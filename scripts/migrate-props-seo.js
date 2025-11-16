/**
 * Quick Migration Script: Props and SEO only
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

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

  // Migrate default SEO (homepage)
  try {
    const defaultDoc = {
      _type: 'seo',
      page: '/',
      title: seoData.default.defaultTitle,
      description: seoData.default.defaultDescription,
      keywords: seoData.default.defaultKeywords?.split(', ').map((k) => k.trim()) || [],
      ogType: seoData.default.type || 'website',
      ogImage: null,
    };

    const existing = await client.fetch(
      `*[_type == "seo" && page == "/"][0]`
    );

    if (existing) {
      await client
        .patch(existing._id)
        .set(defaultDoc)
        .commit();
      console.log(`  ✓ Updated: Homepage SEO (/)`);
    } else {
      await client.create(defaultDoc);
      console.log(`  ✓ Created: Homepage SEO (/)`);
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
        ogImage: null,
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

// Main migration
async function migrate() {
  console.log('🚀 Starting Props & SEO Migration...');
  console.log(`📦 Project: ${projectId}`);
  console.log(`📊 Dataset: ${dataset}\n`);

  try {
    await migrateProps();
    await migrateSEO();

    console.log('\n✨ Migration Complete!');
    console.log('\n📝 Note: Events need to be created manually in /studio');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate().catch(console.error);

