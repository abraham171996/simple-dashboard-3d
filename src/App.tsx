import React from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import DesignersPage from "./pages/DesignersPage";
import EditorPage from "./pages/EditorPage";

export default function App() {
  const location = useLocation();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f7fb" }}>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <Typography sx={{ flex: 1, fontWeight: 700 }}>
            Simple Dashboard 3D
          </Typography>

          <Button
            component={Link}
            to="/designers"
            color="inherit"
            variant={location.pathname.includes("designers") ? "outlined" : "text"}
            sx={{ mr: 1 }}
          >
            Designers
          </Button>
          <Button
            component={Link}
            to="/editor"
            color="inherit"
            variant={location.pathname.includes("editor") ? "outlined" : "text"}
          >
            Editor
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }} maxWidth="lg">
        <Routes>
          <Route path="/" element={<Navigate to="/designers" replace />} />
          <Route path="/designers" element={<DesignersPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="*" element={<Navigate to="/designers" replace />} />
        </Routes>
      </Container>
    </Box>
  );
}