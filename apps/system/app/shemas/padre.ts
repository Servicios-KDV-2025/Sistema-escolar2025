// src/app/schemas/padre.ts
import { z } from "zod";

export const padreSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  apellidos: z.string().min(1, "Los apellidos son obligatorios."),
  email: z
    .string()
    .email("El email debe tener un formato válido.")
    .optional()
    .or(z.literal("")),
  telefono: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 dígitos.")
    .optional()
    .or(z.literal("")),
  direccion: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres.")
    .optional()
    .or(z.literal("")),
  activo: z.boolean().default(true),
});

export type PadreFormValues = z.input<typeof padreSchema>; 