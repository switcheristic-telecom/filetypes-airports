import { AIRPORT_CODES_WITH_FILETYPES, airportOfTheDay } from '@/data/data';

export async function GET(request: Request) {
  return Response.json({
    allAirports: AIRPORT_CODES_WITH_FILETYPES,
    airportOfTheDay,
  });
}
