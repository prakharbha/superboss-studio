/**
 * Check equipment images in Sanity to verify they're uploaded correctly
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

async function checkEquipmentImages() {
  try {
    console.log('🔍 Checking equipment images in Sanity...\n');

    const equipment = await client.fetch(`
      *[_type == "equipment"] | order(name asc) {
        _id,
        id,
        name,
        image {
          asset->{
            _id,
            url,
            originalFilename,
            metadata {
              dimensions
            }
          },
          alt
        }
      }
    `);

    console.log(`Found ${equipment.length} equipment items:\n`);

    equipment.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}`);
      if (item.image && item.image.asset) {
        console.log(`   ✓ Image: ${item.image.asset.url}`);
        console.log(`   Filename: ${item.image.asset.originalFilename || 'N/A'}`);
        if (item.image.asset.metadata && item.image.asset.metadata.dimensions) {
          const dims = item.image.asset.metadata.dimensions;
          console.log(`   Dimensions: ${dims.width}x${dims.height}`);
        }
      } else {
        console.log(`   ❌ No image`);
      }
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkEquipmentImages();

