import { z } from "zod"

export const personalSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  apellidos: z.string().min(1, { message: "Los apellidos son requeridos" }),
  email: z.string().min(1, { message: "El email es requerido" }),
  telefono: z.string().min(1, { message: "El numero de telefono es rquerido" }),
  puesto: z.string().min(1, { message: "El puesto" }),
  fechaIngreso: z.number().min(1, { message: "fecha de ingreso requerida" }),
  activo: z.boolean(),
})

export type PersonalFormValues = z.infer<typeof personalSchema>