import { z } from "zod";

export const calendarioSchema = z.object({
    fecha: z.number().min(Date.now(), { message: "La fecha de inicio debe ser una fecha futura" }),
    tipo: z.string().min(1, { message: "El nombre es requerido" }),
    descripcion: z.string().min(1, { message: "El nombre es requerido" }),
});

export type CalendarioFormValues = z.infer<typeof calendarioSchema>;