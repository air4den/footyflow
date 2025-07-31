import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() 
{
  const session = await getServerSession(authOptions) as any;
  // console.log("API Route /api/strava/activities - Session:", session);

  if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

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

  try {
    const res = await fetch(
      `https://www.strava.com/api/v3/athlete/activities`,
      { headers: { Authorization: `Bearer ${account.access_token}` } }
    );
    const activities = await res.json();
    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}