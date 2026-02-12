import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useAppStore } from "../app/store";

export default function DesignerPicker() {
  const designers = useAppStore((s) => s.designers);
  const selectedDesignerId = useAppStore((s) => s.selectedDesignerId);
  const setSelectedDesignerId = useAppStore((s) => s.setSelectedDesignerId);

  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      <FormControl fullWidth size="small">
        <InputLabel id="designer-label">
          Selected designer (required)
        </InputLabel>
        <Select
          labelId="designer-label"
          label="Selected designer (required)"
          value={selectedDesignerId ?? ""}
          onChange={(e) => setSelectedDesignerId(e.target.value || null)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {designers.map((d) => (
            <MenuItem key={d.id} value={d.id}>
              {d.fullName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {designers.length === 0 && (
        <Typography variant="body2" color="error">
          Add designers first.
        </Typography>
      )}
    </Stack>
  );
}
