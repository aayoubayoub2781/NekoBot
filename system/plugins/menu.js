const moment = require("moment-timezone");
const pkg = require(process.cwd() + "/package.json");
const axios = require("axios");
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
  command: "menu",
  alias: ["menu", "help"],
  category: ["main"],
  description: "Bot main menu",
  loading: true,
  async run(m, { sock, plugins, config, Func, text }) {
    let data = fs.readFileSync(process.cwd() + "/system/case.js", "utf8");
    let casePattern = /case\s+"([^"]+)"/g;
    let matches = data.match(casePattern);
    if (!matches) return m.reply("Tidak ada case yang ditemukan.");
    matches = matches.map((match) => match.replace(/case\s+"([^"]+)"/, "$1"));
    let menu = {};
    plugins.forEach((item) => {
      if (item.category && item.command && item.alias) {
        item.category.forEach((cat) => {
          if (!menu[cat]) {
            menu[cat] = {
              command: [],
            };
          }
          menu[cat].command.push({
            name: item.command,
            alias: item.alias,
            description: item.description,
            settings: item.settings,
          });
        });
      }
    });
    let cmd = 0;
    let alias = 0;
    let pp = await sock
      .profilePictureUrl(m.sender, "image")
      .catch((e) => "https://files.catbox.moe/37022o.jpg");
    Object.values(menu).forEach((category) => {
      cmd += category.command.length;
      category.command.forEach((command) => {
        alias += command.alias.length;
      });
    });
    let premium = db.list().user[m.sender].premium.status;
    let limit = db.list().user[m.sender].limit;

    const header = `🤟 *D R A C O – AI*
👋 Hay~ its me Draco your favroite frendily AI !
─────────────────────────
        `;

    const footer = `
📢 *Jika Anda menemui masalah*
*hubungi developer bot.*
💻 *Owner:* XiT Draco
🤖 *The Script Is closed Source*
🌐 *Saluran WhatsApp NekoBot :*
https://whatsapp.com/channel/0029Vb0YWvYJ3jusF2nk9U1P

> 💬 *Feature Limit*: 🥈
> 💎 *Feature Premium*: 🥇
─────────────────────────
`;

    if (text === "all") {
      let caption = `${header} 
🎮🎮 *Info Pengguna*:
> - 🧑‍💻 Name: ${m.pushName}
> - 🏷️ Tag: @${m.sender.split("@")[0]}
> - 🎖️ Status: ${m.isOwner ? "Developer" : premium ? "Premium" : "Gratis"}
> - ⚖️ Limit: ${m.isOwner ? "Updown" : limit}

🤖 *Info Bot*:
> - 🏷️ Name: ${pkg.name}
> - 🔢 Version: v${pkg.version}
> - 🕰️ Uptime: ${Func.toDate(process.uptime() * 1000)}
> - 🔑 Prefix: [ ${m.prefix} ]
> - ⚡ Total Cmd: ${cmd + alias + matches.length}

  
🛠️ *menu – OTHER* 
${matches.map((a, i) => `> *(${i + 1})* ${m.prefix + a}`).join("\n")}
─────────────────────────
`;

      Object.entries(menu).forEach(([tag, commands]) => {
        caption += `\n🛠️ *Menu – ${tag.toUpperCase()}* 
${commands.command.map((command, index) => `> *(${index + 1})* ${m.prefix + command.name} ${command.settings?.premium ? "🥇" : command.settings?.limit ? "🥈" : ""}`).join("\n")}
─────────────────────────
`;
      });

      caption += footer;

      m.reply({
        text: caption,
        contextInfo: {
          mentionedJid: sock.parseMention(caption),
          externalAdReply: {
            title: "© Draco | simple",
            body: "👨‍💻 Bot WhatsApp - Simple",
            mediaType: 1,
            sourceUrl: "https://whatsapp.com/channel/0029Vb0YWvYJ3jusF2nk9U1P",
            thumbnailUrl: "https://files.catbox.moe/37022o.jpg",
            renderLargerThumbnail: true,
          },
        },
      });
    } else if (Object.keys(menu).find((a) => a === text.toLowerCase())) {
      let list = menu[Object.keys(menu).find((a) => a === text.toLowerCase())];
      let caption = `${header}
🎮 *Info*:
> - 🧑‍💻 Nama: ${m.pushName}
> - 🏷️ Tag: @${m.sender.split("@")[0]}
> - 🎖️ Status: ${m.isOwner ? "Developer" : premium ? "Premium" : "Free2use"}
> - ⚖️ Limit: ${m.isOwner ? "Updown" : limit}

🤖 *Info Bot*:
> - 🏷️ Nama: ${pkg.name}
> - 🔢 Version: v${pkg.version}
> - 🕰️ Uptime: ${Func.toDate(process.uptime() * 1000)}
> - 🔑 Prefix: [ ${m.prefix} ]
> - ⚡ Total cmd: ${cmd + alias + matches.length}

─────────────────────────
🛠️ *Menu – ${text.toUpperCase()}*
${list.command
  .map(
    (a, i) =>
      `> *(${i + 1})* ${m.prefix + a.name} ${a.settings?.premium ? "🥇" : a.settings?.limit ? "🥈" : ""}`,
  )
  .join("\n")}
─────────────────────────
`;

      caption += footer;

      m.reply({
        text: caption,
        contextInfo: {
          mentionedJid: sock.parseMention(caption),
          externalAdReply: {
            title: "© Draco| Playground",
            body: "👨‍💻 Bot WhatsApp - Simple",
            mediaType: 1,
            sourceUrl: "https://whatsapp.com/channel/0029VaGiagl1CYoIwP8Vri0g",
            thumbnailUrl: "https://files.catbox.moe/37022o.jpg",
            renderLargerThumbnail: true,
          },
        },
      });
    } else {
      let list = Object.keys(menu);
      let caption = `${header}
🎮 *Info*:
> - 🧑‍💻 Name: ${m.pushName}
> - 🏷️ Tag: @${m.sender.split("@")[0]}
> - 🎖️ Status: ${m.isOwner ? "Developer" : premium ? "Premium" : "free"}
> - ⚖️ Limit: ${m.isOwner ? "updown" : limit}

🤖 *Info Bot*:
> - 🏷️ Name: ${pkg.name}
> - 🔢 Version: v${pkg.version}
> - 🕰️ Uptime: ${Func.toDate(process.uptime() * 1000)}
> - 🔑 Prefix: [ ${m.prefix} ]
> - ⚡ Total Cmd: ${cmd + alias + matches.length}

─────────────────────────
🗂️ *Daftar Menu*:
> *(all)* ${m.prefix}menu all
${list.map((a) => `> *(${a})* ${m.prefix}menu ${a}`).join("\n")}

─────────────────────────
`;

      caption += footer;

      m.reply({
        text: caption,
        contextInfo: {
          mentionedJid: sock.parseMention(caption),
          externalAdReply: {
            title: "© Draco | Playground",
            body: "👨‍💻 Bot WhatsApp - Simple",
            mediaType: 1,
            sourceUrl: "https://whatsapp.com/channel/0029VaGiagl1CYoIwP8Vri0g",
            thumbnailUrl: "https://files.catbox.moe/37022o.jpg",
            renderLargerThumbnail: true,
          },
        },
      });
    }
  },
};
