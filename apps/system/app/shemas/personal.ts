import { z } from "zod"
 
export const personalSchema = z.object({
  departamentoId: z.string().min(1, { message: "Denes seleccionar un departamento" }),
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  apellidos: z.string().min(1, { message: "Los apellidos son requeridos" }),
  email: z.string().min(1, { message: "El email es requerido" }),
  telefono: z.string().min(1, { message: "El numero de telefono es rquerido" }),
  maestro: z.boolean(),
  fechaIngreso: z.number().min(1, { message: "fecha de ingreso requerida" }),
  activo: z.boolean(),
})
 
export type PersonalFormValues = z.infer<typeof personalSchema>