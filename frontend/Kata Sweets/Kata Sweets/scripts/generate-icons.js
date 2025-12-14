/**
 * Icon Generation Script for Nataraja Traders
 * 
 * This script generates all required icons from NatarajaLogo.svg
 * 
 * Requirements:
 * - sharp: npm install sharp --save-dev
 * - OR use ImageMagick: brew install imagemagick (Mac) / choco install imagemagick (Windows)
 * 
 * Usage: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available (preferred method)
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.warn('⚠️  sharp not found. Install with: npm install sharp --save-dev');
  console.warn('   Or use ImageMagick method (see script comments)');
}

const LOGO_PATH = path.join(__dirname, '../public/NatarajaLogo.svg');
const OUTPUT_DIR = path.join(__dirname, '../public/icons');

// Android mipmap sizes (in dp, converted to px at different densities)
const ANDROID_SIZES = {
  mdpi: { multiplier: 1, sizes: [48, 72, 96, 144, 192] },
  hdpi: { multiplier: 1.5, sizes: [48, 72, 96, 144, 192] },
  xhdpi: { multiplier: 2, sizes: [48, 72, 96, 144, 192] },
  xxhdpi: { multiplier: 3, sizes: [48, 72, 96, 144, 192] },
  xxxhdpi: { multiplier: 4, sizes: [48, 72, 96, 144, 192] },
};

// iOS icon sizes
const IOS_SIZES = [
  { size: 20, scale: 1 },
  { size: 20, scale: 2 },
  { size: 20, scale: 3 },
  { size: 29, scale: 1 },
  { size: 29, scale: 2 },
  { size: 29, scale: 3 },
  { size: 40, scale: 1 },
  { size: 40, scale: 2 },
  { size: 40, scale: 3 },
  { size: 60, scale: 2 },
  { size: 60, scale: 3 },
  { size: 76, scale: 1 },
  { size: 76, scale: 2 },
  { size: 83.5, scale: 2 },
  { size: 1024, scale: 1 },
];

// Web favicon sizes
const WEB_SIZES = [
  { size: 16, name: 'favicon-16.png' },
  { size: 32, name: 'favicon-32.png' },
  { size: 64, name: 'favicon-64.png' },
  { size: 192, name: 'favicon-192.png' },
  { size: 512, name: 'favicon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
];

async function generateIcon(inputPath, outputPath, size, backgroundColor = null) {
  if (!sharp) {
    console.error('❌ sharp is required. Install with: npm install sharp --save-dev');
    process.exit(1);
  }

  try {
    let image = sharp(inputPath).resize(size, size, {
      fit: 'contain',
      background: backgroundColor || { r: 255, g: 255, b: 255, alpha: 0 }
    });

    if (outputPath.endsWith('.ico')) {
      // For ICO files, we'll generate PNG first, then convert
      const pngPath = outputPath.replace('.ico', '.png');
      await image.png().toFile(pngPath);
      console.log(`✅ Generated: ${pngPath}`);
      return pngPath;
    } else {
      await image.png().toFile(outputPath);
      console.log(`✅ Generated: ${outputPath}`);
    }
  } catch (error) {
    console.error(`❌ Error generating ${outputPath}:`, error.message);
  }
}

async function generateNotificationIcon(inputPath, outputPath) {
  if (!sharp) {
    console.error('❌ sharp is required');
    process.exit(1);
  }

  try {
    // Create white-only version for notification icon
    await sharp(inputPath)
      .resize(96, 96, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .greyscale()
      .threshold(128)
      .png()
      .toFile(outputPath);
    console.log(`✅ Generated notification icon: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error generating notification icon:`, error.message);
  }
}

async function main() {
  console.log('🎨 Starting icon generation from NatarajaLogo.svg...\n');

  if (!fs.existsSync(LOGO_PATH)) {
    console.error(`❌ Logo not found at: ${LOGO_PATH}`);
    process.exit(1);
  }

  // Create output directories
  const dirs = [
    OUTPUT_DIR,
    path.join(__dirname, '../android/app/src/main/res/drawable'),
    path.join(__dirname, '../public'),
  ];

  // Create Android mipmap directories
  Object.keys(ANDROID_SIZES).forEach(density => {
    dirs.push(path.join(__dirname, `../android/app/src/main/res/mipmap-${density}`));
  });

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  console.log('📁 Created output directories\n');

  // Generate Android icons
  console.log('📱 Generating Android icons...');
  for (const [density, config] of Object.entries(ANDROID_SIZES)) {
    for (const size of config.sizes) {
      const pxSize = Math.round(size * config.multiplier);
      const outputPath = path.join(
        __dirname,
        `../android/app/src/main/res/mipmap-${density}/ic_launcher_foreground.png`
      );
      
      // Only generate once per density (use largest size for foreground)
      if (size === 192) {
        await generateIcon(LOGO_PATH, outputPath, pxSize);
      }
    }
  }

  // Generate Android round icons (same as regular for now)
  for (const density of Object.keys(ANDROID_SIZES)) {
    const foregroundPath = path.join(
      __dirname,
      `../android/app/src/main/res/mipmap-${density}/ic_launcher_foreground.png`
    );
    const roundPath = path.join(
      __dirname,
      `../android/app/src/main/res/mipmap-${density}/ic_launcher_round.png`
    );
    
    if (fs.existsSync(foregroundPath)) {
      fs.copyFileSync(foregroundPath, roundPath);
      console.log(`✅ Copied round icon: ${roundPath}`);
    }
  }

  // Generate notification icon (white outline version)
  console.log('\n🔔 Generating Android notification icon...');
  const notificationPath = path.join(
    __dirname,
    '../android/app/src/main/res/drawable/ic_notification.png'
  );
  await generateNotificationIcon(LOGO_PATH, notificationPath);

  // Generate web favicons
  console.log('\n🌐 Generating web favicons...');
  for (const { size, name } of WEB_SIZES) {
    const outputPath = path.join(OUTPUT_DIR, name);
    await generateIcon(LOGO_PATH, outputPath, size);
  }

  // Generate favicon.ico (16x16 and 32x32 combined)
  const favicon16 = path.join(OUTPUT_DIR, 'favicon-16.png');
  const favicon32 = path.join(OUTPUT_DIR, 'favicon-32.png');
  await generateIcon(LOGO_PATH, favicon16, 16);
  await generateIcon(LOGO_PATH, favicon32, 32);
  console.log('⚠️  Note: favicon.ico needs manual creation from favicon-16.png and favicon-32.png');
  console.log('   Use an online tool like https://favicon.io/favicon-converter/');

  console.log('\n✅ Icon generation complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Copy generated icons to their respective locations');
  console.log('2. Update AndroidManifest.xml (already configured)');
  console.log('3. Update index.html with new favicon references');
  console.log('4. Update Firebase notification config');
  console.log('5. For iOS: Copy icons to ios/App/App/Assets.xcassets/AppIcon.appiconset/');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateIcon, generateNotificationIcon };

