import { unstable_noStore as noStore } from "next/cache";

import { api } from "@/trpc/server";
import MapManager from "./_components/MapManager";

export default async function Home() {
  noStore();
  const airportConcise = await api.airport.getAllConcise.query();

  return (
    <main className="bg-retro-blue flex min-h-screen flex-col items-center  justify-center">
      <MapManager allAirports={airportConcise}></MapManager>
    </main>
  );
}
