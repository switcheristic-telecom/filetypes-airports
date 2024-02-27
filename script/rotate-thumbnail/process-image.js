/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const THREE = require('three');
const GIFEncoder = require('gifencoder');
const { createCanvas } = require('./lib');
const PNG = require('pngjs').PNG;
const sharp = require('sharp');
const apng = require('sharp-apng');

const FRAME_COUNT = 24;

const width = 32,
  height = 32;

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const canvas = createCanvas(width, height);

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
});

renderer.setClearColor(0x000000, 0);

function generateSpinningPNGSequence(inputFilePath, outputDirectoryPath) {
  //  get the directory of the input file
  const inputDirectoryPath = inputFilePath.substring(
    0,
    inputFilePath.lastIndexOf('/')
  );

  const inputFileName = inputFilePath.substring(
    inputFilePath.lastIndexOf('/') + 1
  );

  const inputFileNameWithoutExtension = inputFileName.substring(
    0,
    inputFileName.lastIndexOf('.')
  );
  console.log('input directory path', inputDirectoryPath);
  console.log('input file name', inputFileName);
  console.log(
    'input file name without extension',
    inputFileNameWithoutExtension
  );

  if (outputDirectoryPath === undefined) {
    outputDirectoryPath = `${inputDirectoryPath}/${inputFileNameWithoutExtension}`;
  }

  //  input file is a png, read the dimensions, load it synchronously
  //  create a plane with the same dimensions
  console.log('input file path', inputFilePath);
  if (!fs.existsSync(inputFilePath)) {
    console.log('input file does not exist');
    return;
  }

  const data = fs.readFileSync(inputFilePath);

  const png = PNG.sync.read(data);

  const aspectRatio = png.width / png.height;

  console.log('input file path', inputFilePath);

  const longEdge = 5;
  let planeWidth, planeHeight;
  if (aspectRatio > 1) {
    planeWidth = longEdge;
    planeHeight = longEdge / aspectRatio;
  } else {
    planeHeight = longEdge;
    planeWidth = longEdge * aspectRatio;
  }
  const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
  const texture = new THREE.DataTexture(
    png.data,
    png.width,
    png.height,
    THREE.RGBAFormat
  );

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);
  const scene = new THREE.Scene();

  scene.add(plane);
  plane.rotation.z = Math.PI;
  plane.rotation.y = Math.PI;
  camera.position.z = 6;

  // const encoder = new GIFEncoder(width, height);
  // encoder
  //   .createReadStream()
  //   .pipe(fs.createWriteStream('./output/' + outputFilePath));
  // encoder.start();
  // encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
  // encoder.setDelay(16); // frame delay in ms
  // encoder.setQuality(10); // image quality. 10 is default.
  // encoder.setTransparent(0x000000);
  let idx = 0;

  // if output directory does not exist, create it
  // if (!fs.existsSync(outputDirectoryPath)) {
  //   fs.mkdirSync(outputDirectoryPath);
  // }
  const renderedFrames = [];

  for (let i = 0; i < FRAME_COUNT; i++) {
    update();
  }
  // const filename = `${i}.png`;
  // const filepath = `${outputDirectoryPath}/${filename}`;
  // console.log('writing to file', filepath
  // );

  function update() {
    plane.rotation.y += (Math.PI * 2) / FRAME_COUNT;
    // plane.rotation.y += 0.01;
    renderer.render(scene, camera);
    if (idx >= 0) {
      // encoder.addFrame(canvas.__ctx__);
      const buffer = canvas.toBuffer('image/png');
      renderedFrames.push(sharp(buffer));
      // const filename = `${idx}.png`;
      // const filepath = `${outputDirectoryPath}/${filename}`;
      // fs.writeFileSync(filepath, buffer, 'binary');
      //  clear the last line
      // console.log(`add frame ${idx}`);
    }
    idx++;
    if (idx < FRAME_COUNT) {
      // setTimeout(update, 16);
    }
    if (idx === FRAME_COUNT) {
      console.log('finished');
      // const filename = `${inputFileNameWithoutExtension}-animated.png`;
      // const filepath = `${outputDirectoryPath}/${filename}`;
      console.log('rendered frames', renderedFrames.length);
      console.log('saving to output directory path', outputDirectoryPath);
      apng.framesToApng(renderedFrames, outputDirectoryPath, {
        // delay: 3,
      });
      // const encoder = new GIFEncoder(512, 512);
      // encoder
      //   .createReadStream()
      //   .pipe(
      //     fs.createWriteStream(outputDirectoryPath.replace('.png', '.gif'))
      //   );

      // encoder.start();
      // encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
      // encoder.setDelay(3); // frame delay in ms
      // encoder.setQuality(10); // image quality. 10 is default.
      // encoder.setTransparent(0x000000);
      // renderedFrames.forEach((frame) => {
      //   encoder.addFrame(frame);
      // });
      // encoder.finish();
    }
  }
  // update();
}

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

// find all png files in the input directory, recursively search subdirectories

// const INPUT_DIRECTORY = './assets/thumbnails copy';

// let allFiles = [];
// const ALL_PNGS = findFilesInDir(INPUT_DIRECTORY, '.png');
// for (const png of ALL_PNGS) {
//   console.log('png', png);
// }

// get argument from command line
const inputFilePath = process.argv[2];
const outputFilePath = process.argv[3];
console.log('input file path', inputFilePath, outputFilePath);
// setTimeout(() => {
//   console.log('finished');
// }, 5000);
generateSpinningPNGSequence(inputFilePath, outputFilePath);
