const fs=require('fs'), path=require('path'); const db=path.join(__dirname,'../database/antifake.json'); let D={}; if(fs.existsSync(db)) D=JSON.parse(fs.readFileSync(db))
module.exports={ name:'antifake', description:'Manage allowed number prefixes', command:['antifake'], category:'group',
 handler: async (sock, chat, args) => {
   const sub=args[0]; if(!sub) return sock.sendMessage(chat,{text:`Allowed: ${D[chat]?.allowed||[]}`})
   if(sub==='off'){ D[chat]={allowed:[]}; fs.writeFileSync(db,JSON.stringify(D,null,2)); return sock.sendMessage(chat,{text:'✔ Disabled antifake'}) }
   D[chat]=D[chat]||{allowed:[]}; D[chat].allowed.push(sub); fs.writeFileSync(db,JSON.stringify(D,null,2)); return sock.sendMessage(chat,{text:`✔ Added ${sub}`})
 } }