import { create } from "zustand";

type Escuela = {
  _id: string;
  nombre: string;
  direccion?: string;
  logoUrl?: string;
};

type EscuelaStore = {
  escuela: Escuela | null;
  setEscuela: (e: Escuela) => void;
  resetEscuela: () => void;
};

export const useEscuela = create<EscuelaStore>((set) => ({
  escuela: null,
  setEscuela: (e) => set({ escuela: e }),
  resetEscuela: () => set({ escuela: null }),
}));
