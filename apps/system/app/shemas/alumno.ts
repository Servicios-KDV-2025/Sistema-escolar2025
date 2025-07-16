import { z } from "zod"

export const alumnoSchema = z.object({
  padreId: z.string().min(1, {message: "Debes seleccionar un grupo"}),
  grupoId: z.string().min(1, { message: "Debes seleccionar padres o Tutor" }),
  matricula: z.string().min(1, { message: "La matricula es requerida" }),
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  apellidos: z.string().min(1, { message: "Los apellidos son requeridos" }),
  fechaNacimiento: z.string().min(1, { message: "fecha de nachimineto requerida" }),
  email: z.string().min(1, { message: "El email es requerido" }),
  telefono: z.string().min(1, { message: "El numero de telefono es rquerido" }),
  direccion: z.string().min(1, { message: "La dirección es requerida" }),
  activo: z.boolean(),
  updateAt: z.number().optional(),
})

export type AlumnoFormValues = z.infer<typeof alumnoSchema>