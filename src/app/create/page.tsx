"use client";

import { useEffect, useState } from "react";
import { useHeatmapStore } from "@/store/useHeatmapStore";
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation";
import { Button } from "@radix-ui/themes";

export default function CreatePage() {
    const { data: session } = useSession();
    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }
    const [activities, setActivities] = useState<Array<{
        id: string;
        name: string;
        start_date_local: string;
        timezone: string;
    }>>([]);
    const [tempActivityId, setTempActivityId] = useState<string>("");
    const { setSelectedActivityId } = useHeatmapStore();

    // fetch activities from Strava API
    useEffect(() => {
        const fetchActivities = async () => {
            const response = await fetch("/api/strava/activities");
            const data = await response.json();
            console.log("Activities:", data);
            setActivities(data);
        }
        fetchActivities();
    }, []);

    const handleChooseActivity = () => {
        if (tempActivityId) {
            setSelectedActivityId(tempActivityId); // Set the selected activity ID
            redirect("/edit");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center gap-4 mt-32" style={{ minHeight: 'calc(100vh - 14rem)' }}>
            <h1 className="text-4xl text-strorange font-bold">Create Heatmap</h1>
            <div className="flex flex-col items-center justify-center gap-4 px-4">
                <select 
                    value={tempActivityId || ""} 
                    onChange={(e) => setTempActivityId(e.target.value)}
                    className="w-full max-w-md"
                >
                    <option value="">Select Activity...</option>
                    {activities.map((activity) => {
                        const date = new Date(activity.start_date_local);
                        const timeZone = activity.timezone.split(' ').pop();
                        const formattedDate = new Intl.DateTimeFormat('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true, // Use 12-hour time format
                            timeZone: timeZone,
                        }).format(date);
                        return (
                        <option key={activity.id} value={activity.id}>
                            {formattedDate} | {activity.name}
                        </option>
                        )
                    })}
                </select>
                <Button
                    className="px-4 py-2 rounded-md bg-strorange text-white font-medium hover:bg-orange-700 hover:opacity-80"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleChooseActivity()}
                >
                    Choose Activity
                </Button>
            </div>
        </div>
    )
}