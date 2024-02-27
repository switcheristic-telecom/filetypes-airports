// run "process-image.js" in the background

// Path: index.js
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function findFilesInDir(baseDir, fileExtension) {
  const res = [];
  const files = fs.readdirSync(baseDir);

  for (const file of files) {
    const newPath = path.join(baseDir, file);

    const isDir = fs.statSync(newPath).isDirectory();

    if (isDir) {
      const subDirFiles = findFilesInDir(newPath, fileExtension);
      res.push(...subDirFiles);
    } else if (file.endsWith(fileExtension)) {
      res.push(newPath);
    }
  }

  return res;
}
const INPUT_DIRECTORY = './assets/thumbnails copy';

let allFiles = [];
const ALL_PNGS = findFilesInDir(INPUT_DIRECTORY, '.png');

console.log('all pngs', ALL_PNGS);

// run "process-image.js" in the background synchronously
for (const png of ALL_PNGS) {
  const child = spawn('node', ['process-image.js', png]);

  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
}
