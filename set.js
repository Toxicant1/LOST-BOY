const sessionName = 'session';
const session = process.env.SESSION || '';
const autobio = process.env.AUTOBIO || 'FALSE';
const autolike = process.env.AUTOLIKE_STATUS || 'TRUE';
const autoviewstatus = process.env.AUTOVIEW_STATUS || 'TRUE';
const welcomegoodbye = process.env.WELCOMEGOODBYE || 'FALSE';
const prefix = process.env.PREFIX || '';
const appname = process.env.APP_NAME || '';
const herokuapi = process.env.HEROKU_API;
const gptdm = process.env.GPT_INBOX || 'FALSE';
const mode = process.env.MODE || 'PRIVATE';
const anticall = process.env.AUTOREJECT_CALL || 'TRUE';

// 💥 Stylized bot branding
const botname = process.env.BOTNAME || '⚡ 𝕷𝖔𝖘𝖙 𝕭𝖔𝖞 ⚡';
const antibot = process.env.ANTIBOT || 'FALSE';
const author = process.env.STICKER_AUTHOR || '👑 𝕷𝖔𝖘𝖙 𝕭𝖔𝖞';
const packname = process.env.STICKER_PACKNAME || '🔥 𝕷𝖔𝖘𝖙 𝕭𝖔𝖞 𝕻𝖆𝖈𝖐 🔥';

const antitag = process.env.ANTITAG || 'TRUE';
const dev = process.env.DEV || '254741819582'; // ✅ Your number

const menulink = process.env.MENU_LINK || 'https://files.catbox.moe/jxxwms.jpeg';
const menu = process.env.MENU_TYPE || 'IMAGE';

const DevRaven = dev.split(",");
const badwordkick = process.env.BAD_WORD_KICK || 'FALSE';
const bad = process.env.BAD_WORD || 'fuck';
const autoread = process.env.AUTOREAD || 'FALSE';
const antidel = process.env.ANTIDELETE || 'TRUE';

const admin = process.env.ADMIN_MSG || '⚠️ This command is for Admins only!';
const group = process.env.GROUP_ONLY_MSG || '⚠️ Group-only command!';
const botAdmin = process.env.BOT_ADMIN_MSG || '⚠️ I need admin rights to do that!';
const NotOwner = process.env.NOT_OWNER_MSG || '⚠️ Only the bot owner can run this!';

const wapresence = process.env.WA_PRESENCE || 'recording';
const antilink = process.env.ANTILINK || 'TRUE';
const mycode = process.env.CODE || '254';
const antiforeign = process.env.ANTIFOREIGN || 'TRUE';
const port = process.env.PORT || 10000;
const antilinkall = process.env.ANTILINK_ALL || 'TRUE';

module.exports = {
  session, sessionName, autobio, author, packname, dev, DevRaven,
  badwordkick, bad, mode, group, NotOwner, botname, botAdmin, antiforeign,
  menu, autoread, antilink, admin, mycode, antilinkall, anticall, antitag,
  antidel, wapresence, welcomegoodbye, antibot, herokuapi, prefix,
  port, gptdm, appname, autolike, autoviewstatus
};