const Scheme = require('../models/Scheme');

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

/**
 * Compute a relevance score for a matched scheme.
 * Higher score = more eligibility fields actively match the user.
 * Used to sort results so the most-relevant schemes appear first.
 */
function relevanceScore(scheme, profile) {
  let score = 0;
  const e = scheme.eligibility || {};

  // Occupation and caste/category are weighted highest because
  // they are the strongest signal that a scheme was designed for this user.
  if (e.occupations?.includes(profile.occupation)) score += 3;
  if (e.categories?.includes(profile.category)) score += 3;
  if (e.requiredGender === profile.gender) score += 2;
  if (e.maxIncome && profile.income && profile.income <= e.maxIncome) score += 1;
  if (e.minAge && profile.age && profile.age >= e.minAge) score += 1;
  if (e.maxAge && profile.age && profile.age <= e.maxAge) score += 1;

  return score;
}

// POST /api/schemes/match
exports.matchSchemes = async (req, res, next) => {
  try {
    await ensureSchemes();
    const { profile, page = 1, limit = 20 } = req.body;
    if (!profile) {
      return res.status(400).json({ success: false, error: 'Profile is required' });
    }

    const allSchemes = await Scheme.find({}).lean();

    const matched = allSchemes
      .filter((scheme) => isEligible(scheme, profile))
      .sort((a, b) => relevanceScore(b, profile) - relevanceScore(a, profile));

    // Paginate
    const start = (page - 1) * limit;
    const paginated = matched.slice(start, start + limit);

    res.json({
      success: true,
      total: matched.length,
      page: Number(page),
      totalPages: Math.ceil(matched.length / limit),
      schemes: paginated,
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
