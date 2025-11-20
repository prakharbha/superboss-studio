const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const props = [
  {
    id: 'marble-coffee-table',
    name: 'Marble Coffee Table',
    category: 'Furniture',
    description: 'DIMENSION: 1.27m(Length), 0.7m (Width), 0.39m(Height)',
    priceHalfDay: 75,
    pricePerDay: 140,
    currency: 'AED',
    available: true,
    imageFile: 'pr1.webp',
  },
  {
    id: '2-piece-round-side-table',
    name: '2-Piece Round Side Table',
    category: 'Furniture',
    description: 'Height: 0.46m, Diameter: 0.7m / Height: 0.41m, Diameter: 0.5m. Available: 1',
    priceHalfDay: 75,
    pricePerDay: 140,
    currency: 'AED',
    available: true,
    imageFile: 'pr2.webp',
  },
  {
    id: 'single-round-side-table',
    name: 'Single Round Side Table',
    category: 'Furniture',
    description: 'Height: 0.41m, Diameter: 0.5m. Available: 1',
    priceHalfDay: 35,
    pricePerDay: 60,
    currency: 'AED',
    available: true,
    imageFile: 'pr3.webp',
  },
  {
    id: 'wooden-table',
    name: 'Wooden Table',
    category: 'Furniture',
    description: 'DIMENSION: 0.91m(Length), 0.5m(Width), 0.41m(Height). Available: 1',
    priceHalfDay: 60,
    pricePerDay: 110,
    currency: 'AED',
    available: true,
    imageFile: 'pr4.webp',
  },
  {
    id: 'rock-marble-side-table',
    name: 'Rock Marble Side Table',
    category: 'Furniture',
    description: 'DIMENSION: 0.48m(Width), 0.53m(Height). Available: 1',
    priceHalfDay: 45,
    pricePerDay: 80,
    currency: 'AED',
    available: true,
    imageFile: 'pr5.webp',
  },
  {
    id: 'double-tier-side-table',
    name: 'Double Tier Side Table',
    category: 'Furniture',
    description: 'DIMENSION: 0.5m (Diameter) 0.55m(Height). Available: 1',
    priceHalfDay: 45,
    pricePerDay: 80,
    currency: 'AED',
    available: true,
    imageFile: 'pr6.webp',
  },
];

async function uploadImage(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const filename = path.basename(imagePath);
    
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: filename,
      contentType: 'image/webp',
    });
    
    return asset._id;
  } catch (error) {
    console.error(`Error uploading image ${imagePath}:`, error);
    throw error;
  }
}

async function addProps() {
  try {
    for (const prop of props) {
      const imagePath = path.join(process.cwd(), prop.imageFile);
      
      if (!fs.existsSync(imagePath)) {
        console.error(`Image not found: ${imagePath}`);
        continue;
      }
      
      console.log(`Uploading image for ${prop.name}...`);
      const imageAssetId = await uploadImage(imagePath);
      
      const doc = {
        _type: 'prop',
        id: prop.id,
        name: prop.name,
        category: prop.category,
        description: prop.description,
        priceHalfDay: prop.priceHalfDay,
        pricePerDay: prop.pricePerDay,
        currency: prop.currency,
        available: prop.available,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAssetId,
          },
          alt: prop.name,
        },
      };
      
      await client.create(doc);
      console.log(`✅ Added: ${prop.name}`);
    }
    
    console.log(`\n✅ Successfully added ${props.length} props`);
  } catch (error) {
    console.error('Error adding props:', error);
    process.exit(1);
  }
}

addProps();

