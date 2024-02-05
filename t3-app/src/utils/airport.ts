import * as seedrandom from "seedrandom";

export type Airport = AirportVerbose | AirportConcise;

export interface AirportVerbose {
  ident: string;
  type: string;
  name: string;
  elevation_ft: number | null;
  continent: string;
  iso_country: string;
  iso_region: string;
  municipality: string | null;
  gps_code: string | null;
  iata_code: string;
  local_code: string | null;
  latitude: number;
  longitude: number;
  filetypes: FileType[];
}

export interface AirportConcise {
  ident: string;
  iata_code: string;
  type: string;
  name: string;
  latitude: number;
  longitude: number;
  iso_country: string;
  filetypes: FileType[];
}

export interface FileType {
  extension: string;
  description: string | null;
  used_by: string | null;
}

export const getAirportOfTheDay = (
  airports: AirportVerbose[],
): AirportVerbose => {
  // today's date as a number
  const today = new Date().toISOString().slice(0, 10).split("-").join("");

  const myrng = seedrandom.default(today);
  const airport = airports[Math.floor(myrng() * airports.length)]!;

  return airport;
};

export const getRandomAirport = (
  airports: AirportVerbose[],
): AirportVerbose => {
  const airport = airports[Math.floor(Math.random() * airports.length)]!;
  return airport;
};

export const convertToConcise = (airport: AirportVerbose): AirportConcise => {
  const {
    ident,
    type,
    iata_code,
    name,
    latitude,
    longitude,
    iso_country,
    filetypes,
  } = airport;
  return {
    ident,
    type,
    iata_code,
    name,
    latitude,
    longitude,
    iso_country,
    filetypes,
  };
};
