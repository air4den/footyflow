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
            // Convert coordinates to activity data format
            const activityData = coords.map(([lat, lng]: [number, number]) => ({ lat, lng }));
            setActivityData(activityData);
            console.log("Activity data set:", activityData.length, "points");

            // Calculate initial center from coordinates
            const avgLat = coords.reduce((sum: number, [lat]: [number, number]) => sum + lat, 0) / coords.length;
            const avgLng = coords.reduce((sum: number, [, lng]: [number, number]) => sum + lng, 0) / coords.length;
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
        console.log("Saving heatmap");
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-8 mt-28 mb-8">
                <h1 className="text-3xl text-strorange font-bold">Edit Heatmap</h1>
                <Editor />
            </div>
            <Button
                className="absolute top-0 left-4 px-4 py-2 rounded-md bg-strorange text-white font-medium hover:bg-orange-700 hover:opacity-80"
                style={{ cursor: 'pointer' }}
                onClick={() => handleBack()}
            >
                Back
            </Button>
        </>
    )
}