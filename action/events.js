const welcomegoodbye = process.env.WELCOMEGOODBYE || 'FALSE';
const botname = process.env.BOTNAME || '⚡ 𝕷𝖔𝖘𝖙 𝕭𝖔𝖞 ⚡';

const Events = async (client, Nick) => {
  try {
    const metadata = await client.groupMetadata(Nick.id);
    const participants = Nick.participants;
    const groupName = metadata.subject || 'Unnamed Group';
    const groupDesc = metadata.desc || 'No Description';
    const memberCount = metadata.participants.length;

    for (const num of participants) {
      let dpUser;

      try {
        dpUser = await client.profilePictureUrl(num, 'image');
      } catch {
        dpUser = 'https://files.catbox.moe/s5nuh3.jpg'; // fallback pic
      }

      const username = `@${num.split('@')[0]}`;

      if (Nick.action === 'add') {
        const welcomeText = `
🔥 ${username} ameingia base! 🔥
Karibu *${groupName}* 🎭 — tunawanga 24/7!
👥 Sasa tuko *${memberCount} deep*.

📝 *Group Bio:* ${groupDesc}
⚠️ Usijifanye admin, hapa tunajua face 😎

        `;

        if (welcomegoodbye === 'TRUE') {
          await client.sendMessage(Nick.id, {
            image: { url: dpUser },
            caption: welcomeText,
            mentions: [num],
          });
        }

      } else if (Nick.action === 'remove') {
        const goodbyeText = `
💨 ${username} ametoka kwa group...
Hakua na loyalty basi 😤

👋🏾 Bye! Tutasema ulikua legend ama snitch? 
~ _${botname}_
        `;

        if (welcomegoodbye === 'TRUE') {
          await client.sendMessage(Nick.id, {
            image: { url: dpUser },
            caption: goodbyeText,
            mentions: [num],
          });
        }
      }
    }
  } catch (err) {
    console.error('⚠️ Events error:', err);
  }
};

module.exports = Events;