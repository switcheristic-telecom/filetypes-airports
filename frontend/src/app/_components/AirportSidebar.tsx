import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useState } from "react";

import type { Airport } from "@/utils/airport";
import { getThumbnailSpriteCSS } from "@/utils/thumbnail";
import ThumbnailSprite from "./ThumbnailSprite";

interface AirportSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  airports: Airport[];
  onClickOnAirport: (airport: Airport) => void;
  selectedAirport?: Airport;

  open: boolean;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
}

export function AirportSidebar({
  className,
  airports,
  onClickOnAirport,
  selectedAirport,
  open,
  onClose,
  onOpenChange,
}: AirportSidebarProps) {
  return (
    <div
      className={cn(
        "w-screen md:w-96",
        "border-b-4 border-r-4",
        "font-bitmap",
        "border-b-gray-500 border-l-gray-100 border-r-retro-cyan border-t-gray-300",
        className,
        open ? "translate-x-0" : "-translate-x-full",
        "transition-transform duration-300 ease-in-out",
      )}
    >
      {true && (
        <div className={cn("flex h-full flex-col gap-2  bg-retro-gray py-4")}>
          <div className="flex flex-row justify-between px-4">
            <h2 className=" text-2xl font-semibold tracking-tight ">
              Filetypes / Airports
            </h2>
            <Button className="" onClick={onClose}>
              {"<"}
            </Button>
          </div>
          <div className="mx-2 h-full overflow-y-scroll border-2 border-retro-cyan bg-white  scrollbar-thin scrollbar-track-gray-200  scrollbar-thumb-retro-blue">
            <div className="grid grid-cols-4 gap-1 p-2">
              {airports?.map((airport, i) => (
                <Button
                  key={`${airport.iata_code}-${i}`}
                  variant={
                    selectedAirport?.iata_code === airport.iata_code
                      ? "secondary"
                      : "default"
                  }
                  className="flex flex-row gap-0 px-0 text-xl"
                  onClick={() => onClickOnAirport(airport)}
                >
                  <ThumbnailSprite
                    className="-mx-2"
                    airport={airport}
                    pixelSize={16}
                  />
                  <div className="mx-2">{airport.iata_code}</div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
