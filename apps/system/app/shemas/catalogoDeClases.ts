import { z } from 'zod';

export const catalogoDeClaseSchema = z.object({
  cicloEscolarId: z.string(),
  materiaId: z.string(),
  salonId: z.string(),
  maestroId: z.string(),
  grupoId: z.string(),
  nombre: z.string().min(1, { message: 'El nombre es es requerído' }),
  activa: z.boolean(),
});

export type CatalogoDeClaseFormValues = z.infer<typeof catalogoDeClaseSchema>;
