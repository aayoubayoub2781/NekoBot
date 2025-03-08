const {
    toAudio
} = require(process.cwd() + "/lib/converter.js");

class Command {
    constructor() {
        this.command = "applemusic";
        this.alias = ["aplm", "apple"];
        this.category = ["downloader"];
        this.settings = {
            limit: true,
        };
        this.description = "🎵 Search and download music from Apple Music!";
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
        if (!text) throw "> ❌ *Enter a search query or Apple Music link*";

        if (Func.isUrl(text)) {
            if (!/music.apple.com/.test(text))
                throw "> ❌ *The provided link is not an Apple Music link!*";
            let data = await Scraper.applemusic.download(text);
            if (!data.metadata) throw Func.jsonFormat(data);
            let anu = await toAudio(await Func.fetchBuffer(data.download), 'mp3');
            let cap = "*🎧 Apple Music Downloader 🎧*\n"
            cap += `*✍️ Title :* ${data.metadata.name}\n`
            cap += `*📝 Genre :* ${data.metadata.genre}\n`
            cap += `*👦 Artist :* ${data.metadata.artist.name}\n`
            cap += `*🕑 Released on :* ${data.metadata.datePublished}`
            sock.sendFile(m.cht, data.metadata.image, null, cap, m);
            sock.sendFile(
                m.cht,
                anu.data,
                `${data.metadata.name} | ${data.metadata.artist.name}.mp3`,
                `🎧 *Download this music by clicking the button above*\n\n> *Note*: If the file appears as , please download it manually.`,
                m, {
                    mimetype: "audio/mpeg",
                    jpegThumbnail: await sock.resize(data.metadata.image, 400, 400),
                },
            );
        } else {
            let data = await Scraper.applemusic.search(text);
            if (data.length === 0) throw "> ❌ *Music not found*";

            let cap = `*– 乂 Apple Music - Search Results*\n> 🎤 *Select a song to download!*\n\n`;
            for (let i of data) {
                cap += `> 🎶 *Title*: ${i.title}\n`;
                cap += `> 👨‍🎤 *Artist*: ${i.artist.name}\n`;
                cap += `> 🔗 *Link*: ${i.song}\n\n`;
            }
            m.reply(cap);
        }
    };
}

module.exports = new Command();
