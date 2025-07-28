// action/events.js

const welcomegoodbye = process.env.WELCOMEGOODBYE || 'FALSE';
const botname = process.env.BOTNAME || '𝑳𝑶𝑺𝑻 𝑩𝑶𝒀'; // Default: LOST BOY
const ownerName = '𝓘𝓼𝓱𝓪𝓺 𝓘𝓫𝓻𝓪𝓱𝓲𝓶'; // Your name stylized

const Events = async (client, Nick) => {
    try {
        const metadata = await client.groupMetadata(Nick.id);
        const participants = Nick.participants;

        for (const num of participants) {
            let dpuser;

            try {
                dpuser = await client.profilePictureUrl(num, "image");
            } catch {
                dpuser = "https://files.catbox.moe/s5nuh3.jpg"; // fallback image
            }

            if (Nick.action === "add") {
                const username = num.split("@")[0];
                const welcomeText = `@${username} 👋 Holla!\n\nWelcome to *${metadata.subject}*.\n\n📜 Be sure to check the group rules and description.\n🚫 Respect others to avoid being removed.\n\n🤖 ${botname} | 👑 ${ownerName}`;

                if (welcomegoodbye.toUpperCase() === 'TRUE') {
                    await client.sendMessage(Nick.id, {
                        image: { url: dpuser },
                        caption: welcomeText,
                        mentions: [num],
                    });
                }

            } else if (Nick.action === "remove") {
                const username = num.split("@")[0];
                const goodbyeText = `@${username} 😔 Just left the group.\n\nAll the best out there.\n\n🤖 ${botname} | 👑 ${ownerName}`;

                if (welcomegoodbye.toUpperCase() === 'TRUE') {
                    await client.sendMessage(Nick.id, {
                        image: { url: dpuser },
                        caption: goodbyeText,
                        mentions: [num],
                    });
                }
            }
        }
    } catch (err) {
        console.error("⚠️ Error in Events Handler:", err);
    }
};

module.exports = Events;