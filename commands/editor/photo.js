// commands/editor/photo.js
module.exports = {
  name: 'photo',
  alias: ['toimg'],
  desc: 'Converts sticker to image',
  category: 'editor',
  async run(m, { conn, quoted, mime }) {
    if (!quoted || !/webp/.test(mime)) return m.reply('❌ Reply to a sticker.');

    let buffer = await quoted.download();
    return conn.sendMessage(m.chat, { image: buffer, caption: '🖼 Sticker converted to image.' }, { quoted: m });
  }
};
