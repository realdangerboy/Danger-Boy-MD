// Danger-Boy-MD starter (minimal event loop)
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const pino = require('pino')
const fs = require('fs')
const path = require('path')

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'session'))
  const sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state
  })

  // load plugins
  const pluginsDir = path.join(__dirname, 'plugins')
  let pluginMap = {}
  for (const f of fs.readdirSync(pluginsDir).filter(x => x.endsWith('.js'))) {
    try {
      const p = require(path.join(pluginsDir, f))
      if (p && p.name) pluginMap[p.name] = p
    } catch (e) { console.error('Failed load plugin', f, e) }
  }
  console.log('Loaded plugins:', Object.keys(pluginMap).length)

  sock.ev.on('messages.upsert', async m => {
    try {
      const msg = m.messages[0]
      if (!msg.message) return
      const text = (msg.message.conversation || (msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) || '').trim()
      if (!text) return

      // command prefix '.'
      if (!text.startsWith('.')) return
      const args = text.split(' ').slice(1)
      const cmd = text.split(' ')[0].slice(1).toLowerCase()

      // context helpers
      const isGroup = msg.key.remoteJid && msg.key.remoteJid.endsWith('@g.us')
      const isAdmin = false // plugin can check via sock.groupMetadata; simplified here

      // find plugin by command
      for (let name in pluginMap) {
        const p = pluginMap[name]
        if (p.command && p.command.includes(cmd)) {
          try {
            await p.handler(sock, msg.key.remoteJid, args, msg, { isGroup, isAdmin })
          } catch (e) { console.error('plugin handler error', p.name, e) }
          break
        }
      }
    } catch (e) { console.error(e) }
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const reason = (lastDisconnect.error && lastDisconnect.error.output) ? lastDisconnect.error.output.statusCode : null
      console.log('connection closed', reason)
    }
    if (connection === 'open') console.log('Connected')
  })

  console.log('⚡ Danger-Boy-MD started (minimal)')
}

start().catch(console.error)
