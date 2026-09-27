const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const Scheme = require('../models/Scheme');

// We are using a mock API (DummyJSON) for this exercise because 
// the real myScheme API blocks automated requests with a 403 Forbidden.
// The concepts (pagination, normalization, bulkWrite) remain exactly the same!
const API_BASE_URL = 'https://dummyjson.com/products';

async function scrapeSchemes() {
  let isStandalone = false;
  
  try {
    // If running as a standalone script, we need to connect to DB
    if (mongoose.connection.readyState === 0) {
      isStandalone = true;
      console.log('Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected.');
    }

    let from = 0;
    const size = 50; 
    let hasMoreData = true;
    let totalSchemesScraped = 0;

    console.log('Starting SchemeMatch scraper...');

    while (hasMoreData) {
      console.log(`Fetching schemes from offset ${from}...`);
      
      try {
        // DummyJSON uses limit and skip for pagination
        const response = await axios.get(API_BASE_URL, {
          params: {
            limit: size,
            skip: from
          }
        });
        
        const dataObj = response.data;

        // For dummyjson, the items are inside the "products" array
        const schemesData = dataObj.products || [];
        
        if (!schemesData || schemesData.length === 0) {
          console.log('No more data found. Finished scraping.');
          hasMoreData = false;
          break;
        }

        console.log(`Received ${schemesData.length} schemes. Normalizing...`);

        // Normalizing data to match our Mongoose schema
        const bulkOperations = schemesData.map((externalScheme) => {
          
          // These fields depend on the actual JSON structure of myScheme response.
          // Fallbacks ensure the scraper doesn't break.
          const basicInfo = externalScheme;
          
          const normalizedScheme = {
            id: basicInfo.id + 1000, // Adding 1000 to avoid ID conflicts with our seed data
            name: `(Mock) ${basicInfo.title}`,
            category: 'Other', 
            benefit: basicInfo.description,
            documents: ['Identity Proof'], 
            link: `https://dummyjson.com/products/${basicInfo.id}`,
            deadline: 'Ongoing',
          };

          return {
            updateOne: {
              filter: { id: normalizedScheme.id }, 
              update: { $set: normalizedScheme },  
              upsert: true                         
            }
          };
        });

        if (bulkOperations.length > 0) {
           const bulkResult = await Scheme.bulkWrite(bulkOperations);
           console.log(`Upserted/Updated ${bulkOperations.length} records.`);
        }
        
        totalSchemesScraped += bulkOperations.length;
        from += size; // pagination uses 'from' instead of 'page'
        
        // Wait between requests to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1500));
        
      } catch (apiError) {
        console.error(`Error fetching offset ${from}:`, apiError.message);
        hasMoreData = false; 
      }
    }

    console.log(`\nScraping Complete! Total schemes processed: ${totalSchemesScraped}`);
    
  } catch (error) {
    console.error('Scraper encountered an error:', error.message);
  } finally {
    if (isStandalone && mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('Database connection closed.');
    }
  }
}

// Run the scraper directly if called from command line
if (require.main === module) {
  scrapeSchemes();
}

module.exports = scrapeSchemes;
