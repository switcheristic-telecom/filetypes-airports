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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ThumbnailSprite from "./ThumbnailSprite";
import { Button } from "@/components/ui/button";

import type { Airport, AirportVerbose } from "@/utils/airport";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { AirportCombobox } from "./AirportCombobox";

import Image from "next/image";

interface AirportDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  allAirports: Airport[];
  selectedAirport: AirportVerbose | undefined;
  featuredAirport: Airport | undefined;
  convertedTo: AirportVerbose | undefined;
  setConvertedTo: (convertedTo: Airport | undefined) => void;
}

const AirportDrawer = ({
  allAirports,
  open,
  setOpen,
  selectedAirport,
  featuredAirport,
  convertedTo,
  setConvertedTo,
}: AirportDrawerProps) => {
  const { isMd } = useBreakpoint("md");
  const isMobile = !isMd;

  const isFeatured =
    selectedAirport &&
    featuredAirport &&
    selectedAirport.iata_code === featuredAirport.iata_code;

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
      direction={isMobile ? "bottom" : "right"}
    >
      {selectedAirport && (
        <DrawerContent className=" mx-auto max-w-xl font-bitmap md:ml-auto md:mr-0">
          <DrawerHeader>
            <DrawerTitle className="relative flex flex-row justify-center gap-0 text-center text-4xl md:text-5xl">
              {isFeatured && <FeaturedTag />}
              <ThumbnailSprite
                className="my-auto"
                airport={selectedAirport}
                pixelSize={isMobile ? 32 : 36}
              />
              <div className="my-auto">{selectedAirport.iata_code}</div>
            </DrawerTitle>
            <DrawerDescription
              className="bor text-md max-h-[10rem]
                 min-h-0 overflow-y-scroll overscroll-none  border-2 border-retro-cyan bg-white
                 px-2 py-2 leading-tight text-black shadow-inner scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-retro-blue md:max-h-[28vh] md:min-h-[12rem] md:text-xl"
            >
              <div className="grid grid-cols-8 gap-2 text-left">
                <div className="col-span-3">Airport</div>
                <div className="col-span-5 ">
                  <div className="font-semibold">{selectedAirport.name}</div>
                  <div className=" text-pretty text-right font-light text-neutral-600">
                    {selectedAirport.municipality !== null &&
                      selectedAirport.municipality !== "" &&
                      selectedAirport.municipality !== "null" &&
                      selectedAirport.municipality !== undefined &&
                      `${selectedAirport.municipality}, `}
                    {selectedAirport.iso_country}
                  </div>
                  {/* <div>{selectedAirport.type}</div> */}
                </div>

                {/* Divider - Airport / Filetype */}
                <div className="col-span-8">
                  <hr className="-mx-2 border-t-2 border-retro-gray" />
                </div>
                <div className="col-span-3">Filetype</div>
                <div className="col-span-5">
                  {selectedAirport?.filetypes.map((filetype, i) => {
                    return (
                      <div key={i}>
                        <p className="text-pretty font-semibold">
                          {filetype.description}
                        </p>
                        {filetype.used_by && (
                          <p className="text-pretty text-right text-neutral-600">
                            Used by {filetype.used_by}
                          </p>
                        )}
                        {i < selectedAirport.filetypes.length - 1 ? (
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
            {/* Airport / Filetype Conversion */}
            {selectedAirport.onGoogleFlights !== true && (
              <div className="flex flex-row gap-2 text-sm md:text-xl">
                <div className="my-auto mr-2 whitespace-nowrap opacity-60">
                  Conversion not available, pick another one...
                </div>
              </div>
            )}
            {selectedAirport.onGoogleFlights === true && (
              <div className="flex flex-row gap-2 text-sm md:text-xl">
                <div className="my-auto mr-2 whitespace-nowrap">Convert to</div>
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
                    {allAirports
                      .filter(
                        (a) =>
                          a.onGoogleFlights === true &&
                          a.iata_code !== selectedAirport.iata_code,
                      )
                      .map((airport) => {
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
                <AlertDialog>
                  <Button
                    className="text-sm md:text-xl"
                    disabled={convertedTo === undefined}
                  >
                    <AlertDialogTrigger disabled={convertedTo === undefined}>
                      Convert
                    </AlertDialogTrigger>
                  </Button>
                  <AlertDialogContent className="rounded-none border-8  border-retro-cyan">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-3xl">
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogTitle className="flex flex-row justify-center  text-3xl sm:justify-normal">
                        <ThumbnailSprite
                          airport={selectedAirport}
                          className="my-auto"
                          pixelSize={32}
                        />
                        <div className="my-auto">{"-->-->-->"}</div>
                        <ThumbnailSprite
                          airport={convertedTo!}
                          pixelSize={32}
                        />
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-xl">
                        You are about to convert from{" "}
                        <span className="text-black">
                          {`${selectedAirport.iata_code} (${selectedAirport.filetypes[0]!.description}${selectedAirport?.filetypes[0]!.used_by ? ` used by ${selectedAirport?.filetypes[0].used_by}` : ""})`}
                        </span>{" "}
                        to{" "}
                        <span className="text-black">
                          {` ${convertedTo?.iata_code} (${convertedTo?.filetypes[0]!.description}${convertedTo?.filetypes[0]!.used_by ? ` used by ${convertedTo?.filetypes[0].used_by}` : ""})`}
                        </span>
                      </AlertDialogDescription>
                      <AlertDialogDescription className="text-xl">
                        This action cannot be undone. This will permanently
                        convert the target to the destination!
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="text-xl">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="text-xl"
                        onClick={() => {
                          //  open a new tab with the google flight search
                          window.open(
                            composeGoogleFlightUrl(
                              selectedAirport,
                              convertedTo,
                            ),
                            "_blank",
                          );
                        }}
                      >
                        Convert
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
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

function composeGoogleFlightUrl(
  from: AirportVerbose | undefined,
  to: AirportVerbose | undefined,
) {
  if (!from || !to) {
    return "";
  }
  // https://www.google.com/travel/flights?q=Flights%20to%20SFO%20from%20FRA%20on%202023-09-13%20through%202023-09-17%20with%20one%20adult%20business%20class&curr=USD
  const params = new URLSearchParams({
    q: `Flights to ${to.iata_code} from ${from.iata_code} oneway`,
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
