module.exports = {
  name:"jid", description:"Get someone's or group's JID", command:["jid","getjid"], category:"tools",
  handler: async (sock, chat, args, msg, {isGroup}= {}) => {
    try {
      if (args && args[0] && args[0].toLowerCase()==='group') return sock.sendMessage(chat,{text:`🏷️ Group JID:\n\n\`${chat}\``})
      const ctx = msg.message?.extendedTextMessage?.contextInfo
      let target = ctx?.mentionedJid?.[0] || ctx?.participant || msg.key.participant || msg.key.remoteJid
      await sock.sendMessage(chat, { text: `📌 JID:\n\\`${target}\\`` })
    } catch(e){ await sock.sendMessage(chat,{text:'⚠ Could not fetch JID.'}) }
  }
}
