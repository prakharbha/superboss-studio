const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const videoPath = path.join(process.cwd(), 'public', 'superboss-studio-tour.mp4');
const outputDir = path.join(process.cwd(), 'public', 'videos');

// Create videos directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎬 Starting banner video optimization...\n');

// Check if ffmpeg is available
try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ ffmpeg is not installed. Please install it first:');
  console.error('   macOS: brew install ffmpeg');
  console.error('   Linux: sudo apt-get install ffmpeg');
  process.exit(1);
}

if (!fs.existsSync(videoPath)) {
  console.error(`❌ Video file not found at: ${videoPath}`);
  console.error('   Using optimized 720p version as source...');
  const sourcePath = path.join(outputDir, 'superboss-studio-tour-720p.mp4');
  if (!fs.existsSync(sourcePath)) {
    console.error(`❌ Source video not found at: ${sourcePath}`);
    process.exit(1);
  }
  videoPath = sourcePath;
}

const fileSizeBefore = fs.existsSync(videoPath) ? fs.statSync(videoPath).size : 0;
console.log(`📹 Source video size: ${(fileSizeBefore / 1024 / 1024).toFixed(2)} MB\n`);

// Banner video optimization settings - optimized for homepage background
const bannerOptimization = {
  name: 'Banner Video (1080p, no audio)',
  output: path.join(outputDir, 'superboss-studio-tour-banner-1080p.mp4'),
  width: 1920,
  height: 1080,
  bitrate: '3M',
  maxrate: '3.5M',
  bufsize: '6M',
  description: 'Optimized for homepage banner - no audio, smaller file size',
};

// Also create a 720p version for better performance
const bannerOptimization720 = {
  name: 'Banner Video (720p, no audio)',
  output: path.join(outputDir, 'superboss-studio-tour-banner-720p.mp4'),
  width: 1280,
  height: 720,
  bitrate: '1.5M',
  maxrate: '2M',
  bufsize: '3M',
  description: 'Optimized for homepage banner - 720p, no audio, smaller file size',
};

console.log('🔄 Optimizing banner videos (no audio)...\n');

// Optimize 1080p banner version
console.log(`Creating ${bannerOptimization.name}...`);
try {
  const command = `ffmpeg -i "${videoPath}" ` +
    `-c:v libx264 ` + // H.264 codec
    `-preset slow ` + // Better compression
    `-crf 25 ` + // Slightly higher CRF for smaller file (25 is good for background video)
    `-vf "scale=${bannerOptimization.width}:${bannerOptimization.height}:force_original_aspect_ratio=decrease,pad=${bannerOptimization.width}:${bannerOptimization.height}:(ow-iw)/2:(oh-ih)/2" ` +
    `-b:v ${bannerOptimization.bitrate} ` +
    `-maxrate ${bannerOptimization.maxrate} ` +
    `-bufsize ${bannerOptimization.bufsize} ` +
    `-an ` + // No audio
    `-movflags +faststart ` + // Web optimization
    `-y ` + // Overwrite
    `"${bannerOptimization.output}"`;
  
  execSync(command, { stdio: 'pipe' });
  
  const fileSize = fs.statSync(bannerOptimization.output).size;
  const reduction = fileSizeBefore > 0 ? ((1 - fileSize / fileSizeBefore) * 100).toFixed(1) : 'N/A';
  console.log(`   ✓ Created: ${(fileSize / 1024 / 1024).toFixed(2)} MB (${reduction}% reduction)`);
  console.log(`   ${bannerOptimization.description}\n`);
} catch (error) {
  console.error(`   ✗ Error creating ${bannerOptimization.name}:`, error.message);
}

// Optimize 720p banner version
console.log(`Creating ${bannerOptimization720.name}...`);
try {
  const command = `ffmpeg -i "${videoPath}" ` +
    `-c:v libx264 ` +
    `-preset slow ` +
    `-crf 26 ` + // Slightly higher for smaller file
    `-vf "scale=${bannerOptimization720.width}:${bannerOptimization720.height}:force_original_aspect_ratio=decrease,pad=${bannerOptimization720.width}:${bannerOptimization720.height}:(ow-iw)/2:(oh-ih)/2" ` +
    `-b:v ${bannerOptimization720.bitrate} ` +
    `-maxrate ${bannerOptimization720.maxrate} ` +
    `-bufsize ${bannerOptimization720.bufsize} ` +
    `-an ` + // No audio
    `-movflags +faststart ` +
    `-y ` +
    `"${bannerOptimization720.output}"`;
  
  execSync(command, { stdio: 'pipe' });
  
  const fileSize = fs.statSync(bannerOptimization720.output).size;
  const reduction = fileSizeBefore > 0 ? ((1 - fileSize / fileSizeBefore) * 100).toFixed(1) : 'N/A';
  console.log(`   ✓ Created: ${(fileSize / 1024 / 1024).toFixed(2)} MB (${reduction}% reduction)`);
  console.log(`   ${bannerOptimization720.description}\n`);
} catch (error) {
  console.error(`   ✗ Error creating ${bannerOptimization720.name}:`, error.message);
}

console.log('✅ Banner video optimization complete!\n');
console.log('📝 Next steps:');
console.log('   1. Use the 720p version for better performance: /videos/superboss-studio-tour-banner-720p.mp4');
console.log('   2. Use the 1080p version for better quality: /videos/superboss-studio-tour-banner-1080p.mp4');
console.log('   3. Both versions have no audio and are optimized for background use');

