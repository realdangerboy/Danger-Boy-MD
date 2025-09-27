const { downloadMediaMessage } = require('@whiskeysockets/baileys')
module.exports={ name:'fullgpp', description:'Set group full HD profile pic', command:['fullgpp'], category:'group',
 handler: async (sock, chat, args, msg)=>{
  try{
    const ctx = msg.message?.extendedTextMessage?.contextInfo; const quoted = ctx?.quotedMessage
    if(!quoted || !quoted.imageMessage) return sock.sendMessage(chat,{text:'Reply to an image with .fullgpp'})
    const buffer = await downloadMediaMessage({ message: quoted }, 'buffer')
    await sock.updateProfilePicture(chat, buffer)
    await sock.sendMessage(chat,{text:'✔ Group profile updated'}) }catch(e){ console.error(e); await sock.sendMessage(chat,{text:'⚠ Failed'}) }
}}