heremodule.exports = {
  name: "alive",
  description: "Check if bot is active",
  command: ["alive"],
  category: "general",
  handler: async (sock, chat) => {
    return sock.sendMessage(chat, { text: "╭───『 ᴅᴀɴɢᴇʀ-ʙᴏʏ-ᴍᴅ 』───╮\n\n        ✔ ɪ'ᴍ ᴀʟɪᴠᴇ\n        ⚡ ʀᴜɴɴɪɴɢ ᴡᴇʟʟ\n\n╰────────────────────╯" })
  }
}
