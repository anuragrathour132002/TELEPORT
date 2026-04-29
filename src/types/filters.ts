import type { BodyType, FlightStatus } from "./flight";

export interface FlightFilters {
  fromDate: string;
  toDate: string;
  daysOfOperation: number[];
  status: FlightStatus | "";
  aoc: string;
  bodyType: BodyType | "";
}

export const DEFAULT_FLIGHT_FILTERS: FlightFilters = {
  fromDate: "",
  toDate: "",
  daysOfOperation: [],
  status: "",
  aoc: "",
  bodyType: "",
};
