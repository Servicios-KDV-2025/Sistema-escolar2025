import { z } from "zod";

export const calendarioSchema = z.object({
    fecha: z.string().min(1, { message: "La fecha es requerida" }),
    tipo: z.string().min(1, { message: "El nombre es requerido" }),
    descripcion: z.string().min(1, { message: "El nombre es requerido" }),
    activo: z.boolean().optional()
});

export type CalendarioFormValues = z.infer<typeof calendarioSchema>;