"use client";

import { env } from "@/env";
import React, { useState, useEffect } from "react";

// Mapbox
import Map from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { mapboxStyles } from "@/utils/mapbox";
import { NavigationControl } from "react-map-gl";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";

// DeckGL
import type { PickingInfo } from "@deck.gl/core/typed";

import DeckGL from "@deck.gl/react/typed";

// Config
import { lightingEffect, material, colorRange } from "@/lib/map-config";
import { textLayerFromAirports, iconLayerFromAirports } from "@/lib/map-layers";

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

  const [lastClickedAirport, setLastClickedAirport] = useState<Airport | null>(
    null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      setIsDrawerOpen(true);
      setLastClickedAirport(object as Airport);
    }
  };

  const textLayer = textLayerFromAirports({
    airports: allAirports,
    onClick: layerOnCLick,
  });

  const iconLayer = iconLayerFromAirports({
    airports: allAirports,
    timeInMs: animationTime,
    onClick: layerOnCLick,
  });

  const layers = [textLayer, iconLayer];

  return (
    <div>
      {initialAirport && (
        <div>
          <DeckGL
            effects={[]}
            initialViewState={initialViewState}
            controller={true}
            layers={layers}
            // getTooltip={getTooltip}
            onViewStateChange={({ viewState }) => {
              setLatestViewState(viewState as MapViewState);
            }}
          >
            <Map
              mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
              mapStyle={mapboxStyles.latest}
            ></Map>
          </DeckGL>
          <Drawer
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onOpenChange={setIsDrawerOpen}
            modal={false}
            preventScrollRestoration={true}
            dismissible={true}
          >
            {lastClickedAirport && (
              <DrawerContent className=" font-bitmap mx-auto max-w-2xl">
                <DrawerHeader>
                  <DrawerTitle className="text-center text-3xl md:text-5xl">
                    {lastClickedAirport.iata_code}
                  </DrawerTitle>
                  <DrawerDescription
                    className="scrollbar-thin scrollbar-thumb-retro-blue scrollbar-track-gray-200
                   bor text-md max-h-[10rem] overflow-y-scroll 
                   border-2 border-retro-cyan bg-white px-2 py-2 leading-tight text-black shadow-inner md:max-h-none md:text-xl"
                  >
                    <div className="grid grid-cols-8 gap-2 text-left">
                      <div className="col-span-3">Airport</div>
                      <div className="col-span-5 ">
                        <div className="font-semibold">
                          {lastClickedAirport?.name} (
                          {lastClickedAirport?.iso_country})
                        </div>
                        <div>{lastClickedAirport.type}</div>
                      </div>

                      {/* divider here */}
                      <div className="col-span-8">
                        <hr className="-mx-2 border-t-2 border-retro-gray" />
                      </div>
                      <div className="col-span-3">Filetype</div>
                      <div className="col-span-5">
                        {lastClickedAirport?.filetypes.map((filetype, i) => {
                          return (
                            <div key={i}>
                              <div className="font-semibold">
                                {filetype.description}
                              </div>
                              <div>{filetype.used_by}</div>
                              {i < lastClickedAirport.filetypes.length - 1 ? (
                                <hr className="-mx-2 my-1 border-t-2 border-retro-gray" />
                              ) : (
                                ""
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </DrawerDescription>
                </DrawerHeader>
                {/* <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter> */}
              </DrawerContent>
            )}
          </Drawer>
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
