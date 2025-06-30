// src/app/schemas/materia.ts
import { z } from "zod";

export const materiaSchema = z.object({
  nombre: z.string().min(1, "El nombre de la materia es obligatorio."),
  descripcion: z.string().optional(),
  creditos: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val === undefined || val === "") return true;
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      {
        message: "Los créditos deben ser un número válido mayor o igual a 0.",
        path: ["creditos"],
      }
    ),

  activa: z.boolean().default(true),
});

export type MateriaFormValues = z.input<typeof materiaSchema>;
