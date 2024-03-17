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

interface MapManagerProps {
  allAirports: Airport[];
}

const MapManager = ({ allAirports }: MapManagerProps) => {
  const { data: airportOfTheDay } = api.airport.getAirportOfTheDay.useQuery();

  const [initialViewState, setInitialViewState] = useState(INITIAL_VIEW_STATE);

  const [lastClickedAirport, setLastClickedAirport] = useState<
    Airport | undefined
  >(undefined);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

      setLastClickedAirport(airportOfTheDay);
      setIsDrawerOpen(true);
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

      <AirportDrawer
        open={isDrawerOpen}
        setOpen={setIsDrawerOpen}
        allAirports={allAirports}
        lastClickedAirport={lastClickedAirport}
        featuredAirport={airportOfTheDay}
      ></AirportDrawer>
    </>
  );
};

export default MapManager;
