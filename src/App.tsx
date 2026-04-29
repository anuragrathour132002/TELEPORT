import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { DeleteConfirmDialog } from "./components/common/DeleteConfirmDialog";
import { FlightsBasicTable } from "./components/flights/FlightsBasicTable";
import { FlightsFilterPanel } from "./components/flights/FlightsFilterPanel";
import { useFlightsData } from "./hooks/useFlightsData";
import { DEFAULT_FLIGHT_FILTERS, type FlightFilters } from "./types/filters";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

type DeleteDialogState =
  | { mode: "single"; flightId: string }
  | { mode: "bulk"; ids: string[] }
  | null;

export default function App() {
  const { flights, loading, error } = useFlightsData();
  const [allFlights, setAllFlights] = useState(flights);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FlightFilters>(DEFAULT_FLIGHT_FILTERS);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>(null);

  useEffect(() => {
    setAllFlights(flights);
  }, [flights]);

  const aocOptions = useMemo(
    () => Array.from(new Set(allFlights.map((flight) => flight.aoc))).sort(),
    [allFlights],
  );

  const hasActiveFilters = useMemo(
    () =>
      searchQuery.trim().length > 0 ||
      filters.fromDate.length > 0 ||
      filters.toDate.length > 0 ||
      filters.daysOfOperation.length > 0 ||
      filters.status.length > 0 ||
      filters.aoc.length > 0 ||
      filters.bodyType.length > 0,
    [filters, searchQuery],
  );

  const filteredFlights = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return allFlights.filter((flight) => {
      const flightStart = dayjs(flight.startDate);
      const flightEnd = dayjs(flight.endDate);

      const fromDate = filters.fromDate ? dayjs(filters.fromDate) : null;
      const toDate = filters.toDate ? dayjs(filters.toDate) : null;

      const hasDateOverlap =
        (!fromDate || !flightEnd.isBefore(fromDate, "day")) &&
        (!toDate || !flightStart.isAfter(toDate, "day"));

      const hasMatchingDay =
        filters.daysOfOperation.length === 0 ||
        flight.daysOfOperation.some((day) => filters.daysOfOperation.includes(day));

      const hasMatchingStatus =
        !filters.status || flight.status === filters.status;

      const hasMatchingAoc = !filters.aoc || flight.aoc === filters.aoc;

      const hasMatchingBodyType =
        !filters.bodyType || flight.bodyType === filters.bodyType;

      const hasMatchingSearch =
        normalizedQuery.length === 0 ||
        flight.flightNumber.toLowerCase().includes(normalizedQuery) ||
        flight.origin.toLowerCase().includes(normalizedQuery) ||
        flight.destination.toLowerCase().includes(normalizedQuery);

      return (
        hasDateOverlap &&
        hasMatchingDay &&
        hasMatchingStatus &&
        hasMatchingAoc &&
        hasMatchingBodyType &&
        hasMatchingSearch
      );
    });
  }, [allFlights, filters, searchQuery]);

  return (
    <Container maxWidth={false} sx={{ py: 4, maxWidth: "1500px" }}>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="overline" color="primary.main">
              Teleport Assessment
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              Flight Schedule Management Table
            </Typography>
          </Box>

          {loading && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={20} />
              <Typography>Loading flights...</Typography>
            </Stack>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          {!loading && !error && (
            <Stack spacing={1}>
              <Typography>
                Showing <strong>{filteredFlights.length}</strong> of{" "}
                <strong>{allFlights.length}</strong> flights.
              </Typography>
              <FlightsFilterPanel
                filters={filters}
                searchQuery={searchQuery}
                aocOptions={aocOptions}
                onSearchChange={setSearchQuery}
                onFiltersChange={setFilters}
                onClearAll={() => {
                  setSearchQuery("");
                  setFilters(DEFAULT_FLIGHT_FILTERS);
                }}
                hasActiveFilters={hasActiveFilters}
              />
              <Divider sx={{ my: 1 }} />
              <FlightsBasicTable
                flights={filteredFlights}
                selectedIds={selectedIds}
                onToggleSelectRow={(id, checked) => {
                  setSelectedIds((previous) => {
                    const next = new Set(previous);
                    if (checked) {
                      next.add(id);
                    } else {
                      next.delete(id);
                    }
                    return next;
                  });
                }}
                onToggleSelectAllVisible={(checked) => {
                  setSelectedIds((previous) => {
                    const next = new Set(previous);
                    if (checked) {
                      filteredFlights.forEach((flight) => next.add(flight.id));
                    } else {
                      filteredFlights.forEach((flight) => next.delete(flight.id));
                    }
                    return next;
                  });
                }}
                onDeleteRow={(id) => {
                  setDeleteDialog({ mode: "single", flightId: id });
                }}
                onDeleteSelected={() => {
                  if (selectedIds.size === 0) {
                    return;
                  }
                  setDeleteDialog({
                    mode: "bulk",
                    ids: Array.from(selectedIds),
                  });
                }}
                onUpdateFlight={(id, updates) => {
                  setAllFlights((previous) =>
                    previous.map((flight) =>
                      flight.id === id ? { ...flight, ...updates } : flight,
                    ),
                  );
                }}
              />
            </Stack>
          )}
        </Stack>
      </Paper>
      <DeleteConfirmDialog
        open={deleteDialog !== null}
        title={
          deleteDialog?.mode === "bulk"
            ? "Delete selected flights?"
            : "Delete this flight?"
        }
        description={
          deleteDialog?.mode === "bulk"
            ? `Are you sure you want to delete ${deleteDialog.ids.length} selected flights? This action cannot be undone.`
            : "Are you sure you want to delete this flight? This action cannot be undone."
        }
        onCancel={() => setDeleteDialog(null)}
        onConfirm={() => {
          if (!deleteDialog) {
            return;
          }

          if (deleteDialog.mode === "single") {
            const id = deleteDialog.flightId;
            setAllFlights((previous) =>
              previous.filter((flight) => flight.id !== id),
            );
            setSelectedIds((previous) => {
              const next = new Set(previous);
              next.delete(id);
              return next;
            });
          } else {
            const idsToDelete = new Set(deleteDialog.ids);
            setAllFlights((previous) =>
              previous.filter((flight) => !idsToDelete.has(flight.id)),
            );
            setSelectedIds(new Set());
          }

          setDeleteDialog(null);
        }}
      />
    </Container>
  );
}
