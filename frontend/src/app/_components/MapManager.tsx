import React, { useEffect, useState, useCallback } from "react";

import { Button } from "@/components/ui/button";

import { useBreakpoint } from "@/hooks/useBreakpoint";

import type { Airport, AirportVerbose } from "@/utils/airport";

import { INITIAL_VIEW_STATE, MapViewState } from "@/lib/map-config";
import { FlyToInterpolator } from "deck.gl/typed";

// Child Components
import AirportMarquee from "@/app/_components/AirportMarquee";
import AirportMap from "@/app/_components/AirportMap";
import AirportDrawer from "./AirportDrawer";
import { AirportSidebar } from "@/app/_components/AirportSidebar";

interface MapManagerProps {
  allAirports: Airport[];
  airportOfTheDay: Airport;
  showUI?: boolean;
}

const MapManager = ({ allAirports, airportOfTheDay, showUI = true }: MapManagerProps) => {

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

      if (isDrawerOpen && lastSelectedAirport?.iata_code !== airport.iata_code) {
        // Quick retract-and-expand to signify content change
        setIsDrawerOpen(false);
        setTimeout(() => {
          setLastSelectedAirport(airport);
          setIsDrawerOpen(true);
        }, 150);
      } else {
        setLastSelectedAirport(airport);
        setIsDrawerOpen(true);
      }
    },
    [flyToAirport, isDrawerOpen, lastSelectedAirport],
  );

  const onClickOnAirportInSidebar = useCallback(
    (airport: Airport) => {
      flyToAirport(airport, false);

      if (isDrawerOpen && lastSelectedAirport?.iata_code !== airport.iata_code) {
        setIsDrawerOpen(false);
        setTimeout(() => {
          setLastSelectedAirport(airport);
          setIsDrawerOpen(true);
        }, 150);
      } else {
        setLastSelectedAirport(airport);
        setTimeout(() => {
          setIsDrawerOpen(true);
        }, 800);
      }
    },
    [flyToAirport, isDrawerOpen, lastSelectedAirport],
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
        onDragStart={() => setIsDrawerOpen(false)}
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
        className="fixed bottom-6 left-0 z-[5] flex cursor-pointer"
      >
        <img
          src="/logo/switcheristic-telecom-main.svg"
          alt="Switcheristic Telecommunications"
          width={80}
          height={156}
          className="m-4 mr-auto block h-12 invert transition-all hover:invert-0 md:hidden"
        />
        <img
          src="/logo/switcheristic-telecom-large.svg"
          alt="Switcheristic Telecommunications"
          width={290}
          height={78}
          className="m-4 mr-auto hidden h-16 invert transition-all hover:invert-0 md:block"
        />
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
