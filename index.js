const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeInMemoryStore
} = require("@whiskeysockets/baileys");

const { Boom } = require("@hapi/boom");
const P = require("pino");
const fs = require("fs");
const path = require("path");

// ✅ Load all custom functions
const { autobio, autoStatus, checkBotActive } = require("./action/set.js");

// ✅ Setup multi-auth state
const startBot = async () => {
  const { state, saveCreds } = await useMultiFileAuthState("session");

  const store = makeInMemoryStore({
    logger: P().child({ level: "silent", stream: "store" }),
  });

  store.readFromFile("./session/baileys_store.json");
  setInterval(() => {
    store.writeToFile("./session/baileys_store.json");
  }, 10_000);

  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`⏳ Using WA v${version.join(".")} (Latest: ${isLatest})`);

  const sock = makeWASocket({
    version,
    printQRInTerminal: true,
    logger: P({ level: "silent" }),
    auth: state,
    browser: ["LostBoy", "Chrome", "4.0"],
    syncFullHistory: false,
  });

  store.bind(sock.ev);

  // ✅ Load external events like message handler
  require("./action/events")(sock, store);

  // ✅ Auto bio and status if enabled
  if (autobio.enabled) {
    setInterval(() => {
      sock.updateProfileStatus(autobio.text).catch(() => {});
    }, autobio.interval || 60_000);
  }

  if (autoStatus.enabled) {
    setInterval(() => {
      sock.sendPresenceUpdate("available");
    }, autoStatus.interval || 60_000);
  }

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("🔌 Disconnected. Reconnecting:", shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === "open") {
      console.log("✅ Bot connected successfully!");
    }
  });

  sock.ev.on("creds.update", saveCreds);
};

startBot();