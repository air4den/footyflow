// Function to calculate distance between two points in meters
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// Function to interpolate points along a line segment
export function interpolatePoints(
    lat1: number, lng1: number, 
    lat2: number, lng2: number, 
    intervalDistance: number
): [number, number][] {
    const totalDistance = calculateDistance(lat1, lng1, lat2, lng2);
    const numPoints = Math.ceil(totalDistance / intervalDistance);
    
    if (numPoints <= 1) {
        return [[lat1, lng1]];
    }

    const points: [number, number][] = [];
    for (let i = 0; i <= numPoints; i++) {
        const fraction = i / numPoints;
        const lat = lat1 + (lat2 - lat1) * fraction;
        const lng = lng1 + (lng2 - lng1) * fraction;
        points.push([lat, lng]);
    }
    
    return points;
}

// Function to process coordinates with interpolation
export function processCoordinates(
    rawCoords: [number, number][], 
    interpolationInterval: number
): { activityData: { lat: number; lng: number }[] } {
    if (rawCoords.length < 2) {
        const activityData = rawCoords.map(([lat, lng]) => ({ lat, lng }));
        return { activityData };
    }

    // Process coordinates with interpolation
    const processed: [number, number][] = [];
    for (let i = 0; i < rawCoords.length - 1; i++) {
        const [lat1, lng1] = rawCoords[i];
        const [lat2, lng2] = rawCoords[i + 1];
        
        const interpolatedPoints = interpolatePoints(lat1, lng1, lat2, lng2, interpolationInterval);
        processed.push(...interpolatedPoints.slice(0, -1));
    }
    
    // Add the final point
    processed.push(rawCoords[rawCoords.length - 1]);

    // Convert to activity data format
    const activityData = processed.map(([lat, lng]) => ({ lat, lng }));

    return { activityData };
} 

// Function to calculate the four corners of the field in lat/lon coordinates
export function calculateFieldCorners(
    center: { lat: number; lon: number },
    pitchSize: number,
    pitchX: number,
    pitchY: number,
    rotation: number,
    mapBounds?: { north: number; south: number; east: number; west: number }
): { lat: number; lng: number }[] {
    // This function will be called from the component where we have access to the map instance
    // For now, return a placeholder - the actual calculation will be done in the component
    return [];
}

// Function to calculate field corners using the map's container point conversion
export function calculateFieldCornersFromMap(
    map: L.Map,
    pitchSize: number,
    pitchX: number,
    pitchY: number,
    rotation: number
): { lat: number; lng: number }[] {
    console.log("calculateFieldCornersFromMap called with:", { pitchSize, pitchX, pitchY, rotation });
    
    // Get the map container dimensions
    const mapContainer = map.getContainer();
    const containerWidth = mapContainer.offsetWidth;
    const containerHeight = mapContainer.offsetHeight;
    
    console.log("Map container dimensions:", { containerWidth, containerHeight });
    
    // Calculate the center of the map container
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    
    // Calculate field dimensions in pixels
    const fieldWidth = pitchSize * 0.67;
    const fieldHeight = pitchSize;
    
    // Calculate the field center position (accounting for pitchX and pitchY)
    const fieldCenterX = centerX + pitchX;
    const fieldCenterY = centerY - pitchY; // Invert pitchY to match field overlay transform
    
    console.log("Field center position:", { fieldCenterX, fieldCenterY });
    console.log("Field dimensions:", { fieldWidth, fieldHeight });
    
    // Calculate the four corners relative to field center (before rotation)
    // Reduce the dimensions slightly to move corners closer to the center
    const halfWidth = (fieldWidth / 2) * .92; 
    const halfHeight = (fieldHeight / 2) * .95; 
    
    const cornerPoints = [
        { x: fieldCenterX - halfWidth, y: fieldCenterY - halfHeight }, // Top-left
        { x: fieldCenterX + halfWidth, y: fieldCenterY - halfHeight }, // Top-right
        { x: fieldCenterX + halfWidth, y: fieldCenterY + halfHeight }, // Bottom-right
        { x: fieldCenterX - halfWidth, y: fieldCenterY + halfHeight }  // Bottom-left
    ];
    
    console.log("Corner points (pixels):", cornerPoints);
    
    // Apply rotation if needed
    let rotatedCornerPoints = cornerPoints;
    if (rotation !== 0) {
        const rotationRad = (rotation * Math.PI) / 180;
        const cos = Math.cos(rotationRad);
        const sin = Math.sin(rotationRad);
        
        rotatedCornerPoints = cornerPoints.map(point => {
            // Translate to origin
            const dx = point.x - fieldCenterX;
            const dy = point.y - fieldCenterY;
            
            // Rotate
            const rotatedX = dx * cos - dy * sin;
            const rotatedY = dx * sin + dy * cos;
            
            // Translate back
            return {
                x: fieldCenterX + rotatedX,
                y: fieldCenterY + rotatedY
            };
        });
        
        console.log("Rotated corner points (pixels):", rotatedCornerPoints);
    }
    
    // Convert pixel coordinates to lat/lng using the map's conversion method
    const corners = rotatedCornerPoints.map(point => {
        const latLng = map.containerPointToLatLng([point.x, point.y]);
        return { lat: latLng.lat, lng: latLng.lng };
    });
    
    console.log("Final corner coordinates:", corners);
    return corners;
} 

// Function to check if a point is inside a polygon (field boundaries)
export function isPointInPolygon(
    point: { lat: number; lng: number },
    polygon: { lat: number; lng: number }[]
): boolean {
    const { lat, lng } = point;
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].lng;
        const yi = polygon[i].lat;
        const xj = polygon[j].lng;
        const yj = polygon[j].lat;
        
        if (((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
            inside = !inside;
        }
    }
    
    return inside;
}

// Function to filter activity data to only include points within field boundaries
export function filterPointsInField(
    activityData: { lat: number; lng: number }[],
    fieldCorners: { lat: number; lng: number }[] | null,
    showOverflow: boolean
): { lat: number; lng: number }[] {
    if (showOverflow || !fieldCorners || fieldCorners.length < 3) {
        return activityData; // Show all points if overflow is enabled or no valid field
    }
    
    return activityData.filter(point => 
        isPointInPolygon(point, fieldCorners)
    );
} 