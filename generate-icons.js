#!/usr/bin/env node

// Simple icon generator using Canvas (if available) or creating placeholder SVGs
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons at different sizes
sizes.forEach(size => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#45a049;stop-opacity:1" />
    </linearGradient>
  </defs>

  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>

  <g transform="translate(${size/2},${size/2})">
    ${generateFlowerPetals(size)}
    <circle cx="0" cy="0" r="${size * 0.07}" fill="#FFA500"/>
    <circle cx="0" cy="0" r="${size * 0.05}" fill="#FFD700"/>
  </g>

  <g transform="translate(${size * 0.74},${size * 0.74})">
    <circle cx="0" cy="0" r="${size * 0.1}" fill="white" opacity="0.3"/>
    <text x="0" y="${size * 0.03}" font-size="${size * 0.08}" font-family="Arial" font-weight="bold" text-anchor="middle" fill="white">AQ</text>
  </g>
</svg>`;

    const filename = path.join(iconsDir, `icon-${size}x${size}.png`);
    const svgFilename = path.join(iconsDir, `icon-${size}x${size}.svg`);

    // Write SVG file
    fs.writeFileSync(svgFilename, svg);
    console.log(`Generated: icon-${size}x${size}.svg`);
});

function generateFlowerPetals(size) {
    const petalSize = size * 0.08;
    const petalLength = size * 0.12;
    const distance = size * 0.16;

    let petals = '';
    for (let i = 0; i < 8; i++) {
        const angle = (i * 45) - 90;
        const x = Math.cos(angle * Math.PI / 180) * distance;
        const y = Math.sin(angle * Math.PI / 180) * distance;

        petals += `<ellipse cx="${x}" cy="${y}" rx="${petalSize}" ry="${petalLength}" fill="#FFE4E1" opacity="0.9" transform="rotate(${angle} ${x} ${y})"/>
    `;
    }

    return petals;
}

console.log('\n✅ SVG icons generated successfully!');
console.log('\nTo convert SVG to PNG, you can:');
console.log('1. Use the generate-icons.html in your browser');
console.log('2. Use an online converter like https://cloudconvert.com/svg-to-png');
console.log('3. Use ImageMagick: convert icon.svg icon.png');
console.log('\nFor now, the SVG files will work as placeholders.\n');
