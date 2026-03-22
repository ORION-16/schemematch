const SavedProfile = require('../models/SavedProfile');

// POST /api/profiles/save
exports.saveProfile = async (req, res, next) => {
  try {
    const { phone, profile } = req.body;

    if (!phone || !profile) {
      return res.status(400).json({ success: false, error: 'Phone and profile are required' });
    }

    // TODO: OTP verification — scaffold only, not wired
    // 1. Generate OTP and send via SMS gateway
    // 2. Verify OTP before saving
    // For now, save directly

    const saved = await SavedProfile.findOneAndUpdate(
      { phone },
      { phone, profile },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
};
