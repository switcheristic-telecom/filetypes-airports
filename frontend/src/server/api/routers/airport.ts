import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

import { convertToConcise } from "@/utils/airport";

import {
  allAirports,
  randomAirport,
  airportOfTheDay,
} from "@/utils/airport-data";

export const airportRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => {
    return allAirports;
  }),

  getAllConcise: publicProcedure.query(() => {
    return allAirports.map(convertToConcise);
  }),

  getOne: publicProcedure
    .input(z.object({ iata_code: z.string() }))
    .query(({ input }) => {
      return allAirports.find((a) => a.iata_code === input.iata_code);
    }),

  getOneConcise: publicProcedure
    .input(z.object({ iata_code: z.string() }))
    .query(({ input }) => {
      const airport = allAirports.find((a) => a.iata_code === input.iata_code);
      return airport ? convertToConcise(airport) : null;
    }),

  getRandomAirport: publicProcedure.query(() => {
    return randomAirport;
  }),

  getAirportOfTheDay: publicProcedure.query(() => {
    return airportOfTheDay;
  }),
});
