import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HeatmapStore {
    selectedActivityId: string | null;
    setSelectedActivityId: (id: string) => void;

    radius: number;
    setRadius: (radius: number) => void;

    rotation: number;
    setRotation: (rotation: number) => void;
    
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
            activityData: [],
            center: null,
            setSelectedActivityId: (id: string) => set({ selectedActivityId: id }),
            setRadius: (radius: number) => set({ radius }),
            setRotation: (rotation: number) => set({ rotation }),
            setActivityData: (data: any[]) => set({ activityData: data }),
            setCenter: (center: { lat: number, lon: number } | null) => set({ center }),
            reset: () => set({
                selectedActivityId: "",
                radius: 0.000125,
                rotation: 0,
                center: null,
            }),
        }),
        {
            name: "heatmap-storage", // unique name for the storage
            storage: localStorageWrapper,
        }
    )
);