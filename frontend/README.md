# Frontend

Next.js 14 app that renders the interactive map.

## Stack

- **Next.js 14** with App Router
- **Mapbox GL** + **deck.gl** for the map and custom icon layers
- **tRPC** for the API layer (serves airport data from a static dataset)
- **Tailwind CSS** with a retro/bitmap aesthetic (Fixedsys, LED dot-matrix fonts)
- **Radix UI** + **shadcn/ui** components (drawer, sidebar, combobox, etc.)
- **Bun** as package manager

## Getting started

```sh
cp .env.example .env   # add your Mapbox access token
bun install
bun dev
```

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox GL access token (required) |

## Source layout

```
src/
  app/                  Pages and route-level components
    _components/        Map, sidebar, drawer, marquee, LED display
    api/trpc/           tRPC API route handler
    fonts/              Fixedsys, Square Dot-Matrix
  components/ui/        shadcn/ui primitives
  data/                 Static airport + filetype dataset, thumbnail mappings
  hooks/                useBreakpoint
  lib/                  Map config, deck.gl layers, utilities
  server/api/           tRPC router (airport queries)
  utils/                Airport types, math, easing, mapbox helpers
  styles/               Global CSS
public/
  assets/               Filetype thumbnails (static, animated, spritesheets)
  cursors/              Custom cursors
  logo/                 Switcheristic Telecoms branding
```
