import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

import AirportMarquee from "@/app/_components/AirportMarquee";
import AirportMap from "@/app/_components/AirportMap";
import { api } from "@/trpc/server";

export default async function Home() {
  noStore();
  // const hello = await api
  const airportConcise = await api.airport.getAllConcise.query();

  return (
    <main className="bg-retro-blue flex min-h-screen flex-col items-center  justify-center">
      <AirportMarquee />
      <AirportMap allAirports={airportConcise} />
    </main>
  );
}
