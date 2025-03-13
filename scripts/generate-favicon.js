const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
    try {
        // Baca file SVG
        const svgBuffer = fs.readFileSync(path.join(__dirname, '../public/logo.svg'));

        // Konversi ke PNG dengan ukuran 32x32 (ukuran standar favicon)
        const pngBuffer = await sharp(svgBuffer)
            .resize(32, 32)
            .png()
            .toBuffer();

        // Simpan sebagai favicon.ico
        fs.writeFileSync(path.join(__dirname, '../public/favicon.ico'), pngBuffer);

        console.log('Favicon berhasil dibuat!');
    } catch (error) {
        console.error('Error generating favicon:', error);
    }
}

generateFavicon(); 