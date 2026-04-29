import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { memo, useMemo, useState } from "react";
import { DAYS_OF_WEEK } from "../../constants/days";
import type { Flight } from "../../types/flight";
import { isValidIsoDate, isValidTime } from "../../utils/date";

interface FlightsBasicTableProps {
  flights: Flight[];
  selectedIds: Set<string>;
  onToggleSelectRow: (id: string, checked: boolean) => void;
  onToggleSelectAllVisible: (checked: boolean) => void;
  onDeleteRow: (id: string) => void;
  onDeleteSelected: () => void;
  onUpdateFlight: (id: string, updates: Partial<Flight>) => void;
}

const GRID_TEMPLATE =
  "48px 90px 64px 92px 120px 70px 70px 140px 120px 110px 110px 130px 180px";
const DATE_INPUT_SX = {
  "& input::-webkit-calendar-picker-indicator": {
    filter: "invert(1)",
    opacity: 1,
    cursor: "pointer",
  },
};

interface RowData {
  flights: Flight[];
  selectedIds: Set<string>;
  editingRowId: string | null;
  savingRowId: string | null;
  draftRow: Flight | null;
  validationError: string | null;
  rowErrorById: Record<string, string>;
  onToggleSelectRow: (id: string, checked: boolean) => void;
  onToggleStatus: (id: string, currentStatus: Flight["status"]) => void;
  onDeleteRow: (id: string) => void;
  onStartEdit: (flight: Flight) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onDraftChange: (key: keyof Flight, value: string) => void;
}

function getDaysLabel(days: number[]): string {
  const labelByValue = new Map<number, string>(
    DAYS_OF_WEEK.map((day) => [day.value, day.shortLabel]),
  );
  return days
    .map((day) => labelByValue.get(day))
    .filter(Boolean)
    .join(", ");
}

const TableRowItem = memo(
  ({ flight, data }: { flight: Flight; data: RowData }) => {
    const isEditing = data.editingRowId === flight.id;
    const isSaving = data.savingRowId === flight.id;
    const rowSource = isEditing && data.draftRow ? data.draftRow : flight;
    const status = rowSource.status;
    const checked = data.selectedIds.has(flight.id);
    const rowError = data.rowErrorById[flight.id];

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: GRID_TEMPLATE,
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          px: 1,
          backgroundColor: checked ? "action.selected" : "transparent",
        }}
      >
        <Checkbox
          size="small"
          checked={checked}
          disabled={isSaving}
          onChange={(event) =>
            data.onToggleSelectRow(flight.id, event.target.checked)
          }
        />
        <Typography variant="body2">{flight.id}</Typography>
        <Typography variant="body2">{flight.aoc}</Typography>
        <Typography variant="body2">{flight.flightNumber}</Typography>
        <Typography variant="body2">
          {flight.origin} - {flight.destination}
        </Typography>
        {isEditing ? (
          <TextField
            size="small"
            value={rowSource.std}
            disabled={isSaving}
            onChange={(event) => data.onDraftChange("std", event.target.value)}
          />
        ) : (
          <Typography variant="body2">{rowSource.std}</Typography>
        )}
        {isEditing ? (
          <TextField
            size="small"
            value={rowSource.sta}
            disabled={isSaving}
            onChange={(event) => data.onDraftChange("sta", event.target.value)}
          />
        ) : (
          <Typography variant="body2">{rowSource.sta}</Typography>
        )}
        <Typography variant="body2">{getDaysLabel(flight.daysOfOperation)}</Typography>
        <Chip
          size="small"
          label={flight.bodyType}
          color={flight.bodyType === "wide_body" ? "secondary" : "default"}
          sx={{ width: "fit-content" }}
        />
        {isEditing ? (
          <TextField
            size="small"
            type="date"
            sx={DATE_INPUT_SX}
            value={rowSource.startDate}
            disabled={isSaving}
            onChange={(event) =>
              data.onDraftChange("startDate", event.target.value)
            }
            InputLabelProps={{ shrink: true }}
          />
        ) : (
          <Typography variant="body2">{rowSource.startDate}</Typography>
        )}
        {isEditing ? (
          <TextField
            size="small"
            type="date"
            sx={DATE_INPUT_SX}
            value={rowSource.endDate}
            disabled={isSaving}
            onChange={(event) => data.onDraftChange("endDate", event.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        ) : (
          <Typography variant="body2">{rowSource.endDate}</Typography>
        )}
        {isEditing ? (
          <Select
            size="small"
            value={rowSource.status}
            disabled={isSaving}
            onChange={(event) =>
              data.onDraftChange("status", event.target.value as string)
            }
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        ) : (
          <FormControlLabel
            sx={{ m: 0 }}
            control={
              <Switch
                size="small"
                checked={status === "Active"}
                disabled={isSaving}
                onChange={() => data.onToggleStatus(flight.id, status)}
              />
            }
            label={status}
          />
        )}
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          {isEditing ? (
            <>
              <Button size="small" variant="contained" onClick={data.onSaveEdit}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button
                size="small"
                variant="outlined"
                disabled={isSaving}
                onClick={data.onCancelEdit}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                size="small"
                variant="outlined"
                disabled={isSaving}
                onClick={() => data.onStartEdit(flight)}
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                variant="outlined"
                disabled={isSaving}
                onClick={() => data.onDeleteRow(flight.id)}
              >
                Delete
              </Button>
            </>
          )}
        </Stack>
        {rowError && (
          <Typography
            variant="caption"
            color="error.main"
            sx={{ gridColumn: "13 / 14", justifySelf: "end", mr: 1 }}
          >
            {rowError}
          </Typography>
        )}
      </Box>
    );
  },
);

TableRowItem.displayName = "TableRowItem";

export function FlightsBasicTable({
  flights,
  selectedIds,
  onToggleSelectRow,
  onToggleSelectAllVisible,
  onDeleteRow,
  onDeleteSelected,
  onUpdateFlight,
}: FlightsBasicTableProps) {
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [savingRowId, setSavingRowId] = useState<string | null>(null);
  const [draftRow, setDraftRow] = useState<Flight | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [rowErrorById, setRowErrorById] = useState<Record<string, string>>({});

  const selectedVisibleCount = useMemo(
    () => flights.filter((flight) => selectedIds.has(flight.id)).length,
    [flights, selectedIds],
  );

  const allVisibleSelected = flights.length > 0 && selectedVisibleCount === flights.length;

  const onToggleStatus = (id: string, currentStatus: Flight["status"]) => {
    setRowErrorById((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
    onUpdateFlight(id, {
      status: currentStatus === "Active" ? "Inactive" : "Active",
    });
  };

  const onStartEdit = (flight: Flight) => {
    setEditingRowId(flight.id);
    setDraftRow({ ...flight });
    setValidationError(null);
    setRowErrorById((previous) => {
      const next = { ...previous };
      delete next[flight.id];
      return next;
    });
  };

  const onCancelEdit = () => {
    setEditingRowId(null);
    setDraftRow(null);
    setValidationError(null);
  };

  const onDraftChange = (key: keyof Flight, value: string) => {
    if (!draftRow) {
      return;
    }
    setDraftRow({
      ...draftRow,
      [key]: value,
    });
  };

  const onSaveEdit = async () => {
    if (!editingRowId || !draftRow) {
      return;
    }

    if (
      !isValidIsoDate(draftRow.startDate) ||
      !isValidIsoDate(draftRow.endDate) ||
      !isValidTime(draftRow.std) ||
      !isValidTime(draftRow.sta)
    ) {
      setValidationError("Use valid date (YYYY-MM-DD) and time (HH:mm) values.");
      return;
    }

    setValidationError(null);
    const rowId = editingRowId;
    setSavingRowId(rowId);

    await new Promise((resolve) => {
      setTimeout(resolve, 900);
    });

    const failed = Math.random() < 0.25;
    if (failed) {
      setSavingRowId(null);
      setRowErrorById((previous) => ({
        ...previous,
        [rowId]: "Save failed. Try again.",
      }));
      return;
    }

    onUpdateFlight(rowId, {
      std: draftRow.std,
      sta: draftRow.sta,
      startDate: draftRow.startDate,
      endDate: draftRow.endDate,
      status: draftRow.status,
    });
    setSavingRowId(null);
    setEditingRowId(null);
    setDraftRow(null);
    setRowErrorById((previous) => {
      const next = { ...previous };
      delete next[rowId];
      return next;
    });
  };

  const rowData = useMemo<RowData>(
    () => ({
      flights,
      selectedIds,
      editingRowId,
      savingRowId,
      draftRow,
      validationError,
      rowErrorById,
      onToggleSelectRow,
      onToggleStatus,
      onDeleteRow,
      onStartEdit,
      onCancelEdit,
      onSaveEdit,
      onDraftChange,
    }),
    [
      draftRow,
      editingRowId,
      flights,
      onDeleteRow,
      onToggleSelectRow,
      rowErrorById,
      savingRowId,
      selectedIds,
      validationError,
    ],
  );

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Inline editing enabled for STD, STA, start/end date, and status.
        </Typography>
        <Button
          color="error"
          variant="outlined"
          disabled={selectedIds.size === 0 || savingRowId !== null}
          onClick={onDeleteSelected}
        >
          Delete Selected ({selectedIds.size})
        </Button>
      </Stack>
      {validationError && <Alert severity="error">{validationError}</Alert>}

      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: GRID_TEMPLATE,
            alignItems: "center",
            px: 1,
            py: 1,
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <Checkbox
            size="small"
            checked={allVisibleSelected}
            indeterminate={selectedVisibleCount > 0 && !allVisibleSelected}
            onChange={(event) => onToggleSelectAllVisible(event.target.checked)}
          />
          <Typography variant="caption" fontWeight={700}>
            ID
          </Typography>
          <Typography variant="caption" fontWeight={700}>
            AOC
          </Typography>
          <Typography variant="caption" fontWeight={700}>
            Flight No.
          </Typography>
          <Typography variant="caption" fontWeight={700}>
            Route
          </Typography>
          <Typography variant="caption" fontWeight={700}>
            STD
          </Typography>
          <Typography variant="caption" fontWeight={700}>
            STA
          </Typography>
          <Typography variant="caption" fontWeight={700}>
            Days
          </Typography>
          <Typography variant="caption" fontWeight={700}>
            Body Type
          </Typography>
          <Typography variant="caption" fontWeight={700}>
            Start Date
          </Typography>
          <Typography variant="caption" fontWeight={700}>
            End Date
          </Typography>
          <Typography variant="caption" fontWeight={700}>
            Status
          </Typography>
          <Typography variant="caption" fontWeight={700} textAlign="right">
            Actions
          </Typography>
        </Box>

        <Box sx={{ maxHeight: 520, overflowY: "auto" }}>
          {flights.map((flight) => (
            <TableRowItem key={flight.id} flight={flight} data={rowData} />
          ))}
        </Box>
      </Paper>
    </Stack>
  );
}
