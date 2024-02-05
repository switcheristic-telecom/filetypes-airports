"use client";

import React from "react";

// Mapbox
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { mapboxStyles } from "@/utils/mapbox";

// DeckGL
import type { PickingInfo } from "@deck.gl/core/typed";
import { HexagonLayer } from "@deck.gl/aggregation-layers/typed";
import DeckGL from "@deck.gl/react/typed";

// Config
import {
  lightingEffect,
  material,
  INITIAL_VIEW_STATE,
  colorRange,
} from "@/lib/mapconfig";
import { textLayerFromAirports } from "@/lib/mapLayers";

// Airport TRPC
import type { Airport, AirportConcise } from "@/utils/airport";
import { api } from "@/trpc/react";

interface AirportMapProps {
  allAirports: Airport[];
  noOverlap?: boolean;
}

function getTooltip(info: PickingInfo) {
  if (!info.object) {
    return null;
  }
  const airport = info.object as AirportConcise;

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
