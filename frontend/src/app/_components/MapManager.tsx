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

import type { Airport, AirportVerbose } from "@/utils/airport";

import { INITIAL_VIEW_STATE, MapViewState } from "@/lib/map-config";
import { FlyToInterpolator } from "deck.gl/typed";

// TRPC
import { api } from "@/trpc/react";

// Child Components
import AirportMarquee from "@/app/_components/AirportMarquee";
import AirportMap from "@/app/_components/AirportMap";
import AirportDrawer from "./AirportDrawer";
import { AirportSidebar } from "@/app/_components/AirportSidebar";
import WebsiteMarquee from "./WebsiteMarquee";
import AirportLEDMarquee from "./AirportLEDMarquee";
import Image from "next/image";

interface MapManagerProps {
  allAirports: Airport[];
  showUI?: boolean;
}

const MapManager = ({ allAirports, showUI = true }: MapManagerProps) => {
  /** Load the airport of the day */
  const { data: airportOfTheDay } = api.airport.getAirportOfTheDay.useQuery();

  /** Breakpoint and mobile detection */
  const { isMd } = useBreakpoint("md");
  const isMobile = !isMd;

  /** Initial view state */
  const [initialViewState, setInitialViewState] = useState(INITIAL_VIEW_STATE);
  const [latestViewState, setLatestViewState] = useState(initialViewState);

  const LATITUDE_OFFSET = isMobile ? -0.5 : -0.55;

  // useEffect(() => {
  //   console.log("latestViewState", latestViewState);
  // }, [latestViewState]);

  /** Set different initial view state based on the breakpoint */
  useEffect(() => {
    setInitialViewState((prev) => ({
      ...prev,
      minZoom: isMobile
        ? INITIAL_VIEW_STATE.mobileMinZoom
        : INITIAL_VIEW_STATE.minZoom,
    }));
  }, [isMobile]);

  /** Fly to the airport of the day when it's loaded */
  useEffect(() => {
    const INITIAL_ZOOM = isMobile ? 3.5 : 4.5;
    if (airportOfTheDay) {
      setInitialViewState({
        ...INITIAL_VIEW_STATE,
        minZoom: isMobile
          ? INITIAL_VIEW_STATE.mobileMinZoom
          : INITIAL_VIEW_STATE.minZoom,
        zoom: INITIAL_ZOOM,
        latitude: airportOfTheDay.latitude + LATITUDE_OFFSET,
        longitude: airportOfTheDay.longitude,
      });

      setLastSelectedAirport(airportOfTheDay);
      setIsDrawerOpen(true);
    }
  }, [LATITUDE_OFFSET, airportOfTheDay, isMobile]);

  /***************************************************************************
   *  State for the airport selection drawer
   ***************************************************************************/
  /** Last selected airport */
  const [lastSelectedAirport, setLastSelectedAirport] = useState<
    Airport | undefined
  >(undefined);

  /** Destination airport for conversion */
  const [destinationAirport, setDestinationAirport] = useState<
    Airport | undefined
  >(undefined);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  /***************************************************************************
   * Fly to the center of the two airports, to show the conversion arc
   ***************************************************************************/
  const flyToAirportCenter = useCallback(
    ({
      fromAirport,
      toAirport,
    }: {
      fromAirport: Airport;
      toAirport: Airport;
    }) => {
      const distance = Math.sqrt(
        (toAirport.latitude - fromAirport.latitude) ** 2 +
          (toAirport.longitude - fromAirport.longitude) ** 2,
      );

      const zoomLevel = Math.log2(360 / distance) - 1;

      const midPoint = {
        latitude:
          fromAirport.latitude +
          (toAirport.latitude - fromAirport.latitude) / 2,
        longitude:
          fromAirport.longitude +
          (toAirport.longitude - fromAirport.longitude) / 2,
      };
      setInitialViewState((prev) => ({
        ...prev,
        latitude: midPoint.latitude,
        longitude: midPoint.longitude,
        zoom: zoomLevel,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator(),
        numberOfMutations: prev.numberOfMutations + 1,
      }));
    },
    [setInitialViewState],
  );

  /** Fly to the airport center when the destination airport is set */
  useEffect(() => {
    if (destinationAirport && lastSelectedAirport && !isMobile) {
      flyToAirportCenter({
        fromAirport: lastSelectedAirport,
        toAirport: destinationAirport,
      });
    }
  }, [destinationAirport, flyToAirportCenter, isMobile, lastSelectedAirport]);

  /***************************************************************************
   * Fly to the selected airport
   ***************************************************************************/
  const flyToAirport = useCallback(
    (airport: Airport, conditional = true) => {
      const distanceBetweenCenterAndSelected = Math.sqrt(
        (airport.latitude - latestViewState.latitude) ** 2 +
          (airport.longitude - latestViewState.longitude) ** 2,
      );
      const MOBILE_FAR_THRESHOLD = 2;
      const DESKTOP_FAR_THRESHOLD = 8;
      const farThreshold = isMobile
        ? MOBILE_FAR_THRESHOLD
        : DESKTOP_FAR_THRESHOLD;
      const isFar = distanceBetweenCenterAndSelected > farThreshold;

      const isTooZoomedOut = latestViewState.zoom < 4.5;

      // Only fly to the airport if it's far or the map is too zoomed out
      if (isFar || isTooZoomedOut || !conditional) {
        // Only zoom in if the map is too zoomed out now
        const DEFAULT_ZOOM = isMobile ? 4 : 6;

        const newZoom = isTooZoomedOut ? DEFAULT_ZOOM : latestViewState.zoom;

        setInitialViewState((prev) => ({
          ...prev,
          latitude: airport.latitude + LATITUDE_OFFSET,
          longitude: airport.longitude,
          zoom: newZoom,
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator(),
          numberOfMutations: prev.numberOfMutations + 1,
        }));
      }
    },
    [
      LATITUDE_OFFSET,
      isMobile,
      latestViewState.latitude,
      latestViewState.longitude,
      latestViewState.zoom,
    ],
  );

  /***************************************************************************
   * When an airport is clicked, fly to it and open the drawer
   ***************************************************************************/
  const onClickOnAirport = useCallback(
    (airport: Airport) => {
      flyToAirport(airport);
      setIsDrawerOpen(true);
      // make sure the drawer will definitely open
      setTimeout(() => {
        setIsDrawerOpen(true);
      }, 800);
      setLastSelectedAirport(airport);
    },
    [flyToAirport, setIsDrawerOpen, setLastSelectedAirport],
  );

  const onClickOnAirportInSidebar = useCallback(
    (airport: Airport) => {
      flyToAirport(airport, false);
      setTimeout(() => {
        setIsDrawerOpen(true);
      }, 800);

      setLastSelectedAirport(airport);
    },
    [flyToAirport, setLastSelectedAirport, setIsDrawerOpen],
  );

  return (
    <>
      {/* <WebsiteMarquee className="top-8" /> */}
      {airportOfTheDay && showUI && (
        <AirportMarquee
          featuredAirport={
            // (isDrawerOpen ? lastSelectedAirport : airportOfTheDay) ??
            airportOfTheDay
          }
          // customTitle={
          //   lastSelectedAirport?.iata_code !== airportOfTheDay.iata_code
          //     ? "Selected Airport"
          //     : undefined
          // }
          onClickOnAirport={onClickOnAirport}
        />
      )}

      {/* The main DeckGL map */}
      {airportOfTheDay && showUI && (
        <>
          <Button
            className="margin-8 absolute left-0 top-8 z-[5] m-4"
            onClick={() => {
              setIsSidebarOpen(true);
              setIsDrawerOpen(false);
            }}
          >
            {">"}
          </Button>
          <AirportSidebar
            className="absolute left-0 top-0 z-10 h-dvh pt-8"
            airports={allAirports}
            selectedAirport={lastSelectedAirport}
            onClickOnAirport={(a) => {
              onClickOnAirportInSidebar(a);
              if (isMobile) {
                setIsSidebarOpen(false);
              }
            }}
            open={isSidebarOpen}
            onOpenChange={setIsSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          ></AirportSidebar>
        </>
      )}
      <AirportMap
        allAirports={allAirports}
        initialViewState={initialViewState}
        latestViewState={latestViewState}
        setLatestViewState={setLatestViewState}
        onClickOnAirport={onClickOnAirport}
        conversionAirports={{
          from: lastSelectedAirport,
          to: destinationAirport,
        }}
      />

      {/* Switcheristic Telecom logo */}
      <a
        href="https://swtch.tel"
        target="_blank"
        rel="noreferrer"
        className="cursor-pointer"
      >
        <Image
          src="/logo/switcheristic-telecom-large.svg"
          alt="Switcheristic Telecommunications"
          width={160}
          height={200}
          className="fixed bottom-0 left-0 z-50 m-4 invert transition-all hover:invert-0"
        ></Image>
      </a>

      {/* Drawer card to show the selected airport details */}
      {showUI && (
        <AirportDrawer
          open={isDrawerOpen}
          setOpen={setIsDrawerOpen}
          allAirports={allAirports}
          featuredAirport={airportOfTheDay}
          selectedAirport={lastSelectedAirport as AirportVerbose}
          convertedTo={destinationAirport as AirportVerbose}
          setConvertedTo={setDestinationAirport}
        ></AirportDrawer>
      )}
    </>
  );
};

export default MapManager;
