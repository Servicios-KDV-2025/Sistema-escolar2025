import { z } from 'zod';

export const eventoPorClaseSchema = z.object({
  catalogoClases: z.string(),
  calendario: z.string(),
  cicloEscolar: z.string(),
  eventosEscolares: z.string(),
  fecha: z.string().min(1, { message: "La fecha es requerida" }),
  descripcion: z.string().min(1, { message: 'La descripción es requerída' }),
  activo: z.boolean(),
});

export type EventoPorClaseFormValues = z.infer<typeof eventoPorClaseSchema>;
