'use client';
// components/Map.jsx

import React, { Suspense, useState } from 'react';

import Map from 'react-map-gl';
import { HexagonLayer } from '@deck.gl/aggregation-layers/typed';
import { TextLayer } from '@deck.gl/layers/typed';
import DeckGL from '@deck.gl/react/typed';
import 'mapbox-gl/dist/mapbox-gl.css';
import { scaleLinear } from 'd3-scale';

import { textLayerFromAirports } from '@/lib/mapLayers';

import type { Airport } from '@/utils/airport';

import { mapboxStyles } from '@/utils/mapbox';

// import map config
import {
  lightingEffect,
  material,
  INITIAL_VIEW_STATE,
  colorRange,
} from '../lib/mapconfig.js';

interface AirportMapProps {
  allAirportsData: Airport[];
  initialAirport: Airport | null;
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

const AirportMap = ({
  allAirportsData,
  initialAirport,
  noOverlap = true,
}: AirportMapProps) => {
  const updataedInitialState = {
    ...INITIAL_VIEW_STATE,
    longitude: initialAirport?.longitude,
    latitude: initialAirport?.latitude,
  };

  const textLayer = textLayerFromAirports({
    airports: allAirportsData,
  });

  const layers = [textLayer];

  return (
    <div>
      {initialAirport && (
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
            mapStyle={mapboxStyles.latest}
          ></Map>
        </DeckGL>
      )}
    </div>
  );
};

export default AirportMap;
