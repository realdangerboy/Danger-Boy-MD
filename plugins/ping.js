export dexport default {
  name: "ping",
  command: ["ping", "alive", "danger"],
  description: "Aesthetic tiny-font ping with live edit and latency",
  async execute(sock, msg) {
    try {
      const from = msg.key.remoteJid

      // Send initial message
      const sent = await sock.sendMessage(from, { text: "✨ ᴘɪɴɢɪɴɢ..." }, { quoted: msg })
      const start = Date.now()

      // Simulate latency test
      const ping = Date.now() - start

      // Stylish tiny-font result (compact version)
      const result = `
💀 *ᴅᴀɴɢᴇʀ ʙᴏʏ ᴍᴅ* 💀
│ ⚡ ᴘɪɴɢ: ${ping}ms
│ 👑 ᴄʀᴇᴀᴛᴏʀ: ᴅᴀɴɢᴇʀ ʙᴏʏ
│ 🧠 sʏsᴛᴇᴍ: ᴀᴄᴛɪᴠᴇ
`

      // Wait a bit for effect
      await new Promise(r => setTimeout(r, 1000))

      // Edit previous message
      await sock.sendMessage(from, {
        text: result,
        edit: sent.key
      })
    } catch (err) {
      console.error("Ping Error:", err)
      await sock.sendMessage(msg.key.remoteJid, { text: "⚠️ Error running ping" }, { quoted: msg })
    }
  }
}￼Enter
