import React, { useCallback } from "react";
import type { Airport } from "@/utils/airport";
import type { MapViewState } from "@/lib/map-config";

interface AirportMarqueeProps {
  featuredAirport: Airport;
  flyToAirport: (airport: Airport) => void;
}

const AirportMarquee = ({
  featuredAirport,
  flyToAirport,
}: AirportMarqueeProps) => {
  return (
    <div
      className="font-bitmap absolute top-0 z-10 w-screen cursor-pointer"
      onClick={() => flyToAirport(featuredAirport)}
    >
      <>
        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap bg-black text-white">
            <ContentSpans featuredAirport={featuredAirport} />
            <ContentSpans featuredAirport={featuredAirport} />
          </div>

          <div className="absolute top-0 z-10 animate-marquee2 whitespace-nowrap bg-black text-white">
            <ContentSpans featuredAirport={featuredAirport} />
            <ContentSpans featuredAirport={featuredAirport} />
          </div>
        </div>
      </>
    </div>
  );
};

function ContentSpans({ featuredAirport }: { featuredAirport: Airport }) {
  const fileTypes = featuredAirport.filetypes;
  const fileTypeSpans = fileTypes.map((fileType, i) => (
    <span
      key={"filetype-" + i}
      className="border-r-4 border-r-black bg-retro-blue px-4 text-2xl font-extralight text-white"
    >
      {fileType.description?.toLowerCase()}
    </span>
  ));

  return (
    <>
      <span className="bg-black px-4 text-2xl font-light text-white">
        Airport / Filetype of the Day
      </span>
      <span className=" border-r-4 border-r-black bg-white px-4 text-2xl text-black ">
        {featuredAirport?.iata_code}
      </span>

      <span className="border-r-black  bg-retro-cyan px-4 text-2xl font-light text-black">
        {featuredAirport?.name}
      </span>
      <span className="border-r-black  bg-black px-4 text-2xl font-light text-white">
        /
      </span>
      {fileTypeSpans}
    </>
  );
}

export default AirportMarquee;
