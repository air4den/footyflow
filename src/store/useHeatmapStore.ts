import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HeatmapStore {
    selectedActivityId: string | null;
    setSelectedActivityId: (id: string) => void;

    radius: number;
    setRadius: (radius: number) => void;

    rotation: number;
    setRotation: (rotation: number) => void;

    pitchSize: number;
    setPitchSize: (pitchSize: number) => void;

    pitchX: number;
    setPitchX: (pitchX: number) => void;

    pitchY: number;
    setPitchY: (pitchY: number) => void;

    tileType: 'osm' | 'satellite';
    setTileType: (tileType: 'osm' | 'satellite') => void;

    interpolationInterval: number;
    setInterpolationInterval: (interval: number) => void;

    showOverflow: boolean;
    setShowOverflow: (show: boolean) => void;

    showFieldOverlay: boolean;
    setShowFieldOverlay: (show: boolean) => void;

    fieldBoundary: { lat: number; lng: number }[] | null;
    setFieldBoundary: (boundary: { lat: number; lng: number }[] | null) => void;

    activityData: any[];
    setActivityData: (data: any[]) => void;

    center: { lat: number, lon: number } | null;
    setCenter: (center: { lat: number, lon: number } | null) => void;

    reset: () => void;
}

const localStorageWrapper = {
    getItem: (name: string) => {
        const item = localStorage.getItem(name);
        return item ? JSON.parse(item) : null;
    },
    setItem: (name: string, value: any) => {
        localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name: string) => {
        localStorage.removeItem(name);
    },
};

export const useHeatmapStore = create<HeatmapStore>()(
    persist(
        (set) => ({
            selectedActivityId: "",
            radius: 0.000125,
            rotation: 0,
            pitchSize: 500,
            pitchX: 0,
            pitchY: 0,
            tileType: 'osm',
            interpolationInterval: 1.5,
            showOverflow: false,
            showFieldOverlay: false,
            fieldBoundary: null,
            activityData: [],
            center: null,
            setSelectedActivityId: (id: string) => set({ selectedActivityId: id }),
            setRadius: (radius: number) => set({ radius }),
            setRotation: (rotation: number) => set({ rotation }),
            setPitchSize: (pitchSize: number) => set({ pitchSize }),
            setPitchX: (pitchX: number) => set({ pitchX }),
            setPitchY: (pitchY: number) => set({ pitchY }),
            setTileType: (tileType: 'osm' | 'satellite') => set({ tileType }),
            setInterpolationInterval: (interval: number) => set({ interpolationInterval: interval }),
            setShowOverflow: (show: boolean) => set({ showOverflow: show }),
            setShowFieldOverlay: (show: boolean) => set({ showFieldOverlay: show }),
            setFieldBoundary: (boundary: { lat: number; lng: number }[] | null) => set({ fieldBoundary: boundary }),
            setActivityData: (data: any[]) => set({ activityData: data }),
            setCenter: (center: { lat: number, lon: number } | null) => set({ center }),
            reset: () => set({
                selectedActivityId: "",
                radius: 0.000125,
                rotation: 0,
                center: null,
                activityData: [],
                fieldBoundary: null,
            }),
        }),
        {
            name: "heatmap-storage",
            storage: localStorageWrapper,
        }
    )
);