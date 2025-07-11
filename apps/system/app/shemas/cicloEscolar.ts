import { z } from "zod";

export const cicloEscolarSchema = z.object({
    _id: z.string().optional(),
    nombre: z.string().min(1, { message: "El nombre es requerido" }),
    fechaInicio: z.union([
        z.string().min(1, { message: "La fecha de inicio es requerida" }),
        z.number().transform((val) => new Date(val).toISOString().split('T')[0])
    ]).transform((val) => typeof val === 'string' ? val : new Date(val).toISOString().split('T')[0]),
    fechaFin: z.union([
        z.string().min(1, { message: "La fecha fin es requerida" }),
        z.number().transform((val) => new Date(val).toISOString().split('T')[0])
    ]).transform((val) => typeof val === 'string' ? val : new Date(val).toISOString().split('T')[0]),
    activo: z.boolean().optional()
});

export type CicloEscolarFormValues = z.infer<typeof cicloEscolarSchema>;