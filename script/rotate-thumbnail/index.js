/* eslint-disable no-console */
const fs = require('fs');
const THREE = require('three');
const GIFEncoder = require('gifencoder');
const { createCanvas } = require('./lib');
const PNG = require('pngjs').PNG;

const FRAME_COUNT = 360;

const width = 512,
  height = 512;

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

const canvas = createCanvas(width, height);

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
});

renderer.setClearColor(0x000000, 0);

function generateSpinningGif(inputFilePath, outputFilePath) {
  //  input file is a png, read the dimensions, load it synchronously
  //  create a plane with the same dimensions
  console.log('input file path', inputFilePath);

  const data = fs.readFileSync(inputFilePath);

  const png = PNG.sync.read(data);

  const aspectRatio = png.width / png.height;

  console.log('input file path', inputFilePath);

  const geometry = new THREE.PlaneGeometry(5, 5);
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
  camera.position.z = 5;

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
  function update() {
    plane.rotation.y += (Math.PI * 2) / FRAME_COUNT;
    // plane.rotation.y += 0.01;
    renderer.render(scene, camera);
    if (idx > 0) {
      // encoder.addFrame(canvas.__ctx__);
      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(`./output/${idx}.png`, buffer, 'binary');
      console.log(`add frame ${idx}`);
    }
    idx++;
    if (idx < FRAME_COUNT) {
      setTimeout(update, 16);
    }
  }
  update();
}

generateSpinningGif('./assets/test/_fallback_classic.png', 'output.gif');
