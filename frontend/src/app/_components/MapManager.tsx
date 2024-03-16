"use client";

import { env } from "@/env";
import React, { useEffect, useState, useCallback } from "react";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

import { useBreakpoint } from "@/hooks/useBreakpoint";

import type { Airport } from "@/utils/airport";

import { INITIAL_VIEW_STATE } from "@/lib/map-config";
import { FlyToInterpolator } from "deck.gl/typed";

// TRPC
import { api } from "@/trpc/react";

// Child Components
import AirportMarquee from "@/app/_components/AirportMarquee";
import AirportMap from "@/app/_components/AirportMap";
import Link from "next/link";

interface MapManagerProps {
  allAirports: Airport[];
}

const MapManager = ({ allAirports }: MapManagerProps) => {
  const { data: airportOfTheDay } = api.airport.getAirportOfTheDay.useQuery();

  const [initialViewState, setInitialViewState] = useState(INITIAL_VIEW_STATE);

  const [lastClickedAirport, setLastClickedAirport] = useState<Airport | null>(
    null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isMd } = useBreakpoint("md");

  const [convertedTo, setConvertedTo] = useState<string | undefined>(
    allAirports[0]?.iata_code,
  );

  const flyToAirport = useCallback(
    (airport: Airport) => {
      setInitialViewState((prev) => ({
        ...prev,
        latitude: airport.latitude,
        longitude: airport.longitude,
        // zoom: 14,
        zoom: 7,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator(),
        numberOfMutations: prev.numberOfMutations + 1,
      }));
      setIsDrawerOpen(true);
      setLastClickedAirport(airport);
    },
    [setInitialViewState, setIsDrawerOpen, setLastClickedAirport],
  );

  useEffect(() => {
    if (airportOfTheDay) {
      setInitialViewState({
        ...INITIAL_VIEW_STATE,
        latitude: airportOfTheDay.latitude,
        longitude: airportOfTheDay.longitude,
      });
    }
  }, [airportOfTheDay]);

  useEffect(() => {
    console.log("initialViewState", initialViewState);
  }, [initialViewState]);

  return (
    <>
      {airportOfTheDay && (
        <AirportMarquee
          featuredAirport={airportOfTheDay}
          flyToAirport={flyToAirport}
        />
      )}
      <AirportMap
        allAirports={allAirports}
        initialViewState={initialViewState}
        flyToAirport={flyToAirport}
      />

      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenChange={setIsDrawerOpen}
        modal={false}
        preventScrollRestoration={true}
        dismissible={true}
        direction={isMd ? "right" : "bottom"}
      >
        {lastClickedAirport && (
          <DrawerContent className=" font-bitmap mx-auto max-w-2xl md:ml-auto md:mr-0">
            <DrawerHeader>
              <DrawerTitle className="text-center text-3xl md:text-5xl">
                {lastClickedAirport.iata_code}
              </DrawerTitle>
              <DrawerDescription
                className="scrollbar-thin scrollbar-thumb-retro-blue scrollbar-track-gray-200
                   bor text-md max-h-[10rem]  min-h-0 overflow-y-scroll overscroll-none
                   border-2 border-retro-cyan bg-white px-2 py-2 leading-tight text-black shadow-inner md:max-h-[35vh] md:min-h-[14rem] md:text-xl"
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
                          {filetype.used_by && (
                            <div>Used by {filetype.used_by}</div>
                          )}
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
            <DrawerFooter>
              {/* <div className="text-xl">Free File Converter</div> */}
              <div className="flex flex-row gap-2 text-xl">
                <div className="my-auto whitespace-nowrap">Convert to</div>
                <Select onValueChange={setConvertedTo}>
                  <SelectTrigger className="w-full bg-white text-xl">
                    <SelectValue placeholder={convertedTo} />
                  </SelectTrigger>
                  <SelectContent className=" ">
                    {allAirports.map((airport) => {
                      return (
                        <SelectItem
                          key={airport.iata_code}
                          value={airport.iata_code}
                        >
                          {airport.iata_code}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Link
                  className=""
                  target="_blank"
                  href={composeGoogleFlightUrl(
                    lastClickedAirport.iata_code,
                    convertedTo ?? "",
                  )}
                >
                  <Button className="text-xl">Convert</Button>
                </Link>
              </div>
              {/* <DrawerClose>
                <Button variant="outline">
                  <Link
                    target="_blank"
                    href={composeGoogleFlightUrl(
                      "SFO",
                      lastClickedAirport.iata_code,
                    )}
                  >
                    buy
                  </Link>
                </Button>
              </DrawerClose> */}
            </DrawerFooter>
          </DrawerContent>
        )}
      </Drawer>
    </>
  );
};

export default MapManager;

function composeGoogleFlightUrl(from: string, to: string) {
  // https://www.google.com/travel/flights?q=Flights%20to%20SFO%20from%20FRA%20on%202023-09-13%20through%202023-09-17%20with%20one%20adult%20business%20class&curr=USD
  const params = new URLSearchParams({
    q: `Flights to ${to} from ${from}`,
    // curr: "USD",
  });
  return `https://www.google.com/travel/flights?${params.toString()}`;
}
