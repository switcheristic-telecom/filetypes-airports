import { TextLayer } from "@deck.gl/layers/typed";
import type { Airport } from "@/utils/airport";
import { CollisionFilterExtension } from "@deck.gl/extensions/typed";

import type { PickingInfo } from "deck.gl/typed";
interface TextLayerFromAirportsArgs {
  airports: Airport[];
  fontSize?: number;
  sizeMaxPixels?: number;
  sizeMinPixels?: number;
  noOverlap?: boolean;
  onClick?: (info: PickingInfo) => void;
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
