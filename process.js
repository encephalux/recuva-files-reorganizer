const fs_p = require("fs/promises");
const readline = require("readline");
const stack = [];
const pth = require("path");

fs_p.open("./deleted_files.txt", "r").then(async _fd => {
    const stream = _fd.createReadStream();

    const interface = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    let history = {}, dirs = new Set(), ct = 0;
    for await(const line of interface) {
        ct++;
        const match = line.match(/(.+\.[a-z0-9]+) +[0-9]+ +(.+)/i);

        const filename = match[1];
        const path = match[2].trim().substring(`D:\\DOSSIER COMMUN\\`.length).replace(/\\/g, "/")
        let count = 0;

        if(history.hasOwnProperty(filename)) {
            count = ++history[filename];
        } else history[filename] = 0;

        const {name, ext} = pth.parse(filename);

        dirs.add(path);
        stack.push({
            filename: `${name}${count === 0 ? "":`_${count}`}${ext}`,
            path
        });
    }

    return fs_p.writeFile("output.json", JSON.stringify(stack))
        .then(() => console.log(`${ct} files found for ${dirs.size} directories.`))
        .finally(() => _fd.close());
}).catch(_err => console.log(_err));