const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const addExif = async (input, output, packname = 'LOST-BOY', author = 'Ishaq Ibrahim') => {
    const json = {
        "sticker-pack-id": "com.lostboybot.sticker",
        "sticker-pack-name": packname,
        "sticker-pack-publisher": author,
        "emojis": ["😹", "👻", "🐀", "❤️‍🔥", "👀", "✌️"]
    };

    const exifAttr = Buffer.from(JSON.stringify(json), 'utf8');
    const exif = Buffer.concat([
        Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00]),
        exifAttr
    ]);

    const tempExifPath = path.join(__dirname, 'temp.exif');
    fs.writeFileSync(tempExifPath, exif);

    exec(`webpmux -set exif ${tempExifPath} ${input} -o ${output}`, (err) => {
        if (err) throw err;
        fs.unlinkSync(tempExifPath);
    });
};

module.exports = { addExif };