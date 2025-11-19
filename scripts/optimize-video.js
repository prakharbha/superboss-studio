const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const videoPath = path.join(process.cwd(), 'public', 'superboss-studio-tour.mp4');
const outputDir = path.join(process.cwd(), 'public', 'videos');

// Create videos directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🎬 Starting video optimization...\n');

// Check if ffmpeg is available
try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ ffmpeg is not installed. Please install it first:');
  console.error('   macOS: brew install ffmpeg');
  console.error('   Linux: sudo apt-get install ffmpeg');
  console.error('   Windows: Download from https://ffmpeg.org/download.html');
  process.exit(1);
}

if (!fs.existsSync(videoPath)) {
  console.error(`❌ Video file not found at: ${videoPath}`);
  process.exit(1);
}

const fileSizeBefore = fs.statSync(videoPath).size;
console.log(`📹 Original video size: ${(fileSizeBefore / 1024 / 1024).toFixed(2)} MB\n`);

// Optimization settings
const optimizations = [
  {
    name: 'High Quality (1080p)',
    output: path.join(outputDir, 'superboss-studio-tour-1080p.mp4'),
    width: 1920,
    height: 1080,
    bitrate: '5M',
    maxrate: '6M',
    bufsize: '10M',
    description: 'Best quality for desktop viewing',
  },
  {
    name: 'Medium Quality (720p)',
    output: path.join(outputDir, 'superboss-studio-tour-720p.mp4'),
    width: 1280,
    height: 720,
    bitrate: '2.5M',
    maxrate: '3M',
    bufsize: '5M',
    description: 'Good balance for most devices',
  },
  {
    name: 'Mobile Quality (480p)',
    output: path.join(outputDir, 'superboss-studio-tour-480p.mp4'),
    width: 854,
    height: 480,
    bitrate: '1M',
    maxrate: '1.5M',
    bufsize: '2M',
    description: 'Optimized for mobile devices',
  },
];

// WebM version (better compression)
const webmOptimization = {
  name: 'WebM (720p)',
  output: path.join(outputDir, 'superboss-studio-tour-720p.webm'),
  width: 1280,
  height: 720,
  bitrate: '2M',
  maxrate: '2.5M',
  bufsize: '4M',
  description: 'WebM format for modern browsers',
};

console.log('🔄 Optimizing videos...\n');

// Optimize MP4 versions
optimizations.forEach((opt, index) => {
  console.log(`[${index + 1}/${optimizations.length}] Creating ${opt.name}...`);
  
  try {
    const command = `ffmpeg -i "${videoPath}" ` +
      `-c:v libx264 ` + // H.264 codec
      `-preset slow ` + // Better compression
      `-crf 23 ` + // Quality (18-28, lower is better quality)
      `-vf "scale=${opt.width}:${opt.height}:force_original_aspect_ratio=decrease,pad=${opt.width}:${opt.height}:(ow-iw)/2:(oh-ih)/2" ` +
      `-b:v ${opt.bitrate} ` +
      `-maxrate ${opt.maxrate} ` +
      `-bufsize ${opt.bufsize} ` +
      `-c:a aac ` + // AAC audio codec
      `-b:a 128k ` + // Audio bitrate
      `-movflags +faststart ` + // Web optimization (moov atom at beginning)
      `-y ` + // Overwrite output file
      `"${opt.output}"`;
    
    execSync(command, { stdio: 'pipe' });
    
    const fileSize = fs.statSync(opt.output).size;
    const reduction = ((1 - fileSize / fileSizeBefore) * 100).toFixed(1);
    console.log(`   ✓ Created: ${(fileSize / 1024 / 1024).toFixed(2)} MB (${reduction}% reduction)`);
    console.log(`   ${opt.description}\n`);
  } catch (error) {
    console.error(`   ✗ Error creating ${opt.name}:`, error.message);
  }
});

// Create WebM version
console.log(`Creating ${webmOptimization.name}...`);
try {
  const webmCommand = `ffmpeg -i "${videoPath}" ` +
    `-c:v libvpx-vp9 ` + // VP9 codec for WebM
    `-preset slow ` +
    `-crf 30 ` +
    `-vf "scale=${webmOptimization.width}:${webmOptimization.height}:force_original_aspect_ratio=decrease,pad=${webmOptimization.width}:${webmOptimization.height}:(ow-iw)/2:(oh-ih)/2" ` +
    `-b:v ${webmOptimization.bitrate} ` +
    `-maxrate ${webmOptimization.maxrate} ` +
    `-bufsize ${webmOptimization.bufsize} ` +
    `-c:a libopus ` + // Opus audio for WebM
    `-b:a 128k ` +
    `-y ` +
    `"${webmOptimization.output}"`;
  
  execSync(webmCommand, { stdio: 'pipe' });
  
  const fileSize = fs.statSync(webmOptimization.output).size;
  const reduction = ((1 - fileSize / fileSizeBefore) * 100).toFixed(1);
  console.log(`   ✓ Created: ${(fileSize / 1024 / 1024).toFixed(2)} MB (${reduction}% reduction)`);
  console.log(`   ${webmOptimization.description}\n`);
} catch (error) {
  console.error(`   ✗ Error creating WebM version:`, error.message);
}

console.log('✅ Video optimization complete!\n');
console.log('📝 Next steps:');
console.log('   1. Update the video element in app/studios/[slug]/page.tsx');
console.log('   2. Use the optimized versions with responsive srcset');
console.log('   3. Consider using the 720p version as default for best balance');

