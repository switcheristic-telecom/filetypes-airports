"use client";

import { env } from "@/env";
import React, { useState, useEffect } from "react";

// Mapbox
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { mapboxStyles } from "@/utils/mapbox";
import { NavigationControl } from "react-map-gl";

// DeckGL
import type { PickingInfo } from "@deck.gl/core/typed";

import DeckGL from "@deck.gl/react/typed";

// Config
import { lightingEffect, material, colorRange } from "@/lib/map-config";
import {
  textLayerFromAirports,
  meshLayerFromAirports,
  iconLayerFromAirports,
} from "@/lib/map-layers";

// Airport TRPC
import type { Airport, AirportConcise } from "@/utils/airport";
import { api } from "@/trpc/react";
import type { MapViewState } from "@/lib/map-config";

// 24 fps
const ANIMATION_INTERVAL = 1000 / 24;

interface AirportMapProps {
  allAirports: Airport[];
  initialViewState: MapViewState;
  flyToAirport: (airport: Airport) => void;
}

const AirportMap = ({
  allAirports,
  initialViewState,
  flyToAirport,
}: AirportMapProps) => {
  const { data: initialAirport } = api.airport.getAirportOfTheDay.useQuery();
  const [animationTime, setAnimationTime] = useState(0);

  const [latestViewState, setLatestViewState] = useState(initialViewState);

  useEffect(() => {
    // console.log("latestViewState", latestViewState);
  }, [latestViewState]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime((prev) => prev + ANIMATION_INTERVAL);
    }, ANIMATION_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const layerOnCLick = ({ object }: PickingInfo) => {
    if (object) {
      flyToAirport(object as Airport);
    }
  };

  const textLayer = textLayerFromAirports({
    airports: allAirports,
    onClick: layerOnCLick,
  });
  const meshLayer = meshLayerFromAirports({
    airports: allAirports,
    onClick: layerOnCLick,
    timeInMs: animationTime,
    viewState: latestViewState,
  });

  const iconLayer = iconLayerFromAirports({
    airports: allAirports,
    onClick: layerOnCLick,
  });

  const layers = [textLayer, meshLayer];

  return (
    <div>
      {initialAirport && (
        <DeckGL
          effects={[lightingEffect]}
          initialViewState={initialViewState}
          controller={true}
          layers={layers}
          getTooltip={getTooltip}
          onViewStateChange={({ viewState }) => {
            setLatestViewState(viewState as MapViewState);
          }}
        >
          <Map
            mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            mapStyle={mapboxStyles.latest}
          ></Map>
        </DeckGL>
      )}
    </div>
  );
};

export default AirportMap;

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
