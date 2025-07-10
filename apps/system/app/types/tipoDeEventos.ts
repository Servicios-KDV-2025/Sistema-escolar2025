import { Id } from "@/convex/_generated/dataModel";
import { GenericId } from "convex/values";

export interface TiposDeEventos {
  _id: GenericId<"tiposDeEventos">
  escuelaId: Id<"escuelas">
  nombre: string
  clave: string
  descripcion?: string
  color?: string
  icono?: string
  activo: boolean
}