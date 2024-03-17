"use client";

import { env } from "@/env";
import React, { useState, useEffect } from "react";

// Mapbox
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { mapboxStyles } from "@/utils/mapbox";

// DeckGL
import type { PickingInfo } from "@deck.gl/core/typed";
import DeckGL from "@deck.gl/react/typed";

// Config
import {
  textLayerFromAirports,
  iconLayerFromAirports,
  arcLayerFromAirports,
} from "@/lib/map-layers";

// Airport TRPC
import type { Airport, AirportConcise } from "@/utils/airport";
import { api } from "@/trpc/react";
import type { MapViewState } from "@/lib/map-config";

import { _GlobeView as GlobeView } from "@deck.gl/core/typed";
import { BitmapLayer } from "@deck.gl/layers/typed";
import { TileLayer, COORDINATE_SYSTEM } from "deck.gl/typed";

// 24 fps
const ANIMATION_INTERVAL = 1000 / 24;

interface AirportMapProps {
  allAirports: Airport[];
  initialViewState: MapViewState;
  onClickOnAirport: (airport: Airport) => void;
  conversionAirports?: {
    from: Airport | undefined;
    to: Airport | undefined;
  };
}

const AirportMap = ({
  allAirports,
  initialViewState,
  onClickOnAirport,
  conversionAirports,
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
      onClickOnAirport(object as Airport);
    }
  };

  const displayedAirports =
    conversionAirports?.from && conversionAirports?.to
      ? [conversionAirports?.from, conversionAirports?.to].filter(
          (airport) => airport !== undefined,
        )
      : allAirports;

  const iconLayer = iconLayerFromAirports({
    airports: displayedAirports,
    timeInMs: animationTime,
    onClick: layerOnCLick,
  });

  const textLayer = textLayerFromAirports({
    airports: displayedAirports,
    onClick: layerOnCLick,
  });

  const conversionArcLayer = arcLayerFromAirports({
    fromAirport: conversionAirports?.from,
    toAirport: conversionAirports?.to,
    timeInMs: animationTime,
  });
  const bitmap = new BitmapLayer({
    id: "WORLD_MAP",
    bounds: [-180, -90, 180, 90],
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Blue_Marble_Next_Generation_%2B_topography_%2B_bathymetry.jpg/800px-Blue_Marble_Next_Generation_%2B_topography_%2B_bathymetry.jpg?20191118154255",
    // "https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg",
  });
  const tileLayer = new TileLayer({
    data: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,

    renderSubLayers: (props) => {
      const {
        bbox: { west, south, east, north },
      } = props.tile;

      return new BitmapLayer(props, {
        data: undefined,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        image: props.data,
        desaturate: 1,
        tintColor: [200, 200, 10],

        _imageCoordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        bounds: [west, south, east, north],
      });
    },
  });

  const layers = [
    // bitmap,
    textLayer,
    iconLayer,
    conversionArcLayer,
    tileLayer,
  ].filter((layer) => layer);

  const view = new GlobeView({ id: "globe" });

  return (
    <div>
      {initialAirport && (
        <div className="overflow-hidden">
          <DeckGL
            effects={[]}
            initialViewState={initialViewState}
            controller={true}
            layers={layers}
            views={[view]}
            // getTooltip={getTooltip}
            onViewStateChange={({ viewState }) => {
              setLatestViewState(viewState as MapViewState);
            }}
            getCursor={({ isDragging, isHovering }) => {
              // http://www.rw-designer.com/cursor-set/win-95-98#google_vignette
              // const grabbingCursor = "url(cursors/Cursor_10.png), auto";
              // const pointerCursor = "url(cursors/Cursor_15.png), auto";
              // const defaultCursor = "url(cursors/arrow.png), auto";
              // return isDragging
              //   ? grabbingCursor
              //   : isHovering
              //     ? pointerCursor
              //     : defaultCursor;
              return isDragging
                ? "grabbing"
                : isHovering
                  ? "pointer"
                  : "default";
            }}
          >
            {/* <Map
              mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
              mapStyle={mapboxStyles.latest}
              projection={"globe"}
            ></Map> */}
          </DeckGL>
        </div>
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
