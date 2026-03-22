const mongoose = require('mongoose');
const crypto = require('crypto');

const savedProfileSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      set: (val) => crypto.createHash('sha256').update(val).digest('hex'),
    },
    profile: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SavedProfile', savedProfileSchema);
