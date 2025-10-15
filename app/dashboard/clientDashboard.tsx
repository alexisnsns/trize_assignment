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
  IconButton,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import RefreshIcon from "@mui/icons-material/Refresh";

export type Position = {
  id: string;
  symbol: string;
  balance: number;
  priceUSD: number;
  valueUSD: number;
  change24h: number;
};

async function fetchPositions() {
  // simulate network delay
  await new Promise((res) => setTimeout(res, 1000));
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

  const { data, isLoading, isFetching, refetch, remove } = useQuery<
    Position[],
    Error
  >(["positions"], fetchPositions, {
    enabled: !!address,
    initialData: address ? initialPositions : undefined,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (address) {
      refetch().catch(() => {});
    } else {
      remove();
    }
  }, [address, refetch, remove]);

  const showSkeleton = isLoading || isFetching;
  const hasData = data && data.length > 0;

  return (
    <Box sx={{ p: 3, color: theme.palette.text.primary }}>
      {/* Wallet Controls */}
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="h6">
              Connected:{" "}
              <Typography
                component="a"
                href={`https://etherscan.io/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: theme.palette.primary.main,
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
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
          </Box>
        )}
      </Box>

      {/* Content */}
      {!address ? (
        <Typography variant="body2" sx={{ mt: 2 }}>
          Please connect your wallet to view your token positions.
        </Typography>
      ) : (
        <>
          {/* Header */}
          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h5">Token Positions</Typography>

            {address && (
              <Tooltip title="Refresh data">
                <span>
                  <IconButton
                    onClick={() => refetch()}
                    color="primary"
                    disabled={isFetching}
                    sx={{
                      transition: "transform 0.2s ease",
                      ...(isFetching && { transform: "rotate(180deg)" }),
                      "&:hover": { transform: "rotate(180deg)" },
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </Box>

          {/* Loading Skeletons */}
          {showSkeleton && (
            <Grid
              container
              spacing={2}
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: 2,
              }}
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <Card
                  key={i}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: 2,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Skeleton variant="text" width="40%" height={24} />
                      <Skeleton variant="text" width="25%" height={24} />
                    </Box>

                    {/* Balance */}
                    <Skeleton variant="text" width="80%" height={24} />

                    {/* USD Value */}
                    <Skeleton
                      variant="text"
                      width="50%"
                      height={16}
                      sx={{ mb: 2 }}
                    />
                  </CardContent>
                </Card>
              ))}
            </Grid>
          )}

          {/* Data Display */}
          {!showSkeleton && hasData && (
            <Grid
              container
              spacing={2}
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: 2,
              }}
            >
              {data.map((pos) => {
                const isPositive = pos.change24h > 0;
                const changeColor = isPositive
                  ? "success.main"
                  : pos.change24h < 0
                  ? "error.main"
                  : "text.secondary";

                return (
                  <Card
                    key={pos.id}
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      boxShadow: 2,
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                      },
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 0 }}>
                      {/* Header: symbol + 24h change */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle2" color="text.secondary">
                          {pos.symbol}
                        </Typography>
                        <Typography variant="body2" sx={{ color: changeColor }}>
                          {isPositive && "+"}
                          {pos.change24h.toFixed(2)}%
                        </Typography>
                      </Box>

                      {/* Balance */}
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {pos.balance.toLocaleString()} {pos.symbol}
                      </Typography>

                      {/* USD Value */}
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
                );
              })}
            </Grid>
          )}

          {/* Empty State: not used as data is mocked */}
          {!showSkeleton && !hasData && (
            <Typography sx={{ mt: 2 }}>No positions found.</Typography>
          )}
        </>
      )}
    </Box>
  );
}
