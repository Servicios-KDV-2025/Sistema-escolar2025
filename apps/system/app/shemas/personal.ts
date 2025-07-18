import { z } from "zod"

const fechaLimite = new Date()
fechaLimite.setFullYear(fechaLimite.getFullYear())
 
export const personalSchema = z.object({
  departamentoId: z.string().min(1, { message: "Denes seleccionar un departamento" }),
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  apellidos: z.string().min(1, { message: "Los apellidos son requeridos" }),
  email: z.string().min(1, { message: "El email es requerido" }),
  telefono: z.string().min(1, { message: "El numero de telefono es rquerido" }),
  maestro: z.boolean(),
  fechaIngreso: z.string()//.min(1, { message: "fecha de ingreso requerida" }),
    .refine((value) => {
      const fecha = new Date(value)
      return fecha <= fechaLimite
    }, { message: "La fecha no debe ser posterior a la fecha actual" }),
  activo: z.boolean(),
})
 
export type PersonalFormValues = z.infer<typeof personalSchema>