import { z } from 'zod';

export const gradoSchema = z.object({
  grado: z.enum(["1°", "2°", "3°", "4°", "5°", "6°"], {
    errorMap: () => ({ message: "Selecciona un grado válido" })
  }),
  nombre: z.string().min(1, { message: 'El nombre es requerido' }),
  activo: z.boolean(),
});

export type GradoFormValues = z.infer<typeof gradoSchema>;
