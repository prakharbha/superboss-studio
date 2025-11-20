const { createClient } = require('@sanity/client');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error('❌ Missing required environment variables');
  console.error('   Please ensure NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN are set in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

// Pricing data from reference file
const pricingData = {
  'Boss Unit': {
    pricePerHour: 300,
    price2Hours: 500,
    price4Hours: 700,
    price6Hours: 900,
    price8Hours: 1250,
    pricePerDay: 1250,
  },
  'Boss Frame': {
    pricePerHour: 300,
    price2Hours: 500,
    price4Hours: 700,
    price6Hours: 900,
    price8Hours: 1250,
    pricePerDay: 1250,
  },
  'Boss Cell': {
    pricePerHour: 300,
    price2Hours: 500,
    price4Hours: 700,
    price6Hours: 900,
    price8Hours: 1250,
    pricePerDay: 1250,
  },
  'Super Cell': {
    pricePerHour: 500,
    price2Hours: 800,
    price4Hours: 1200,
    price6Hours: 1700,
    price8Hours: 2400,
    pricePerDay: 2400,
  },
  'Super Frame': {
    pricePerHour: 700,
    price2Hours: 1000,
    price4Hours: 1800,
    price6Hours: 2200,
    price8Hours: 2800,
    pricePerDay: 2800,
  },
  'Super Vault': {
    pricePerHour: 600,
    price2Hours: 900,
    price4Hours: 1100,
    price6Hours: 1200,
    price8Hours: 2000,
    pricePerDay: 2000,
  },
};

async function updateStudioPricing() {
  console.log('💰 Updating Studio Pricing in Sanity CMS...\n');
  
  let updated = 0;
  let notFound = 0;
  let errors = 0;

  try {
    // Fetch all studios
    const studios = await client.fetch(`*[_type == "studio"]`);
    
    console.log(`Found ${studios.length} studios in Sanity\n`);

    for (const studio of studios) {
      const studioName = studio.name;
      const pricing = pricingData[studioName];

      if (!pricing) {
        console.log(`⚠️  No pricing data found for: ${studioName}`);
        notFound++;
        continue;
      }

      try {
        await client
          .patch(studio._id)
          .set({
            pricePerHour: pricing.pricePerHour,
            price2Hours: pricing.price2Hours,
            price4Hours: pricing.price4Hours,
            price6Hours: pricing.price6Hours,
            price8Hours: pricing.price8Hours,
            pricePerDay: pricing.pricePerDay,
          })
          .commit();

        console.log(`✓ Updated: ${studioName}`);
        console.log(`  - 1 Hour: AED ${pricing.pricePerHour}`);
        console.log(`  - 2 Hours: AED ${pricing.price2Hours}`);
        console.log(`  - 4 Hours: AED ${pricing.price4Hours}`);
        console.log(`  - 6 Hours: AED ${pricing.price6Hours}`);
        console.log(`  - 8 Hours/Full Day: AED ${pricing.price8Hours}\n`);
        updated++;
      } catch (error) {
        console.error(`✗ Error updating ${studioName}:`, error.message);
        errors++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`  ✓ Updated: ${updated} studios`);
    if (notFound > 0) {
      console.log(`  ⚠️  Not found in pricing data: ${notFound} studios`);
    }
    if (errors > 0) {
      console.log(`  ✗ Errors: ${errors} studios`);
    }
    console.log('\n✅ Pricing update complete!');
  } catch (error) {
    console.error('❌ Error fetching studios:', error.message);
    process.exit(1);
  }
}

// Run the update
updateStudioPricing()
  .then(() => {
    console.log('\n🎉 All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });

