import { z } from "zod";

export const calendarioSchema = z.object({
    fecha: z.date({
        required_error: "La fecha es requerida",
        invalid_type_error: "Fecha inválida",
    }),
    hora: z.string().optional(),
    tipoEventoId: z.string({
        required_error: "El tipo de evento es requerido",
    }).min(1, "Debe seleccionar un tipo de evento"),
    descripcion: z
        .string()
        .max(500, "La descripción no puede exceder 500 caracteres")
        .optional(),
    cicloEscolarId: z.string({
        required_error: "El ciclo escolar es requerido",
    }).min(1, "Debe seleccionar un ciclo escolar"),
    activo: z.boolean().optional()
});

export type CalendarioFormValues = z.infer<typeof calendarioSchema>;