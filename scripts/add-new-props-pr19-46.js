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
    id: '3-table-set',
    name: '3 TABLE SET',
    category: 'Furniture',
    description: 'Height: 0.61m, 0.46m and 0.31m. Available: 1',
    priceHalfDay: 750,
    pricePerDay: 1250,
    currency: 'AED',
    available: true,
    imageFile: 'pr19.webp',
  },
  {
    id: 'flower-sofa',
    name: 'FLOWER SOFA',
    category: 'Furniture',
    description: 'Diameter: 0.9m, Height: 0.6m / Diameter: 0.52m, Height: 0.29m. Available: 2',
    priceHalfDay: 300,
    pricePerDay: 500,
    currency: 'AED',
    available: true,
    imageFile: 'pr20.webp',
  },
  {
    id: 'rectangle-coffee-table',
    name: 'RECTANGLE COFFEE TABLE',
    category: 'Furniture',
    description: 'DIMENSION: 1.02m(Length), 0.42m(Height). Available: 1',
    priceHalfDay: 90,
    pricePerDay: 160,
    currency: 'AED',
    available: true,
    imageFile: 'pr21.webp',
  },
  {
    id: 'genuine-leather-sofa',
    name: 'GENUINE LEATHER SOFA',
    category: 'Furniture',
    description: 'DIMENSION: 1.7m(Length), 0.87m(Width), 0.77m(Height). Available: 1',
    priceHalfDay: 250,
    pricePerDay: 450,
    currency: 'AED',
    available: true,
    imageFile: 'pr22.webp',
  },
  {
    id: 'wooden-white-bench-small',
    name: 'WOODEN WHITE BENCH (SMALL)',
    category: 'Furniture',
    description: 'DIMENSION: 2.4m(Length), 0.42m(Height). Available: 3',
    priceHalfDay: 35,
    pricePerDay: 60,
    currency: 'AED',
    available: true,
    imageFile: 'pr23.webp',
  },
  {
    id: 'wooden-white-bench-large',
    name: 'WOODEN WHITE BENCH (LARGE)',
    category: 'Furniture',
    description: 'DIMENSION: 2.4m(Length), 0.62m(Height). Available: 3',
    priceHalfDay: 35,
    pricePerDay: 60,
    currency: 'AED',
    available: true,
    imageFile: 'pr23.webp',
  },
  {
    id: 'big-door',
    name: 'BIG DOOR',
    category: 'Backdrops',
    description: 'DIMENSION: 2.4m(Length), 0.3m(Width), 2.68m(Height). Available: 1',
    priceHalfDay: 800,
    pricePerDay: 1200,
    currency: 'AED',
    available: true,
    imageFile: 'pr24.webp',
  },
  {
    id: 'curved-wall',
    name: 'CURVED WALL',
    category: 'Backdrops',
    description: 'DIMENSION: 3m(Length), 3m(Width), 2.55m(Height). Available: 1',
    priceHalfDay: 700,
    pricePerDay: 1000,
    currency: 'AED',
    available: true,
    imageFile: 'pr25.webp',
  },
  {
    id: 'concrete-room',
    name: 'CONCRETE ROOM',
    category: 'Backdrops',
    description: 'DIMENSION: 2.02m(Length), 1.97m(Width), 3.04m(Height). Available: 1',
    priceHalfDay: 800,
    pricePerDay: 1400,
    currency: 'AED',
    available: true,
    imageFile: 'pr26.webp',
  },
  {
    id: 'semi-circular-wall',
    name: 'SEMI-CIRCULAR WALL',
    category: 'Backdrops',
    description: 'Radius: 2.5m. Available: 1',
    priceHalfDay: 700,
    pricePerDay: 1300,
    currency: 'AED',
    available: true,
    imageFile: 'pr27.webp',
  },
  {
    id: 'sphere-platform-set',
    name: 'SPHERE PLATFORM SET',
    category: 'Display',
    description: 'Small 1.99m(Diameter), 0.15m(Height) / Big 2.32m(Diameter), 0.15m(Height). Available: 1',
    priceHalfDay: 750,
    pricePerDay: 1250,
    currency: 'AED',
    available: true,
    imageFile: 'pr28.webp',
  },
  {
    id: '1-piece-circular-platform-small',
    name: '1-PIECE CIRCULAR PLATFORM (SMALL)',
    category: 'Display',
    description: '1.99m(Diameter), 0.15m(Height). Available: 2',
    priceHalfDay: 350,
    pricePerDay: 600,
    currency: 'AED',
    available: true,
    imageFile: 'pr29.webp',
  },
  {
    id: '1-piece-circular-platform-big',
    name: '1-PIECE CIRCULAR PLATFORM (BIG)',
    category: 'Display',
    description: '2.32m(Diameter), 0.15m(Height). Available: 2',
    priceHalfDay: 400,
    pricePerDay: 700,
    currency: 'AED',
    available: true,
    imageFile: 'pr29.webp',
  },
  {
    id: 'girl-meditate-sculpture-set',
    name: 'GIRL MEDITATE SCULPTURE SET',
    category: 'Decor',
    description: 'Height: 1.76m. Available: 1',
    priceHalfDay: 700,
    pricePerDay: 1200,
    currency: 'AED',
    available: true,
    imageFile: 'pr30.webp',
  },
  {
    id: 'white-girl-meditate-sculpture',
    name: 'WHITE GIRL MEDITATE SCULPTURE',
    category: 'Decor',
    description: 'Height: 1.76m. Available: 1',
    priceHalfDay: 400,
    pricePerDay: 700,
    currency: 'AED',
    available: true,
    imageFile: 'pr31.webp',
  },
  {
    id: 'black-girl-meditate-sculpture',
    name: 'BLACK GIRL MEDITATE SCULPTURE',
    category: 'Decor',
    description: 'Height: 1.76m. Available: 1',
    priceHalfDay: 400,
    pricePerDay: 700,
    currency: 'AED',
    available: true,
    imageFile: 'pr32.webp',
  },
  {
    id: 'mirror-bear-set',
    name: 'MIRROR BEAR SET',
    category: 'Decor',
    description: 'Height: 1.03m and 0.81m. Available: 1',
    priceHalfDay: 600,
    pricePerDay: 1100,
    currency: 'AED',
    available: true,
    imageFile: 'pr33.webp',
  },
  {
    id: 'mirror-bear-big',
    name: 'MIRROR BEAR (BIG)',
    category: 'Decor',
    description: 'Height: 1.03m. Available: 1',
    priceHalfDay: 400,
    pricePerDay: 700,
    currency: 'AED',
    available: true,
    imageFile: 'pr34.webp',
  },
  {
    id: 'mirror-bear-small',
    name: 'MIRROR BEAR (SMALL)',
    category: 'Decor',
    description: 'Height: 0.81m. Available: 1',
    priceHalfDay: 300,
    pricePerDay: 500,
    currency: 'AED',
    available: true,
    imageFile: 'pr35.webp',
  },
  {
    id: 'pearl-bear',
    name: 'PEARL BEAR',
    category: 'Decor',
    description: 'Height: 1.63m. Available: 1',
    priceHalfDay: 450,
    pricePerDay: 800,
    currency: 'AED',
    available: true,
    imageFile: 'pr36.webp',
  },
  {
    id: 'silver-horse',
    name: 'SILVER HORSE',
    category: 'Decor',
    description: 'Height: 1.6m. Available: 1',
    priceHalfDay: 450,
    pricePerDay: 800,
    currency: 'AED',
    available: true,
    imageFile: 'pr37.webp',
  },
  {
    id: 'miniature-vases',
    name: 'MINIATURE VASES',
    category: 'Decor',
    description: '*THIS ITEM IS INCLUDED IN THE STUDIO RENT. Available: Offered in a variety of styles (21 pcs)',
    priceHalfDay: 0,
    pricePerDay: 0,
    currency: 'AED',
    available: true,
    imageFile: 'pr38.webp',
  },
  {
    id: 'artificial-potted-plant',
    name: 'ARTIFICIAL POTTED PLANT',
    category: 'Decor',
    description: '*THIS ITEM IS INCLUDED IN THE STUDIO RENT. Height: 0.6m. Available: 1',
    priceHalfDay: 0,
    pricePerDay: 0,
    currency: 'AED',
    available: true,
    imageFile: 'pr39.webp',
  },
  {
    id: 'metal-floor-planter-set-of-4',
    name: 'METAL FLOOR PLANTER SET OF 4',
    category: 'Decor',
    description: 'Height: 1.34m. Available: 1',
    priceHalfDay: 70,
    pricePerDay: 120,
    currency: 'AED',
    available: true,
    imageFile: 'pr40.webp',
  },
  {
    id: 'artificial-magnolia-in-white-vase',
    name: 'ARTIFICIAL MAGNOLIA IN WHITE VASE',
    category: 'Decor',
    description: '*THIS ITEM IS INCLUDED IN THE STUDIO RENT. Height: 0.61m. Available: 1',
    priceHalfDay: 0,
    pricePerDay: 0,
    currency: 'AED',
    available: true,
    imageFile: 'pr41.webp',
  },
  {
    id: 'artificial-cherry-blossom-tree',
    name: 'ARTIFICIAL CHERRY BLOSSOM TREE',
    category: 'Decor',
    description: 'Height: 2.1m. Available: 1',
    priceHalfDay: 300,
    pricePerDay: 500,
    currency: 'AED',
    available: true,
    imageFile: 'pr42.webp',
  },
  {
    id: 'dried-flower-arrangements',
    name: 'DRIED FLOWER ARRANGEMENTS',
    category: 'Decor',
    description: '*THIS ITEM IS INCLUDED IN THE STUDIO RENT. Height: 0.94m. Available: 1',
    priceHalfDay: 0,
    pricePerDay: 0,
    currency: 'AED',
    available: true,
    imageFile: 'pr43.webp',
  },
  {
    id: 'eclipse-floor-lamp',
    name: 'ECLIPSE FLOOR LAMP',
    category: 'Lighting Props',
    description: 'Height: 1.6m. Available: 1',
    priceHalfDay: 60,
    pricePerDay: 100,
    currency: 'AED',
    available: true,
    imageFile: 'pr44.webp',
  },
  {
    id: 'moon-floor-lamp',
    name: 'MOON FLOOR LAMP',
    category: 'Lighting Props',
    description: 'Height: 1.6m. Available: 1',
    priceHalfDay: 60,
    pricePerDay: 100,
    currency: 'AED',
    available: true,
    imageFile: 'pr45.webp',
  },
  {
    id: 'sheepskin-rug-seat-cover',
    name: 'SHEEPSKIN RUG/ SEAT COVER',
    category: 'Textiles',
    description: '*THIS ITEM IS INCLUDED IN THE STUDIO RENT. Available: 1 Brown, 1 Gray & 2 Black',
    priceHalfDay: 0,
    pricePerDay: 0,
    currency: 'AED',
    available: true,
    imageFile: 'pr46.webp',
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
    console.log('🎨 Adding new props (pr19-pr46) to Sanity CMS...\n');
    
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

