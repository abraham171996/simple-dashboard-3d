import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAppStore } from "../app/store";
import DesignerForm from "../components/DesignerForm";

export default function DesignersPage() {
  const boot = useAppStore((s) => s.boot);
  const designers = useAppStore((s) => s.designers);
  const objects = useAppStore((s) => s.objects);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    boot();
  }, [boot]);

  const attachedCount = useMemo(() => {
    const map: Record<string, number> = {};
    for (const o of objects) map[o.designerId] = (map[o.designerId] ?? 0) + 1;
    return map;
  }, [objects]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" fontWeight={800}>
          Designers
        </Typography>

        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={() => setOpen(true)}
        >
          Add new
        </Button>
      </Stack>

      <Grid container spacing={2}>
        {designers.length === 0 ? (
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography fontWeight={700}>No designers yet</Typography>
                <Typography variant="body2" color="text.secondary">
                  Click “Add new” and create your first designer.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          designers.map((d) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <Card>
                <CardContent>
                  <Typography fontWeight={800}>{d.fullName}</Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Stack spacing={0.5}>
                    <Typography variant="body2">
                      <b>Working hours:</b> {d.workingHours}
                    </Typography>
                    <Typography variant="body2">
                      <b>Attached objects:</b> {attachedCount[d.id] ?? 0}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add designer</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <DesignerForm
              onDone={() => {
                setOpen(false);
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}
