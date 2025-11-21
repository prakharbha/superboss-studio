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

const newProps = [
  {
    id: 'velvet-sofa-gray-set',
    name: 'VELVET SOFA GRAY SET',
    category: 'Furniture',
    description: 'DIMENSION: Height: 0.8m. Available: 1',
    priceHalfDay: 500,
    pricePerDay: 900,
    currency: 'AED',
    available: true,
    imageFile: 'pr7.webp',
  },
  {
    id: 'velvet-sofa-gray-set-a',
    name: 'VELVET SOFA GRAY SET A',
    category: 'Furniture',
    description: 'DIMENSION: Height: 0.8m. Available: 1',
    priceHalfDay: 250,
    pricePerDay: 450,
    currency: 'AED',
    available: true,
    imageFile: 'pr8.webp',
  },
  {
    id: 'velvet-sofa-gray-set-b',
    name: 'VELVET SOFA GRAY SET B',
    category: 'Furniture',
    description: 'DIMENSION: Height: 0.8m. Available: 1',
    priceHalfDay: 250,
    pricePerDay: 450,
    currency: 'AED',
    available: true,
    imageFile: 'pr9.webp',
  },
  {
    id: 'leather-single-sofa',
    name: 'LEATHER SINGLE SOFA',
    category: 'Furniture',
    description: 'DIMENSION: 0.74m(Length), 0.74m(Width), 0.76m(Height). Available: 1',
    priceHalfDay: 160,
    pricePerDay: 300,
    currency: 'AED',
    available: true,
    imageFile: 'pr10.webp',
  },
  {
    id: '2-piece-leather-single-sofa',
    name: '2 PIECE LEATHER SINGLE SOFA',
    category: 'Furniture',
    description: 'DIMENSION: 0.74m(Length), 0.74m(Width), 0.76m(Height). Available: 1',
    priceHalfDay: 300,
    pricePerDay: 500,
    currency: 'AED',
    available: true,
    imageFile: 'pr11.webp',
  },
  {
    id: '2-seater-leather-sofa',
    name: '2 SEATER LEATHER SOFA',
    category: 'Furniture',
    description: 'DIMENSION: 1.35m(Length), 0.72m(Width), 0.84m(Height). Available: 1',
    priceHalfDay: 250,
    pricePerDay: 450,
    currency: 'AED',
    available: true,
    imageFile: 'pr12.webp',
  },
  {
    id: 'velvet-beige-golden-stool',
    name: 'VELVET BEIGE GOLDEN STOOL',
    category: 'Furniture',
    description: 'Height: 0.9m. Available: 1',
    priceHalfDay: 45,
    pricePerDay: 80,
    currency: 'AED',
    available: true,
    imageFile: 'pr13.webp',
  },
  {
    id: 'brown-folding-chair',
    name: 'BROWN FOLDING CHAIR',
    category: 'Furniture',
    description: 'Height: 0.71m. Available: 1',
    priceHalfDay: 30,
    pricePerDay: 50,
    currency: 'AED',
    available: true,
    imageFile: 'pr14.webp',
  },
  {
    id: '1-piece-make-up-chair',
    name: '1-PIECE MAKE UP CHAIR',
    category: 'Furniture',
    description: 'Height: 1.84m. Available: 2',
    priceHalfDay: 65,
    pricePerDay: 120,
    currency: 'AED',
    available: true,
    imageFile: 'pr15.webp',
  },
  {
    id: 'rotatable-black-chair',
    name: 'ROTATABLE BLACK CHAIR',
    category: 'Furniture',
    description: 'Height: 0.81m. Available: 3',
    priceHalfDay: 60,
    pricePerDay: 100,
    currency: 'AED',
    available: true,
    imageFile: 'pr16.webp',
  },
  {
    id: 'white-folding-chair',
    name: 'WHITE FOLDING CHAIR',
    category: 'Furniture',
    description: 'Height: 0.76m. Available: 12',
    priceHalfDay: 60,
    pricePerDay: 100,
    currency: 'AED',
    available: true,
    imageFile: 'pr17.webp',
  },
  {
    id: 'gray-wooden-stool',
    name: 'GRAY WOODEN STOOL',
    category: 'Furniture',
    description: 'Height: 0.63m. Available: 1',
    priceHalfDay: 45,
    pricePerDay: 80,
    currency: 'AED',
    available: true,
    imageFile: 'pr18.webp',
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
    console.log('🎨 Adding new props (pr7-pr18) to Sanity CMS...\n');
    
    let success = 0;
    let errors = 0;

    for (const prop of newProps) {
      try {
        // Check if prop already exists
        const existing = await client.fetch(
          `*[_type == "prop" && id == $id][0]`,
          { id: prop.id }
        );

        if (existing) {
          console.log(`⏭️  Skipping ${prop.name} (already exists)`);
          continue;
        }

        const imagePath = path.join(process.cwd(), prop.imageFile);
        
        if (!fs.existsSync(imagePath)) {
          console.error(`❌ Image not found: ${imagePath}`);
          errors++;
          continue;
        }
        
        console.log(`📤 Uploading image for ${prop.name}...`);
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
        success++;
      } catch (error) {
        console.error(`❌ Error adding ${prop.name}:`, error.message);
        errors++;
      }
    }
    
    console.log(`\n✅ Successfully added ${success} props`);
    if (errors > 0) {
      console.log(`⚠️  ${errors} errors occurred`);
    }
  } catch (error) {
    console.error('❌ Error adding props:', error);
    process.exit(1);
  }
}

addProps();

