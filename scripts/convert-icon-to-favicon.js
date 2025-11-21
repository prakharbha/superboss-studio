/**
 * Convert icon.png to favicon.ico
 * This script converts the correct icon.png to favicon.ico format
 */

const fs = require('fs');
const path = require('path');
const toIco = require('to-ico');
const sharp = require('sharp');

async function convertIconToFavicon() {
  try {
    const iconPath = path.join(__dirname, '../public/icon.png');
    const outputPath = path.join(__dirname, '../app/favicon.ico');
    
    console.log('🔄 Converting icon.png to favicon.ico...');
    
    // Read the icon.png file
    const iconBuffer = fs.readFileSync(iconPath);
    
    // Create multiple sizes for ICO (16x16, 32x32, 48x48)
    const sizes = [16, 32, 48];
    const buffers = await Promise.all(
      sizes.map(size =>
        sharp(iconBuffer)
          .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
          .png()
          .toBuffer()
      )
    );
    
    // Convert to ICO format
    const icoBuffer = await toIco(buffers);
    
    // Write to app/favicon.ico
    fs.writeFileSync(outputPath, icoBuffer);
    
    console.log('✅ Successfully created favicon.ico from icon.png');
    console.log(`   Output: ${outputPath}`);
    
    // Also update public/favicon.ico
    const publicOutputPath = path.join(__dirname, '../public/favicon.ico');
    fs.writeFileSync(publicOutputPath, icoBuffer);
    console.log(`   Also updated: ${publicOutputPath}`);
    
  } catch (error) {
    console.error('❌ Error converting icon:', error);
    process.exit(1);
  }
}

convertIconToFavicon();

