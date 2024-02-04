'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import LocationAggregatorMap from '../components/Map';

import type { Airport } from '@/data/data';
export default function Home() {
  let [allAirportsData, setAllAirportsData] = useState<Airport[]>([]);
  let [airportOfTheDayData, setAirportOfTheDayData] = useState<Airport | null>(
    null
  );

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/airports');
      const { allAirports, airportOfTheDay } = await res.json();
      setAllAirportsData(allAirports);
      setAirportOfTheDayData(airportOfTheDay);
    })();
  }, []);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <LocationAggregatorMap
        allAirportsData={allAirportsData}
        airportOfTheDayData={airportOfTheDayData}
      />
    </main>
  );
}
