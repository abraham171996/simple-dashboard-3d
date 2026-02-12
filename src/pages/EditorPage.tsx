import React, { useEffect } from "react";
import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { useAppStore } from "../app/store";
import ThreeCanvas from "../components/ThreeCanvas";
import ObjectPropertiesPanel from "../components/ObjectPropertiesPanel";
import DesignerPicker from "../components/DesignerPicker";

export default function EditorPage() {
  const boot = useAppStore((s) => s.boot);

  useEffect(() => {
    boot();
  }, [boot]);

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={800}>
        Editor
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <DesignerPicker />
                <Box sx={{ height: 520, borderRadius: 2, overflow: "hidden" }}>
                  <ThreeCanvas />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Double-click on the ground to add an object (designer must be
                  selected). Click object to select. Drag to move.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <ObjectPropertiesPanel />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
