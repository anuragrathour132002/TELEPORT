import { useEffect, useState } from "react";
import type { Flight, FlightsResponse } from "../types/flight";

interface UseFlightsDataResult {
  flights: Flight[];
  loading: boolean;
  error: string | null;
}

export function useFlightsData(): UseFlightsDataResult {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadFlights() {
      try {
        setLoading(true);
        const response = await fetch("/data/flights.json");
        if (!response.ok) {
          throw new Error(`Failed to load flights: ${response.status}`);
        }

        const data = (await response.json()) as FlightsResponse;
        if (active) {
          setFlights(data.flights);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load flights data.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadFlights();

    return () => {
      active = false;
    };
  }, []);

  return { flights, loading, error };
}
