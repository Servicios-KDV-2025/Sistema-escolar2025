import { z } from "zod"

export const clasePorAlumnoSchema = z.object({
  _id: z.string().optional(),
  catalogoClaseId: z.string().min(1, "Debe seleccionar una clase"),
  alumnoId: z.string().min(1, "Debe seleccionar un alumno"),
  cicloEscolarId: z.string().min(1, "Debe seleccionar un ciclo escolar"),
  fechaInscripcion: z.string().min(1, "La fecha de inscripción es requerida"),
  activo: z.boolean().default(true),
})

export type ClasePorAlumnoFormValues = z.infer<typeof clasePorAlumnoSchema> 