import { allAirports, airportOfTheDay } from "@/data/airport-data";
import MapManager from "@/app/_components/MapManager";

const sortedAirports = allAirports
  .filter((airport) => !airport.filetypeUncommon)
  .sort((a, b) => a.iata_code.localeCompare(b.iata_code));

export default function App() {
  return (
    <main className="flex h-dvh w-screen flex-col items-center justify-center overflow-hidden bg-retro-blue">
      <MapManager
        allAirports={sortedAirports}
        airportOfTheDay={airportOfTheDay}
      />
    </main>
  );
}
