import express from 'express';
import fs from 'fs';
import multer from 'multer';
import exphbs from 'express-handlebars';
import { deleteUpload } from './tools.mjs';
import { moveFile } from './tools.mjs';

const app = express();

// Load config.json
console.log("Loading config file...");
var content = fs.readFileSync("config.json");
const config = JSON.parse(content);

// Host static files
app.use(express.static('public'))

// Set the render engine to handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Get the path item from the config file
function selectPath(name) {
    let input;
    config.paths.forEach(item => {
        if (item.name == name) {
            input = item;
        }
    });
    return input;
}

// multer stuff
function createStorage(name) {
    return multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './uploads');
        },
        filename: function (req, file, callback) {
            callback(null, Date.now() + "-" + file.originalname);
        }
    });
}

function createUpload(name) {
    return multer({ storage: createStorage(name) }).array('files', 100);
}

// The endpoint for the main page
app.get("/", (req, res) => {
    res.render("main", config);
});

// The endpoint for all the different paths
app.get("/add/:name", (req, res) => {
    let input = selectPath(req.params.name);

    res.render("add", {
        item: input
    });
});

// The post to upload the files
app.post("/add/:name", (req, res) => {
    let input = selectPath(req.params.name);

    createUpload(req.params.name)(req, res, (err) => {
        if (err) {
            console.log(err);
            res.render("done");
            return;
        }

        // Sort the files into bad (non .torrent) and good (.torrent) files
        let newFiles = [];
        let badFiles = [];
        for (let i = 0; i < req.files.length; i++) {
            if (req.files[i].mimetype == "application/x-bittorrent") {
                newFiles.push(req.files[i]);
            } else {
                badFiles.push(req.files[i]);
            }
        }

        // delete the bad files
        badFiles.forEach(element => {
            deleteUpload(element.filename);
        });

        // move the good files into the right place
        newFiles.forEach(el => {
            moveFile(el.filename, input["download-path"]);
        });

        // Send the webpage
        res.render("done", {
            files: newFiles
        });
    });
});

app.listen(config.port, () => { console.log("Listening on " + config.port); });