const fs=require('fs'), path=require('path'); const db=path.join(__dirname,'../database/antilink.json'); let D={}; if(fs.existsSync(db)) D=JSON.parse(fs.readFileSync(db))
module.exports={ name:'antilink', description:'Toggle anti-link', command:['antilink'], category:'group',
 handler: async (sock, chat, args) => { const sub=args[0]; if(!['on','off'].includes(sub)) return sock.sendMessage(chat,{text:'Usage: .antilink on/off'}); D[chat]={enabled: sub==='on'}; fs.writeFileSync(db,JSON.stringify(D,null,2)); return sock.sendMessage(chat,{text:`✔ Antilink ${sub}`}) },
 onMessage: async (sock, msg, chat) => {
   try{ const s= D[chat]; if(!s||!s.enabled) return; const text = msg.message?.conversation||''; if(!text) return; if(/https?:\/\//.test(text)) { await sock.sendMessage(chat,{delete: msg.key}); await sock.sendMessage(chat,{text:'🚫 Links are not allowed here.'}) } }catch(e){}
 }}