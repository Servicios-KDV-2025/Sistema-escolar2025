import { GenericId } from "convex/values";

export type CiclosEscolaresId = GenericId<"ciclosEscolares">;
export type EscuelaId = GenericId<"escuelas">;

export interface CicloEscolar {
  _id: CiclosEscolaresId;
  escuelaId: EscuelaId
  nombre: string;
  fechaInicio: number;
  fechaFin: number;
  activo: boolean;
}