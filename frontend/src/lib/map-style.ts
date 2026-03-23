import type { StyleSpecification } from "maplibre-gl";
import { env } from "@/env";

const key = env.MAPTILER_KEY;

export const mapStyle: StyleSpecification = {
  version: 8,
  name: "airport-codes-filetypes",
  sources: {
    openmaptiles: {
      type: "vector",
      url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${key}`,
    },
  },
  glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${key}`,
  layers: [
    // Background (land)
    {
      id: "land",
      type: "background",
      paint: {
        "background-color": [
          "interpolate",
          ["linear"],
          ["zoom"],
          9,
          "#C0C0C0",
          11,
          "rgb(158, 158, 158)",
        ],
      },
    },

    // Water (fill)
    {
      id: "water",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "water",
      paint: {
        "fill-color": "#1F3CAE",
      },
    },

    // Waterways (lines)
    {
      id: "waterway",
      type: "line",
      source: "openmaptiles",
      "source-layer": "waterway",
      minzoom: 8,
      layout: {
        "line-cap": ["step", ["zoom"], "butt", 11, "round"],
        "line-join": ["step", ["zoom"], "miter", 11, "round"],
      },
      paint: {
        "line-color": "#1F3CAE",
        "line-width": [
          "interpolate",
          ["exponential", 1.3],
          ["zoom"],
          9,
          ["match", ["get", "class"], ["canal", "river"], 0.1, 0],
          20,
          ["match", ["get", "class"], ["canal", "river"], 8, 3],
        ],
        "line-opacity": ["interpolate", ["linear"], ["zoom"], 8, 0, 8.5, 1],
      },
    },

    // Landuse (parks, forests, etc.)
    {
      id: "landuse",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "landuse",
      minzoom: 5,
      paint: {
        "fill-color": [
          "match",
          ["get", "class"],
          "wood",
          "rgba(6, 215, 236, 0.8)",
          "scrub",
          "rgba(36, 246, 246, 0.6)",
          "agriculture",
          "rgba(63, 250, 250, 0.6)",
          "park",
          "#008080",
          "grass",
          "rgba(63, 250, 250, 0.6)",
          "cemetery",
          "rgb(23, 131, 131)",
          "glacier",
          "rgb(131, 145, 201)",
          "pitch",
          "rgb(0, 138, 116)",
          "sand",
          "rgb(48, 255, 255)",
          "rgb(150, 150, 150)",
        ],
        "fill-opacity": [
          "interpolate",
          ["linear"],
          ["zoom"],
          8,
          ["match", ["get", "class"], "residential", 0.8, 0.2],
          10,
          ["match", ["get", "class"], "residential", 0, 1],
        ],
        "fill-antialias": false,
      },
    },

    // Aeroway polygons
    {
      id: "aeroway-polygon",
      type: "fill",
      source: "openmaptiles",
      "source-layer": "aeroway",
      minzoom: 11,
      filter: [
        "all",
        ["match", ["get", "class"], ["runway", "taxiway", "helipad"], true, false],
        ["==", ["geometry-type"], "Polygon"],
      ],
      paint: {
        "fill-color": "rgb(180, 180, 180)",
        "fill-opacity": ["interpolate", ["linear"], ["zoom"], 10, 0, 11, 1],
      },
    },

    // Aeroway lines
    {
      id: "aeroway-line",
      type: "line",
      source: "openmaptiles",
      "source-layer": "aeroway",
      minzoom: 9,
      filter: ["==", ["geometry-type"], "LineString"],
      paint: {
        "line-color": "rgb(180, 180, 180)",
        "line-width": [
          "interpolate",
          ["exponential", 1.5],
          ["zoom"],
          9,
          ["match", ["get", "class"], "runway", 1, 0.5],
          18,
          ["match", ["get", "class"], "runway", 80, 20],
        ],
        "line-opacity": ["interpolate", ["linear"], ["zoom"], 10, 0, 11, 1],
      },
    },

    // Roads
    {
      id: "road-simple",
      type: "line",
      source: "openmaptiles",
      "source-layer": "transportation",
      minzoom: 5,
      layout: {
        "line-cap": ["step", ["zoom"], "butt", 14, "round"],
        "line-join": ["step", ["zoom"], "miter", 14, "round"],
      },
      paint: {
        "line-width": [
          "interpolate",
          ["exponential", 1.5],
          ["zoom"],
          5,
          ["match", ["get", "class"], ["motorway", "trunk", "primary"], 0.45, ["secondary", "tertiary"], 0.06, 0],
          13,
          ["match", ["get", "class"], ["motorway", "trunk", "primary"], 2.4, ["secondary", "tertiary"], 1.5, 0.6],
          18,
          ["match", ["get", "class"], ["motorway", "trunk", "primary"], 19.2, ["secondary", "tertiary"], 15.6, 10.8],
        ],
        "line-color": [
          "match",
          ["get", "class"],
          ["secondary", "tertiary", "minor", "service", "track"],
          "hsl(0, 0%, 16%)",
          "hsl(0, 0%, 19%)",
        ],
      },
    },

    // Admin boundaries (state/province)
    {
      id: "admin-1-boundary",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      minzoom: 2,
      filter: ["all", ["==", ["get", "admin_level"], 4], ["==", ["get", "maritime"], 0]],
      paint: {
        "line-dasharray": [2, 2, 6, 2],
        "line-width": ["interpolate", ["linear"], ["zoom"], 3, 0.3, 12, 1.5],
        "line-opacity": ["interpolate", ["linear"], ["zoom"], 2, 0, 3, 1],
        "line-color": "rgb(102, 102, 102)",
      },
    },

    // Admin boundaries (country)
    {
      id: "admin-0-boundary",
      type: "line",
      source: "openmaptiles",
      "source-layer": "boundary",
      minzoom: 1,
      filter: ["all", ["==", ["get", "admin_level"], 2], ["==", ["get", "maritime"], 0]],
      paint: {
        "line-color": "rgb(95, 95, 95)",
        "line-width": ["interpolate", ["linear"], ["zoom"], 3, 0.65, 12, 2.6],
      },
    },

    // Country labels
    {
      id: "country-label",
      type: "symbol",
      source: "openmaptiles",
      "source-layer": "place",
      minzoom: 1,
      maxzoom: 10,
      filter: ["==", ["get", "class"], "country"],
      layout: {
        "text-field": ["coalesce", ["get", "name:en"], ["get", "name"]],
        "text-font": ["Source Code Pro Regular", "Open Sans Regular"],
        "text-max-width": 6,
        "text-size": [
          "interpolate",
          ["cubic-bezier", 0.2, 0, 0.7, 1],
          ["zoom"],
          1,
          ["step", ["get", "rank"], 11, 4, 9, 5, 8],
          9,
          ["step", ["get", "rank"], 22, 4, 19, 5, 17],
        ],
      },
      paint: {
        "text-color": "hsl(0, 0%, 0%)",
        "text-halo-color": [
          "interpolate",
          ["linear"],
          ["zoom"],
          2,
          "rgba(255, 255, 255, 0.75)",
          3,
          "rgb(255, 255, 255)",
        ],
        "text-halo-width": 1.25,
      },
    },
  ],
};
