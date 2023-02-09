const fs = require('fs/promises');
const pth = require("path");

const input = "./input";
const output = "./output";

let copier = async () => {
    let errors = [];
    let unlink_errors = [];

    fs.readFile("output.json",'utf-8').then(_result => {
        let stack = [];

        for (const file of JSON.parse(_result)) {
            const { filename, path } = file;
            const dest_dir = pth.join(output, path);

            stack.push(fs.mkdir(dest_dir, {recursive: true}).then(() => {

                return fs.copyFile(pth.join(input, filename), pth.join(dest_dir, filename))
                    .then(() => fs.unlink(pth.join(input, filename)).catch(_err => unlink_errors.push(file)))
                    .catch(_err => {
                        console.log(`[COPY_ERR::${_err.code}] ${filename}`, _err);
                        errors.push(file);
                    });
            }).catch(_err => {
                console.log(`[MKDIR_ERR::${_err.code}] ${filename}`);
            }));
        }

        Promise.all(stack)
            .then(() => console.log("All done!"))
            .finally(() => {
                fs.writeFile("errors.json", JSON.stringify(errors));
                fs.writeFile("unlink_errors.json", JSON.stringify(unlink_errors));
            });
    });
}


copier();