module.exports = {
  command: "mediafire",
  alias: ["mf", "mfdl"],
  category: ["downloader"],
  settings: {
    limit: false,
  },
  description: "Download files from MediaFire 🔽",
  loading: true,
  async run(m, { sock, Scraper, Func, text }) {
    if (!Func.isUrl(text) || !/mediafire.com/.test(text) || !text)
      throw "> *❌ Enter a valid MediaFire link!*";
    let data = await Scraper.mediafire(text);
    let cap = "*– 乂 MediaFire - Downloader 🗂️*\n";
    cap += `> *🔸 File Name :* ${data.filename}\n`;
    cap += `> *🔸 File Type :* ${data.mimetype}\n`;
    cap += `> *🔸 File Size :* ${Func.formatSize(data.size)}\n`;
    cap += `> *🔸 Download Link :* ${data.download}\n`;

    let buffer = await fetch(data.download).then(async (a) =>
      Buffer.from(await a.arrayBuffer()),
    );
    let size = Func.formatSize(buffer.length);
    let limit = Func.sizeLimit(data.size, db.list().settings.max_upload);

    if (limit.oversize)
      throw `Sorry, the file size *( ${size} )* exceeds the allowed limit. Upgrade to premium to download files up to *1GB*!`;

    m.reply({
      document: buffer,
      mimetype: data.mimetype,
      fileName: data.filename,
      caption: cap,
    });
  },
};
