/**
 * Migrate Events to Sanity
 * Creates event documents from the static event items
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

// Event items from the static page
const eventItems = [
  // Fashion Shows
  { id: 1, title: 'Fashion Show 2024', category: 'Fashion Shows', type: 'image', src: '/images/DSC09213-large.webp', thumbnail: '/images/DSC09213-medium.webp' },
  { id: 2, title: 'Designer Launch', category: 'Fashion Shows', type: 'image', src: '/images/DSC09205-large.webp', thumbnail: '/images/DSC09205-medium.webp' },
  { id: 3, title: 'Runway Event', category: 'Fashion Shows', type: 'image', src: '/images/DSC09220-large.webp', thumbnail: '/images/DSC09220-medium.webp' },
  
  // Photo Shoots
  { id: 4, title: 'E-commerce Shoot', category: 'Photo Shoots', type: 'image', src: '/images/DSC09215-large.webp', thumbnail: '/images/DSC09215-medium.webp' },
  { id: 5, title: 'Product Photography', category: 'Photo Shoots', type: 'image', src: '/images/DSC09217-large.webp', thumbnail: '/images/DSC09217-medium.webp' },
  { id: 6, title: 'Lifestyle Session', category: 'Photo Shoots', type: 'image', src: '/images/DSC09221-large.webp', thumbnail: '/images/DSC09221-medium.webp' },
  { id: 7, title: 'Fashion Editorial', category: 'Photo Shoots', type: 'image', src: '/images/DSC09224-large.webp', thumbnail: '/images/DSC09224-medium.webp' },
  
  // Events
  { id: 8, title: 'Art Exhibition', category: 'Events', type: 'image', src: '/images/DSC09226-large.webp', thumbnail: '/images/DSC09226-medium.webp' },
  { id: 9, title: 'Launch Party', category: 'Events', type: 'image', src: '/images/DSC09229-large.webp', thumbnail: '/images/DSC09229-medium.webp' },
  { id: 10, title: 'Private Event', category: 'Events', type: 'image', src: '/images/DSC09230-large.webp', thumbnail: '/images/DSC09230-medium.webp' },
  { id: 11, title: 'Corporate Event', category: 'Events', type: 'image', src: '/images/DSC09240-large.webp', thumbnail: '/images/DSC09240-medium.webp' },
  
  // Music Videos
  { id: 12, title: 'Music Video Production', category: 'Music Videos', type: 'video', src: '/images/DSC09248-large.webp', thumbnail: '/images/DSC09248-medium.webp' },
  { id: 13, title: 'Artist Performance', category: 'Music Videos', type: 'video', src: '/images/DSC09250-large.webp', thumbnail: '/images/DSC09250-medium.webp' },
  { id: 14, title: 'Recording Session', category: 'Music Videos', type: 'video', src: '/images/DSC09260-large.webp', thumbnail: '/images/DSC09260-medium.webp' },
  
  // Workshops
  { id: 15, title: 'Photography Workshop', category: 'Workshops', type: 'image', src: '/images/DSC09263-large.webp', thumbnail: '/images/DSC09263-medium.webp' },
  { id: 16, title: 'Creative Workshop', category: 'Workshops', type: 'image', src: '/images/DSC09275-large.webp', thumbnail: '/images/DSC09275-medium.webp' },
  { id: 17, title: 'Production Workshop', category: 'Workshops', type: 'image', src: '/images/DSC09277-large.webp', thumbnail: '/images/DSC09277-medium.webp' },
  
  // Exhibitions
  { id: 18, title: 'Gallery Opening', category: 'Exhibitions', type: 'image', src: '/images/DSC09278-large.webp', thumbnail: '/images/DSC09278-medium.webp' },
  { id: 19, title: 'Art Installation', category: 'Exhibitions', type: 'image', src: '/images/DSC09282-large.webp', thumbnail: '/images/DSC09282-medium.webp' },
  { id: 20, title: 'Design Exhibition', category: 'Exhibitions', type: 'image', src: '/images/DSC09187-large.webp', thumbnail: '/images/DSC09187-medium.webp' },
];

function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Map categories to event types
const categoryToEventType = {
  'Fashion Shows': 'Fashion Show',
  'Photo Shoots': 'Workshop',
  'Events': 'Launch Event',
  'Music Videos': 'Performance',
  'Workshops': 'Workshop',
  'Exhibitions': 'Exhibition'
};

async function migrateEvents() {
  console.log('🎉 Migrating Events to Sanity...\n');
  let success = 0;
  let errors = 0;

  for (const item of eventItems) {
    try {
      const eventId = `event-${item.id}`;
      
      // Create event document
      const doc = {
        _type: 'event',
        id: eventId,
        title: item.title,
        slug: {
          _type: 'slug',
          current: createSlug(item.title),
        },
        description: `${item.title} - A showcase of creativity at SuperBoss Studio.`,
        eventType: categoryToEventType[item.category] || 'Other',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        location: 'SuperBoss Studio',
        status: 'completed',
        featured: false,
        filters: [item.category],
        // Note: Images will need to be uploaded manually via Studio
        // For now, we'll store the image paths as reference
        _imagePath: item.src,
        _thumbnailPath: item.thumbnail,
        _mediaType: item.type,
      };

      // Check if event already exists
      const existing = await client.fetch(
        `*[_type == "event" && id == $id][0]`,
        { id: eventId }
      );

      if (existing) {
        await client
          .patch(existing._id)
          .set(doc)
          .commit();
        console.log(`  ✓ Updated: ${item.title}`);
      } else {
        await client.create(doc);
        console.log(`  ✓ Created: ${item.title}`);
      }
      success++;
    } catch (error) {
      console.error(`  ✗ Error with ${item.title}:`, error.message);
      errors++;
    }
  }

  console.log(`\n✅ Events: ${success} migrated, ${errors} errors`);
  console.log('\n📝 Next Steps:');
  console.log('  1. Go to /studio and click on "Event"');
  console.log('  2. For each event, upload the corresponding image');
  console.log('  3. Image paths are stored in the description for reference');
  console.log('  4. The events page will automatically fetch from Sanity');
}

migrateEvents().catch(console.error);

