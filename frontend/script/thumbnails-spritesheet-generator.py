# Generate a spritesheet from the data in the folder structure
# Export WebP and JSON file
#
# Near-duplicate images (max pixel diff <= DEDUP_THRESHOLD) are deduplicated:
# only one copy is packed into the sheet, and all duplicates point to
# the same sprite coordinates.
import os
import json
import numpy as np
from PIL import Image

# Get the current file path
cwd = os.path.dirname(__file__)
THUMBNAILS_DIR = os.path.join(cwd, "../public/assets/thumbnails")
SPRITESHEET_DIR = os.path.join(cwd, "../public/assets/thumbnails-spritesheet")

COLS = 13  # number of columns in the grid
DEDUP_THRESHOLD = 10  # max per-channel pixel difference to consider "same"

thumbnails = []
# Walk through the directory and get the list of png files
for root, dirs, files in os.walk(THUMBNAILS_DIR):
    for file in files:
        if file.endswith(".png"):

            # filenames are in the format of "ext_style.png"
            # in case of the fallback, the filename is "_fallback_style.png"

            splited = file.split("_")

            # find first non-empty string
            extension = None
            for s in splited:
                if s:
                    extension = s
                    break
            print("Extension: ", extension)

            # the parent folder is the style name
            parent_folder = os.path.basename(root)
            style = parent_folder

            abs_path = os.path.join(root, file)
            rel_path = os.path.relpath(abs_path, THUMBNAILS_DIR)

            thumbnail = {
                "rel_path": rel_path,
                "abs_path": abs_path,
                "style": style,
                "extension": extension,
            }

            thumbnails.append(thumbnail)


print("Found {} thumbnails".format(len(thumbnails)))

# Generate the spritesheet
# 1. Sort the thumbnails by file name
thumbnails.sort(key=lambda x: x["rel_path"])
print("Sorted thumbnails")

# 2. Load all images and deduplicate near-identical ones
arrays = []
for t in thumbnails:
    img = Image.open(t["abs_path"]).convert("RGBA")
    arrays.append(np.array(img))
    t["_img"] = img

canonical = {}  # thumb_idx -> unique_idx (which unique slot this thumb maps to)
unique_indices = []  # indices into `thumbnails` that are actually unique

for i, arr_i in enumerate(arrays):
    found = False
    for u_idx in unique_indices:
        arr_u = arrays[u_idx]
        if arr_i.shape != arr_u.shape:
            continue
        if np.abs(arr_i.astype(int) - arr_u.astype(int)).max() <= DEDUP_THRESHOLD:
            canonical[i] = u_idx
            found = True
            break
    if not found:
        canonical[i] = i
        unique_indices.append(i)

deduped = len(thumbnails) - len(unique_indices)
print(f"Unique icons: {len(unique_indices)} (deduplicated {deduped})")

# 3. Make a grid from unique thumbnails only
unique_thumbs = [thumbnails[i] for i in unique_indices]
thumbnails_grid = []
for i in range(0, len(unique_thumbs), COLS):
    thumbnails_grid.append(unique_thumbs[i : i + COLS])

print("Generated thumbnails grid")

# get width and height of each row
widths = []
heights = []
for row in thumbnails_grid:
    row_width = 0
    row_height = 0
    for thumbnail in row:
        img = thumbnail["_img"]
        row_width += img.width
        if img.height > row_height:
            row_height = img.height
    widths.append(row_width)
    heights.append(row_height)

spritesheet_width = max(widths)
spritesheet_height = sum(heights)

print(
    "Spritesheet width: ", spritesheet_width, "Spritesheet height: ", spritesheet_height
)

# 4. Generate the spritesheet from unique icons
spritesheet = Image.new("RGBA", (spritesheet_width, spritesheet_height), (0, 0, 0, 0))

# Map unique original index -> sprite coordinates
unique_coords = {}

x_offset = 0
y_offset = 0
for row, row_height in zip(thumbnails_grid, heights):
    x_offset = 0
    for thumbnail in row:
        img = thumbnail["_img"]
        spritesheet.paste(img, (x_offset, y_offset))
        orig_idx = thumbnails.index(thumbnail)
        unique_coords[orig_idx] = {
            "x": x_offset,
            "y": y_offset,
            "width": img.width,
            "height": img.height,
        }
        x_offset += img.width
    y_offset += row_height

# 5. Build output data for ALL thumbnails (duplicates point to same coords)
output_frames = []
deckgl_mapping = {}

for i, thumbnail in enumerate(thumbnails):
    canon_idx = canonical[i]
    coords = unique_coords[canon_idx]

    frame = {
        "rel_path": thumbnail["rel_path"],
        "style": thumbnail["style"],
        "extension": thumbnail["extension"],
        **coords,
    }
    output_frames.append(frame)

    # deck.gl icon mapping key: "{extension}-{style}"
    key = f"{thumbnail['extension']}-{thumbnail['style']}"
    deckgl_mapping[key] = {**coords, "mask": False}

# Save the spritesheet as WebP
SPRITESHEET_PATH = os.path.join(SPRITESHEET_DIR, "spritesheet.webp")
spritesheet.save(SPRITESHEET_PATH, "WEBP", lossless=True, quality=100)

webp_size = os.path.getsize(SPRITESHEET_PATH)
print(f"Output: {SPRITESHEET_PATH} ({webp_size / 1024:.1f} KB)")

# Save the JSON file
output_json = {
    "meta": {
        "spritesheet": "spritesheet.webp",
        "format": "RGBA",
        "size": {"w": spritesheet_width, "h": spritesheet_height},
        "scale": 1,
    },
    "frames": output_frames,
}

JSON_PATH = os.path.join(SPRITESHEET_DIR, "spritesheet.json")
with open(JSON_PATH, "w") as f:
    json.dump(output_json, f, indent=4)

# Save the deck.gl mapping
DECKGL_JSON_PATH = os.path.join(SPRITESHEET_DIR, "deckgl-spritesheet.json")
with open(DECKGL_JSON_PATH, "w") as f:
    json.dump(deckgl_mapping, f, indent=4)
