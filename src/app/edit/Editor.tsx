"use client";

import { useHeatmapStore } from "@/store/useHeatmapStore";
import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import { redirect } from 'next/navigation';
import EditSlider from "./EditSlider";
import { Button } from "@radix-ui/themes";
import { LeafletMapRef } from "./LeafletMap";

const LeafletMap = dynamic(() => import('./LeafletMap'), {ssr: false}); 

export default function Editor() {
    const { rotation, setRotation, radius, setRadius, pitchSize, setPitchSize, pitchX, setPitchX, pitchY, setPitchY, tileType, setTileType, interpolationInterval, setInterpolationInterval, showOverflow, setShowOverflow, showFieldOverlay, setShowFieldOverlay } = useHeatmapStore();
    const mapRef = useRef<LeafletMapRef>(null);

    const handleCapture = async () => {
        try {
            if (mapRef.current) {
                const dataUrl = await mapRef.current.captureHeatmap();
                
                // Create download link
                const link = document.createElement('a');
                link.download = 'heatmap.png';
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Error capturing heatmap:', error);
            alert('Failed to capture heatmap. Please try again.');
        }
    };

    return (
        <>
        <div className="flex flex-col lg:flex-row items-center justify-center w-full">
            <div className="flex justify-center w-full">
                <LeafletMap ref={mapRef} />
            </div>
            <div className="flex flex-col items-center justify-center gap-4 mt-4 w-full">
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
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center justify-between gap-2 w-full max-w-sm">
                        <h1 className="text-1xl text-strorange font-bold text-right w-24">Rotation</h1>
                        <div className="flex justify-center flex-1">
                            <EditSlider value={rotation} setValue={setRotation} min={-90} max={90} step={1} defaultValue={0} />
                        </div>
                        <h1 className="text-1xl text-strorange font-bold text-left w-12">{rotation}°</h1>
                    </div>
                    <div className="flex items-center justify-between gap-2 w-full max-w-sm">
                        <h1 className="text-1xl text-strorange font-bold text-right w-24">Pitch Size</h1>
                        <div className="flex justify-center flex-1">
                            <EditSlider value={pitchSize} setValue={setPitchSize} min={50} max={800} step={1} defaultValue={300} />
                        </div>
                        <h1 className="text-1xl text-strorange font-bold text-left w-12">{pitchSize}</h1>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2 w-full max-w-sm">
                        <h1 className="text-1xl text-strorange font-bold text-right w-24">Pitch X</h1>
                        <div className="flex justify-center flex-1">
                            <EditSlider value={pitchX} setValue={setPitchX} min={-200} max={200} step={1} defaultValue={0} />
                        </div>
                        <h1 className="text-1xl text-strorange font-bold text-left w-12">{pitchX}</h1>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2 w-full max-w-sm">
                        <h1 className="text-1xl text-strorange font-bold text-right w-24">Pitch Y</h1>
                        <div className="flex justify-center flex-1">
                            <EditSlider value={pitchY} setValue={setPitchY} min={-200} max={200} step={1} defaultValue={0} />
                        </div>
                        <h1 className="text-1xl text-strorange font-bold text-left w-12">{pitchY}</h1>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2 w-full max-w-sm">
                        <h1 className="text-1xl text-strorange font-bold text-right leading-tight w-24">Interpolation Distance</h1>
                        <div className="flex justify-center flex-1">
                            <EditSlider value={interpolationInterval} setValue={setInterpolationInterval} min={1} max={10} step={0.1} defaultValue={1.5} />
                        </div>
                        <h1 className="text-1xl text-strorange font-bold text-left w-12">{interpolationInterval}m</h1>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2 w-full max-w-sm">
                        <h1 className="text-1xl text-strorange font-bold text-right w-24">Heatmap Radius</h1>
                        <div className="flex justify-center flex-1">
                            <EditSlider value={radius} setValue={setRadius} min={0.000001} max={0.00002} step={0.000001} defaultValue={0.000125} />
                        </div>
                        <h1 className="text-1xl text-strorange font-bold text-left w-12">{radius}</h1>
                    </div>
                </div>
                <Button
                className="px-4 py-2 rounded-md bg-gradient-to-br from-strorange to-purple-400 text-white font-medium hover:opacity-80"
                onClick={handleCapture}
                >
                    Capture Heatmap
                </Button>
            </div>
        </div>
        </>
    )
}