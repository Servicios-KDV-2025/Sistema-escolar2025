import { z } from "zod"

const fechaLimite = new Date()
fechaLimite.setFullYear(fechaLimite.getFullYear() - 5)

export const alumnoSchema = z.object({
  padreId: z.string().min(1, {message: "Debes seleccionar padres o Tutor"}),
  grupoId: z.string().optional().or(z.literal('')),
  matricula: z.string().min(1, { message: "La matricula es requerida" }),
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  apellidos: z.string().min(1, { message: "Los apellidos son requeridos" }),
  fechaNacimiento: z.string()
    .refine((value) => {
      const fecha = new Date(value)
      return fecha <= fechaLimite
    }, { message: "El alumno debe tener al menos 5 años." }),
  email: z.string().min(1, { message: "El email es requerido" }),
  telefono: z.string().min(1, { message: "El numero de telefono es rquerido" }),
  direccion: z.string().min(1, { message: "La dirección es requerida" }),
  activo: z.boolean(),
  updateAt: z.number().optional(),
})

export type AlumnoFormValues = z.infer<typeof alumnoSchema>