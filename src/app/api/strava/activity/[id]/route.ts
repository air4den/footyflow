import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { decode } from "@mapbox/polyline";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(_: Request, context: { params: { id: string } }) 
{
  const session = await getServerSession(authOptions) as any;
  if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const params = await context.params;

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
  
  const r = await fetch(
    `https://www.strava.com/api/v3/activities/${params.id}?include_all_efforts=false`,
    { headers: { Authorization: `Bearer ${account.access_token}` } }
  );
  const activity = await r.json();
  console.log("Strava activity map from Strava API call:", activity.map);

  // just send the summary + the decoded lat/lng list
  const polyline = activity.map.polyline ?? activity.polyline ?? "";
  return NextResponse.json({
    id: activity.id,
    name: activity.name,
    distance: activity.distance,
    coords: decode(polyline, 6),
  });
}