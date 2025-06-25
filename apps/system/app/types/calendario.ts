import { GenericId } from "convex/values";

export type CalendariosId = GenericId<"calendario">;

export interface Calendario {
  _id: CalendariosId;
  escuelaId: GenericId<"escuelas">;
  cicloEscolarId: GenericId<"ciclosEscolares">;
  fecha: number;
  tipo: string;
  descripcion?: string;
  activo: boolean;
}