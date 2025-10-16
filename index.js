// ==============================================
// ⚡ DANGER-BOY-MD | WhatsApp Multi-Device Bot
// 💀 Created by Danger Boy
// ==============================================

import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys"
import P from "pino"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"

dotenv.config()

// ========== CONFIG ==========
const BOT_NAME = process.env.BOT_NAME || "DANGER-BOY-MD"
const PREFIX = process.env.PREFIX || "."
const SUDO = process.env.SUDO || ""
const TZ = process.env.TZ || "Asia/Karachi"
const SESSION_DATA = process.env.SESSION || ""
const START_MESSAGE =
  process.env.START_MESSAGE ||
  `🚀 *${BOT_NAME}* has been launched successfully!\n👑 Creator: Danger Boy 💀`
// ============================

// Prepare session folder
const sessionDir = "./session"
if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true })

// Restore session from base64 if present
if (SESSION_DATA) {
  try {
    const data = JSON.parse(Buffer.from(SESSION_DATA, "base64").toString("utf8"))
    for (const file in data) fs.writeFileSync(`${sessionDir}/${file}`, data[file])
    console.log("✅ Restored session from .env")
  } catch (err) {
    console.log("⚠️ Invalid SESSION data:", err.message)
  }
}

const logger = P({ level: "silent" })
const plugins = new Map()

// =================================================
// ⚙️ LOAD ALL PLUGINS
// =================================================
async function loadPlugins() {
  plugins.clear()
  const folder = path.join(process.cwd(), "plugins")
  if (!fs.existsSync(folder)) fs.mkdirSync(folder)

  const files = fs.readdirSync(folder).filter(f => f.endsWith(".js"))
  for (const file of files) {
    const pluginPath = path.join(folder, file)
    try {
      const plugin = (await import(`file://${pluginPath}?t=${Date.now()}`)).default
      if (plugin && plugin.command && typeof plugin.execute === "function") {
        plugin.command.forEach(cmd => plugins.set(cmd.toLowerCase(), plugin))
        console.log(`✅ Loaded plugin: ${file}`)
      }
    } catch (err) {
      console.error(`❌ Plugin load error (${file}):`, err.message)
    }
  }
  console.log(`🔁 Plugins loaded: ${plugins.size}`)
}

// =================================================
// ⚙️ MAIN START FUNCTION
// =================================================
async function startDangerBoyMD() {
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir)
  const { version } = await fetchLatestBaileysVersion()
  const sock = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: state,
    logger,
    browser: [BOT_NAME, "Chrome", "1.0.0"]
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async update => {
    const { connection, lastDisconnect } = update
    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode
      const reconnect = reason !== DisconnectReason.loggedOut
      console.log("⚠️ Connection closed:", reason)
      if (reconnect) startDangerBoyMD()
      else console.log("❌ Logged out from WhatsApp.")
    } else if (connection === "open") {
      console.log(`✅ ${BOT_NAME} connected successfully!`)
      if (SUDO) {
        await sock.sendMessage(`${SUDO}@s.whatsapp.net`, { text: START_MESSAGE })
      }
    }
  })

  await loadPlugins()

  // Watch plugin folder for hot reload
  fs.watch("./plugins", async (eventType, filename) => {
    if (filename && filename.endsWith(".js")) {
      console.log(`♻️ Plugin changed: ${filename}`)
      await loadPlugins()
    }
  })

  // =================================================
  // 💀 MESSAGE HANDLER WITH ACCESS CONTROL
  // =================================================
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const from = msg.key.remoteJid
    const sender = msg.key.participant || msg.key.remoteJid
    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      ""

    if (!text.startsWith(PREFIX)) return
    const args = text.slice(PREFIX.length).trim().split(/ +/)
    const cmd = args.shift().toLowerCase()
    const plugin = plugins.get(cmd)
    if (!plugin) return

    const isGroup = from.endsWith("@g.us")
    let isAdmin = false
    if (isGroup) {
      try {
        const metadata = await sock.groupMetadata(from)
        const admins = metadata.participants.filter(p => p.admin)
        isAdmin = admins.map(a => a.id).includes(sender)
      } catch {}
    }

    const isOwner = SUDO && sender.includes(SUDO)

    // Permission checks
    if (plugin.ownerOnly && !isOwner)
      return await sock.sendMessage(from, {
        text: "🚫 *Access Denied!*\nOnly *Owner* can use this command."
      })

    if (plugin.adminOnly && !isAdmin)
      return await sock.sendMessage(from, {
        text: "🚫 *Access Denied!*\nOnly *Group Admins* can use this command."
      })

    if (plugin.groupOnly && !isGroup)
      return await sock.sendMessage(from, {
        text: "🚫 *Group Only Command!*"
      })

    // Execute plugin
    try {
      await plugin.execute(sock, msg, args, { isOwner, isAdmin, isGroup })
    } catch (err) {
      console.error(`❌ Error running ${cmd}:`, err)
      await sock.sendMessage(from, { text: `⚠️ Error: ${err.message}` })
    }
  })
}

startDangerBoyMD()
// ==============================================￼Enter// ==============================================
// ⚡ DANGER-BOY-MD | WhatsApp Multi-Device Bot
// 💀 Created by Danger Boy
// ==============================================

import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys"
import P from "pino"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"

dotenv.config()

// ========== CONFIG ==========
const BOT_NAME = process.env.BOT_NAME || "DANGER-BOY-MD"
const PREFIX = process.env.PREFIX || "."
const SUDO = process.env.SUDO || ""
const TZ = process.env.TZ || "Asia/Karachi"
const SESSION_DATA = process.env.SESSION || ""
const START_MESSAGE =
  process.env.START_MESSAGE ||
  `🚀 *${BOT_NAME}* has been launched successfully!\n👑 Creator: Danger Boy 💀`
// ============================

// Prepare session folder
sessionDir = "./session"
if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true })

// Restore session from base64 if present
if (SESSION_DATA) {
  try {
    const data = JSON.parse(Buffer.from(SESSION_DATA, "base64").toString("utf8"))
    for (const file in data) fs.writeFileSync(`${sessionDir}/${file}`, data[file])
    console.log("✅ Restored session from .env")
  } catch (err) {
    console.log("⚠️ Invalid SESSION data:", err.message)
  }
}

const logger = P({ level: "silent" })
const plugins = new Map()

// =================================================
// ⚙️ LOAD ALL PLUGINS
// =================================================
async function loadPlugins() {
  plugins.clear()
  const folder = path.join(process.cwd(), "plugins")
  if (!fs.existsSync(folder)) fs.mkdirSync(folder)

  const files = fs.readdirSync(folder).filter(f => f.endsWith(".js"))
  for (const file of files) {
    const pluginPath = path.join(folder, file)
    try {
      const plugin = (await import(`file://${pluginPath}?t=${Date.now()}`)).default
      if (plugin && plugin.command && typeof plugin.execute === "function") {
        plugin.command.forEach(cmd => plugins.set(cmd.toLowerCase(), plugin))
        console.log(`✅ Loaded plugin: ${file}`)
      }
    } catch (err) {
      console.error(`❌ Plugin load error (${file}):`, err.message)
    }
  }
  console.log(`🔁 Plugins loaded: ${plugins.size}`)
}

// =================================================
// ⚙️ MAIN START FUNCTION
// =================================================
async function startDangerBoyMD() {
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir)
  const { version } = await fetchLatestBaileysVersion()
  const sock = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: state,
    logger,
    browser: [BOT_NAME, "Chrome", "1.0.0"]
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", async update => {
    const { connection, lastDisconnect } = update
    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode
      const reconnect = reason !== DisconnectReason.loggedOut
      console.log("⚠️ Connection closed:", reason)
      if (reconnect) startDangerBoyMD()
      else console.log("❌ Logged out from WhatsApp.")
    } else if (connection === "open") {
      console.log(`✅ ${BOT_NAME} connected successfully!`)
      if (SUDO) {
        await sock.sendMessage(`${SUDO}@s.whatsapp.net`, { text: START_MESSAGE })
      }
    }
