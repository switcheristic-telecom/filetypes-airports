# Filetypes / Airports

An interactive map that maps filetypes to airports when extensions overlap with IATA codes, with authentic thumbnail icons ripped from the original software.

**Live:** [filetypes.swtch.tel](https://filetypes.swtch.tel/) | [airports.swtch.tel](https://airports.swtch.tel/)

## How it works

Many 3-letter file extensions (`.AVI`, `.DOC`, `.GIF`, ...) happen to share their name with IATA airport codes. This project plots every overlap on a map, pairing each airport with its matching filetype and the authentic icon from the software that originally used it.

- Click an airport to see its filetype match, description, and associated software
- An "airport of the day" is picked deterministically each day
- Filetype thumbnails are real icons extracted from original applications, rendered as spinning 3D sprites on the map

### File conversion

Need to convert `.DOC` to `.PDF`? Select your source filetype on the map, pick a destination, and hit **Convert** — we'll book you a flight between the two airports on Google Flights, complete with an animated arc across the globe. The only file conversion service that requires a passport.

## Project structure

```text
data/          Data pipeline — Jupyter notebooks for cleaning, matching, and
               merging airport + filetype datasets into a single JSON
frontend/      Vite + React app with MapLibre GL + deck.gl map visualization
script/        Tooling for generating rotated thumbnail sprites from icons
```

## Setup

```sh
cd frontend
bun install
bun dev
```

## Credits

A [Switcheristic Telecoms](https://swtch.tel) project.
