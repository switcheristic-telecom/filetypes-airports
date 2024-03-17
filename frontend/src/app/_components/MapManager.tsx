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
import AirportDrawer from "./AirportDrawer";

import { arcLayerFromAirports } from "@/lib/map-layers";

interface MapManagerProps {
  allAirports: Airport[];
}

const MapManager = ({ allAirports }: MapManagerProps) => {
  const { data: airportOfTheDay } = api.airport.getAirportOfTheDay.useQuery();

  const [initialViewState, setInitialViewState] = useState(INITIAL_VIEW_STATE);

  const [lastClickedAirport, setLastClickedAirport] = useState<
    Airport | undefined
  >(undefined);

  const [convertedTo, setConvertedTo] = useState<Airport | undefined>(
    undefined,
  );

  const converstionArcLayer = arcLayerFromAirports({
    fromAirport: lastClickedAirport,
    toAirport: convertedTo,
    timeInMs: 0,
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (convertedTo && lastClickedAirport) {
      flyToAirportCenter({
        fromAirport: lastClickedAirport,
        toAirport: convertedTo,
      });
    }
  }, [convertedTo]);

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
    },
    [setInitialViewState],
  );

  const onClickOnAirport = useCallback(
    (airport: Airport) => {
      flyToAirport(airport);
      setIsDrawerOpen(true);
      setLastClickedAirport(airport);
    },
    [flyToAirport, setIsDrawerOpen, setLastClickedAirport],
  );

  useEffect(() => {
    if (airportOfTheDay) {
      setInitialViewState({
        ...INITIAL_VIEW_STATE,
        latitude: airportOfTheDay.latitude,
        longitude: airportOfTheDay.longitude,
      });

      setLastClickedAirport(airportOfTheDay);
      setIsDrawerOpen(true);
    }
  }, [airportOfTheDay]);

  // useEffect(() => {
  //   console.log("initialViewState", initialViewState);
  // }, [initialViewState]);

  return (
    <>
      {airportOfTheDay && (
        <AirportMarquee
          featuredAirport={airportOfTheDay}
          onClickOnAirport={onClickOnAirport}
        />
      )}
      <AirportMap
        allAirports={allAirports}
        initialViewState={initialViewState}
        onClickOnAirport={onClickOnAirport}
        conversionAirports={{
          from: lastClickedAirport,
          to: convertedTo,
        }}
      />

      <AirportDrawer
        open={isDrawerOpen}
        setOpen={setIsDrawerOpen}
        allAirports={allAirports}
        featuredAirport={airportOfTheDay}
        lastClickedAirport={lastClickedAirport}
        convertedTo={convertedTo}
        setConvertedTo={setConvertedTo}
      ></AirportDrawer>
    </>
  );
};

export default MapManager;
