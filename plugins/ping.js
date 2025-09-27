module.exports = {
  name: "ping",
  description: "Check bot response time",
  command: ["ping","speed"],
  category: "general",
  handler: async (sock, chat) => {
    const start = Date.now()
    const sent = await sock.sendMessage(chat, { text: "✦ Pong..." })
    const diff = Date.now() - start
    await sock.sendMessage(chat, { text: `✔ Response time: ${diff} ms` })
  }
}
