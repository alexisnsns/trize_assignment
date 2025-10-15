"use client";

import React, { useState, useMemo, createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  IconButton,
  Box,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

// Context for dark/light mode toggle
const ColorModeContext = createContext({ toggleColorMode: () => {} });
export const useColorMode = () => useContext(ColorModeContext);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [mode, setMode] = useState<"light" | "dark">("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === "light" ? "#1976d2" : "#90caf9" },
        },
      }),
    [mode]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          {/* Animated background gradient */}
          <Box
            sx={{
              minHeight: "100vh",
              background:
                mode === "light"
                  ? "linear-gradient(135deg, #f8fafc 0%, #c3cfe2 100%)"
                  : "linear-gradient(135deg, #141421 0%, #2b2b40 100%)",
              backgroundSize: "200% 200%",
              animation: "gradientShift 10s ease infinite",
              transition: "background 1s ease",
              "@keyframes gradientShift": {
                "0%": { backgroundPosition: "0% 50%" },
                "50%": { backgroundPosition: "100% 50%" },
                "100%": { backgroundPosition: "0% 50%" },
              },
            }}
          >
            {/* Theme toggle button */}
            <Box
              sx={{
                position: "fixed",
                top: 16,
                right: 16,
                zIndex: 2000,
                bgcolor: "background.paper",
                borderRadius: "50%",
                boxShadow: 2,
              }}
            >
              <IconButton
                onClick={colorMode.toggleColorMode}
                color="inherit"
                size="large"
              >
                {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>

            {/* Main content container */}
            <Box
              sx={{
                maxWidth: "1200px",
                mx: "auto",
                px: 3,
                py: 6,
                transition: "opacity 0.3s ease",
              }}
            >
              {children}
            </Box>
          </Box>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </QueryClientProvider>
  );
}
