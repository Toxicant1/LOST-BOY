require("./config.js");
const {
    default: LostBoyConnect,
    useSingleFileAuthState,
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
const { state, saveState } = useSingleFileAuthState("./session.json");
const { autobio, emoji1, emoji2, emoji3, ownername } = require("./set");
const { smsg } = require("./lib/simple");
const figlet = require("figlet");
const cfonts = require("cfonts");

// Display Fancy Banner with Fonts
cfonts.say("LostBoy", {
  font: "block",
  align: "center",
  colors: ["red", "black"],
  background: "transparent",
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
});

cfonts.say("Ishak Ibrahim", {
  font: "chrome",
  align: "center",
  colors: ["yellow"],
  background: "transparent",
});

// Setup Store
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) });
store.readFromFile("./baileys_store.json");
setInterval(() => {
    store.writeToFile("./baileys_store.json");
}, 10000);

// MAIN START FUNCTION
async function startLostBoyBot() {
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

    // Save Auth State
    store.bind(sock.ev);
    sock.ev.on("creds.update", saveState);

    // Auto Bio Feature
    if (autobio === "on") {
        setInterval(async () => {
            const time = new Date().toLocaleTimeString("en-US", { hour12: true });
            const newBio = `🤖 ${emoji1} I'm LostBoy | Time: ${time}`;
            await sock.updateProfileStatus(newBio).catch(() => {});
        }, 40 * 1000); // every 40 seconds
    }

    // Events
    require("./action/events")(sock, store);

    // Connection Handling
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            switch (reason) {
                case DisconnectReason.badSession:
                    console.log(chalk.red("Bad Session File. Please Delete Session and Scan Again."));
                    process.exit();
                    break;
                case DisconnectReason.connectionClosed:
                    console.log(chalk.yellow("Connection Closed. Reconnecting..."));
                    startLostBoyBot();
                    break;
                case DisconnectReason.connectionLost:
                    console.log(chalk.yellow("Connection Lost. Reconnecting..."));
                    startLostBoyBot();
                    break;
                case DisconnectReason.connectionReplaced:
                    console.log(chalk.red("Connection Replaced. Another session opened."));
                    process.exit();
                    break;
                case DisconnectReason.loggedOut:
                    console.log(chalk.red("Device Logged Out. Please Scan Again."));
                    process.exit();
                    break;
                case DisconnectReason.restartRequired:
                    console.log(chalk.green("Restart Required. Restarting..."));
                    startLostBoyBot();
                    break;
                case DisconnectReason.timedOut:
                    console.log(chalk.yellow("Connection Timed Out. Reconnecting..."));
                    startLostBoyBot();
                    break;
                default:
                    console.log(chalk.red("Unknown Disconnect Reason. Reconnecting..."));
                    startLostBoyBot();
            }
        } else if (connection === "open") {
            console.log(chalk.greenBright("✅ LostBoy is now online and connected!"));
        }
    });

    // Handle Incoming Messages
    sock.ev.on("messages.upsert", async (m) => {
        try {
            smsg(sock, m);
        } catch (err) {
            console.log("Error handling message: ", err);
        }
    });
}

startLostBoyBot();