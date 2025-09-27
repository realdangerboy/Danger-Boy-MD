let botMode='public';
module.exports={ name:'mode', description:'Set bot mode (public/private)', command:['mode'], category:'general',
  handler: async (sock, chat, args) => {
    const c = args[0]; if(!['public','private'].includes(c)) return sock.sendMessage(chat,{text:'✦ Usage: .mode <public|private>'})
    botMode=c; await sock.sendMessage(chat,{text:`✔ Bot mode: ${botMode}`})
  },
  preHandler: (sock,chat,args,msg)=>{ if(botMode==='private'){ const owner=process.env.OWNER_JID; const sender=msg.key.participant||msg.key.remoteJid; return sender===owner } return true }
}