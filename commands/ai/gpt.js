module.exports = {
  name: "gpt",
  description: "Ask GPT anything",
  category: "ai",
  run: async ({ sock, m, args }) => {
    const question = args.join(" ");
    if (!question) return sock.sendMessage(m.chat, { text: "❓ Ask me something!" });

    // Dummy reply
    sock.sendMessage(m.chat, { text: `🤖 GPT Response to: ${question}` });
  }
};
