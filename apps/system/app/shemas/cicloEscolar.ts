import { z } from "zod";

export const cicloEscolarSchema = z.object({
    nombre: z.string().min(1, { message: "El nombre es requerido" }),
    fechaInicio: z.string().min(1, { message: "La fecha de inicio es requerida" }),
    fechaFin: z.string().min(1, { message: "La fecha fin es requerida" }),
    activo: z.boolean().optional()
});

export type CicloEscolarFormValues = z.infer<typeof cicloEscolarSchema>;