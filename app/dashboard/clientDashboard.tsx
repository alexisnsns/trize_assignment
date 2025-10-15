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

export type Position = {
  id: string;
  token: string;
  balance: string;
  valueUSD?: number;
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

  const { data, isLoading, isFetching, refetch } = useQuery<Position[], Error>(
    ["positions"],
    fetchPositions,
    {
      initialData: initialPositions,
      refetchInterval: 30_000,
      refetchOnWindowFocus: true,
    }
  );

  useEffect(() => {
    refetch().catch(() => {});
  }, [refetch]);

  return (
    <Box sx={{ p: 3 }}>
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
            Connect your web3 wallet to manage positions.
          </Typography>
        </Box>
      ) : (
        <Typography variant="h6" sx={{ mb: 2 }}>
          Connected: {address}
        </Typography>
      )}

      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="h5">Token Positions</Typography>
        {isFetching && <Typography variant="body2">(updating...)</Typography>}
      </Box>

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

      {!isLoading && data?.length === 0 && (
        <Typography>No positions found.</Typography>
      )}

      {!isLoading && data?.length ? (
        <Grid container spacing={2}>
          {data.map((pos) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={pos.id}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle2">{pos.token}</Typography>
                  <Typography variant="h6">{pos.balance}</Typography>
                  {typeof pos.valueUSD === "number" ? (
                    <Typography variant="body2">
                      ${pos.valueUSD.toFixed(2)} USD
                    </Typography>
                  ) : null}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : null}
    </Box>
  );
}
