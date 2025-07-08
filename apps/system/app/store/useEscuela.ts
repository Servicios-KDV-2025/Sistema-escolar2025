import { create } from "zustand";

type Escuela = {
  _id: string;
  nombre: string;
  nombreCorto: string;
  email?: string;
  telefono?: string;
  director?: string;
  descripcion?: string;
  direccion?: string;
  logoUrl?: string;
  activa: boolean;
};

type EscuelaStore = {
  escuela: Escuela | null;
  setEscuela: (e: Escuela) => void;
  resetEscuela: () => void;
};

export const useEscuelaEmilio = create<EscuelaStore>((set) => ({
  escuela: null,
  setEscuela: (e) => set({ escuela: e }),
  resetEscuela: () => set({ escuela: null }),
}));
