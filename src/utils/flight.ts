import type { Flight } from "../types/flight";

export function getFlightDisplayName(flight: Flight): string {
  return `${flight.aoc}${flight.flightNumber}`;
}
