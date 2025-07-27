// ✅ FINALIZED index.js for LOST BOY // ⚠️ Only name, number, and repo updated – session pairing untouched

const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require("@whiskeysockets/baileys") const { Boom } = require("@hapi/boom") const pino = require("pino") const fs = require("fs") const figlet = require("figlet") const chalk = require("chalk")

const startLostBoy = async () => { const { state, saveCreds } = await useMultiFileAuthState("./session")

const sock = makeWASocket({ logger: pino({ level: "silent" }), printQRInTerminal: true, auth: state, browser: ["Lost Boy", "Chrome", "1.0.0"] })

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", (update) => { const { connection, lastDisconnect } = update if (connection === "close") { const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut console.log("Connection closed due to", lastDisconnect.error, ", reconnecting...", shouldReconnect) if (shouldReconnect) { startLostBoy() } } else if (connection === "open") { console.log(chalk.green("\nConnected to WhatsApp!")) } })

sock.ev.on("messages.upsert", async ({ messages }) => { const msg = messages[0] if (!msg.message) return const messageType = Object.keys(msg.message)[0] const sender = msg.key.remoteJid

if (messageType === "conversation" && msg.message.conversation.toLowerCase() === ".menu") {
  await sock.sendMessage(sender, { text: "🔥 Welcome to LOST BOY bot menu!" })
}

}) }

console.clear() console.log(chalk.red(figlet.textSync("LOST BOY", { horizontalLayout: "default" }))) console.log(chalk.whiteBright("Owner: Ishaq Ibrahim")) console.log(chalk.cyanBright("GitHub: https://github.com/Toxicant1/LOST-BOY")) console.log(chalk.magentaBright("Powered by LOST BOY x Baileys MD"))

startLostBoy()

