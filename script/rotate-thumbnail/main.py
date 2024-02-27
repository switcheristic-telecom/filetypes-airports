import subprocess
import os

node_scripts = ["process-image.js", "process-image.js"]


INPUT_DIRECTORY = "assets/thumbnails copy"
CURRENT_DIRECTORY = os.getcwd()

INPUT_DIRECTORY = os.path.join(CURRENT_DIRECTORY, INPUT_DIRECTORY)
# find all files in the directory and subdirectories recursively and store them in a list
# only keep the files that have a specific extension

found_files = []
extension = ".png"
for root, dirs, files in os.walk(INPUT_DIRECTORY):
    print(len(files))
    for file in files:
        if file.endswith(extension):
            found_files.append(os.path.join(root, file))


print(found_files)

for file in found_files:
    input_file = file
    output_file = file.replace("thumbnails copy", "thumbnails-animated")

    subprocess.run(["node", "process-image.js", input_file, output_file])

# for script in node_scripts:
#     subprocess.run(["node", script])
