/**
 * Delete equipment items that don't have images set (placeholders)
 */

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error('❌ Missing environment variables');
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

async function deleteEquipmentWithoutImages() {
  try {
    console.log('🔍 Finding equipment without images...\n');

    // Fetch all equipment
    const allEquipment = await client.fetch(`
      *[_type == "equipment"] {
        _id,
        id,
        name,
        image {
          asset->{
            _id,
            url
          }
        }
      }
    `);

    // Filter equipment without images
    const equipmentWithoutImages = allEquipment.filter((item) => {
      return !item.image || !item.image.asset || !item.image.asset.url;
    });

    if (equipmentWithoutImages.length === 0) {
      console.log('✅ No equipment found without images. All equipment have images set.');
      return;
    }

    console.log(`📋 Found ${equipmentWithoutImages.length} equipment items without images:\n`);
    equipmentWithoutImages.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.name} (ID: ${item.id})`);
    });

    console.log(`\n🗑️  Deleting ${equipmentWithoutImages.length} placeholder equipment items...\n`);

    let deleted = 0;
    let errors = 0;

    for (const item of equipmentWithoutImages) {
      try {
        await client.delete(item._id);
        console.log(`   ✓ Deleted: ${item.name}`);
        deleted++;
      } catch (error) {
        console.error(`   ✗ Error deleting ${item.name}:`, error.message);
        errors++;
      }
    }

    console.log(`\n✅ Summary:`);
    console.log(`   Deleted: ${deleted}`);
    console.log(`   Errors: ${errors}`);
    console.log(`\n🎉 Done! Placeholder equipment has been removed.`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
deleteEquipmentWithoutImages();

