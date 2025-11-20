const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function deleteAllProps() {
  try {
    // Fetch all props
    const props = await client.fetch(`*[_type == "prop"]`);
    
    console.log(`Found ${props.length} props to delete`);
    
    if (props.length === 0) {
      console.log('No props to delete');
      return;
    }
    
    // Delete each prop
    for (const prop of props) {
      await client.delete(prop._id);
      console.log(`Deleted: ${prop.name} (${prop._id})`);
    }
    
    console.log(`\n✅ Successfully deleted ${props.length} props`);
  } catch (error) {
    console.error('Error deleting props:', error);
    process.exit(1);
  }
}

deleteAllProps();

