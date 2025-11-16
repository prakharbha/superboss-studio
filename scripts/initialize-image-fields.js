/**
 * Initialize Image Fields
 * Adds empty image fields to documents so they become editable in Studio
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

async function initializeImageFields() {
  console.log('🔧 Initializing Image Fields...\n');

  // Fix Props - set image to undefined (not null) so it becomes editable
  console.log('📦 Fixing Props...');
  const props = await client.fetch('*[_type == "prop" && !defined(image)]');
  for (const prop of props) {
    await client
      .patch(prop._id)
      .set({ image: undefined })
      .commit();
    console.log(`  ✓ ${prop.name}`);
  }
  console.log(`✅ Fixed ${props.length} props\n`);

  // Fix Equipment
  console.log('🔧 Fixing Equipment...');
  const equipment = await client.fetch('*[_type == "equipment" && !defined(image)]');
  for (const item of equipment) {
    await client
      .patch(item._id)
      .set({ image: undefined })
      .commit();
    console.log(`  ✓ ${item.name}`);
  }
  console.log(`✅ Fixed ${equipment.length} equipment items\n`);

  // Fix Studios
  console.log('📸 Fixing Studios...');
  const studios = await client.fetch('*[_type == "studio" && !defined(images)]');
  for (const studio of studios) {
    await client
      .patch(studio._id)
      .set({ images: undefined })
      .commit();
    console.log(`  ✓ ${studio.name}`);
  }
  console.log(`✅ Fixed ${studios.length} studios\n`);

  console.log('✨ All image fields initialized!');
  console.log('🎨 Images should now be editable in Studio.');
}

initializeImageFields().catch(console.error);

