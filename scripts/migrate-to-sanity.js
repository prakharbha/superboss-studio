/**
 * Migration Script: Import JSON data to Sanity CMS
 * 
 * This script migrates existing JSON data (studios, equipment, props, SEO) to Sanity.
 * 
 * Usage:
 * 1. Make sure you have SANITY_API_TOKEN in .env.local with write permissions
 * 2. Run: npm run migrate:sanity
 * 
 * Note: Images will need to be uploaded separately or referenced by URL
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  console.error('❌ NEXT_PUBLIC_SANITY_PROJECT_ID is required');
  process.exit(1);
}

if (!token) {
  console.error('❌ SANITY_API_TOKEN is required for write access');
  console.log('💡 Get your token from: https://sanity.io/manage');
  console.log('💡 Go to: API → Tokens → Add API token');
  console.log('💡 Give it "Editor" permissions');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

// Helper to create slug from name
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Migrate Studios
async function migrateStudios() {
  console.log('\n📸 Migrating Studios...');
  let success = 0;
  let errors = 0;

  const studiosData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/studios.json'), 'utf-8')
  );

  for (const studio of studiosData) {
    try {
      const doc = {
        _type: 'studio',
        id: studio.id,
        name: studio.name,
        slug: {
          _type: 'slug',
          current: studio.slug || createSlug(studio.name),
        },
        size: studio.size,
        unit: studio.unit,
        description: studio.description,
        pricePerHour: studio.pricePerHour,
        pricePerDay: studio.pricePerDay,
        currency: studio.currency,
        features: studio.features || [],
        suitableFor: studio.suitableFor || [],
        location: studio.location || {
          address: '',
          coordinates: {
            lat: 0,
            lng: 0,
          },
        },
      };

      // Only add optional fields if they have values
      if (studio.video) doc.video = studio.video;
      // Don't include images field - it will be null/empty and cause errors
      // Images can be uploaded manually via Studio UI

      // Check if document already exists
      const existing = await client.fetch(
        `*[_type == "studio" && id == $id][0]`,
        { id: studio.id }
      );

      if (existing) {
        // Update existing document
        await client
          .patch(existing._id)
          .set(doc)
          .commit();
        console.log(`  ✓ Updated: ${studio.name}`);
      } else {
        // Create new document
        await client.create(doc);
        console.log(`  ✓ Created: ${studio.name}`);
      }
      success++;
    } catch (error) {
      console.error(`  ✗ Error with ${studio.name}:`, error.message);
      errors++;
    }
  }

  console.log(`\n✅ Studios: ${success} migrated, ${errors} errors`);
}

// Migrate Equipment
async function migrateEquipment() {
  console.log('\n📷 Migrating Equipment...');
  let success = 0;
  let errors = 0;

  const equipmentData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/equipment.json'), 'utf-8')
  );

  for (const item of equipmentData) {
    try {
      const doc = {
        _type: 'equipment',
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        pricePerHour: item.pricePerHour,
        pricePerDay: item.pricePerDay,
        currency: item.currency,
        specifications: item.specifications || [],
        available: item.available !== false,
      };

      // Don't include image field - it will be null and cause errors
      // Images can be uploaded manually via Studio UI

      const existing = await client.fetch(
        `*[_type == "equipment" && id == $id][0]`,
        { id: item.id }
      );

      if (existing) {
        await client
          .patch(existing._id)
          .set(doc)
          .commit();
        console.log(`  ✓ Updated: ${item.name}`);
      } else {
        await client.create(doc);
        console.log(`  ✓ Created: ${item.name}`);
      }
      success++;
    } catch (error) {
      console.error(`  ✗ Error with ${item.name}:`, error.message);
      errors++;
    }
  }

  console.log(`\n✅ Equipment: ${success} migrated, ${errors} errors`);
}

// Migrate Props
async function migrateProps() {
  console.log('\n🎨 Migrating Props...');
  let success = 0;
  let errors = 0;

  const propsData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/props.json'), 'utf-8')
  );

  for (const item of propsData) {
    try {
      const doc = {
        _type: 'prop',
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description,
        pricePerDay: item.pricePerDay,
        currency: item.currency,
        available: item.available !== false,
      };

      // Only add optional fields if they have values
      if (item.color) doc.color = item.color;
      if (item.style) doc.style = item.style;
      // Don't include image field - it will be null and cause errors
      // Images can be uploaded manually via Studio UI

      const existing = await client.fetch(
        `*[_type == "prop" && id == $id][0]`,
        { id: item.id }
      );

      if (existing) {
        await client
          .patch(existing._id)
          .set(doc)
          .commit();
        console.log(`  ✓ Updated: ${item.name}`);
      } else {
        await client.create(doc);
        console.log(`  ✓ Created: ${item.name}`);
      }
      success++;
    } catch (error) {
      console.error(`  ✗ Error with ${item.name}:`, error.message);
      errors++;
    }
  }

  console.log(`\n✅ Props: ${success} migrated, ${errors} errors`);
}

// Migrate SEO Data
async function migrateSEO() {
  console.log('\n🔍 Migrating SEO Data...');
  let success = 0;
  let errors = 0;

  const seoData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/seo.json'), 'utf-8')
  );

  // Migrate default SEO
  try {
    const defaultDoc = {
      _type: 'seo',
      page: '/',
      title: seoData.default.defaultTitle,
      description: seoData.default.defaultDescription,
      keywords: seoData.default.defaultKeywords?.split(', ').map((k) => k.trim()) || [],
      ogType: seoData.default.type || 'website',
      ogImage: null, // Can be added later via Studio
    };

    const existing = await client.fetch(
      `*[_type == "seo" && page == "/"][0]`
    );

    if (existing) {
      await client
        .patch(existing._id)
        .set(defaultDoc)
        .commit();
      console.log(`  ✓ Updated: Homepage SEO`);
    } else {
      await client.create(defaultDoc);
      console.log(`  ✓ Created: Homepage SEO`);
    }
    success++;
  } catch (error) {
    console.error(`  ✗ Error with default SEO:`, error.message);
    errors++;
  }

  // Migrate page-specific SEO
  for (const [pagePath, seo] of Object.entries(seoData.pages)) {
    try {
      const doc = {
        _type: 'seo',
        page: pagePath,
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords?.split(', ').map((k) => k.trim()) || [],
        ogType: seo.ogType || 'website',
        ogImage: null, // Can be added later via Studio
      };

      const existing = await client.fetch(
        `*[_type == "seo" && page == $page][0]`,
        { page: pagePath }
      );

      if (existing) {
        await client
          .patch(existing._id)
          .set(doc)
          .commit();
        console.log(`  ✓ Updated: ${pagePath}`);
      } else {
        await client.create(doc);
        console.log(`  ✓ Created: ${pagePath}`);
      }
      success++;
    } catch (error) {
      console.error(`  ✗ Error with ${pagePath}:`, error.message);
      errors++;
    }
  }

  console.log(`\n✅ SEO: ${success} migrated, ${errors} errors`);
}

// Main migration function
async function migrate() {
  console.log('🚀 Starting Sanity Migration...');
  console.log(`📦 Project: ${projectId}`);
  console.log(`📊 Dataset: ${dataset}\n`);

  try {
    await migrateStudios();
    await migrateEquipment();
    await migrateProps();
    await migrateSEO();

    console.log('\n✨ Migration Complete!');
    console.log('\n📝 Next Steps:');
    console.log('  1. Visit /studio to view your content');
    console.log('  2. Upload images for studios, equipment, and props');
    console.log('  3. Review and update any content as needed');
    console.log('  4. Your website will now use content from Sanity!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration
migrate().catch(console.error);

