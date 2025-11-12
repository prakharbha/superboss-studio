const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../images');
const outputDir = path.join(__dirname, '../public/images');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImage(inputPath, outputPath, quality = 85) {
  const ext = path.extname(inputPath).toLowerCase();
  const filename = path.basename(inputPath, ext);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`Processing: ${path.basename(inputPath)} (${metadata.width}x${metadata.height})`);
    
    // For banner images, create optimized versions
    if (filename.includes('banner')) {
      // Full HD version for desktop
      await image
        .resize(1920, 1080, { fit: 'cover', position: 'center' })
        .webp({ quality: quality })
        .toFile(path.join(outputDir, `${filename}.webp`));
      
      // Mobile version
      await sharp(inputPath)
        .resize(768, 1024, { fit: 'cover', position: 'center' })
        .webp({ quality: quality })
        .toFile(path.join(outputDir, `${filename}-mobile.webp`));
      
      console.log(`  ✓ Created ${filename}.webp and ${filename}-mobile.webp`);
    } else {
      // For other images, create multiple sizes
      // Large (for full-width backgrounds)
      await image
        .resize(1920, null, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: quality })
        .toFile(path.join(outputDir, `${filename}-large.webp`));
      
      // Medium (for section backgrounds)
      await sharp(inputPath)
        .resize(1280, null, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: quality })
        .toFile(path.join(outputDir, `${filename}-medium.webp`));
      
      // Small (for mobile)
      await sharp(inputPath)
        .resize(768, null, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: quality })
        .toFile(path.join(outputDir, `${filename}-small.webp`));
      
      console.log(`  ✓ Created ${filename}-large.webp, ${filename}-medium.webp, ${filename}-small.webp`);
    }
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error.message);
  }
}

async function processAllImages() {
  console.log('Starting image optimization...\n');
  
  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file)
  );
  
  console.log(`Found ${imageFiles.length} images to process\n`);
  
  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    await optimizeImage(inputPath, outputDir);
  }
  
  console.log('\n✓ All images optimized successfully!');
}

processAllImages().catch(console.error);

