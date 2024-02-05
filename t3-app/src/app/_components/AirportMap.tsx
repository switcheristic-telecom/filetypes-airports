"use client";

import React, { Suspense, useState } from "react";

import Map from "react-map-gl";
import { HexagonLayer } from "@deck.gl/aggregation-layers/typed";
import DeckGL from "@deck.gl/react/typed";
import "mapbox-gl/dist/mapbox-gl.css";

import { textLayerFromAirports } from "@/lib/mapLayers";
import type { Airport, AirportConcise } from "@/utils/airport";
import { mapboxStyles } from "@/utils/mapbox";

import { PickingInfo } from "@deck.gl/core/typed";

import { api } from "@/trpc/react";

import {
  lightingEffect,
  material,
  INITIAL_VIEW_STATE,
  colorRange,
} from "@/lib/mapconfig.js";

interface AirportMapProps {
  allAirports: Airport[];
  noOverlap?: boolean;
}

function getTooltip(info: PickingInfo) {
  if (!info.object) {
    return null;
  }

  const airport = info.object as AirportConcise;

  const iata_code = airport.iata_code;

  const extension = `<b>Extension</b>: ${iata_code}`;
  const composeFileTypeLines = (
    description: string | null,
    usedBy: string | null,
  ) => {
    const descriptionLine = `<b>${description}</b>`;
    const usedByLine = usedBy ? `Used by ${usedBy}` : "";

    return `<li>${descriptionLine}. ${usedByLine}</li>`;
  };

  const fileTypeLines = airport.filetypes.map((filetype) => {
    return composeFileTypeLines(filetype.description, filetype.used_by);
  });

  return {
    html: `\
    <h2 class="font-bold text-lg">${airport.iata_code}</h2>
    <h3 class="font-bold text-md pt-1">As airport:</h3>
    <ul class="list-disc pl-4"><li>${airport.name}</li></ul>
    <h3 class="font-bold text-md pt-1">As filetype:</h3>
    <ul class="list-disc pl-4">
    ${fileTypeLines.join("")}
    </ul>
    `,
    style: {
      fontSize: "0.8em",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      color: "white",
      width: "22em",
    },
  };
}

const AirportMap = ({ allAirports, noOverlap = true }: AirportMapProps) => {
  const { data: initialAirport } = api.airport.getAirportOfTheDay.useQuery();

  const updataedInitialState = {
    ...INITIAL_VIEW_STATE,
    longitude: initialAirport?.longitude,
    latitude: initialAirport?.latitude,
  };

  const textLayer = textLayerFromAirports({
    airports: allAirports,
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
