import fs from 'fs';
import pathlib from 'path';

export function deleteUpload(name) {
    fs.unlink('./uploads/' + name, (err) => {
        if (err) console.error(err);
        console.log('removed file for being the wrong type');
    });
}

export function moveFile(name, toPath) {

    let path = toPath;
    if (path.startsWith('./')) {
        path = path.substring(2);
    }

    let index = path.lastIndexOf('/');
    if (index != -1) {
        path = path.substring(0, index);
    }

    // Create folder if does no existing
    fs.mkdir(path, { recursive: true }, (err) => {
        if (err && err.code != "EEXIST") console.error(err);
        fs.copyFile(pathlib.resolve("./uploads/", name), pathlib.resolve(toPath, name), (err) => {
            if (err) {
                console.error(err);
                return;
            }

            fs.unlink('./uploads/' + name, (err) => {
                if (err) console.error(err);

                console.log("moved file to new location");
            });
        });
    });

}