// store/useEscuelaStore.ts
import { create } from 'zustand';
import { Escuela } from '../types/escuelas'; 

interface EscuelaState {
  selectedEscuela: Escuela | null;
  setSelectedEscuela: (escuela: Escuela | null) => void;
}

export const useEscuelaStore = create<EscuelaState>((set) => ({
  selectedEscuela: null,
  setSelectedEscuela: (escuela) => set({ selectedEscuela: escuela }),
}));