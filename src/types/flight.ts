export type FlightStatus = "Active" | "Inactive";

export type BodyType = "narrow_body" | "wide_body";

export interface Flight {
  id: string;
  aoc: string;
  flightNumber: string;
  origin: string;
  destination: string;
  std: string;
  sta: string;
  daysOfOperation: number[];
  bodyType: BodyType;
  startDate: string;
  endDate: string;
  status: FlightStatus;
}

export interface FlightsResponse {
  flights: Flight[];
}
