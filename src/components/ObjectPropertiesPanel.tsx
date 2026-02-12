import React, { useMemo } from "react";
import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppStore } from "../app/store";
import { ObjectSize } from "../models/sceneObject";

const sizes: ObjectSize[] = ["small", "normal", "large"];

export default function ObjectPropertiesPanel() {
  const designers = useAppStore((s) => s.designers);
  const selectedObject = useAppStore((s) => s.getSelectedObject());
  const updateObject = useAppStore((s) => s.updateObject);
  const deleteSelectedObject = useAppStore((s) => s.deleteSelectedObject);

  const designerName = useMemo(() => {
    if (!selectedObject) return "";
    return (
      designers.find((d) => d.id === selectedObject.designerId)?.fullName ??
      "Unknown"
    );
  }, [selectedObject, designers]);

  if (!selectedObject) {
    return (
      <Stack spacing={1}>
        <Typography fontWeight={800}>Properties</Typography>
        <Typography variant="body2" color="text.secondary">
          Select an object in the scene to edit its properties.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <Typography fontWeight={800}>Properties</Typography>
      <Divider />

      <TextField
        label="Name"
        value={selectedObject.name}
        onChange={(e) =>
          updateObject(selectedObject.id, { name: e.target.value })
        }
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel id="designer-attached">Attached designer</InputLabel>
        <Select
          labelId="designer-attached"
          label="Attached designer"
          value={selectedObject.designerId}
          onChange={(e) =>
            updateObject(selectedObject.id, {
              designerId: String(e.target.value),
            })
          }
        >
          {designers.map((d) => (
            <MenuItem key={d.id} value={d.id}>
              {d.fullName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Color"
        type="color"
        value={selectedObject.color}
        onChange={(e) =>
          updateObject(selectedObject.id, { color: e.target.value })
        }
        fullWidth
        InputLabelProps={{ shrink: true }}
      />

      <FormControl fullWidth>
        <InputLabel id="size-label">Size</InputLabel>
        <Select
          labelId="size-label"
          label="Size"
          value={selectedObject.size}
          onChange={(e) =>
            updateObject(selectedObject.id, {
              size: e.target.value as ObjectSize,
            })
          }
        >
          {sizes.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Stack spacing={0.5}>
        <Typography variant="body2" color="text.secondary">
          <b>Current attached designer:</b> {designerName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <b>Position:</b> [
          {selectedObject.position.map((n) => n.toFixed(2)).join(", ")}]
        </Typography>
      </Stack>

      <Button
        color="error"
        variant="contained"
        startIcon={<DeleteIcon />}
        onClick={deleteSelectedObject}
      >
        Delete object
      </Button>
    </Stack>
  );
}
