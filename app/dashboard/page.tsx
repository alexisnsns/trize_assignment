import ClientDashboard from "./clientDashboard";
import { Position } from "./clientDashboard";

export default async function Page() {
  let initialPositions: Position[] = [];

  try {
    const res = await fetch(`/api/positions`, {
      cache: "no-store",
    });
    if (res.ok) initialPositions = await res.json();
  } catch {
    console.log("error fetching positions");
  }

  return <ClientDashboard initialPositions={initialPositions} />;
}
