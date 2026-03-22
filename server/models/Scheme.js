const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Health', 'Housing', 'Agriculture', 'Finance', 'Education', 'Women', 'Employment', 'Senior'],
    },
    benefit: { type: String, required: true },
    documents: { type: [String], default: [] },
    link: { type: String },
    linkType: { type: String, enum: ['URL', 'OFFLINE'], default: 'URL' },
    offlineGuidance: {
      whereTo: String,
      whatToBring: String,
      whatToSay: String,
      helpline: String,
    },
    deadline: { type: String, default: 'Ongoing' },
    stateCodes: { type: [String], default: ['ALL'] },
    beneficiaryType: { type: String },
    eligibility: {
      minAge: Number,
      maxAge: Number,
      maxIncome: Number,
      requiredGender: { type: String, default: null },
      occupations: { type: [String], default: [] },
      categories: { type: [String], default: [] },
      requiresBPL: { type: Boolean, default: false },
      requiresLand: { type: Boolean, default: false },
      requiresNoHouse: { type: Boolean, default: false },
      requiresGirlChild: { type: Boolean, default: false },
      requiresPregnant: { type: Boolean, default: false },
      customRule: { type: String, default: null },
    },
    translations: {
      hi: {
        name: String,
        benefit: String,
        deadline: String,
        offlineGuidance: {
          whereTo: String,
          whatToBring: String,
          whatToSay: String,
        }
      },
      mr: {
        name: String,
        benefit: String,
        deadline: String,
        offlineGuidance: {
          whereTo: String,
          whatToBring: String,
          whatToSay: String,
        }
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scheme', schemeSchema);
