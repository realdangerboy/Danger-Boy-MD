const fs = require('fs'); const path = require('path');
module.exports = {
  name: "menu", description:"Show menu", command:["menu","help"], category:"general",
  handler: async (sock, chat) => {
    const pluginsDir = path.join(__dirname)
    const files = fs.readdirSync(pluginsDir).filter(f=>f.endsWith('.js'))
    let cats = {}
    for (let f of files) {
      try { let p = require(path.join(pluginsDir,f)); if (p.command) { let c=p.category||'other'; if(!cats[c])cats[c]=[]; cats[c].push(p) } } catch(e){}
    }
    let text = "╔═══ 『 ᴅᴀɴɢᴇʀ-ʙᴏʏ-ᴍᴅ 』 ═══╗\n│ Stylish Command List │\n╚══════════════════════╝\n\n"
    for (let cat in cats) { text += `╭─── ${cat.toUpperCase()} ───╮\n`+cats[cat].map(p=>`│ ✦ .${p.command[0]}`).join('\n')+"\n╰─────────────────╯\n\n" }
    await sock.sendMessage(chat, { text })
  }
}
