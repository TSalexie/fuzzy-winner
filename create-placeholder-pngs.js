#!/usr/bin/env node

// Create placeholder PNG files by copying SVGs with .png extension
// Modern browsers handle SVG in img tags, so this workaround should work
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'icons');

console.log('Creating placeholder PNG files...\n');

sizes.forEach(size => {
    const svgFile = path.join(iconsDir, `icon-${size}x${size}.svg`);
    const pngFile = path.join(iconsDir, `icon-${size}x${size}.png`);

    if (fs.existsSync(svgFile)) {
        // Copy SVG content to PNG file (browsers will handle it)
        fs.copyFileSync(svgFile, pngFile);
        console.log(`✓ Created icon-${size}x${size}.png`);
    }
});

console.log('\n✅ Placeholder PNG files created!');
console.log('\nNote: These are actually SVG files with .png extension.');
console.log('For production, convert to real PNG using:');
console.log('- generate-icons.html in your browser, or');
console.log('- Online tools like cloudconvert.com\n');
