"use client";

import { useHeatmapStore } from "@/store/useHeatmapStore";
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import EditSlider from "./EditSlider";

const LeafletMap = dynamic(() => import('./LeafletMap'), {ssr: false}); 

export default function Editor() {
    const { rotation, setRotation, radius, setRadius } = useHeatmapStore();

    return (
        <>
            <LeafletMap />
            <div className="flex items-center justify-center gap-4">
                <h1 className="text-1xl text-strorange font-bold">Rotation</h1>
                <EditSlider value={rotation} setValue={setRotation} min={-180} max={180} step={1} defaultValue={0} />
                <h1 className="text-1xl text-strorange font-bold">{rotation}</h1>
            </div>
            <div className="flex items-center justify-center gap-4">
                <h1 className="text-1xl text-strorange font-bold">HeatmapRadius</h1>
                <EditSlider value={radius} setValue={setRadius} min={0} max={0.00002} step={0.000001} defaultValue={0.000125} />
                <h1 className="text-1xl text-strorange font-bold">{radius}</h1>
            </div>
        </>
    )
}