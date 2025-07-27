import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient();

export async function POST(request: Request) 
{
    // TODO: validate request body. what if the id exists already?
    const session = await getServerSession(authOptions) as any;
    if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });  

    const { stravaActivityId, transform, coords, image } = await request.json();

    const hm = await prisma.heatmaps.create({
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