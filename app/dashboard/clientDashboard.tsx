"use client";

import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useWallet } from "../../lib/useWallet";
import {
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  Skeleton,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export type Position = {
  id: string;
  symbol: string;
  balance: number;
  priceUSD: number;
  valueUSD: number;
  change24h: number; 
};

async function fetchPositions() {
  const res = await fetch("/api/positions");
  if (!res.ok) throw new Error("Failed to fetch positions");
  return (await res.json()) as Position[];
}

export default function ClientDashboard({
  initialPositions,
}: {
  initialPositions?: Position[];
}) {
  const { address, connect, disconnect } = useWallet();
  const theme = useTheme();

  // Only fetch positions when wallet is connected
  const { data, isLoading, isFetching, refetch, remove } = useQuery<
    Position[],
    Error
  >(["positions"], fetchPositions, {
    enabled: !!address,
    initialData: address ? initialPositions : undefined,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });

  // Refresh data on connect
  useEffect(() => {
    if (address) {
      refetch().catch(() => {});
    } else {
      // Clear cached data when disconnected
      remove();
    }
  }, [address, refetch, remove]);

  return (
    <Box sx={{ p: 3, color: theme.palette.text.primary }}>
      {/* Connection controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        {!address ? (
          <Button
            variant="contained"
            color="primary"
            onClick={connect}
            data-testid="connect-button"
          >
            Connect Wallet
          </Button>
        ) : (
          <>
            <Typography variant="h6">
              Connected:{" "}
              <Typography
                component="span"
                sx={{ color: theme.palette.primary.main }}
              >
                {address}
              </Typography>
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={disconnect}
              data-testid="disconnect-button"
            >
              Disconnect
            </Button>
          </>
        )}
      </Box>

      {/* Only render data section if wallet is connected */}
      {!address ? (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Please connect your wallet to view your token positions.
        </Typography>
      ) : (
        <>
          {/* Header */}
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h5">Token Positions</Typography>
            {isFetching && (
              <Typography variant="body2" color="text.secondary">
                (updating…)
              </Typography>
            )}
          </Box>

          {/* Loading state */}
          {isLoading && (
            <Grid container spacing={2}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                  <Card>
                    <CardContent>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* No positions */}
          {!isLoading && data?.length === 0 && (
            <Typography>No positions found.</Typography>
          )}

          {/* Positions grid */}
          {!isLoading && data?.length ? (
            <Grid container spacing={2}>
              {data.map((pos) => {
                const isPositive = pos.change24h > 0;
                const changeColor = isPositive
                  ? "success.main"
                  : pos.change24h < 0
                  ? "error.main"
                  : "text.secondary";

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={pos.id}>
                    <Card
                      sx={{
                        height: "100%",
                        borderRadius: 3,
                        boxShadow: 2,
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 4,
                        },
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            {pos.symbol}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: changeColor }}
                          >
                            {isPositive && "+"}
                            {pos.change24h.toFixed(2)}%
                          </Typography>
                        </Box>

                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {pos.balance.toLocaleString()} {pos.symbol}
                        </Typography>

                        {typeof pos.valueUSD === "number" && (
                          <Typography variant="body2" color="text.secondary">
                            $
                            {pos.valueUSD.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : null}
        </>
      )}
    </Box>
  );
}
