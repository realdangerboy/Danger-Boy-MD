module.exports={ name:'requests', description:'Manage group join requests', command:['requests','approve','reject'], category:'group',
 handler: async (sock, chat, args, msg,{isGroup,isAdmin}={})=>{
  try{
    if(!isGroup) return sock.sendMessage(chat,{text:'This works only in groups.'})
    if(!isAdmin) return sock.sendMessage(chat,{text:'Admins only.'})
    const cmd = msg.message?.conversation?.split(' ')[0].slice(1) || args[0]
    if(cmd==='requests'){
      let meta = await sock.groupMetadata(chat); let pending = meta.pendingParticipants || []
      if(!pending.length) return sock.sendMessage(chat,{text:'✅ No pending requests.'})
      let list = pending.map((p,i)=>`${i+1}. ${p.jid.replace(/@.*/,'')}`).join('\n')
      return sock.sendMessage(chat,{text:`╔══ ✦ REQUESTS ✦ ══╗\n\n${list}\n\n╚══ Use .approve all / .reject all ══╝`})
    }
    if((cmd==='approve' && args[0]==='all') || (cmd==='reject' && args[0]==='all')){
      let meta = await sock.groupMetadata(chat); let pending = meta.pendingParticipants || []
      if(!pending.length) return sock.sendMessage(chat,{text:'✅ No pending.'})
      let users = pending.map(p=>p.jid); let action = cmd==='approve'?'approve':'reject'
      const batchSize=15
      for(let i=0;i<users.length;i+=batchSize){ let batch=users.slice(i,i+batchSize); await sock.groupRequestParticipantsUpdate(chat,batch,action); await new Promise(r=>setTimeout(r,700)); await sock.sendMessage(chat,{text:`⏳ ${action} ${Math.min(i+batchSize,users.length)}/${users.length}`}) }
      return sock.sendMessage(chat,{text:`✅ ${action==='approve'?'Approved':'Rejected'} ${users.length} requests.`})
    }
  }catch(e){ console.error(e); await sock.sendMessage(chat,{text:'⚠ Something went wrong.'}) }
}}