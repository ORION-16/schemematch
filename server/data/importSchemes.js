const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const Scheme = require('../models/Scheme');

const CATEGORY_MAP = {
  'education & learning': 'Education',
  'social welfare & empowerment': 'Social Welfare',
  'health & wellness': 'Health',
  'housing & shelter': 'Housing',
  'agriculture,rural & environment': 'Agriculture',
  'banking,financial services and insurance': 'Finance',
  'women and child': 'Women',
  'skills & employment': 'Employment',
  'business & entrepreneurship': 'Business',
  'transport & infrastructure': 'Transport',
  'utility & sanitation': 'Utilities',
  'public safety,law & justice': 'Other',
  'science, it & communications': 'Other',
  'sports & culture': 'Other',
  'travel & tourism': 'Other'
};

function normalizeCategory(categoryArray) {
  if (!categoryArray || categoryArray.length === 0) return 'Other';
  const first = categoryArray[0].toLowerCase().trim();
  return CATEGORY_MAP[first] || 'Other';
}

function normalizeScheme(raw, index) {
  const f = raw.fields || {};

  return {
    schemeId: raw.id || `imported-${index}`,
    name: f.schemeName || 'Unknown Scheme',
    benefit: f.briefDescription || '',
    category: normalizeCategory(f.schemeCategory),
    state: Array.isArray(f.beneficiaryState)
      ? (f.beneficiaryState.includes('All') ? 'Central' : f.beneficiaryState[0])
      : (f.beneficiaryState || 'Central'),
    link: f.slug ? `https://www.myscheme.gov.in/schemes/${f.slug}` : '',
    linkType: f.slug ? 'URL' : 'OFFLINE',
    documents: [],
    deadline: f.schemeCloseDate || 'Ongoing',
    source: 'myscheme',
    stateCodes: Array.isArray(f.beneficiaryState) && !f.beneficiaryState.includes('All')
      ? f.beneficiaryState
      : ['ALL'],
    eligibility: {
      minAge: null,
      maxAge: null,
      maxIncome: null,
      requiredGender: null,
      categories: [],
      occupations: [],
      requiresBPL: false,
      requiresLand: false,
      requiresNoHouse: false,
      requiresGirlChild: false,
      requiresPregnant: false,
    },
    tags: Array.isArray(f.tags) ? f.tags : [],
  };
}

async function importSchemes() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const rawData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'raw_schemes.json'), 'utf8')
    );
    console.log(`Read ${rawData.length} records`);

    // Wipe only imported schemes, keep original 25
    await Scheme.deleteMany({ source: 'myscheme' });
    console.log('Cleared previous imports');

    const normalized = rawData.map((raw, i) => normalizeScheme(raw, i));

    // Batch upsert in groups of 500
    const BATCH = 500;
    for (let i = 0; i < normalized.length; i += BATCH) {
      const batch = normalized.slice(i, i + BATCH);
      const ops = batch.map(s => ({
        updateOne: {
          filter: { schemeId: s.schemeId },
          update: { $set: s },
          upsert: true
        }
      }));
      await Scheme.bulkWrite(ops);
      console.log(`Progress: ${Math.min(i + BATCH, normalized.length)}/${normalized.length}`);
    }

    const total = await Scheme.countDocuments();
    const imported = await Scheme.countDocuments({ source: 'myscheme' });
    console.log(`\nTotal in DB: ${total}`);
    console.log(`Imported: ${imported}`);

  } catch (err) {
    console.error('Import failed:', err.message);
    console.error(err.stack);
  } finally {
    await mongoose.connection.close();
    console.log('DB closed.');
  }
}

if (require.main === module) importSchemes();
module.exports = importSchemes;
