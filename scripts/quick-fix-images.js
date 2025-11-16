/**
 * Quick Fix: Remove null image fields from all documents
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

async function fixDocumentType(type, imageFields) {
  console.log(`\n🔧 Fixing ${type}...`);
  let fixed = 0;
  
  try {
    const docs = await client.fetch(`*[_type == "${type}"]`);
    
    for (const doc of docs) {
      try {
        const patch = client.patch(doc._id);
        let needsUpdate = false;

        for (const field of imageFields) {
          if (doc[field] === null || doc[field] === undefined || 
              (Array.isArray(doc[field]) && doc[field].length === 0)) {
            patch.unset([field]);
            needsUpdate = true;
          }
        }

        if (needsUpdate) {
          await patch.commit();
          fixed++;
        }
      } catch (error) {
        console.error(`  ✗ Error:`, error.message);
      }
    }

    console.log(`  ✓ Fixed ${fixed} ${type} documents`);
  } catch (error) {
    console.error(`Error with ${type}:`, error.message);
  }
}

async function main() {
  console.log('🔧 Fixing Image Fields...\n');

  await fixDocumentType('prop', ['image']);
  await fixDocumentType('equipment', ['image']);
  await fixDocumentType('studio', ['images']);
  await fixDocumentType('event', ['image', 'images']);
  await fixDocumentType('seo', ['ogImage']);

  console.log('\n✅ Done! Image fields fixed.');
  console.log('📝 You can now upload images via Studio UI.');
}

main().catch(console.error);

