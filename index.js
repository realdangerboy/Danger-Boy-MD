const express = require("express");
const qrcode = require("qrcode");
const bodyParser = require("body-parser");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("session");
  const { version } = await fetchLatestBaileysVersion();

  // 🔑 Create WhatsApp connection
  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on("creds.update", saveCreds);

  // ✅ When connection is ready, bot will start
  sock.ev.on("connection.update", (update) => {
    if (update.connection === "open") {
      console.log("✅ WhatsApp connected!");
      // 👉 Here you can start bot commands / features
    }
  });

  // 🚀 Web server for session
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));

  // Homepage
  app.get("/", (req, res) => {
    res.send(`
      <h1>⚡ Danger-Boy-MD Session Generator ⚡</h1>
      <ul>
        <li><a href="/session-qr">Get Session via QR</a></li>
        <li><a href="/session-pairing">Get Session via Pairing Code</a></li>
      </ul>
    `);
  });

  // QR route
  app.get("/session-qr", (req, res) => {
    sock.ev.on("connection.update", (update) => {
      if (update.qr) {
        qrcode.toDataURL(update.qr, (err, url) => {
          res.send(`<h2>Scan this QR to log in</h2><img src="${url}" />`);
        });
      }
      if (update.connection === "open") {
        res.send("<h2>✅ Session created! Bot is now running 🚀</h2>");
      }
    });
  });

  // Pairing code input
  app.get("/session-pairing", (req, res) => {
    res.send(`
      <h2>Enter your WhatsApp number (with country code):</h2>
      <form method="POST" action="/session-pairing">
        <input type="text" name="phone" placeholder="e.g. 447123456789" required>
        <button type="submit">Get Pairing Code</button>
      </form>
    `);
  });

  // Generate pairing code
  app.post("/session-pairing", async (req, res) => {
    const phoneNumber = req.body.phone;
    try {
      const code = await sock.requestPairingCode(phoneNumber);
      res.send(`<h2>📱 Pairing Code for ${phoneNumber}: <b>${code}</b></h2><p>Bot will auto-start after login ✅</p>`);
    } catch (e) {
      res.send(`<p>Error: ${e.message}</p>`);
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`🌍 Session web running on http://localhost:${PORT}`)
  );
}

startBot();
