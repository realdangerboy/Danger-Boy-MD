module.exports={ name:'tagall', description:'Tag all group members', command:['tagall'], category:'group',
 handler: async (sock, chat) => {
  try{
    const meta = await sock.groupMetadata(chat)
    const members = meta.participants.map(p=>p.id)
    const text = `⚡ Attention:\n` + members.map(m=>`@${m.split('@')[0]}`).join(' ')
    await sock.sendMessage(chat,{ text, mentions: members })
  }catch(e){ console.error(e); await sock.sendMessage(chat,{text:'Failed'}) }
}}