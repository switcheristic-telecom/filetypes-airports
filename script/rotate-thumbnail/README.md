# rotate-thumbnail

Generates spinning 3D animated thumbnails (APNG) from static PNG icons. Takes a flat filetype icon, maps it onto a Three.js plane, renders 24 frames of Y-axis rotation, and stitches them into an animated PNG using sharp-apng.

These animated thumbnails are used as the spinning filetype sprites on the map.

## How it works

1. Reads a static PNG icon (e.g. a `.DOC` filetype thumbnail)
2. Creates a textured plane in a headless Three.js scene (via node-canvas-webgl + headless-gl)
3. Rotates the plane 360° over 24 frames, rendering each to a 32×32 canvas
4. Combines all frames into a single APNG file

## Usage

Process a single icon:

```sh
node process-image.js <input.png> <output.apng>
```

Batch-process all icons in the thumbnails directory:

```sh
python main.py
```

This walks `assets/thumbnails copy/`, finds all `.png` files, and runs `process-image.js` on each, outputting to `assets/thumbnails-animated/`.

`index.js` is an alternative Node-based batch runner that does the same thing.

## Dependencies

Requires Node.js and Python 3. Install Node dependencies first:

```sh
npm install
```

Key dependencies:

- **three** — 3D rendering (scene, camera, textured plane)
- **node-canvas + headless-gl** — offscreen WebGL rendering without a browser (via `lib/`)
- **sharp + sharp-apng** — frame stitching into animated PNG
- **pngjs** — reading input PNG dimensions and pixel data
