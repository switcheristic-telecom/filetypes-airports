"use client";

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

import type { Airport } from "@/utils/airport";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { AirportCombobox } from "./AirportCombobox";

import Image from "next/image";

interface AirportDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  allAirports: Airport[];
  lastClickedAirport: Airport | undefined;
  featuredAirport: Airport | undefined;
  convertedTo: Airport | undefined;
  setConvertedTo: (convertedTo: Airport | undefined) => void;
}

const AirportDrawer = ({
  allAirports,
  open,
  setOpen,
  lastClickedAirport,
  featuredAirport,
  convertedTo,
  setConvertedTo,
}: AirportDrawerProps) => {
  const { isMd } = useBreakpoint("md");

  const isFeatured =
    lastClickedAirport &&
    featuredAirport &&
    lastClickedAirport.iata_code === featuredAirport.iata_code;

  return (
    <Drawer
      open={open}
      onClose={() => {
        setOpen(false);
        setConvertedTo(undefined);
      }}
      onOpenChange={setOpen}
      modal={false}
      preventScrollRestoration={true}
      dismissible={true}
      direction={isMd ? "right" : "bottom"}
    >
      {lastClickedAirport && (
        <DrawerContent className=" mx-auto max-w-2xl font-bitmap md:ml-auto md:mr-0">
          <DrawerHeader>
            <DrawerTitle className="relative text-center text-3xl md:text-5xl">
              {isFeatured && <FeaturedTag />}
              {lastClickedAirport.iata_code}
            </DrawerTitle>
            <DrawerDescription
              className="bor text-md max-h-[10rem]
                 min-h-0 overflow-y-scroll overscroll-none  border-2 border-retro-cyan bg-white
                 px-2 py-2 leading-tight text-black shadow-inner scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-retro-blue md:max-h-[35vh] md:min-h-[14rem] md:text-xl"
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

                {/* Divider - Airport / Filetype */}
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
          <DrawerFooter className="-mt-6 ">
            {/* <div className="text-xl">Free File Converter</div> */}
            <div className="flex flex-row gap-2 text-sm md:text-xl">
              <div className="my-auto whitespace-nowrap">Convert to</div>
              <Select
                onValueChange={(iataCode) => {
                  const airport = allAirports.find(
                    (a) => a.iata_code === iataCode,
                  );
                  setConvertedTo(airport);
                }}
              >
                <SelectTrigger className="w-full rounded-none border-2 border-retro-cyan bg-white text-sm md:text-xl">
                  <SelectValue
                    placeholder={convertedTo?.iata_code ?? "Select..."}
                  />
                </SelectTrigger>
                <SelectContent className="border-2 border-retro-cyan bg-neutral-200 shadow-sm">
                  {allAirports.map((airport) => {
                    return (
                      <SelectItem
                        key={airport.iata_code}
                        value={airport.iata_code}
                        className="font-bitmap text-sm md:text-xl"
                      >
                        {airport.iata_code}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {/* Combobox popover has double scrolling issues on mobile */}
              {/* <AirportCombobox
                className="w-full text-xl"
                airports={allAirports}
                value={convertedTo}
                setValue={setConvertedTo}
              ></AirportCombobox> */}

              <Button
                className="text-sm md:text-xl"
                disabled={convertedTo === undefined}
                onClick={() => {
                  //  open a new tab with the google flight search
                  window.open(
                    composeGoogleFlightUrl(
                      lastClickedAirport.iata_code,
                      convertedTo?.iata_code ?? "",
                    ),
                    "_blank",
                  );
                }}
              >
                Convert
              </Button>
            </div>
            {/* <DrawerClose>
              <Button variant="outline">
                Close
              </Button>
            </DrawerClose> */}
          </DrawerFooter>
        </DrawerContent>
      )}
    </Drawer>
  );
};

export default AirportDrawer;

function composeGoogleFlightUrl(from: string, to: string) {
  // https://www.google.com/travel/flights?q=Flights%20to%20SFO%20from%20FRA%20on%202023-09-13%20through%202023-09-17%20with%20one%20adult%20business%20class&curr=USD
  const params = new URLSearchParams({
    q: `Flights to ${to} from ${from}`,
    // curr: "USD",
  });
  return `https://www.google.com/travel/flights?${params.toString()}`;
}

function FeaturedTag() {
  return (
    <div className="group absolute right-0 top-0 mx-2 inline-block h-full">
      <Image
        width={32}
        height={32}
        src={"/assets/gifs/explode.gif"}
        alt="featured"
        className="my-auto inline h-8 w-8 -translate-y-4  scale-[500%] transition-transform duration-500 ease-in-out group-hover:-translate-y-6 group-hover:scale-[1000%]"
      />
      <div className=" absolute left-0 top-0 flex h-full w-full -rotate-12 items-center justify-center text-lg font-light leading-none">
        featured <br /> today
      </div>
    </div>
  );
}
