"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import HeatmapOverlay from "heatmap.js/plugins/leaflet-heatmap";
import { useHeatmapStore } from "@/store/useHeatmapStore";
import { processCoordinates, calculateFieldCornersFromMap } from "@/lib/coordinates";

export default function LeafletMap() {
    const { radius, rotation, activityData, interpolationInterval, center, pitchSize, pitchX, pitchY, tileType, showOverflow, fieldBoundary, setFieldBoundary } = useHeatmapStore();
    const mapRef = useRef<L.Map | null>(null);
    const heatmapLayerRef = useRef<any>(null);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    const fieldMarkersRef = useRef<L.Marker[]>([]);
    const [mapView, setMapView] = useState<{ center: L.LatLng; zoom: number } | null>(null);

    // Process coordinates with interpolation
    const processedActivityData = useMemo(() => {
        if (activityData.length === 0) return [];
        
        // Convert activityData to coordinates format for processing
        const coords: [number, number][] = activityData.map(point => [point.lat, point.lng]);
        const result = processCoordinates(coords, interpolationInterval);
        return result.activityData;
    }, [activityData, interpolationInterval]);

    // Calculate field corners using the map's container point conversion
    const fieldCorners = useMemo(() => {
        if (!mapRef.current) {
            console.log("Map not ready yet");
            return null;
        }
        
        console.log("Calculating field corners with map:", mapRef.current);
        console.log("Field settings:", { pitchSize, pitchX, pitchY, rotation });
        console.log("Map view:", mapView);
        
        try {
            const corners = calculateFieldCornersFromMap(mapRef.current, pitchSize, pitchX, pitchY, rotation);
            console.log("Calculated corners:", corners);
            return corners;
        } catch (error) {
            console.error("Error calculating field corners:", error);
            return null;
        }
    }, [pitchSize, pitchX, pitchY, rotation, mapView]); // Added mapView to dependencies

    // Update field boundary in store
    useEffect(() => {
        if (fieldCorners) {
            setFieldBoundary(fieldCorners);
        }
    }, [fieldCorners, setFieldBoundary]);

    // Update field corner markers
    useEffect(() => {
        if (!mapRef.current || !fieldCorners) return;

        // Remove existing markers
        fieldMarkersRef.current.forEach(marker => {
            mapRef.current?.removeLayer(marker);
        });
        fieldMarkersRef.current = [];

        // Add new markers for each corner
        fieldCorners.forEach((corner, index) => {
            const marker = L.marker([corner.lat, corner.lng], {
                icon: L.divIcon({
                    className: 'field-corner-marker',
                    html: `<div style="background: red; width: 8px; height: 8px; border-radius: 50%; border: 1px solid white; box-shadow: 0 0 3px rgba(0,0,0,0.7);"></div>`,
                    iconSize: [8, 8],
                    iconAnchor: [4, 4]
                }),
                zIndexOffset: 2000
            }).addTo(mapRef.current!);
            
            fieldMarkersRef.current.push(marker);
        });

        console.log("Field corners:", fieldCorners);
    }, [fieldCorners]);

    // Track map view changes
    useEffect(() => {
        if (!mapRef.current) return;

        const updateMapView = () => {
            const center = mapRef.current!.getCenter();
            const zoom = mapRef.current!.getZoom();
            setMapView({ center, zoom });
        };

        // Update view initially
        updateMapView();

        // Listen for map view changes
        mapRef.current.on('moveend', updateMapView);
        mapRef.current.on('zoomend', updateMapView);
        mapRef.current.on('move', updateMapView); // Real-time updates

        return () => {
            if (mapRef.current) {
                mapRef.current.off('moveend', updateMapView);
                mapRef.current.off('zoomend', updateMapView);
                mapRef.current.off('move', updateMapView);
            }
        };
    }, [mapRef.current]);

    useEffect(() => {
        // Initialize the map only when center is available
        if (!mapRef.current && center) {
            console.log("Initializing map with center:", center);
            mapRef.current = L.map('map').setView([center.lat, center.lon], 19);
            
            // Add initial tile layer
            const tileUrl = tileType === 'satellite' 
                ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            
            tileLayerRef.current = L.tileLayer(tileUrl, {
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

            // Test the container point conversion
            setTimeout(() => {
                if (mapRef.current) {
                    const containerCenter = mapRef.current.getContainer();
                    const centerX = containerCenter.offsetWidth / 2;
                    const centerY = containerCenter.offsetHeight / 2;
                    const testLatLng = mapRef.current.containerPointToLatLng([centerX, centerY]);
                    console.log("Test conversion - center pixel to lat/lng:", { centerX, centerY, testLatLng });
                }
            }, 1000);
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [center]);

    // Update tile layer when tileType changes
    useEffect(() => {
        if (mapRef.current && tileLayerRef.current) {
            // Remove current tile layer
            mapRef.current.removeLayer(tileLayerRef.current);
            
            // Add new tile layer
            const tileUrl = tileType === 'satellite' 
                ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            
            tileLayerRef.current = L.tileLayer(tileUrl, {
                maxZoom: 22,
            }).addTo(mapRef.current);
        }
    }, [tileType]);

    // Update the heatmap layer when the processed activity data changes
    useEffect(() => {
        if (heatmapLayerRef.current && processedActivityData.length > 0) {
            console.log("Updating heatmap layer with", processedActivityData.length, "points");
            heatmapLayerRef.current.setData({
                max: 1,
                data: processedActivityData.map(point => ({ ...point, value: 1 }))
            });
            heatmapLayerRef.current.cfg.radius = radius;
        }
    }, [radius, processedActivityData]);

    // Debug field corners calculation
    useEffect(() => {
        if (fieldCorners) {
            console.log("Field corners recalculated:", fieldCorners);
            console.log("Field settings:", { pitchSize, pitchX, pitchY, rotation });
        }
    }, [fieldCorners, pitchSize, pitchX, pitchY, rotation]);

    // Don't render the map div until center is updated
    if (!center) {
        return <div style={{ height: "600px", width: "70%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            Loading map...
        </div>;
    }

    return (
        <div style={{ position: "relative", height: "600px", width: "70%", overflow: "hidden" }}>
            <div id="map" style={{ height: "100%", width: "100%" }}></div>
            <div 
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(calc(-50% + ${pitchX}px), calc(-50% - ${pitchY}px)) rotate(${rotation}deg)`,
                    width: `${pitchSize * 0.67}px`, // Maintain aspect ratio (74/111 ≈ 0.67)
                    height: `${pitchSize}px`,
                    pointerEvents: "none",
                    zIndex: 1000,
                    overflow: "visible"
                }}
            >
                <svg 
                    width="100%" 
                    height="100%" 
                    viewBox="0 0 74 111"
                    preserveAspectRatio="xMidYMid meet"
                    style={{ 
                        filter: "drop-shadow(0 0 2px rgba(0,0,0,0.25))",
                        display: "block"
                    }}
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
