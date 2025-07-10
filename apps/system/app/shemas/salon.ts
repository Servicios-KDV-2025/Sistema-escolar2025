import { z } from "zod";

const ubicacionesPermitidas = [
  "Planta baja",
  "Primer piso",
  "Segundo piso",
  "Tercer piso",
] as const;

export const salonSchema = z.object({
  _id: z.string().optional(),
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  capacidad: z.coerce.number().min(1).max(30),
  ubicacion: z.enum(ubicacionesPermitidas, {
    errorMap: () => ({ message: "Ubicación inválida" }),
  }),
});

export type SalonFormValues = z.infer<typeof salonSchema>;
