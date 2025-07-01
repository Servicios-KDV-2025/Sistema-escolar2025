//. app/schemas/eventoEscolar.ts
import { z } from "zod";

// Define el esquema de Zod para los valores del formulario de un evento escolar
export const eventoEscolarSchema = z.object({
  nombre: z.string().min(1, "El nombre del evento es requerido."),
  descripcion: z.string().optional(), // Es opcional en tu esquema de Convex
  tipo: z.string().min(1, "El tipo de evento es requerido."), // Es requerido en tu esquema de Convex
  activo: z.boolean(),
});


export type EventoEscolarFormValues = z.infer<typeof eventoEscolarSchema>;