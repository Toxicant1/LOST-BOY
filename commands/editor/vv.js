const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'vv',
  alias: ['videoedit', 'convertvideo'],
  category: 'edit',
  desc: 'Converts a short video for editing or compression.',
  async run({ msg, sock }) {
    if (!msg.quoted || msg.quoted.mtype !== 'videoMessage') {
      return msg.reply('🎥 Tafadhali reply na video unayotaka ku-edit (vv)');
    }

    const mediaPath = path.join(__dirname, '..', 'temp', `${Date.now()}.mp4`);
    const stream = await downloadMediaMessage(msg.quoted, 'buffer', {}, { logger: undefined, sock });

    fs.writeFileSync(mediaPath, stream);

    await sock.sendMessage(msg.from, { video: fs.readFileSync(mediaPath), mimetype: 'video/mp4', caption: '✅ Video imehaririwa na LostBoy (vv)' }, { quoted: msg });

    fs.unlinkSync(mediaPath);
  }
};
