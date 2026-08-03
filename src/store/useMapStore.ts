import { create } from 'zustand';

interface MapState {
  center: [number, number];
  zoom: number;
  selectedMarkerId: string | null;
  mapMode: 'markers' | 'heatmap';
  setCenter: (coords: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setSelectedMarkerId: (id: string | null) => void;
  setMapMode: (mode: 'markers' | 'heatmap') => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: [14.6937, -17.4441], // Dakar coordinates
  zoom: 13,
  selectedMarkerId: null,
  mapMode: 'markers',
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setSelectedMarkerId: (selectedMarkerId) => set({ selectedMarkerId }),
  setMapMode: (mapMode) => set({ mapMode }),
}));
