import ClientDashboard from "./clientDashboard";
import { Position } from "./clientDashboard";

export default async function Page() {
  let initialPositions: Position[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/positions`,
      {
        cache: "no-store",
      }
    );
    if (res.ok) initialPositions = await res.json();
  } catch {
    // Ignore errors and use empty initial positions
    console.log('error fetching positions');
  }

  return <ClientDashboard initialPositions={initialPositions} />;
}
