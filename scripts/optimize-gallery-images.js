const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Source and destination directories
const sourceDir = path.join(process.cwd(), 'superboss-images');
const destDir = path.join(process.cwd(), 'public/images/gallery');

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Select 8 images for the gallery (you can adjust these)
const selectedImages = [
  'DSC08515.jpg',
  'DSC08520.jpg',
  'DSC08530.jpg',
  'DSC08539.jpg',
  'DSC08551.jpg',
  'DSC08575.jpg',
  'DSC08588.jpg',
  'DSC08660.jpg',
];

async function optimizeImage(filename) {
  const inputPath = path.join(sourceDir, filename);
  const outputName = filename.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const outputPath = path.join(destDir, outputName);

  try {
    // Check if source file exists
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Source file not found: ${filename}`);
      return null;
    }

    // Get file stats
    const stats = fs.statSync(inputPath);
    const originalSize = (stats.size / 1024).toFixed(2); // KB

    // Optimize image: resize to max 800x800 (square), convert to webp, quality 85
    await sharp(inputPath)
      .resize(800, 800, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: 85 })
      .toFile(outputPath);

    const newStats = fs.statSync(outputPath);
    const newSize = (newStats.size / 1024).toFixed(2); // KB
    const reduction = ((1 - newStats.size / stats.size) * 100).toFixed(1);

    console.log(`✅ ${filename} → ${outputName}`);
    console.log(`   ${originalSize} KB → ${newSize} KB (${reduction}% reduction)`);

    return {
      original: filename,
      optimized: outputName,
      path: `/images/gallery/${outputName}`,
    };
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');
  console.log(`Source: ${sourceDir}`);
  console.log(`Destination: ${destDir}\n`);

  const results = [];

  for (const image of selectedImages) {
    const result = await optimizeImage(image);
    if (result) {
      results.push(result);
    }
  }

  console.log(`\n✨ Optimization complete! Processed ${results.length} images.`);
  console.log('\nOptimized images:');
  results.forEach((r) => {
    console.log(`  - ${r.path}`);
  });
}

main().catch(console.error);

