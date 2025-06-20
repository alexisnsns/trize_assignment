'use client';
import { useQuery } from 'react-query';
import { useWallet } from '@/lib/useWallet';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function Dashboard() {
  /* TODO:
     – gate by wallet
     – server‑side prefetch (React Query hydrate)
     – responsive grid of positions
  */
  return <Typography>implement me</Typography>;
}
