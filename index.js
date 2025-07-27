require("./config.js");
const {
    default: LostBoyConnect,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    jidDecode,
    getContentType,
    makeCacheableSignalKeyStore,
    proto
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require("fs");
const chalk = require("chalk");
const figlet = require("figlet");
const cfonts = require("cfonts");
const { autobio, emoji1, emoji2, emoji3, ownername } = require("./set");
const { smsg } = require("./lib/simple");

// Display Fonts
cfonts.say("LostBoy", {
  font: "block",
  align: "center",
  colors: ["red", "black"],
});

cfonts.say("Ishak Ibrahim", {
  font: "chrome",
  align: "center",
  colors: ["yellow"],
});

// Setup Store
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });
store.readFromFile("./baileys_store.json");
setInterval(() => {
    store.writeToFile("./baileys_store.json");
}, 10000);

// MAIN START FUNCTION
async function startLostBoyBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");
    const { version, isLatest } = await fetchLatestBaileysVersion();
    const sock = LostBoyConnect({
        version,
        logger: pino({ level: "silent" }),
        printQRInTerminal: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
        },
        browser: ["LostBoy", "Chrome", "1.0.0"]
    });

    // Save Auth
    store.bind(sock.ev);
    sock.ev.on("creds.update", saveCreds);

    // Auto Bio Feature
    if (autobio === "on") {
        setInterval(async () => {
            const time = new Date().toLocaleTimeString("en-US", { hour12: true });
            const newBio = `🤖 ${emoji1} I'm LostBoy | Time: ${time}`;
            await sock.updateProfileStatus(newBio).catch(() => {});
        }, 40 * 1000);
    }

    // Event Handler
    require("./action/events")(sock, store);

    // Connection Status
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            switch (reason) {
                case DisconnectReason.badSession:
                    console.log(chalk.red("❌ Bad session file. Delete and rescan."));
                    process.exit();
                    break;
                case DisconnectReason.connectionClosed:
                    console.log(chalk.yellow("🔁 Connection closed. Reconnecting..."));
                    startLostBoyBot();
                    break;
                case DisconnectReason.connectionLost:
                    console.log(chalk.yellow("🔁 Connection lost. Reconnecting..."));
                    startLostBoyBot();
                    break;
                case DisconnectReason.connectionReplaced:
                    console.log(chalk.red("❌ Connection replaced by another session."));
                    process.exit();
                    break;
                case DisconnectReason.loggedOut:
                    console.log(chalk.red("❌ Logged out. Rescan required."));
                    process.exit();
                    break;
                case DisconnectReason.restartRequired:
                    console.log(chalk.green("♻️ Restart required. Restarting..."));
                    startLostBoyBot();
                    break;
                case DisconnectReason.timedOut:
                    console.log(chalk.yellow("⌛ Timed out. Reconnecting..."));
                    startLostBoyBot();
                    break;
                default:
                    console.log(chalk.red("❌ Unknown error. Reconnecting..."));
                    startLostBoyBot();
            }
        } else if (connection === "open") {
            console.log(chalk.greenBright("✅ LostBoy is online and ready!"));
        }
    });

    // Handle Messages
    sock.ev.on("messages.upsert", async (m) => {
        try {
            smsg(sock, m);
        } catch (err) {
            console.log("💥 Message Error:", err);
        }
    });
}

startLostBoyBot();