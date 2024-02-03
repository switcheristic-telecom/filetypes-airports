'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import LocationAggregatorMap from '../components/Map';

import type { Airport } from '@/data/data';
export default function Home() {
  let [data, setData] = useState<Airport[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/airports');
      const { data } = await res.json();
      setData(data);
    })();
  }, []);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <LocationAggregatorMap data={data} />
    </main>
  );
}
