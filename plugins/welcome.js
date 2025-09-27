const fs=require('fs'), path=require('path');
const dbPath=path.join(__dirname,'../database/welcome.json'); let welcomeDB={}; if(fs.existsSync(dbPath)) welcomeDB=JSON.parse(fs.readFileSync(dbPath))
module.exports={ name:'welcome', description:'Toggle welcome messages', command:['welcome'], category:'group',
  handler: async (sock, chat, args) => {
    const sub=args[0]; if(!['on','off','set'].includes(sub)) return sock.sendMessage(chat,{text:'Usage: .welcome on/off/set <message>. Vars: {user} {group}'})
    if(sub==='on'){ welcomeDB[chat]=welcomeDB[chat]||{}; welcomeDB[chat].enabled=true; fs.writeFileSync(dbPath,JSON.stringify(welcomeDB,null,2)); return sock.sendMessage(chat,{text:'✔ Welcome enabled'}) }
    if(sub==='off'){ welcomeDB[chat]={enabled:false}; fs.writeFileSync(dbPath,JSON.stringify(welcomeDB,null,2)); return sock.sendMessage(chat,{text:'✖ Welcome disabled'}) }
    if(sub==='set'){ const msg=args.slice(1).join(' '); if(!msg) return sock.sendMessage(chat,{text:'Provide message'}); welcomeDB[chat]=welcomeDB[chat]||{}; welcomeDB[chat].message=msg; fs.writeFileSync(dbPath,JSON.stringify(welcomeDB,null,2)); return sock.sendMessage(chat,{text:'✔ Message set'}) }
  },
  onGroupParticipantsUpdate: async (sock, update)=>{
    try{
      const { id, participants, action } = update; if(action!=='add') return; const user=participants[0]; const group=id; const meta=await sock.groupMetadata(group); const groupName=meta.subject
      const settings=welcomeDB[group]; if(!settings||!settings.enabled) return
      const template = settings.message || `╔═══ 『 𝑾𝒆𝒍𝒄𝒐𝒎𝒆 』 ═══╗\n│\n│ ✦ 𝑯𝒆𝒍𝒍𝒐 {user}\n│ ✦ 𝑾𝒆𝒍𝒄𝒐𝒎𝒆 𝒕𝒐 {group}\n│\n╚═════════════════╝`
      const final=template.replace(/{user}/g,`@${user.split('@')[0]}`).replace(/{group}/g,groupName)
      await sock.sendMessage(group,{ text: final, mentions:[user] })
    }catch(e){ console.error(e) }
  }
}
