const fs = require('fs'); const path = require('path');
module.exports = {
  name: "list", description:"Show all commands", command:["list","commands","help"], category:"general",
  handler: async (sock, chat, args=[]) => {
    const pluginsDir = path.join(__dirname); const files = fs.readdirSync(pluginsDir).filter(f=>f.endsWith('.js'))
    let plugins = []; for (let f of files) { try{ let p=require(path.join(pluginsDir,f)); if(p.command) plugins.push(p) }catch(e){} }
    let text = "╔═══ 『 ᴅᴀɴɢᴇʀ-ʙᴏʏ-ᴍᴅ 』 ═══╗\n│         𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓\n╚════════════════════════════╝\n\n"
    if (args && args.length) {
      const q=args[0].toLowerCase(); let found=plugins.filter(p=>p.command.some(c=>c.includes(q))); if(!found.length) return sock.sendMessage(chat,{text:`⚠ No command found for: ${q}`})
      for(let p of found){ text+=`✦ ${p.command.map(c=>'.'+c).join(', ')}\n   ⌲ ${p.description || 'No description'}\n\n` }
    } else {
      let cats = {}; for (let p of plugins){ let c=p.category||'others'; if(!cats[c])cats[c]=[]; cats[c].push(p) }
      for (let cat in cats){ text+=`╭─── ${cat.toUpperCase()} ───╮\n`; for (let p of cats[cat]) text+=`│ ✦ ${p.command.map(c=>'.'+c).join(', ')}\n│    ⌲ ${p.description||'No description'}\n`; text+=`╰─────────────────╯\n\n` }
    }
    await sock.sendMessage(chat,{text})
  }
}
