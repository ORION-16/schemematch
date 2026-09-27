const { extractProfile } = require('../services/geminiService');
const Scheme = require('../models/Scheme');

// Reuse the same isEligible and relevanceScore functions from schemeController
// Move those two functions to a shared utility file instead of duplicating

const { isEligible, relevanceScore } = require('./schemeController');

exports.aiMatch = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // Step 1: Extract structured profile from natural language
    const profile = await extractProfile(message);
    console.log('Extracted profile:', profile);

    // Step 2: Run through existing matcher
    const allSchemes = await Scheme.find({}).lean();
    const matched = allSchemes
      .filter(scheme => isEligible(scheme, profile))
      .sort((a, b) => relevanceScore(b, profile) - relevanceScore(a, profile))
      .slice(0, 20); // Top 20 results

    res.json({
      success: true,
      extractedProfile: profile, // Send back so frontend can show "We understood: age 24, SC student..."
      total: matched.length,
      schemes: matched
    });
  } catch (error) {
    next(error);
  }
};