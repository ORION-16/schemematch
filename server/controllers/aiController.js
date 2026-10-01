const { extractProfile } = require('../services/geminiService');
const Scheme = require('../models/Scheme');
const { buildSchemeFilter, buildTagBoosts } = require('../utils/buildSchemeFilter');

exports.aiMatch = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || message.trim().length < 5) {
      return res.status(400).json({ success: false, error: 'Please describe yourself in a few words' });
    }

    const profile = await extractProfile(message);
    console.log('Extracted profile:', JSON.stringify(profile));

    const mongoFilter = buildSchemeFilter(profile);
    const tagBoosts = buildTagBoosts(profile);

    const allMatched = await Scheme.find(mongoFilter).lean();

    // Score by tags
    const scored = allMatched.map(s => {
      let score = 0;
      const tags = (s.tags || []).map(t => t.toLowerCase());
      tagBoosts.forEach(boost => {
        if (tags.some(t => t.includes(boost.toLowerCase()))) score += 2;
      });
      if (s.state === 'Central') score += 1;
      return { ...s, _score: score };
    });

    scored.sort((a, b) => b._score - a._score);

    res.json({
      success: true,
      extractedProfile: profile,
      total: scored.length,
      schemes: scored.slice(0, 20)
    });

  } catch (error) {
    next(error);
  }
};