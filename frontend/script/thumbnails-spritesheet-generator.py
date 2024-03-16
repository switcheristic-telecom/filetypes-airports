# Generate a spritesheet from the data in the folder structure
# Export PNG and JSON file
import os
import json
import PIL
from PIL import Image

# Get the current file path
cwd = os.path.dirname(__file__)
THUMBNAILS_DIR = os.path.join(cwd, "../public/assets/thumbnails")
SPRITESHEET_DIR = os.path.join(cwd, "../public/assets/thumbnails-spritesheet")

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

# 2. Make a grid of thumbnails
thumbnail_length = len(thumbnails)
cols = 13  # number of columns in the grid
thumbnails_grid = []

for i in range(0, thumbnail_length, cols):
    thumbnails_grid.append(thumbnails[i : i + cols])

print("Generated thumbnails grid")


# get width and height of each row
# width should be the sum of the widths of the thumbnails
# height should be the height of the tallest thumbnail
widths = []
heights = []
for row in thumbnails_grid:
    row_width = 0
    row_height = 0
    for thumbnail in row:
        img = Image.open(thumbnail["abs_path"])
        row_width += img.width
        if img.height > row_height:
            row_height = img.height
    widths.append(row_width)
    heights.append(row_height)

# for w, h in zip(widths, heights):
#     print("Width: ", w, "Height: ", h)

spritesheet_width = max(widths)
spritesheet_height = sum(heights)

print(
    "Spritesheet width: ", spritesheet_width, "Spritesheet height: ", spritesheet_height
)


# 2. Generate the spritesheet

spritesheet = Image.new("RGBA", (spritesheet_width, spritesheet_height), (0, 0, 0, 0))

x_offset = 0
y_offset = 0
for row, row_height in zip(thumbnails_grid, heights):
    x_offset = 0
    for thumbnail in row:
        img = Image.open(thumbnail["abs_path"])
        spritesheet.paste(img, (x_offset, y_offset))
        thumbnail["x"] = x_offset
        thumbnail["y"] = y_offset
        thumbnail["width"] = img.width
        thumbnail["height"] = img.height
        del thumbnail["abs_path"]
        x_offset += img.width
    y_offset += row_height

# Save the spritesheet
SPRITESHEET_PATH = os.path.join(SPRITESHEET_DIR, "spritesheet.png")
spritesheet.save(SPRITESHEET_PATH)

# Flatten the thumbnails grid
flat_thumbnails = [item for sublist in thumbnails_grid for item in sublist]
# Save the JSON file

output_json = {
    "meta": {
        "spritesheet": "spritesheet.png",
        "format": "RGBA",
        "size": {"w": spritesheet_width, "h": spritesheet_height},
        "scale": 1,
    },
    "frames": flat_thumbnails,
}

JSON_PATH = os.path.join(SPRITESHEET_DIR, "spritesheet.json")
with open(JSON_PATH, "w") as f:
    json.dump(output_json, f, indent=4)
