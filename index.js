const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const P = require("pino");
const fs = require("fs");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    logger: P({ level: "silent" }),
    auth: state,
    browser: ["LostBoy", "Chrome", "1.0"]
  });

  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") console.log("✅ Lost Boy is connected!");
    if (connection === "close") console.log("❌ Disconnected.");
  });

  // command handler will go here
}

startBot();
