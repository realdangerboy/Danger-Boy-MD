const fs=require('fs'), path=require('path'); const db=path.join(__dirname,'../database/antiword.json'); let DB={}; if(fs.existsSync(db)) DB=JSON.parse(fs.readFileSync(db))
const badWords = ["sex","porn","xxx","dick","pussy","bitch","fuck","nude","horny","anal","tits","asshole"]
module.exports={ name:'antiword', description:'Block bad words', command:['antiword'], category:'group',
 handler: async (sock, chat, args) => {
   const sub=args[0]; const action=args[1]; if(!['on','off'].includes(sub)) return sock.sendMessage(chat,{text:'Usage: .antiword on/off [delete|warn|kick]'})
   if(sub==='on'){ DB[chat]={enabled:true, action: action||'delete', warns:{}}; fs.writeFileSync(db,JSON.stringify(DB,null,2)); return sock.sendMessage(chat,{text:`✔ AntiWord on (${action||'delete'})`}) }
   DB[chat]={enabled:false}; fs.writeFileSync(db,JSON.stringify(DB,null,2)); return sock.sendMessage(chat,{text:'✖ AntiWord off'})
 },
 onMessage: async (sock, msg, chat) => {
  try{ const s = DB[chat]; if(!s||!s.enabled) return; const text = (msg.message?.conversation||msg.message?.extendedTextMessage?.text||'').toLowerCase(); if(!text) return; if(badWords.some(w=>text.includes(w))){ const sender = msg.key.participant||msg.key.remoteJid; if(s.action==='delete') await sock.sendMessage(chat,{delete: msg.key}); if(s.action==='warn'){ s.warns[sender]=(s.warns[sender]||0)+1; fs.writeFileSync(db,JSON.stringify(DB,null,2)); await sock.sendMessage(chat,{text:`⚠ @${sender.split('@')[0]} warned (${s.warns[sender]})`, mentions:[sender]}) } if(s.action==='kick' && chat.endsWith('@g.us')){ await sock.groupParticipantsUpdate(chat,[sender],'remove'); await sock.sendMessage(chat,{text:`👢 @${sender.split('@')[0]} kicked`, mentions:[sender]}) } } }catch(e){}
 }}