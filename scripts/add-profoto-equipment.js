/**
 * Add Profoto Pro-D3 750WS Monolight equipment to Sanity
 * Also processes the image to crop out text and borders
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

async function processImage(inputPath, outputPath) {
  try {
    console.log(`\n📸 Processing image: ${inputPath}`);
    
    if (!fs.existsSync(inputPath)) {
      console.error(`❌ Image file not found: ${inputPath}`);
      return null;
    }

    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    console.log(`   Original size: ${metadata.width}x${metadata.height}`);

    // Crop to remove borders and text
    // Based on the image description: dark gray border around equipment, text at bottom
    // We'll crop more from bottom (where text is) and less from sides/top
    const cropLeft = Math.round(metadata.width * 0.05); // Remove 5% from left (border)
    const cropTop = Math.round(metadata.height * 0.05); // Remove 5% from top (border)
    const cropRight = Math.round(metadata.width * 0.05); // Remove 5% from right (border)
    const cropBottom = Math.round(metadata.height * 0.30); // Remove 30% from bottom (text area with product name and price)

    const newWidth = metadata.width - cropLeft - cropRight;
    const newHeight = metadata.height - cropTop - cropBottom;

    await sharp(inputPath)
      .extract({
        left: cropLeft,
        top: cropTop,
        width: newWidth,
        height: newHeight,
      })
      .resize(800, 800, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }, // White background
      })
      .webp({ quality: 85 })
      .toFile(outputPath);

    console.log(`   ✓ Processed and saved to: ${outputPath}`);
    console.log(`   New size: 800x800 (contained)`);
    
    return outputPath;
  } catch (error) {
    console.error(`   ❌ Error processing image:`, error.message);
    return null;
  }
}

async function uploadImageToSanity(imagePath) {
  try {
    console.log(`\n📤 Uploading image to Sanity...`);
    
    if (!fs.existsSync(imagePath)) {
      console.error(`❌ Image file not found: ${imagePath}`);
      return null;
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: path.basename(imagePath),
      contentType: 'image/webp',
    });

    console.log(`   ✓ Image uploaded successfully`);
    console.log(`   Asset ID: ${asset._id}`);
    
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
      alt: 'Profoto Pro-D3 750WS Monolight',
    };
  } catch (error) {
    console.error(`   ❌ Error uploading image:`, error.message);
    return null;
  }
}

async function addEquipment() {
  try {
    console.log('🎬 Adding Profoto Pro-D3 750WS Monolight to Sanity...\n');

    // Equipment details
    const equipmentData = {
      _type: 'equipment',
      id: 'profoto-pro-d3-750ws-monolight',
      name: 'Profoto Pro-D3 750WS Monolight',
      category: 'Lighting',
      description: 'Professional studio flash unit with 750WS power output. Features fast recycling time, consistent color temperature, and reliable performance for professional photography and video production.',
      pricePerHour: 0, // Not typically rented by hour
      pricePerDay: 150,
      currency: 'AED',
      specifications: [
        '750WS power output',
        'Fast recycling time',
        'Consistent color temperature',
        'Professional studio quality',
        'Compatible with Profoto modifiers',
      ],
      available: true,
    };

    // Process image if provided
    const inputImagePath = process.argv[2] || path.join(__dirname, '../profoto-pro-d3.jpg');
    const outputImagePath = path.join(__dirname, '../public/images/equipment/profoto-pro-d3-750ws.webp');
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputImagePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    let imageAsset = null;
    if (fs.existsSync(inputImagePath)) {
      const processedPath = await processImage(inputImagePath, outputImagePath);
      if (processedPath) {
        imageAsset = await uploadImageToSanity(processedPath);
        if (imageAsset) {
          equipmentData.image = imageAsset;
        }
      }
    } else {
      console.log(`\n⚠️  Image file not found: ${inputImagePath}`);
      console.log(`   Equipment will be added without image. You can upload it manually via Sanity Studio.`);
    }

    // Check if equipment already exists
    const existing = await client.fetch(
      `*[_type == "equipment" && id == $id][0]`,
      { id: equipmentData.id }
    );

    if (existing) {
      // Update existing equipment
      await client
        .patch(existing._id)
        .set(equipmentData)
        .commit();
      console.log(`\n✅ Updated equipment: ${equipmentData.name}`);
    } else {
      // Create new equipment
      await client.create(equipmentData);
      console.log(`\n✅ Created equipment: ${equipmentData.name}`);
    }

    console.log(`\n📋 Equipment Details:`);
    console.log(`   Name: ${equipmentData.name}`);
    console.log(`   Category: ${equipmentData.category}`);
    console.log(`   Price: AED ${equipmentData.pricePerDay}/day`);
    console.log(`   Available: ${equipmentData.available ? 'Yes' : 'No'}`);
    
    if (imageAsset) {
      console.log(`   Image: ✓ Uploaded`);
    } else {
      console.log(`   Image: ⚠️  Not uploaded (upload manually via Sanity Studio)`);
    }

    console.log(`\n🎉 Done! Equipment is now available in Sanity CMS.`);
    
  } catch (error) {
    console.error('❌ Error adding equipment:', error);
    process.exit(1);
  }
}

// Run the script
addEquipment();

