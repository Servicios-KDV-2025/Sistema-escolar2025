// app/schemas/departamento.ts
import { z } from "zod";

// Define el esquema de Zod para los valores del formulario de un departamento
export const departamentoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre del departamento es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim(),
  descripcion: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .optional(),
  activo: z.boolean(),
});

export type DepartamentoFormValues = z.infer<typeof departamentoSchema>;

export type Departamento = {
  id: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
};