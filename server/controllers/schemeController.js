const Scheme = require('../models/Scheme');
const { buildSchemeFilter, buildTagBoosts } = require('../utils/buildSchemeFilter');

/**
 * Self-healing helper: If the database is empty, seed it with initial data.
 */
async function ensureSchemes() {
  const count = await Scheme.countDocuments();
  if (count === 0) {
    console.log('Database empty during request. Triggering auto-seed...');
    try {
      const { schemes } = require('../data/seedSchemes');
      const ops = schemes.map(s => ({
        updateOne: {
          filter: { id: s.id },
          update: { $set: { ...s, source: 'seed' } },
          upsert: true,
        },
      }));
      await Scheme.bulkWrite(ops);
      console.log('On-demand auto-seed complete.');
    } catch (err) {
      console.error('On-demand auto-seed failed:', err.message);
    }
  }
}

/**
 * Check if a scheme's eligibility criteria match a user profile.
 *
 * Design principle: "Open by default."
 * A check only DISQUALIFIES a user if BOTH the scheme has a constraint
 * AND the user's profile explicitly fails it. Missing profile fields
 * are never grounds for exclusion — we assume the best case.
 *
 * No eval(), no new Function(), no string execution — ever.
 */
function isEligible(scheme, profile) {
  const e = scheme.eligibility || {};

  // 1. Age check — only fails if BOTH scheme has limit AND profile has age
  if (e.minAge && profile.age && profile.age < e.minAge) return false;
  if (e.maxAge && profile.age && profile.age > e.maxAge) return false;

  // 2. Income check — only fails if BOTH scheme has limit AND profile has income
  if (e.maxIncome && profile.income && profile.income > e.maxIncome) return false;

  // 3. Gender check
  if (e.requiredGender && profile.gender && e.requiredGender !== profile.gender) return false;

  // 4. Occupation check — scheme requires one of these occupations
  if (e.occupations?.length > 0 && profile.occupation) {
    if (!e.occupations.includes(profile.occupation)) return false;
  }

  // 5. Category/caste check
  if (e.categories?.length > 0 && profile.category) {
    if (!e.categories.includes(profile.category)) return false;
  }

  // 6. State check — 'ALL' means central scheme, applies everywhere
  if (scheme.stateCodes?.length > 0 && !scheme.stateCodes.includes('ALL')) {
    if (profile.state && !scheme.stateCodes.includes(profile.state)) return false;
  }

  // 7. Boolean flags — only disqualify if profile explicitly says NO
  if (e.requiresBPL && profile.hasBPL === 'no') return false;
  if (e.requiresLand && profile.hasLand === 'no') return false;
  if (e.requiresNoHouse && profile.hasHouse === 'yes') return false;
  if (e.requiresGirlChild && profile.hasGirlChild === 'no') return false;
  if (e.requiresPregnant && profile.isPregnant === 'no') return false;

  return true;
}

function getMatchDetails(scheme, profile) {
  let score = 0;
  let maxPossibleScore = 0;
  const e = scheme.eligibility || {};

  const textSpace = [
    ...(scheme.tags || []),
    scheme.name || '',
    scheme.category || '',
    scheme.benefit || ''
  ].join(' ').toLowerCase();

  const checkMatch = (condition, weight) => {
    maxPossibleScore += weight;
    if (condition) score += weight;
  };

  // 1. Occupation
  if (profile.occupation) {
    const occ = profile.occupation.toLowerCase();
    const explicit = e.occupations?.includes(profile.occupation);
    const implicit = textSpace.includes(occ) ||
                     (occ === 'farmer' && textSpace.includes('agricultur')) ||
                     (occ === 'student' && (textSpace.includes('scholarship') || textSpace.includes('education')));

    checkMatch(explicit || implicit, 10);
  }

  // 2. Category / Caste
  if (profile.category && profile.category !== 'General') {
    const explicit = e.categories?.includes(profile.category);
    const implicit = textSpace.includes(profile.category.toLowerCase());
    checkMatch(explicit || implicit, 10);
  }

  // 3. Gender
  if (profile.gender) {
    const g = profile.gender.toLowerCase();
    const explicit = e.requiredGender === profile.gender;
    const implicit = textSpace.includes(g) ||
                     (g === 'female' && (textSpace.includes('women') || textSpace.includes('girl')));
    checkMatch(explicit || implicit, 8);
  }

  // 4. State
  if (profile.state) {
    const explicit = scheme.stateCodes?.includes(profile.state);
    const implicit = textSpace.includes(profile.state.toLowerCase());
    checkMatch(explicit || implicit, 5);
  }

  // 5. BPL
  if (profile.hasBPL === 'yes') {
    const explicit = e.requiresBPL;
    const implicit = textSpace.includes('bpl') || textSpace.includes('poverty');
    if (explicit || implicit) {
      maxPossibleScore += 5;
      score += 5;
    }
  }

  // 6. Explicit strict rules match gives bonus points
  if (e.minAge && profile.age && profile.age >= e.minAge) score += 3;
  if (e.maxAge && profile.age && profile.age <= e.maxAge) score += 3;
  if (e.maxIncome && profile.income && profile.income <= e.maxIncome) score += 5;

  // Calculate percentage
  let percentage = 0;
  if (maxPossibleScore > 0) {
     percentage = Math.round((score / maxPossibleScore) * 100);
  } else {
     percentage = 50; // Neutral base if no distinct profile features exist
  }

  // Bonus base points for matching something
  if (score > 0) {
    percentage = Math.min(percentage + 15, 99);
  } else {
    // Generic match
    percentage = Math.floor(Math.random() * 15) + 35; // 35-50%
  }

  // 100% reserved for explicit perfect matches
  if (score > 15 && e.occupations?.length > 0) percentage = 100;

  return { score, percentage };
}

// POST /api/schemes/match
exports.matchSchemes = async (req, res, next) => {
  try {
    await ensureSchemes();
    const { profile, page = 1, limit = 20 } = req.body;
    if (!profile) return res.status(400).json({ success: false, error: 'Profile is required' });

    const mongoFilter = buildSchemeFilter(profile);
    const total = await Scheme.countDocuments(mongoFilter);

    // Build relevance score using tags
    // If profile has occupation/category, boost schemes whose tags mention them
    const tagBoosts = buildTagBoosts(profile);

    let query = Scheme.find(mongoFilter).lean();

    // If we have tag boosts, sort by tag relevance
    if (tagBoosts.length > 0) {
      const schemes = await query.exec();
      const scored = schemes.map(s => {
        let score = 0;
        const tags = (s.tags || []).map(t => t.toLowerCase());
        tagBoosts.forEach(boost => {
          if (tags.some(t => t.includes(boost.toLowerCase()))) score += 2;
        });
        // Boost central schemes slightly
        if (s.state === 'Central') score += 1;
        return { ...s, _score: score };
      });

      scored.sort((a, b) => b._score - a._score);

      const paginated = scored.slice((page - 1) * limit, page * limit);
      return res.json({
        success: true,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        schemes: paginated
      });
    }

    // No tag boosts — just paginate
    const schemes = await query
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .exec();

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      schemes
    });

  } catch (error) {
    next(error);
  }
};

// GET /api/schemes
exports.getAllSchemes = async (req, res, next) => {
  try {
    await ensureSchemes();
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const schemes = await Scheme.find(filter).lean();
    res.json({ success: true, count: schemes.length, schemes });
  } catch (error) {
    next(error);
  }
};

// GET /api/schemes/search?q=farmer&page=1&limit=20
exports.searchSchemes = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: 'Query required' });
    }

    const skip = (page - 1) * limit;

    const results = await Scheme.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Scheme.countDocuments({ $text: { $search: q } });

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      schemes: results,
    });
  } catch (error) {
    next(error);
  }
};


// Add at the bottom of schemeController.js
module.exports.isEligible = isEligible;
module.exports.getMatchDetails = getMatchDetails;
module.exports.relevanceScore = getMatchDetails;
