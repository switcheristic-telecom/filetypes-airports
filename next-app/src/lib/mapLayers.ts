import { TextLayer } from '@deck.gl/layers/typed';
import { Airport } from '@/utils/airport';
import { CollisionFilterExtension } from '@deck.gl/extensions/typed';

interface TextLayerFromAirportsArgs {
  airports: Airport[];
  fontSize?: number;
  sizeMaxPixels?: number;
  sizeMinPixels?: number;
  noOverlap?: boolean;
}

export const textLayerFromAirports = ({
  airports,
  fontSize = 14,
  sizeMaxPixels = 48,
  sizeMinPixels = 10,
  noOverlap = true,
}: TextLayerFromAirportsArgs) => {
  if (!airports) {
    return null;
  }
  const textLayer = new TextLayer({
    id: 'airport-iata-codes-layer',
    data: airports,
    pickable: true,
    characterSet: 'auto',
    fontSettings: {
      buffer: 8,
    },
    fontFamily: 'Futura, Helvetica, Arial, sans-serif',

    // TextLayer options
    getText: (d) => d.iata_code,
    getPosition: (d) => [d.longitude, d.latitude],
    getColor: (d) => [0, 0, 0],
    getSize: (d) => 1,
    sizeScale: fontSize,
    sizeMaxPixels,
    sizeMinPixels,
    maxWidth: 64 * 12,

    // CollideExtension options
    collisionEnabled: noOverlap,
    // getCollisionPriority: (d) => Math.log10(d.population),
    collisionTestProps: {
      sizeScale: fontSize * 2,
      sizeMaxPixels: sizeMaxPixels * 2,
      sizeMinPixels: sizeMinPixels * 2,
    },
    extensions: [new CollisionFilterExtension()],
  });
  return textLayer;
};
