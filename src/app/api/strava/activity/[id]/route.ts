import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { decode } from "@mapbox/polyline";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions) as { user: { id: string } } | null;
  if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const { id } = await params;

  const account = await prisma.account.findUnique({
    where: {
      userId: session.user.id
    },
    select: {
      access_token: true,
    }
  });

  if (!account || !account.access_token) {
    return NextResponse.json({ error: "Access token not found" }, { status: 401 });
  }
  
  // TODO add error handling logic from API call
  const r = await fetch(
    `https://www.strava.com/api/v3/activities/${id}?include_all_efforts=false`,
    { headers: { Authorization: `Bearer ${account.access_token}` } }
  );
  const activity = await r.json();

  // Decode the polyline and return coordinates
  const polyline = activity.map.polyline ?? activity.polyline ?? "";
  const decodedCoords: [number, number][] = decode(polyline, 6).map(([lat, lng]) => [lat * 10, lng * 10] as [number, number]);

  return NextResponse.json({
    id: activity.id,
    name: activity.name,
    distance: activity.distance,
    coords: decodedCoords,
  });
}