const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Source and destination directories
const sourceDir = path.join(process.cwd(), 'superboss-images');
const destDir = path.join(process.cwd(), 'public/images/studios');

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Studio image mappings
const studioImages = {
  'boss-unit': [
    { source: 'DSC08520.jpg', output: 'boss-unit-1.webp' },
    { source: 'DSC08541.jpg', output: 'boss-unit-2.webp' },
  ],
  'boss-frame': [
    { source: 'DSC08575.jpg', output: 'boss-frame-1.webp' },
    { source: 'DSC08547.jpg', output: 'boss-frame-2.webp' },
  ],
  'boss-cell': [
    { source: 'DSC08586.jpg', output: 'boss-cell-1.webp' },
    { source: 'DSC08580.jpg', output: 'boss-cell-2.webp' },
  ],
  'super-feast': [
    { source: 'DSC08695.jpg', output: 'super-feast-1.webp' },
  ],
};

async function optimizeImage(sourceFile, outputFile) {
  const inputPath = path.join(sourceDir, sourceFile);
  const outputPath = path.join(destDir, outputFile);

  try {
    // Check if source file exists
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Source file not found: ${sourceFile}`);
      return null;
    }

    // Get file stats
    const stats = fs.statSync(inputPath);
    const originalSize = (stats.size / 1024).toFixed(2); // KB

    // Optimize image: resize to max 1200x1200, convert to webp, quality 85
    await sharp(inputPath)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toFile(outputPath);

    const newStats = fs.statSync(outputPath);
    const newSize = (newStats.size / 1024).toFixed(2); // KB
    const reduction = ((1 - newStats.size / stats.size) * 100).toFixed(1);

    console.log(`✅ ${sourceFile} → ${outputFile}`);
    console.log(`   ${originalSize} KB → ${newSize} KB (${reduction}% reduction)`);

    return {
      original: sourceFile,
      optimized: outputFile,
      path: `/images/studios/${outputFile}`,
    };
  } catch (error) {
    console.error(`❌ Error processing ${sourceFile}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🖼️  Starting studio image optimization...\n');
  console.log(`Source: ${sourceDir}`);
  console.log(`Destination: ${destDir}\n`);

  const results = {};

  for (const [studioSlug, images] of Object.entries(studioImages)) {
    console.log(`\n📸 Processing ${studioSlug}...`);
    results[studioSlug] = [];

    for (const image of images) {
      const result = await optimizeImage(image.source, image.output);
      if (result) {
        results[studioSlug].push(result);
      }
    }
  }

  console.log(`\n✨ Optimization complete!`);
  console.log('\nOptimized images by studio:');
  for (const [studioSlug, images] of Object.entries(results)) {
    console.log(`\n${studioSlug}:`);
    images.forEach((img) => {
      console.log(`  - ${img.path}`);
    });
  }
}

main().catch(console.error);

