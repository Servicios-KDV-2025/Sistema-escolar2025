import { z } from "zod"; 

const ubicacionesPermitidas = [
  "Planta baja",
  "Primer piso",
  "Segundo piso",
  "Tercer piso",
] as const;

export const salonSchema = z.object({
  nombre: z
    .string()
    .min(1, { message: "El nombre es requerido" }),
  capacidad: z.coerce
    .number({
      invalid_type_error: "La capacidad debe ser un número",
    })
    .min(1, { message: "Mínimo 1 alumno" })
    .max(30, { message: "Máximo 30 alumnos" }),
  ubicacion: z.enum(ubicacionesPermitidas, {
    errorMap: () => ({ message: "Selecciona una ubicación válida" }),
  }),
});

export type SalonFormValues = z.infer<typeof salonSchema>;
