/**
 * Remove null image fields to make them editable
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

async function removeNullImages() {
  console.log('🔧 Removing null image fields...\n');

  // Fix Props
  console.log('📦 Fixing Props...');
  const props = await client.fetch('*[_type == "prop"]');
  let propsFixed = 0;
  for (const prop of props) {
    if (prop.image === null) {
      await client
        .patch(prop._id)
        .unset(['image'])
        .commit();
      console.log(`  ✓ ${prop.name}`);
      propsFixed++;
    }
  }
  console.log(`✅ Fixed ${propsFixed} props\n`);

  // Fix Equipment
  console.log('🔧 Fixing Equipment...');
  const equipment = await client.fetch('*[_type == "equipment"]');
  let equipmentFixed = 0;
  for (const item of equipment) {
    if (item.image === null) {
      await client
        .patch(item._id)
        .unset(['image'])
        .commit();
      console.log(`  ✓ ${item.name}`);
      equipmentFixed++;
    }
  }
  console.log(`✅ Fixed ${equipmentFixed} equipment items\n`);

  // Fix Studios
  console.log('📸 Fixing Studios...');
  const studios = await client.fetch('*[_type == "studio"]');
  let studiosFixed = 0;
  for (const studio of studios) {
    if (studio.images === null || (Array.isArray(studio.images) && studio.images.length === 0)) {
      await client
        .patch(studio._id)
        .unset(['images'])
        .commit();
      console.log(`  ✓ ${studio.name}`);
      studiosFixed++;
    }
  }
  console.log(`✅ Fixed ${studiosFixed} studios\n`);

  console.log('✨ Done! Refresh Studio to see editable image fields.');
  console.log('💡 Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)');
}

removeNullImages().catch(console.error);

