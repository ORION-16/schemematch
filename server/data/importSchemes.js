const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const Scheme = require('../models/Scheme');

async function importSchemes() {
  try {
    console.log('Connected to MongoDB');
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Reading raw_schemes.json...');
    const rawData = fs.readFileSync(path.join(__dirname, 'raw_schemes.json'), 'utf8');
    const schemes = JSON.parse(rawData);
    
    console.log(`Normalizing ${schemes.length} schemes...`);
    
    const normalizedSchemes = schemes.map(scheme => {
      // Normalization logic based on our schema
      const eligibility = scheme.eligibility || {};
      
      return {
        schemeId: scheme.scheme_id || scheme.id || Math.random().toString(),
        name: scheme.name || 'Unknown Scheme',
        benefit: scheme.description || scheme.benefit || 'Details not provided',
        category: scheme.category || 'Other',
        state: scheme.state || 'Central',
        eligibility: {
          minAge: eligibility.min_age || null,
          maxAge: eligibility.max_age || null,
          maxIncome: eligibility.max_income || null,
          requiredGender: eligibility.gender === 'Any' ? null : eligibility.gender,
          categories: eligibility.caste || [],
          occupations: eligibility.occupations || []
        },
        link: scheme.link || '',
        linkType: scheme.link ? 'URL' : 'OFFLINE',
        source: 'myscheme',
        documents: [],
        deadline: 'Ongoing'
      };
    });

    // Execute bulkWrite with upsert
    let processed = 0;
    const batchSize = 500;
    
    for (let i = 0; i < normalizedSchemes.length; i += batchSize) {
      const batch = normalizedSchemes.slice(i, i + batchSize);
      
      const operations = batch.map(scheme => ({
        updateOne: {
          filter: { schemeId: scheme.schemeId },
          update: { $set: scheme },
          upsert: true
        }
      }));
      
      await Scheme.bulkWrite(operations);
      processed += batch.length;
      console.log(`Progress: ${processed}/${normalizedSchemes.length}`);
    }

    console.log(`bulkWrite complete: ${normalizedSchemes.length} upserted`);
    
  } catch (error) {
    console.error('Error importing schemes:', error.message);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Done. DB connection closed.');
    }
  }
}

if (require.main === module) {
  importSchemes();
}

module.exports = importSchemes;
