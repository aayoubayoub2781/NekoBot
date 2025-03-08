class Command {
    constructor() {
        this.command = "rednote";
        this.alias = ["xiaohongshu"];
        this.category = ["downloader"];
        this.settings = {
            limit: false
        };
        this.description = "🟥 Download videos/slides from Rednote";
        this.loading = true;
    }
    run = async (m, {
        sock,
        Func,
        Scraper,
        config,
        store,
        text
    }) => {
        if (!text || !Func.isUrl(text) || !/xhslink.com|xiaohongshu.com/.test(text)) 
            throw "*❌ Input Error:* Please enter a valid Xiaohongshu/Rednote URL";

        let data = await Scraper.rednote(text);
        if (!data.metadata) throw "*⁉️⁉️ Media not found*";

        let caption = "*Xiaohongshu - Downloader 📩*\n";
        caption += `*🔻 Title :* ${data.metadata.title}\n`;
        caption += `\n*📈 Statistics :*\n`;
        caption += Object.entries(data.metadata.stats)
            .map(([a, b]) => `- ${a.capitalize()} : ${b}`)
            .join("\n");
        caption += `\n\n*👤 Owner Info :*\n`;
        caption += Object.entries(data.metadata.author)
            .map(([a, b]) => `- ${a.capitalize()} : ${b}`)
            .join("\n");
        caption += "\n\n*✅ Media successfully downloaded!*\n📨 Enjoy easy Rednote video downloads only with NekoBot.";

        if (typeof data.download == "object") {
            for (let img of data.download) {
                sock.sendFile(m.cht, img, null, caption, m);
            }
        } else {
            sock.sendFile(m.cht, data.download, null, caption, m);
        }
    };
}

module.exports = new Command();
