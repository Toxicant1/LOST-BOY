const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

module.exports = {
  name: 'vv2',
  alias: ['video2', 'compress2'],
  desc: '⚙️ Alternate lightweight video optimizer (vv2)',
  category: 'edit',
  usage: 'vv2 [reply to video]',
  async execute(sock, m, args) {
    try {
      if (!m.quoted || m.quoted.mtype !== 'videoMessage') {
        return m.reply('📽️ Reply to a video to compress it (lightweight version)');
      }

      const media = await downloadMediaMessage(m.quoted, 'buffer', {}, { reuploadRequest: sock.updateMediaMessage });
      const inputPath = path.join(__dirname, '../../temp', `vv2-input-${Date.now()}.mp4`);
      const outputPath = path.join(__dirname, '../../temp', `vv2-output-${Date.now()}.mp4`);

      fs.writeFileSync(inputPath, media);

      ffmpeg(inputPath)
        .videoBitrate(400) // reduce bitrate for lightweight compression
        .withSize('?x360') // reduce resolution for faster sharing
        .output(outputPath)
        .on('end', async () => {
          const vidBuffer = fs.readFileSync(outputPath);
          await sock.sendMessage(m.chat, { video: vidBuffer, caption: '✅ VV2 compressed 🎬' }, { quoted: m });
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
        })
        .on('error', (err) => {
          console.error(err);
          m.reply('❌ Compression failed.');
        })
        .run();

    } catch (err) {
      console.error('[vv2 error]', err);
      return m.reply('⚠️ Error during vv2 video processing.');
    }
  }
};
