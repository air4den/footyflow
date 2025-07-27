import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { decode } from "@mapbox/polyline";


export async function GET(_: Request, context: { params: { id: string } }) 
{
  const session = await getServerSession(authOptions) as any;
  if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const params = await context.params;

  const r = await fetch(
    `https://www.strava.com/api/v3/activities/${params.id}?include_all_efforts=false`,
    { headers: { Authorization: `Bearer ${session.user.access_token}` } }
  );
  const act = await r.json();
  // just send the summary + the decoded lat/lng list
  const polyline = act.map.summary_polyline ?? act.polyline ?? "";
  return NextResponse.json({
    id: act.id,
    name: act.name,
    distance: act.distance,
    coords: decode(polyline, 6),
  });
}