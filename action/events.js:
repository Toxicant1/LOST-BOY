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
                dpUser = 'https://files.catbox.moe/s5nuh3.jpg';
            }

            const username = `@${num.split('@')[0]}`;

            if (Nick.action === 'add') {
                const welcomeText = `${username} Holla 👋,\n\nWelcome to *${groupName}* 🏡\n\n📌 Be sure to read the group description\n📎 ${groupDesc}\n🛡️ Respect the rules to avoid being kicked!\n\n🤖 Powered by *${botname}* 2025`;

                if (welcomegoodbye === 'TRUE') {
                    await client.sendMessage(Nick.id, {
                        image: { url: dpUser },
                        caption: welcomeText,
                        mentions: [num]
                    });
                }

            } else if (Nick.action === 'remove') {
                const goodbyeText = `${username} just left 🚪\n\n😔 We'll miss you. Goodbye!\n\n— *${botname}*`;

                if (welcomegoodbye === 'TRUE') {
                    await client.sendMessage(Nick.id, {
                        image: { url: dpUser },
                        caption: goodbyeText,
                        mentions: [num]
                    });
                }
            }
        }

    } catch (err) {
        console.error('⚠️ Events error:', err);
    }
};

module.exports = Events;
