module.exports={ name:'send', description:'Send replied message to one or multiple JIDs (no forwarded tag)', command:['send'], category:'tools',
 handler: async (sock, chat, args, msg)=>{
  try{
    if(!args.length) return sock.sendMessage(chat,{text:'Usage: .send <jid1> <jid2> ... (reply to message)'})
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage; if(!quoted) return sock.sendMessage(chat,{text:'Reply to a message please.'})
    for(const jid of args){ await sock.sendMessage(jid, quoted, { quoted: null }) }
    return sock.sendMessage(chat,{text:`✔ Sent to: ${args.join(', ')}`})
  }catch(e){ console.error(e); await sock.sendMessage(chat,{text:'⚠ Failed to send.'}) }
}}