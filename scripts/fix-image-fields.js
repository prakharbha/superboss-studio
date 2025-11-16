/**
 * Fix Image Fields Script
 * Removes null/empty image fields from existing documents
 */

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

// Fix Props
async function fixProps() {
  console.log('\n🎨 Fixing Props image fields...');
  let fixed = 0;
  let errors = 0;

  try {
    const props = await client.fetch(`*[_type == "prop"]`);
    
    for (const prop of props) {
      try {
        const patch = client.patch(prop._id);
        let needsUpdate = false;

        // Remove image field if it's null or empty
        if (prop.image === null || prop.image === undefined) {
          patch.unset(['image']);
          needsUpdate = true;
        }

        if (needsUpdate) {
          await patch.commit();
          console.log(`  ✓ Fixed: ${prop.name}`);
          fixed++;
        }
      } catch (error) {
        console.error(`  ✗ Error with ${prop.name}:`, error.message);
        errors++;
      }
    }

    console.log(`\n✅ Props: ${fixed} fixed, ${errors} errors`);
  } catch (error) {
    console.error('Error fetching props:', error.message);
  }
}

// Fix Equipment
async function fixEquipment() {
  console.log('\n📷 Fixing Equipment image fields...');
  let fixed = 0;
  let errors = 0;

  try {
    const equipment = await client.fetch(`*[_type == "equipment"]`);
    
    for (const item of equipment) {
      try {
        const patch = client.patch(item._id);
        let needsUpdate = false;

        // Remove image field if it's null or empty
        if (item.image === null || item.image === undefined) {
          patch.unset(['image']);
          needsUpdate = true;
        }

        if (needsUpdate) {
          await patch.commit();
          console.log(`  ✓ Fixed: ${item.name}`);
          fixed++;
        }
      } catch (error) {
        console.error(`  ✗ Error with ${item.name}:`, error.message);
        errors++;
      }
    }

    console.log(`\n✅ Equipment: ${fixed} fixed, ${errors} errors`);
  } catch (error) {
    console.error('Error fetching equipment:', error.message);
  }
}

// Fix Studios
async function fixStudios() {
  console.log('\n📸 Fixing Studios image fields...');
  let fixed = 0;
  let errors = 0;

  try {
    const studios = await client.fetch(`*[_type == "studio"]`);
    
    for (const studio of studios) {
      try {
        const patch = client.patch(studio._id);
        let needsUpdate = false;

        // Remove images field if it's null, undefined, or empty array
        if (studio.images === null || studio.images === undefined || (Array.isArray(studio.images) && studio.images.length === 0)) {
          patch.unset(['images']);
          needsUpdate = true;
        }

        if (needsUpdate) {
          await patch.commit();
          console.log(`  ✓ Fixed: ${studio.name}`);
          fixed++;
        }
      } catch (error) {
        console.error(`  ✗ Error with ${studio.name}:`, error.message);
        errors++;
      }
    }

    console.log(`\n✅ Studios: ${fixed} fixed, ${errors} errors`);
  } catch (error) {
    console.error('Error fetching studios:', error.message);
  }
}

// Fix Events
async function fixEvents() {
  console.log('\n🎉 Fixing Events image fields...');
  let fixed = 0;
  let errors = 0;

  try {
    const events = await client.fetch(`*[_type == "event"]`);
    
    for (const event of events) {
      try {
        const patch = client.patch(event._id);
        let needsUpdate = false;

        // Remove image field if it's null or empty
        if (event.image === null || event.image === undefined) {
          patch.unset(['image']);
          needsUpdate = true;
        }

        // Remove images array if it's null, undefined, or empty
        if (event.images === null || event.images === undefined || (Array.isArray(event.images) && event.images.length === 0)) {
          patch.unset(['images']);
          needsUpdate = true;
        }

        if (needsUpdate) {
          await patch.commit();
          console.log(`  ✓ Fixed: ${event.title || event._id}`);
          fixed++;
        }
      } catch (error) {
        console.error(`  ✗ Error with event:`, error.message);
        errors++;
      }
    }

    console.log(`\n✅ Events: ${fixed} fixed, ${errors} errors`);
  } catch (error) {
    console.error('Error fetching events:', error.message);
  }
}

// Fix SEO
async function fixSEO() {
  console.log('\n🔍 Fixing SEO image fields...');
  let fixed = 0;
  let errors = 0;

  try {
    const seoItems = await client.fetch(`*[_type == "seo"]`);
    
    for (const seo of seoItems) {
      try {
        const patch = client.patch(seo._id);
        let needsUpdate = false;

        // Remove ogImage field if it's null or empty
        if (seo.ogImage === null || seo.ogImage === undefined) {
          patch.unset(['ogImage']);
          needsUpdate = true;
        }

        if (needsUpdate) {
          await patch.commit();
          console.log(`  ✓ Fixed: ${seo.page}`);
          fixed++;
        }
      } catch (error) {
        console.error(`  ✗ Error with ${seo.page}:`, error.message);
        errors++;
      }
    }

    console.log(`\n✅ SEO: ${fixed} fixed, ${errors} errors`);
  } catch (error) {
    console.error('Error fetching SEO:', error.message);
  }
}

// Main function
async function fixAll() {
  console.log('🔧 Fixing Image Fields in Sanity...');
  console.log(`📦 Project: ${projectId}`);
  console.log(`📊 Dataset: ${dataset}\n`);

  try {
    await fixProps();
    await fixEquipment();
    await fixStudios();
    await fixEvents();
    await fixSEO();

    console.log('\n✨ All image fields fixed!');
    console.log('\n📝 You can now upload images via Studio UI without errors.');
  } catch (error) {
    console.error('\n❌ Fix failed:', error.message);
    process.exit(1);
  }
}

fixAll().catch(console.error);

