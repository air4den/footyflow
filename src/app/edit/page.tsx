"use client";

import { useEffect, useState } from "react";
import { useHeatmapStore } from "@/store/useHeatmapStore";
import { useSession } from "next-auth/react"
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Button } from "@radix-ui/themes";
import Editor from "./Editor";

export default function EditPage() {
    const { data: session } = useSession();
    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }
    const { selectedActivityId, setSelectedActivityId, setActivityData, setCenter } = useHeatmapStore();

    useEffect(() => {
        if (!selectedActivityId) {
            redirect('/create');
        }
        console.log("useEffect triggered with selectedActivityId:", selectedActivityId);
        fetch(`/api/strava/activity/${selectedActivityId}`)
        .then((r) => r.json())
        .then(({ coords }) => {
            const pts = coords.map((c: [number, number]) => ({ lat: c[0], lng: c[1] }));
            setActivityData(pts);
            console.log("Activity Data: ", pts);

            // Calculate the average latitude and longitude
            const avgLat = pts.reduce((sum: number, point: { lat: number; lng: number }) => sum + point.lat, 0) / pts.length;
            const avgLng = pts.reduce((sum: number, point: { lat: number; lng: number }) => sum + point.lng, 0) / pts.length;

            // Update the center in the heatmap store
            setCenter({ lat: avgLat, lon: avgLng });
        })
        .catch(console.error);
    }, [selectedActivityId]);

    const handleBack = () => {
        setSelectedActivityId("");
        redirect("/create");
    };

    const handleSaveHeatmap = () => {
        // save heatmap as image
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 mt-16">
            <h1 className="text-3xl text-strorange font-bold">Edit Heatmap</h1>
            <div className="flex flex-col items-center justify-center gap-4 w-full">
                <Button
                    className="absolute top-0 left-8 px-4 py-2 rounded-md bg-strorange text-white font-medium hover:bg-orange-700 hover:opacity-80"
                    onClick={() => handleBack()}
                >
                    Back
                </Button>
            </div>
            <Editor />
        </div>
    )
}