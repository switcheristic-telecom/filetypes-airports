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

function getTooltip(object: any) {
  if (!object.object) {
    return null;
  }

  const iata_code = object.object.iata_code;

  const extension = `<b>Extension</b>: ${iata_code}`;
  const composeFileTypeLines = (
    description: string | null,
    usedBy: string | null
  ) => {
    const descriptionLine = `<b>Description</b>: ${description}`;
    const usedByLine = usedBy ? `<b>Used by</b>: ${usedBy}` : '';

    return `${descriptionLine}<br>${usedByLine}`;
  };

  const fileTypeLines = object.object.filetypes.map((filetype: any) => {
    return composeFileTypeLines(filetype.description, filetype.used_by);
  });

  return {
    html: `\
    ${extension}<br> 
    ${fileTypeLines.join('<br>')}
    `,
    style: {
      fontSize: '0.8em',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      width: '24em',
    },
  };
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
          effects={[lightingEffect]}
          initialViewState={updataedInitialState}
          controller={true}
          layers={layers}
          getTooltip={getTooltip}
        >
          <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            mapStyle={mapboxStyles.latest}
          ></Map>
        </DeckGL>
      )}
    </div>
  );
};

export default AirportMap;
