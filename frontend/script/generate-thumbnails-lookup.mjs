// read all the files in a folder

const fs = require("fs");
const path = require("path");

const THUMBNAIL_FOLDER = path.join("./public/assets/thumbnails");

const thumbnails = fs.readdirSync(folder);
