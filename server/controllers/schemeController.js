const Scheme = require('../models/Scheme');

/**
 * Check if a scheme's eligibility criteria match a user profile.
 * Missing profile fields are treated as the most inclusive case.
 */
function isEligible(scheme, profile) {
  const elig = scheme.eligibility || {};

  // State filter
  if (
    scheme.stateCodes &&
    scheme.stateCodes.length > 0 &&
    !scheme.stateCodes.includes('ALL') &&
    profile.stateCode &&
    !scheme.stateCodes.includes(profile.stateCode)
  ) {
    return false;
  }

  // Age check
  if (elig.minAge != null && profile.age != null && profile.age < elig.minAge) return false;
  if (elig.maxAge != null && profile.age != null && profile.age > elig.maxAge) return false;

  // Income check
  if (elig.maxIncome != null && profile.income != null && profile.income > elig.maxIncome) {
    // If there's a customRule, let it handle the logic instead of hard-failing
    if (!elig.customRule) return false;
  }

  // Gender check
  if (elig.requiredGender && profile.gender && elig.requiredGender !== profile.gender) return false;

  // Occupation check
  if (
    elig.occupations &&
    elig.occupations.length > 0 &&
    profile.occupation &&
    !elig.occupations.includes(profile.occupation)
  ) {
    return false;
  }

  // Category check (General, OBC, SC, ST)
  if (
    elig.categories &&
    elig.categories.length > 0 &&
    profile.category &&
    !elig.categories.includes(profile.category)
  ) {
    return false;
  }

  // Boolean flags — only exclude if flag is required AND profile says "no"
  if (elig.requiresBPL && profile.hasBPL === 'no') return false;
  if (elig.requiresLand && profile.hasLand === 'no') return false;
  if (elig.requiresNoHouse && profile.hasHouse === 'yes') return false;
  if (elig.requiresGirlChild && profile.hasGirlChild === 'no') return false;
  if (elig.requiresPregnant && profile.isPregnant === 'no') return false;

  // Custom rule evaluation
  if (elig.customRule) {
    try {
      const fn = new Function('profile', `return (${elig.customRule});`);
      if (!fn(profile)) return false;
    } catch (err) {
      console.error(`Custom rule error for scheme "${scheme.name}":`, err.message);
      // On error, don't exclude the scheme
    }
  }

  return true;
}

// POST /api/match
exports.matchSchemes = async (req, res, next) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      return res.status(400).json({ success: false, error: 'Profile is required' });
    }

    const allSchemes = await Scheme.find({}).lean();

    const matched = allSchemes
      .filter((scheme) => isEligible(scheme, profile))
      .sort((a, b) => a.category.localeCompare(b.category));

    res.json({ success: true, count: matched.length, schemes: matched });
  } catch (error) {
    next(error);
  }
};

// GET /api/schemes
exports.getAllSchemes = async (req, res, next) => {
  try {
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
