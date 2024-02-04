'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import AirportMap from '@/components/AirportMap';

import type { Airport } from '@/utils/airport';

const AirportOfTheDayMarquee = ({
  featuredAirport,
}: {
  featuredAirport: Airport;
}) => {
  const AirportOfTheDaySpans = () => (
    <>
      <span className='px-4 text-2xl bg-black text-white'>
        Airport of the day
      </span>
      <span className='px-4 text-2xl bg-white text-black border-r-black border-r-4'>
        {featuredAirport?.iata_code}
      </span>
      <span className='px-4 text-2xl bg-white text-black border-r-black border-r-4'>
        {featuredAirport?.name}
      </span>
      <span className='px-4 text-2xl bg-white text-black border-r-black border-r-4'>
        {featuredAirport?.iso_country}
      </span>

      {featuredAirport?.municipality && (
        <span className='px-4 text-2xl bg-white text-black'>
          {featuredAirport?.municipality}
        </span>
      )}
    </>
  );

  return (
    <div className='absolute z-10 w-screen top-0'>
      <div className='relative flex overflow-x-hidden '>
        <div className='animate-marquee whitespace-nowrap bg-black text-white'>
          <AirportOfTheDaySpans />
          <AirportOfTheDaySpans />
        </div>

        <div className='absolute top-0 animate-marquee2 whitespace-nowrap z-10 bg-black text-white'>
          <AirportOfTheDaySpans />
          <AirportOfTheDaySpans />
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  let [allAirportsData, setAllAirportsData] = useState<Airport[]>([]);
  let [airportOfTheDay, setAirportOfTheDay] = useState<Airport | null>(null);
  let [randomAirport, setRandomAirport] = useState<Airport | null>(null);

  let [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/airports');
      const { allAirports, airportOfTheDay, randomAirport } = await res.json();
      setAllAirportsData(allAirports);
      setAirportOfTheDay(airportOfTheDay);
      setRandomAirport(randomAirport);
      setLoading(false);
    })();
  }, []);

  const featuredAirport = airportOfTheDay;

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      {featuredAirport && (
        <AirportOfTheDayMarquee featuredAirport={featuredAirport} />
      )}
      {loading && <div></div>}

      {!loading && (
        <AirportMap
          allAirportsData={allAirportsData}
          initialAirport={featuredAirport}
        />
      )}
    </main>
  );
}
