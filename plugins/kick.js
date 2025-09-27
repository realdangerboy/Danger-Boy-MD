module.exports={ name:'kick', description:'Remove a member from group', command:['kick'], category:'group',
 handler: async (sock, chat, args, msg,{isGroup,isAdmin}={})=>{
  try{
    if(!isGroup) return sock.sendMessage(chat,{text:'Group only.'})
    if(!isAdmin) return sock.sendMessage(chat,{text:'Admins only.'})
    const target = args[0] || msg.message?.extendedTextMessage?.contextInfo?.participant
    if(!target) return sock.sendMessage(chat,{text:'Usage: .kick <jid> or reply'}) 
    await sock.groupParticipantsUpdate(chat,[target],'remove')
    await sock.sendMessage(chat,{text:`✔ Removed ${target}`})
  }catch(e){ console.error(e); await sock.sendMessage(chat,{text:'⚠ Failed to kick.'}) }
}}