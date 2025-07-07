// commands/editor/sticker.js
const { writeExifImg, writeExifVid } = require('../../lib/exif');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

module.exports = {
  name: 'sticker',
  alias: ['s', 'stik'],
  desc: 'Converts image or short video to sticker',
  category: 'editor',
  async run(m, { conn, mime, quoted }) {
    let buffer;

    if (/image/.test(mime)) {
      buffer = await quoted.download();
      let sticker = await writeExifImg(buffer, { pack: 'LostBoy', author: 'by AI' });
      return conn.sendFile(m.chat, sticker, null, { asSticker: true });
    }

    if (/video/.test(mime)) {
      buffer = await quoted.download();
      let sticker = await writeExifVid(buffer, { pack: 'LostBoy', author: 'by AI' });
      return conn.sendFile(m.chat, sticker, null, { asSticker: true });
    }

    return m.reply('❌ Reply to image or short video to convert to sticker.');
  }
};
