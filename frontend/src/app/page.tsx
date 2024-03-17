import { unstable_noStore as noStore } from "next/cache";

import { api } from "@/trpc/server";
import MapManager from "./_components/MapManager";

export default async function Home() {
  noStore();
  const airportVerbose = await api.airport.getAll.query();

  const sortedAirports = airportVerbose.sort((a, b) => {
    if (a.iata_code < b.iata_code) {
      return -1;
    }
    if (a.iata_code > b.iata_code) {
      return 1;
    }
    return 0;
  });

  const filteredAirports = sortedAirports.filter((airport) => {
    if (airport.filetypeUncommon === true) {
      return false;
    }
    return true;
  });

  return (
    <main className="flex h-dvh w-screen flex-col  items-center justify-center overflow-hidden bg-retro-blue">
      <MapManager allAirports={filteredAirports}></MapManager>
    </main>
  );
}
