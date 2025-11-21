const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Bypass CDN to get fresh data
  token: process.env.SANITY_API_TOKEN,
});

const propsQuery = `*[_type == "prop"] | order(name asc) {
  _id,
  id,
  name,
  category,
  priceHalfDay,
  pricePerDay,
  available,
  image {
    asset->{
      _id,
      url
    }
  }
}`;

async function verifyProps() {
  try {
    console.log('🔍 Fetching props from Sanity...\n');
    const props = await client.fetch(propsQuery);
    
    console.log(`✅ Found ${props.length} total props\n`);
    
    // Check for the new props
    const newPropIds = [
      'velvet-sofa-gray-set',
      'velvet-sofa-gray-set-a',
      'velvet-sofa-gray-set-b',
      'leather-single-sofa',
      '2-piece-leather-single-sofa',
      '2-seater-leather-sofa',
      'velvet-beige-golden-stool',
      'brown-folding-chair',
      '1-piece-make-up-chair',
      'rotatable-black-chair',
      'white-folding-chair',
      'gray-wooden-stool',
    ];
    
    console.log('📋 Checking for new props (pr7-pr18):\n');
    let found = 0;
    let missing = [];
    
    for (const propId of newPropIds) {
      const prop = props.find(p => p.id === propId);
      if (prop) {
        console.log(`✅ ${prop.name} (${prop.id})`);
        console.log(`   - Image: ${prop.image?.asset?.url ? '✓' : '✗ Missing'}`);
        console.log(`   - Price Half Day: ${prop.priceHalfDay} AED`);
        console.log(`   - Price Full Day: ${prop.pricePerDay} AED`);
        console.log(`   - Available: ${prop.available}`);
        console.log('');
        found++;
      } else {
        console.log(`❌ Missing: ${propId}`);
        missing.push(propId);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Found: ${found}/${newPropIds.length}`);
    if (missing.length > 0) {
      console.log(`   Missing: ${missing.join(', ')}`);
    }
    
    // List all props
    console.log(`\n📝 All props in database (${props.length} total):`);
    props.forEach((prop, index) => {
      console.log(`   ${index + 1}. ${prop.name} (${prop.id})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyProps();

