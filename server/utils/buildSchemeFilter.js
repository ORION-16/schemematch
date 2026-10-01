function buildSchemeFilter(profile) {
  const mustMatch = [];

  if (profile.age != null) {
    mustMatch.push({
      $or: [{ 'eligibility.minAge': null }, { 'eligibility.minAge': { $lte: profile.age } }]
    });
    mustMatch.push({
      $or: [{ 'eligibility.maxAge': null }, { 'eligibility.maxAge': { $gte: profile.age } }]
    });
  }

  if (profile.income != null) {
    mustMatch.push({
      $or: [{ 'eligibility.maxIncome': null }, { 'eligibility.maxIncome': { $gte: profile.income } }]
    });
  }

  if (profile.gender) {
    mustMatch.push({
      $or: [{ 'eligibility.requiredGender': null }, { 'eligibility.requiredGender': profile.gender }]
    });
  }

  if (profile.occupation) {
    mustMatch.push({
      $or: [
        { 'eligibility.occupations': { $size: 0 } },
        { 'eligibility.occupations': profile.occupation }
      ]
    });
  }

  if (profile.category) {
    mustMatch.push({
      $or: [
        { 'eligibility.categories': { $size: 0 } },
        { 'eligibility.categories': profile.category }
      ]
    });
  }

  return mustMatch.length > 0 ? { $and: mustMatch } : {};
}

function buildTagBoosts(profile) {
  const boosts = [];
  if (profile.occupation) boosts.push(profile.occupation);
  if (profile.category) boosts.push(profile.category);
  if (profile.state) boosts.push(profile.state);
  return boosts;
}

module.exports = { buildSchemeFilter, buildTagBoosts };
