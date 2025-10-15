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
import Head from "next/head";

// context for theme mode toggle
const ColorModeContext = createContext({ toggleColorMode: () => {} });
export const useColorMode = () => useContext(ColorModeContext);

export default function RootLayout({
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
    <html lang="en">
      <Head>
        <title>💲 Token-Gated Dashboard</title>
        <meta
          name="description"
          content="A secure, responsive Web3 dashboard for token positions."
        />
        <link
          rel="icon"
          href={`data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💲</text></svg>`}
        />
      </Head>

      <body>
        <QueryClientProvider client={queryClient}>
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {/* Simple dark-mode toggle */}
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

              {children}
            </ThemeProvider>
          </ColorModeContext.Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
