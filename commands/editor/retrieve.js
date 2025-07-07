// commands/editor/retrieve.js
module.exports = {
  name: 'retrieve',
  alias: ['getdeleted', 'recover'],
  desc: 'Recover deleted messages if anti-delete is enabled',
  category: 'editor',
  async run(m, { conn }) {
    // Placeholder. Anti-delete logic is set globally, not here.
    m.reply('✅ Anti-delete is active. Deleted messages will appear automatically.');
  }
};
