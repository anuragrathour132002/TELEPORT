import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DAYS_OF_WEEK } from "../../constants/days";
import type { BodyType, FlightStatus } from "../../types/flight";
import type { FlightFilters } from "../../types/filters";

interface FlightsFilterPanelProps {
  filters: FlightFilters;
  searchQuery: string;
  aocOptions: string[];
  onSearchChange: (value: string) => void;
  onFiltersChange: (next: FlightFilters) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export function FlightsFilterPanel({
  filters,
  searchQuery,
  aocOptions,
  onSearchChange,
  onFiltersChange,
  onClearAll,
  hasActiveFilters,
}: FlightsFilterPanelProps) {
  const dateFieldSx = {
    "& input::-webkit-calendar-picker-indicator": {
      filter: "invert(1)",
      opacity: 1,
      cursor: "pointer",
    },
  };

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 2,
          // "@media (max-width: 1200px)": { gridTemplateColumns: "repeat(2, 1fr)" },
          // "@media (max-width: 700px)": { gridTemplateColumns: "1fr" },
        }}
      >
        <TextField
          label="Search (flight/origin/destination)"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        <TextField
          label="From Date"
          type="date"
          sx={dateFieldSx}
          value={filters.fromDate}
          onChange={(event) =>
            onFiltersChange({ ...filters, fromDate: event.target.value })
          }
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="To Date"
          type="date"
          sx={dateFieldSx}
          value={filters.toDate}
          onChange={(event) =>
            onFiltersChange({ ...filters, toDate: event.target.value })
          }
          InputLabelProps={{ shrink: true }}
        />

        <FormControl>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={filters.status}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                status: event.target.value as FlightStatus | "",
              })
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>AOC</InputLabel>
          <Select
            label="AOC"
            value={filters.aoc}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                aoc: event.target.value,
              })
            }
          >
            <MenuItem value="">All</MenuItem>
            {aocOptions.map((aoc) => (
              <MenuItem key={aoc} value={aoc}>
                {aoc}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <InputLabel>Body Type</InputLabel>
          <Select
            label="Body Type"
            value={filters.bodyType}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                bodyType: event.target.value as BodyType | "",
              })
            }
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="narrow_body">narrow_body</MenuItem>
            <MenuItem value="wide_body">wide_body</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ gridColumn: "span 2", "@media (max-width: 700px)": { gridColumn: "span 1" } }}>
          <InputLabel>Days Of Operation</InputLabel>
          <Select
            multiple
            value={filters.daysOfOperation.map(String)}
            input={<OutlinedInput label="Days Of Operation" />}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                daysOfOperation: (event.target.value as string[]).map(Number),
              })
            }
            renderValue={(selected) =>
              (selected as string[])
                .map((value) => DAYS_OF_WEEK.find((day) => day.value === Number(value))?.shortLabel)
                .filter(Boolean)
                .join(", ")
            }
          >
            {DAYS_OF_WEEK.map((day) => (
              <MenuItem key={day.value} value={String(day.value)}>
                {day.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Stack direction="row" justifyContent="flex-end">
        <Button variant="outlined" onClick={onClearAll} disabled={!hasActiveFilters}>
          Clear All
        </Button>
      </Stack>
    </Stack>
  );
}
