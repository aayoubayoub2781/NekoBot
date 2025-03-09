const fs = require("node:fs");

const config = {
  owner: ["212710723716"],
  name: "- DracoBot - Simple WhatsApp bot",
  sessions: "sessions",
  prefix: [".", "?", "!"], // Tambahkan prefix sesuai kebutuhan
  sticker: {
    packname: "✨ DracoPack ✨", 
    author: "🐾 XiT Draco 🐾", 
  },
  id: {
    newsletter: "120363388655497053@newsletter", 
    group: "120363370515588374@g.us" 
  },
  messages: {
    wait: "> ⏳ *Mohon tunggu sebentar*... please wait a while!", 
    owner: "> 🧑‍💻 *This feature just for the owner.", 
    premium: "> 🥇 *Upgrade To prumiem.", 
    group: "> 👥 *This feature just for Groups.",
    botAdmin: "> ⚠️ *The bot is not admin.", 
    grootbotbup: "> 🛠️ *Admim.", 
  },
  database: "neko-db",
  tz: "Africa/Casablanca",
};

module.exports = config;

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  delete require.cache[file];
});
