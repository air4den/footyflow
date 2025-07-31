import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) 
{
    // TODO: validate request body. what if the id exists already?
    const session = await getServerSession(authOptions) as any;
    if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });  

    const { stravaActivityId, transform, coords, image } = await request.json();

    const hm = await prisma.heatmap.create({
    data: {
      ownerId: session.user.id,
      stravaActivityId: stravaActivityId,
      transform: transform,
      routeCoordinates: coords,
      imageUrl: image,
    },
  });

  // add image to bucket here

  return NextResponse.json({ id: hm.id, imageUrl: hm.imageUrl });
}