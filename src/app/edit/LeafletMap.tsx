"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import HeatmapOverlay from "heatmap.js/plugins/leaflet-heatmap";
import { useHeatmapStore } from "@/store/useHeatmapStore";

export default function LeafletMap() {
    const { radius, rotation, activityData, center } = useHeatmapStore();
    const mapRef = useRef<L.Map | null>(null);
    const heatmapLayerRef = useRef<any>(null);
    const pitchOverlayRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Initialize the map only when center is available
        if (!mapRef.current && center) {
            console.log("Initializing map with center:", center);
            mapRef.current = L.map('map').setView([center.lat, center.lon], 18);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 22,
            }).addTo(mapRef.current);

            heatmapLayerRef.current = new HeatmapOverlay({
                radius: radius,
                maxOpacity: 0.8,
                scaleRadius: true,
                useLocalExtrema: false,
                latField: 'lat',
                lngField: 'lng',
                valueField: 'value'
            }).addTo(mapRef.current);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [center]);

    // Update the heatmap layer when the activity data changes
    useEffect(() => {
        if (heatmapLayerRef.current && activityData.length > 0) {
            console.log("Updating heatmap layer");
            heatmapLayerRef.current.setData({
                max: 1,
                data: activityData.map(point => ({ ...point, value: 1 }))
            });
            heatmapLayerRef.current.cfg.radius = radius;
        }
    }, [radius, activityData]);

    // Update pitch rotation
    useEffect(() => {
        if (pitchOverlayRef.current) {
            pitchOverlayRef.current.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        }
    }, [rotation]);

    // Don't render the map div until center is updated
    if (!center) {
        return <div style={{ height: "600px", width: "70%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            Loading map...
        </div>;
    }

    return (
        <div style={{ position: "relative", height: "600px", width: "70%" }}>
            <div id="map" style={{ height: "100%", width: "100%" }}></div>
            <div 
                ref={pitchOverlayRef}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                    width: "auto",
                    height: "500px",
                    pointerEvents: "none",
                    zIndex: 1000
                }}
            >
                <svg 
                    width="100%" 
                    height="100%" 
                    viewBox="0 0 74 111"
                    style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.25))" }}
                >
                    <rect width="74" height="111" fill="none" />
                    <g fill="none" stroke="#fff" strokeWidth="0.5" transform="translate(3 3)">
                        <path d="M 0 0 h 68 v 105 h -68 Z"/>
                        <path d="M 0 52.5 h 68"/>
                        <circle r="9.15" cx="34" cy="52.5"/>
                        <circle r="0.75" cx="34" cy="52.5" fill="#fff" stroke="none"/>
                        <g>
                            <path d="M 13.84 0 v 16.5 h 40.32 v -16.5"/>
                            <path d="M 24.84 0 v 5.5 h 18.32 v -5.5"/>
                            <circle r="0.75" cx="34" cy="10.94" fill="#fff" stroke="none"/>
                            <path d="M 26.733027 16.5 a 9.15 9.15 0 0 0 14.533946 0"/>
                        </g>
                        <g transform="rotate(180,34,52.5)">
                            <path d="M 13.84 0 v 16.5 h 40.32 v -16.5"/>
                            <path d="M 24.84 0 v 5.5 h 18.32 v -5.5"/>
                            <circle r="0.75" cx="34" cy="10.94" fill="#fff" stroke="none"/>
                            <path d="M 26.733027 16.5 a 9.15 9.15 0 0 0 14.533946 0"/>
                        </g>
                        <path d="M 0 2 a 2 2 0 0 0 2 -2M 66 0 a 2 2 0 0 0 2 2M 68 103 a 2 2 0 0 0 -2 2M 2 105 a 2 2 0 0 0 -2 -2"/>
                    </g>
                </svg>
            </div>
        </div>
    );
}
