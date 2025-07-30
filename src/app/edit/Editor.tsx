"use client";

import { useHeatmapStore } from "@/store/useHeatmapStore";
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import EditSlider from "./EditSlider";

const LeafletMap = dynamic(() => import('./LeafletMap'), {ssr: false}); 

export default function Editor() {
    const { rotation, setRotation, radius, setRadius, pitchSize, setPitchSize, pitchX, setPitchX, pitchY, setPitchY, tileType, setTileType, interpolationInterval, setInterpolationInterval, showOverflow, setShowOverflow, showFieldOverlay, setShowFieldOverlay } = useHeatmapStore();

    return (
        <div className="flex flex-row items-center justify-center gap-4 w-full">
            <LeafletMap />
            <div className="flex flex-col items-center justify-center gap-6 w-96">
                <div className="flex items-center justify-center gap-4 w-full">
                    <h1 className="text-1xl text-strorange font-bold">Map Type</h1>
                    <button
                        onClick={() => setTileType(tileType === 'osm' ? 'satellite' : 'osm')}
                        className="px-4 py-2 rounded-md bg-strorange text-white font-medium hover:bg-orange-700 transition-colors"
                    >
                        {tileType === 'osm' ? 'Switch to Satellite' : 'Switch to OSM'}
                    </button>
                </div>
                
                <div className="flex items-center justify-center gap-4 w-full">
                    <button
                        onClick={() => setShowOverflow(!showOverflow)}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            showOverflow 
                                ? 'bg-strorange text-white hover:bg-orange-700' 
                                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                    >
                        {showOverflow ? 'Hide Overflow' : 'Show Overflow'}
                    </button>
                    <button
                        onClick={() => setShowFieldOverlay(!showFieldOverlay)}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            showFieldOverlay 
                                ? 'bg-strorange text-white hover:bg-orange-700' 
                                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                        }`}
                    >
                        {showFieldOverlay ? 'Hide Field' : 'Show Field'}
                    </button>
                </div>
                
                <div className="grid grid-cols-[140px_200px_60px] gap-4 w-full items-center">
                    <h1 className="text-1xl text-strorange font-bold text-right">Rotation</h1>
                    <div className="flex justify-center">
                        <EditSlider value={rotation} setValue={setRotation} min={-90} max={90} step={1} defaultValue={0} />
                    </div>
                    <h1 className="text-1xl text-strorange font-bold text-left">{rotation}°</h1>
                </div>
                
                <div className="grid grid-cols-[140px_200px_60px] gap-4 w-full items-center">
                    <h1 className="text-1xl text-strorange font-bold text-right">Pitch Size</h1>
                    <div className="flex justify-center">
                        <EditSlider value={pitchSize} setValue={setPitchSize} min={50} max={800} step={1} defaultValue={300} />
                    </div>
                    <h1 className="text-1xl text-strorange font-bold text-left">{pitchSize}</h1>
                </div>
                
                <div className="grid grid-cols-[140px_200px_60px] gap-4 w-full items-center">
                    <h1 className="text-1xl text-strorange font-bold text-right">Pitch X</h1>
                    <div className="flex justify-center">
                        <EditSlider value={pitchX} setValue={setPitchX} min={-200} max={200} step={1} defaultValue={0} />
                    </div>
                    <h1 className="text-1xl text-strorange font-bold text-left">{pitchX}</h1>
                </div>
                
                <div className="grid grid-cols-[140px_200px_60px] gap-4 w-full items-center">
                    <h1 className="text-1xl text-strorange font-bold text-right">Pitch Y</h1>
                    <div className="flex justify-center">
                        <EditSlider value={pitchY} setValue={setPitchY} min={-200} max={200} step={1} defaultValue={0} />
                    </div>
                    <h1 className="text-1xl text-strorange font-bold text-left">{pitchY}</h1>
                </div>
                
                <div className="grid grid-cols-[140px_200px_60px] gap-4 w-full items-center">
                    <h1 className="text-1xl text-strorange font-bold text-right leading-tight">Interpolation Distance</h1>
                    <div className="flex justify-center">
                        <EditSlider value={interpolationInterval} setValue={setInterpolationInterval} min={1} max={10} step={0.1} defaultValue={1.5} />
                    </div>
                    <h1 className="text-1xl text-strorange font-bold text-left">{interpolationInterval}m</h1>
                </div>
                
                <div className="grid grid-cols-[140px_200px_60px] gap-4 w-full items-center">
                    <h1 className="text-1xl text-strorange font-bold text-right">Heatmap Radius</h1>
                    <div className="flex justify-center">
                        <EditSlider value={radius} setValue={setRadius} min={0.000001} max={0.00002} step={0.000001} defaultValue={0.000125} />
                    </div>
                    <h1 className="text-1xl text-strorange font-bold text-left">{radius}</h1>
                </div>
            </div>
        </div>
    )
}