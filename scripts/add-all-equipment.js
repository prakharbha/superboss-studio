/**
 * Add all equipment items to Sanity CMS
 * Processes images and uploads them along with equipment data
 */

const { createClient } = require('@sanity/client');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: require('path').join(__dirname, '../.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error('❌ Missing environment variables');
  console.error('   Please ensure NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN are set in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

// Equipment data
const equipmentList = [
  {
    id: 'profoto-pro-d3-750ws-monolight',
    name: 'Profoto Pro D3 750WS Monolight',
    category: 'Lighting',
    description: 'Professional studio flash unit with 750WS power output. Features fast recycling time, consistent color temperature, and reliable performance for professional photography and video production.',
    pricePerHour: 0,
    pricePerDay: 150,
    imageFile: 'eq1.webp',
    specifications: ['750WS power output', 'Fast recycling time', 'Consistent color temperature', 'Professional studio quality', 'Compatible with Profoto modifiers'],
  },
  {
    id: 'profoto-connect-pro-wireless-transmitter',
    name: 'Profoto Connect Pro Wireless Transmitter',
    category: 'Lighting',
    description: 'Professional wireless transmitter for Profoto flash units. Enables remote control and triggering of Profoto lights from your camera.',
    pricePerHour: 0,
    pricePerDay: 100,
    imageFile: 'eq2.webp',
    specifications: ['Wireless control', 'Compatible with Profoto lights', 'Long range', 'Reliable triggering'],
  },
  {
    id: 'profoto-soft-light-kit',
    name: 'Profoto Soft Light Kit',
    category: 'Lighting',
    description: 'Complete soft light kit for creating beautiful, diffused lighting. Perfect for portraits and product photography.',
    pricePerHour: 0,
    pricePerDay: 100,
    imageFile: 'eq3.webp',
    specifications: ['Soft, diffused lighting', 'Complete kit', 'Professional quality'],
  },
  {
    id: 'profoto-softbox-4ft-octa',
    name: 'Profoto Softbox 4\' Octa',
    category: 'Lighting',
    description: '4-foot octagonal softbox for Profoto lights. Creates soft, even lighting with beautiful catchlights.',
    pricePerHour: 0,
    pricePerDay: 50,
    imageFile: 'eq4.webp',
    specifications: ['4-foot diameter', 'Octagonal shape', 'Soft, even light', 'Compatible with Profoto'],
  },
  {
    id: 'profoto-softbox-strip-1x4ft',
    name: 'Profoto Softbox Strip 1X4\'',
    category: 'Lighting',
    description: 'Strip softbox measuring 1x4 feet. Perfect for creating edge lighting, rim lighting, and accent lighting.',
    pricePerHour: 0,
    pricePerDay: 50,
    imageFile: 'eq5.webp',
    specifications: ['1x4 feet dimensions', 'Strip shape', 'Edge and rim lighting', 'Compatible with Profoto'],
  },
  {
    id: 'profoto-softbox-3x4ft',
    name: 'Profoto Softbox 3X4\'',
    category: 'Lighting',
    description: 'Rectangular softbox measuring 3x4 feet. Ideal for larger subjects and group photography.',
    pricePerHour: 0,
    pricePerDay: 50,
    imageFile: 'eq6.webp',
    specifications: ['3x4 feet dimensions', 'Rectangular shape', 'Large coverage area', 'Compatible with Profoto'],
  },
  {
    id: 'profoto-deep-white-umbrella-xl-65',
    name: 'Profoto Deep White Umbrella (XL 65\')',
    category: 'Lighting',
    description: 'Extra-large 65-inch deep white umbrella for soft, diffused lighting. Perfect for large group shots and full-body portraits.',
    pricePerHour: 0,
    pricePerDay: 50,
    imageFile: 'eq7.webp',
    specifications: ['65-inch diameter', 'Deep white interior', 'Soft, diffused light', 'Compatible with Profoto'],
  },
  {
    id: 'profoto-deep-white-umbrella-small',
    name: 'Profoto Deep White Umbrella (Small)',
    category: 'Lighting',
    description: 'Small deep white umbrella for compact soft lighting. Ideal for headshots and small product photography.',
    pricePerHour: 0,
    pricePerDay: 50,
    imageFile: 'eq8.webp',
    specifications: ['Small size', 'Deep white interior', 'Soft, diffused light', 'Compatible with Profoto'],
  },
  {
    id: 'profoto-zoom-reflector',
    name: 'Profoto Zoom Reflector',
    category: 'Lighting',
    description: 'Zoom reflector for controlling beam angle and light direction. Adjustable from wide to narrow beam.',
    pricePerHour: 0,
    pricePerDay: 50,
    imageFile: 'eq9.webp',
    specifications: ['Adjustable beam angle', 'Zoom control', 'Directional lighting', 'Compatible with Profoto'],
  },
  {
    id: 'profoto-snoot-zoom-reflector',
    name: 'Profoto Snoot for Zoom Reflector',
    category: 'Lighting',
    description: 'Snoot attachment for zoom reflector to create focused, directional light beams. Perfect for accent lighting and dramatic effects.',
    pricePerHour: 0,
    pricePerDay: 100,
    imageFile: 'eq10.webp',
    specifications: ['Focused beam', 'Directional control', 'Dramatic lighting effects', 'Compatible with Profoto Zoom Reflector'],
  },
  {
    id: 'avenger-c-stand-grip-arm-kit',
    name: 'Avenger C-Stand Grip Arm Kit',
    category: 'Support',
    description: 'Professional C-stand with grip arm for positioning lights, modifiers, and accessories. Essential support equipment for studio setups.',
    pricePerHour: 0,
    pricePerDay: 30,
    imageFile: 'eq11.webp',
    specifications: ['Heavy-duty construction', 'Grip arm included', 'Adjustable height', 'Professional grade'],
  },
  {
    id: 'datacolor-spydercheckr-24-camera-color-correction',
    name: 'Datacolor Spydercheckr 24 Camera Color Correction',
    category: 'Accessories',
    description: 'Professional color calibration tool for accurate color reproduction. Ensures consistent color across all your images.',
    pricePerHour: 0,
    pricePerDay: 0, // Included in studio rent
    imageFile: 'eq12.webp',
    specifications: ['24 color patches', 'Color calibration', 'Accurate color reproduction', 'Professional tool'],
    includedInRent: true,
  },
  {
    id: 'profoto-grid-filter-holder',
    name: 'Profoto Grid and Filter Holder',
    category: 'Lighting',
    description: 'Grid and filter holder system for Profoto lights. Allows attachment of grids and filters for precise light control.',
    pricePerHour: 0,
    pricePerDay: 50,
    imageFile: 'eq13.webp',
    specifications: ['Grid attachment', 'Filter holder', 'Light control', 'Compatible with Profoto'],
  },
  {
    id: 'nanlite-four-axle-electric-background',
    name: 'Nanlite Four-Axle Electric Background',
    category: 'Backdrop',
    description: 'Electric background system with four-axle mechanism for smooth background changes. Perfect for seamless backdrop transitions.',
    pricePerHour: 0,
    pricePerDay: 0, // Included in studio rent
    imageFile: 'eq14.webp',
    specifications: ['Four-axle system', 'Electric operation', 'Smooth transitions', 'Professional backdrop system'],
    includedInRent: true,
  },
  {
    id: 'fog-smoke-machine',
    name: 'Fog/Smoke Machine',
    category: 'Effects',
    description: 'Professional fog and smoke machine for creating atmospheric effects. Perfect for creative photography and video production.',
    pricePerHour: 0,
    pricePerDay: 200,
    imageFile: 'eq15.webp',
    specifications: ['Atmospheric effects', 'Professional grade', 'Safe operation', 'Creative tool'],
  },
];

async function processImage(inputPath, outputPath) {
  try {
    if (!fs.existsSync(inputPath)) {
      console.error(`   ⚠️  Image file not found: ${inputPath}`);
      return null;
    }

    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    
    // Resize and optimize the image
    await sharp(inputPath)
      .resize(800, 800, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }, // White background
      })
      .webp({ quality: 85 })
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    console.error(`   ❌ Error processing image:`, error.message);
    return null;
  }
}

async function uploadImageToSanity(imagePath) {
  try {
    if (!fs.existsSync(imagePath)) {
      return null;
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: path.basename(imagePath),
      contentType: 'image/webp',
    });

    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
      alt: asset.originalFilename || 'Equipment image',
    };
  } catch (error) {
    console.error(`   ❌ Error uploading image:`, error.message);
    return null;
  }
}

async function addEquipment() {
  try {
    console.log('🎬 Adding Equipment to Sanity CMS...\n');

    const equipmentDir = path.join(__dirname, '../equipment');
    const outputDir = path.join(__dirname, '../public/images/equipment');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    let success = 0;
    let errors = 0;

    for (const item of equipmentList) {
      try {
        console.log(`\n📦 Processing: ${item.name}`);
        
        const inputImagePath = path.join(equipmentDir, item.imageFile);
        const outputImagePath = path.join(outputDir, `${item.id}.webp`);

        // Process image
        let imageAsset = null;
        if (fs.existsSync(inputImagePath)) {
          const processedPath = await processImage(inputImagePath, outputImagePath);
          if (processedPath) {
            imageAsset = await uploadImageToSanity(processedPath);
            if (imageAsset) {
              console.log(`   ✓ Image processed and uploaded`);
            }
          }
        } else {
          console.log(`   ⚠️  Image file not found: ${item.imageFile}`);
        }

        // Prepare equipment data
        const equipmentData = {
          _type: 'equipment',
          id: item.id,
          name: item.name,
          category: item.category,
          description: item.description,
          pricePerHour: item.pricePerHour,
          pricePerDay: item.pricePerDay,
          currency: 'AED',
          specifications: item.specifications || [],
          available: true,
        };

        if (imageAsset) {
          equipmentData.image = imageAsset;
        }

        // Check if equipment already exists
        const existing = await client.fetch(
          `*[_type == "equipment" && id == $id][0]`,
          { id: item.id }
        );

        if (existing) {
          await client
            .patch(existing._id)
            .set(equipmentData)
            .commit();
          console.log(`   ✓ Updated in Sanity`);
        } else {
          await client.create(equipmentData);
          console.log(`   ✓ Created in Sanity`);
        }

        // Display pricing info
        if (item.includedInRent) {
          console.log(`   💰 Included in studio rent`);
        } else {
          console.log(`   💰 Price: AED ${item.pricePerDay}/day`);
        }

        success++;
      } catch (error) {
        console.error(`   ❌ Error with ${item.name}:`, error.message);
        errors++;
      }
    }

    console.log(`\n\n✅ Summary:`);
    console.log(`   Success: ${success}`);
    console.log(`   Errors: ${errors}`);
    console.log(`\n🎉 Done! All equipment has been added to Sanity CMS.`);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
addEquipment();

