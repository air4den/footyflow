import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() 
{
  const session = await getServerSession(authOptions) as any;
  console.log("API Route /api/strava/activities - Session:", session);

  if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

  const res = await fetch(
    `https://www.strava.com/api/v3/athlete/activities`,
    { headers: { Authorization: `Bearer ${session.user.access_token}` } }
  );
  console.log("Strava Activities API response status:", res);
  const activities = await res.json();
  return NextResponse.json(activities);
}