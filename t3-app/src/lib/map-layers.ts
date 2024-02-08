import type { Airport } from "@/utils/airport";

// Text Layer
import { TextLayer } from "@deck.gl/layers/typed";
import { CollisionFilterExtension } from "@deck.gl/extensions/typed";

// Mesh Layer
import { SimpleMeshLayer } from "@deck.gl/mesh-layers/typed";
import { CubeGeometry, CylinderGeometry, PlaneGeometry } from "@luma.gl/core";
// import { Geom } from "@luma.gl/webgl";

// Icon Layer
import { IconLayer } from "@deck.gl/layers/typed";

import type { PickingInfo } from "deck.gl/typed";
import { MapViewState } from "./map-config";

// Animation helper
import { mix, unmix, remap } from "@/utils/math";
import easingsFunctions from "@/utils/easing";

interface LayerFromAirportsArgs {
  airports: Airport[];
  onClick?: (info: PickingInfo) => void;
}

interface TextLayerFromAirportsArgs extends LayerFromAirportsArgs {
  fontSize?: number;
  sizeMaxPixels?: number;
  sizeMinPixels?: number;
  noOverlap?: boolean;
}

export const textLayerFromAirports = ({
  airports,
  fontSize = 24,
  sizeMaxPixels = 48,
  sizeMinPixels = 10,
  noOverlap = true,
  onClick,
}: TextLayerFromAirportsArgs) => {
  if (!airports) {
    return null;
  }
  const textLayer = new TextLayer({
    id: "airport-iata-codes-layer",
    data: airports,
    pickable: true,
    characterSet: "auto",
    fontSettings: {
      buffer: 8,
    },
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "bold",

    // TextLayer options
    getText: (d: Airport) => d.iata_code,
    getPixelOffset: (d) => [0, fontSize / 2],
    getPosition: (d: Airport) => [d.longitude, d.latitude],

    getColor: (d) => [255, 255, 0],
    getSize: (d) => 1,
    sizeScale: fontSize,
    sizeMaxPixels,
    sizeMinPixels,
    maxWidth: 64 * 12,

    background: true,
    backgroundColor: [0, 0, 0, 255],

    // CollideExtension options
    collisionEnabled: noOverlap,
    // getCollisionPriority: (d) => Math.log10(d.population),
    collisionTestProps: {
      sizeScale: fontSize * 2,
      sizeMaxPixels: sizeMaxPixels * 2,
      sizeMinPixels: sizeMinPixels * 2,
    },
    onClick: onClick,
    extensions: [new CollisionFilterExtension()],
  });
  return textLayer;
};

interface MeshLayerFromAirportsArgs extends LayerFromAirportsArgs {
  texture?: string;
  timeInMs?: number;
  viewState?: MapViewState;
}

export const meshLayerFromAirports = ({
  airports,
  texture,
  timeInMs = 0,
  viewState,
  onClick,
}: MeshLayerFromAirportsArgs) => {
  if (!airports) {
    return null;
  }

  const LOOP_LENGTH = 1800;

  const time = (timeInMs % LOOP_LENGTH) / LOOP_LENGTH;

  const zoom = viewState?.zoom ?? 0;

  const meshLayer = new SimpleMeshLayer({
    id: "airport-3d-layer",
    data: airports,
    pickable: true,
    texture: "assets/thumbnails/classic/_fallback_classic.png",

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    mesh: new PlaneGeometry(),

    sizeScale: 100,
    visible: zoom > 10,
    material: false,
    getPosition: (d: Airport) => [d.longitude, d.latitude],
    getColor: [255, 255, 255],
    getPolygonOffset: () => [0, -1],
    getOrientation: [time * 360, 0, 180],

    getScale: (d: Airport) => {
      const baseScale = 10;
      let factor = 1;
      if (zoom < 10) {
        factor = 1;
      } else if (zoom < 11) {
        const t = unmix(10, 11, zoom);
        factor = mix(0, 3, t);
      } else if (zoom < 12.5) {
        const t = unmix(11, 12.5, zoom);
        factor = mix(3, 1, t);
      } else {
        factor = 1;
      }

      const scale = baseScale * factor;

      return [scale, scale, scale];
    },

    getTranslation: (d: Airport) => {
      const baseX = 0;
      const baseY = 1000;
      const baseZ = 500;

      let yOffset = 0;
      if (zoom < 10) {
        yOffset = 0;
      } else if (zoom < 11) {
        const t = unmix(10, 11, zoom);
        yOffset = mix(0, 1000, t);
      } else if (zoom < 12.5) {
        const t = unmix(11, 12.5, zoom);
        yOffset = mix(1000, -400, t);
      } else {
        yOffset = -400;
      }

      return [baseX, baseY + yOffset, baseZ];
    },
    onClick: onClick,
  });
  return meshLayer;
};

export const iconLayerFromAirports = ({
  airports,
  onClick,
}: LayerFromAirportsArgs) => {
  if (!airports) {
    return null;
  }
  const iconLayer = new IconLayer({
    id: "airport-icons-layer",
    data: airports,
    pickable: true,
    iconAtlas: "assets/thumbnails/classic/_fallback_classic.png",
    iconMapping: {
      marker: {
        x: 0,
        y: 0,
        width: 48,
        height: 48,
        mask: false,
      },
    },
    getPosition: (d: Airport) => [d.longitude, d.latitude],
    getSize: 32,
    sizeScale: 1000,
    onClick: onClick,
  });
  return iconLayer;
};
