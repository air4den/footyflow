"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import HeatmapOverlay from "heatmap.js/plugins/leaflet-heatmap";
import { useHeatmapStore } from "@/store/useHeatmapStore";
import { processCoordinates, calculateFieldCornersFromMap, filterPointsInField } from "@/lib/coordinates";
import html2canvas from "html2canvas";

const LeafletMap = () => {
    const { radius, rotation, activityData, interpolationInterval, center, pitchSize, pitchX, pitchY, tileType, showOverflow, showFieldOverlay, captureRequested, clearCaptureRequest } = useHeatmapStore();
    const mapRef = useRef<L.Map | null>(null);
    const heatmapLayerRef = useRef<{
        setData: (data: { max: number; data: Array<{ lat: number; lng: number; value: number }> }) => void;
        cfg: { radius: number };
    } | null>(null);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [mapView, setMapView] = useState<{ center: L.LatLng; zoom: number } | null>(null);

    // Capture function
    const captureHeatmap = async () => {
        if (!mapContainerRef.current) {
            throw new Error("Map container not found");
        }

        // Get the map container dimensions
        const container = mapContainerRef.current;
        const { width, height } = container.getBoundingClientRect();
        
        // Calculate dimensions for 4:5 aspect ratio
        const aspectRatio = 4/5; // width:height ratio
        
        // Determine the shortest side and calculate the other dimension
        let captureWidth, captureHeight;
        if (width < height) {
            // Width is shorter, use it as the constraint
            captureWidth = width;
            captureHeight = width / aspectRatio;
        } else {
            // Height is shorter, use it as the constraint
            captureHeight = height;
            captureWidth = height * aspectRatio;
        }
        
        // Create a canvas with 4:5 aspect ratio
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = captureWidth;
        canvas.height = captureHeight;

        if (!ctx) {
            throw new Error("Could not get canvas context");
        }

        try {
            // Calculate the center position for capture
            const captureX = (width - captureWidth) / 2; // Center horizontally
            const captureY = (height - captureHeight) / 2; // Center vertically
            
            // Capture the entire map container including overlays
            const canvasResult = await html2canvas(container.parentElement!, {
                width: width,
                height: height,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                scale: 1,
                logging: false,
                removeContainer: true
            });
            
            // Draw only the centered portion to create the 4:5 aspect ratio
            ctx.drawImage(canvasResult, captureX, captureY, captureWidth, captureHeight, 0, 0, captureWidth, captureHeight);

            // Convert to data URL
            const dataUrl = canvas.toDataURL('image/png');
            return dataUrl;
        } catch (error) {
            console.error('Capture error:', error);
            throw new Error('Failed to capture heatmap');
        }
    };

    // Handle capture requests from store
    useEffect(() => {
        if (captureRequested) {
            captureHeatmap().then((dataUrl) => {
                // Create download link
                const link = document.createElement('a');
                link.download = 'heatmap.png';
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                clearCaptureRequest();
            }).catch((error) => {
                console.error('Error capturing heatmap:', error);
                alert('Failed to capture heatmap. Please try again.');
                clearCaptureRequest();
            });
        }
        
        // Cleanup function to clear capture request if component unmounts
        return () => {
            if (captureRequested) {
                clearCaptureRequest();
            }
        };
    }, [captureRequested, clearCaptureRequest]);

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
    }, []); // Removed mapRef.current dependency

    // Initialize Leaflet Map, Heatmap, and Logo
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
    }, [center, radius, tileType]); // Added missing dependencies

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

    // Update the heatmap layer when the relevant inputs change
    useEffect(() => {
        let active = true;

        // Recalculate filteredActivityData here
        const coords: [number, number][] = activityData.map(point => [point.lat, point.lng]);
        const { activityData: processed } = processCoordinates(coords, interpolationInterval);
        const filtered = filterPointsInField(processed, fieldCorners, showOverflow);

        if (heatmapLayerRef.current && active) {
            try {
                if (filtered.length > 0) {
                    heatmapLayerRef.current.setData({
                        max: 1,
                        data: filtered.map(point => ({ ...point, value: 1 }))
                    });
                } else {
                    heatmapLayerRef.current.setData({
                        max: 1,
                        data: []
                    });
                }
                heatmapLayerRef.current.cfg.radius = radius;
            } catch {
                console.error("Error updating heatmap layer");
            }
        }
        return () => {
            active = false;
        };
    }, [activityData, interpolationInterval, fieldCorners, showOverflow, radius]); // Fixed dependency array

    // Don't render the map div until center is updated
    if (!center) {
        return <div style={{ height: "600px", width: "95%", maxWidth: "800px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            Loading map...
        </div>;
    }

    return (
        <div style={{ position: "relative", height: "600px", width: "92%", maxWidth: "800px", overflow: "hidden", zIndex: "0" }}>
            <div id="map" ref={mapContainerRef} style={{ height: "100%", width: "100%" }}></div>
            {showFieldOverlay && (
                <div 
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: `translate(calc(-50% + ${pitchX}px), calc(-50% - ${pitchY}px)) rotate(${rotation}deg)`,
                        width: `${pitchSize * 0.67}px`,
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
            )}
        </div>
    );
};

LeafletMap.displayName = 'LeafletMap';

export default LeafletMap;
