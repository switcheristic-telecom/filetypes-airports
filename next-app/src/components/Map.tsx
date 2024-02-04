'use client';
// components/Map.jsx

import React, { Suspense, useState } from 'react';

import Map from 'react-map-gl';
import { HexagonLayer } from '@deck.gl/aggregation-layers/typed';
import { TextLayer } from '@deck.gl/layers/typed';
import DeckGL from '@deck.gl/react/typed';
import 'mapbox-gl/dist/mapbox-gl.css';
import { scaleLinear } from 'd3-scale';

import {
  MapView,
  OrthographicView,
  _GlobeView as GlobeView,
} from '@deck.gl/core/typed';

import type { Airport } from '@/data/data';

// import map config
import {
  lightingEffect,
  material,
  INITIAL_VIEW_STATE,
  colorRange,
} from '../lib/mapconfig.js';

interface LocationAggregatorMapProps {
  allAirportsData: Airport[];
  airportOfTheDayData: Airport | null;
  noOverlap?: boolean;
}

const fontSize = 1;
const sizeMaxPixels = 100;
const sizeMinPixels = 10;

function getTooltip({ object }: { object: Airport }) {
  if (!object) {
    return null;
  }
  const lat = object.latitude;
  const lng = object.longitude;
  const count = object.filetypes.length;

  return `\
        latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ''}
        longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ''}
        ${count} file extensions here`;
}

const LocationAggregatorMap = ({
  allAirportsData,
  airportOfTheDayData,
  noOverlap = true,
}: LocationAggregatorMapProps) => {
  const updataedInitialState = {
    ...INITIAL_VIEW_STATE,
    longitude: airportOfTheDayData?.longitude,
    latitude: airportOfTheDayData?.latitude,
  };

  const textLayer = new TextLayer({
    id: 'world-cities',
    data: allAirportsData,
    characterSet: 'auto',
    fontSettings: {
      buffer: 8,
    },

    // TextLayer options
    getText: (d) => d.iata_code,
    getPosition: (d) => [d.longitude, d.latitude],
    getColor: (d) => [0, 0, 0],
    getSize: (d) => 15,
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
    // extensions: [new CollisionFilterExtension()],
  });

  const layers = [textLayer];

  return (
    <div>
      {airportOfTheDayData && (
        <DeckGL
          // effects={[lightingEffect]}
          initialViewState={updataedInitialState}
          controller={true}
          layers={layers}
          // getTooltip={getTooltip}
        >
          <Map
            // controller={true}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            mapStyle='mapbox://styles/mapbox/light-v11'
          ></Map>
        </DeckGL>
      )}
    </div>
  );
};

export default LocationAggregatorMap;
