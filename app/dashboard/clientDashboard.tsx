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
  const { address, connect } = useWallet();
  const theme = useTheme();

  // Only enable fetching when the wallet is connected
  const { data, isLoading, isFetching, refetch } = useQuery<Position[], Error>(
    ["positions"],
    fetchPositions,
    {
      enabled: !!address, // only run query if address exists
      initialData: address ? initialPositions : undefined,
      refetchInterval: 30_000,
      refetchOnWindowFocus: true,
    }
  );

  // Refresh only when wallet connects
  useEffect(() => {
    if (address) refetch().catch(() => {});
  }, [address, refetch]);

  return (
    <Box
      sx={{
        p: 3,
        color: theme.palette.text.primary,
      }}
    >
      {/* Wallet connect gate */}
      {!address ? (
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
          <Button
            variant="contained"
            onClick={connect}
            data-testid="connect-button"
          >
            Connect Wallet
          </Button>
          <Typography variant="body2">
            Connect your Web3 wallet to view your positions.
          </Typography>
        </Box>
      ) : (
        <Typography variant="h6" sx={{ mb: 2 }}>
          Connected: {address}
        </Typography>
      )}

      {/* Header */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h5">Token Positions</Typography>
        {isFetching && address && (
          <Typography variant="body2" color="text.secondary">
            (updating...)
          </Typography>
        )}
      </Box>

      {/* If not connected yet */}
      {!address && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Please connect your wallet to load positions.
        </Typography>
      )}

      {/* Loading state */}
      {address && isLoading && (
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
      {address && !isLoading && data?.length === 0 && (
        <Typography>No positions found.</Typography>
      )}

      {/* Positions grid */}
      {address && !isLoading && data?.length ? (
        <Grid container spacing={2}>
          {data.map((pos) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={pos.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle2">{pos.symbol}</Typography>
                  <Typography variant="h6">{pos.balance}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : null}
    </Box>
  );
}
