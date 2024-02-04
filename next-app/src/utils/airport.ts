const seedrandom = require('seedrandom');

export interface Airport {
  ident: string;
  type: string;
  name: string;
  elevation_ft: number | null;
  continent: string;
  iso_country: string;
  iso_region: string;
  municipality: string | null;
  gps_code: string | null;
  iata_code: string | null;
  local_code: string | null;
  latitude: number;
  longitude: number;
  filetypes: FileType[];
}

export interface FileType {
  extension: string;
  description: string | null;
  used_by: string | null;
}

export const getAirportOfTheDay = (airports: Airport[]): Airport => {
  // today's date as a number
  const today = new Date().toISOString().slice(0, 10).split('-').join('');
  const myrng = new seedrandom(today);

  const airport = airports[Math.floor(myrng() * airports.length)];
  return airport;
};

export const getRandomAirport = (airports: Airport[]): Airport => {
  const airport = airports[Math.floor(Math.random() * airports.length)];
  return airport;
};
