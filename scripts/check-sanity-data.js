/**
 * Check Sanity Data - Diagnose image field issues
 */

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

async function checkData() {
  console.log('🔍 Checking Sanity Data...\n');

  // Check Props
  const props = await client.fetch('*[_type == "prop"][0...3]{_id, name, image}');
  console.log('📦 Props (first 3):');
  props.forEach(p => {
    console.log(`  - ${p.name}: image = ${JSON.stringify(p.image)}`);
  });

  // Check Equipment
  const equipment = await client.fetch('*[_type == "equipment"][0...3]{_id, name, image}');
  console.log('\n🔧 Equipment (first 3):');
  equipment.forEach(e => {
    console.log(`  - ${e.name}: image = ${JSON.stringify(e.image)}`);
  });

  // Check Events
  const events = await client.fetch('*[_type == "event"]');
  console.log(`\n🎉 Events: ${events.length} total`);
  if (events.length > 0) {
    events.forEach(e => console.log(`  - ${e.title || e._id}`));
  } else {
    console.log('  No events found. Create one in Studio!');
  }

  // Check SEO
  const seo = await client.fetch('count(*[_type == "seo"])');
  console.log(`\n📄 SEO entries: ${seo}`);

  console.log('\n✅ Check complete!');
}

checkData().catch(console.error);

