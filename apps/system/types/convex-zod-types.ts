import { Id } from "@/convex/_generated/dataModel";
import { z } from "zod";

// Esquemas generados automáticamente desde el schema de Convex

export const subdominiosSchema = z.object({
  subdomain: z.string(),
  createdAt: z.number(),
  activo: z.boolean(),
});

export type Subdominios = z.infer<typeof subdominiosSchema>;

export const escuelasSchema = z.object({
  id: z.custom<Id<'escuelas'>>(),
  nombre: z.string(),
  nombreCorto: z.string(),
  logoUrl: z.optional(z.string()),
  descripcion: z.optional(z.string()),
  direccion: z.optional(z.string()),
  telefono: z.optional(z.string()),
  email: z.optional(z.string()),
  director: z.optional(z.string()),
  activa: z.boolean(),
});

export type Escuelas = z.infer<typeof escuelasSchema>;

export const prospectosSchema = z.object({
  nombre: z.string(),
  nombreCorto: z.string(),
  logoUrl: z.optional(z.string()),
  descripcion: z.optional(z.string()),
  direccion: z.optional(z.string()),
  telefono: z.optional(z.string()),
  email: z.string(),
  director: z.optional(z.string()),
});

export type Prospectos = z.infer<typeof prospectosSchema>;

export const ciclosEscolaresSchema = z.object({
  _id: z.custom<Id<'ciclosEscolares'>>(),
  escuelaId: z.custom<Id<'escuelas'>>(),
  nombre: z.string(),
  fechaInicio: z.number(),
  fechaFin: z.number(),
  activo: z.boolean(),
});

export type Ciclosescolares = z.infer<typeof ciclosEscolaresSchema>;

export const departamentoSchema = z.object({
  id: z.custom<Id<'departamento'>>(),
  escuelaId: z.custom<Id<'escuelas'>>(),
  nombre: z.string(),
  descripcion: z.optional(z.string()),
  activo: z.boolean(),
});

export type Departamento = z.infer<typeof departamentoSchema>;

export const personalSchema = z.object({
  _id: z.custom<Id<'personal'>>(),
  escuelaId: z.custom<Id<'escuelas'>>(),
  departamentoId: z.custom<Id<'departamento'>>(),
  nombre: z.string(),
  apellidos: z.string(),
  email: z.custom<string | null>(),
  telefono: z.custom<string | null>(),
  maestro: z.boolean(),
  fechaIngreso: z.number(),
  activo: z.boolean(),
});

export type Personal = z.infer<typeof personalSchema>;

export const materiasSchema = z.object({
  _id: z.custom<Id<'materias'>>(),
  escuelaId: z.custom<Id<'escuelas'>>(),
  nombre: z.string(),
  descripcion: z.optional(z.string()),
  creditos: z.optional(z.number()),
  activa: z.boolean(),
});

export type Materias = z.infer<typeof materiasSchema>;

export const salonesSchema = z.object({
  _id: z.custom<Id<'salones'>>(),
  escuelaId: z.custom<Id<'escuelas'>>(),
  nombre: z.string(),
  capacidad: z.number(),
  ubicacion: z.optional(z.string()),
  activo: z.boolean(),
});

export type Salones = z.infer<typeof salonesSchema>;

export const gruposSchema = z.object({
  id: z.custom<Id<'grupos'>>(),
  escuelaId: z.custom<Id<'escuelas'>>(),
  nombre: z.string(),
  grado: z.string(),
  activo: z.boolean(),
});

export type Grupos = z.infer<typeof gruposSchema>;

export const periodoSchema = z.object({
  _id: z.custom<Id<'periodos'>>(),
  escuelaId: z.custom<Id<'escuelas'>>(),
  nombre: z.string(),
  horaInicio: z.string(),
  horaFin: z.string(),
  activo: z.boolean(),
});

export type Periodo = z.infer<typeof periodoSchema>;

export const catalogosDeClasesSchema = z.object({
  id: z.custom<Id<'catalogosDeClases'>>(),
  escuelaId: z.custom<Id<'escuelas'>>(),
  cicloEscolarId: z.custom<Id<'ciclosEscolares'>>(),
  materiaId: z.custom<Id<'materias'>>(),
  salonId: z.custom<Id<'salones'>>(),
  maestroId: z.custom<Id<'personal'>>(),
  grupoId: z.optional(z.custom<Id<'grupos'>>()),
  nombre: z.string(),
  activa: z.boolean(),
});

export type Catalogosdeclases = z.infer<typeof catalogosDeClasesSchema>;

export const periodoPorClaseSchema = z.object({
  _id: z.custom<Id<'periodoPorClase'>>(),
  escuelaId: z.custom<Id<'escuelas'>>(),
  catalogoClaseId: z.custom<Id<'catalogosDeClases'>>(),
  periodoId: z.custom<Id<'periodos'>>(),
  diaSemana: z.number(),
  activo: z.boolean(),
});

export type Periodoporclase = z.infer<typeof periodoPorClaseSchema>;

export const padresSchema = z.object({
  _id: z.custom<Id<'padres'>>(),
  escuelaId: z.custom<Id<'escuelas'>>(),
  nombre: z.string(),
  apellidos: z.string(),
  email: z.optional(z.string()),
  telefono: z.optional(z.string()),
  direccion: z.optional(z.string()),
  activo: z.boolean(),
});

export type Padres = z.infer<typeof padresSchema>;

export const alumnosSchema = z.object({
  id: z.custom<Id<'alumnos'>>(),
  escuelaId: z.custom<Id<'escuelas'>>(),
  padreId: z.custom<Id<'padres'>>(),
  grupoId: z.custom<Id<'grupos'>>(),
  matricula: z.string(),
  nombre: z.string(),
  apellidos: z.string(),
  fechaNacimiento: z.string(),
  email: z.optional(z.string()),
  telefono: z.optional(z.number()),
  direccion: z.optional(z.string()),
  activo: z.boolean(),
});

export type Alumnos = z.infer<typeof alumnosSchema>;

export const clasesPorAlumnoSchema = z.object({
  _id: z.custom<Id<'clasesPorAlumno'>>(),
  escuelaId: z.custom<Id<'escuelas'>>(),
  catalogoClaseId: z.custom<Id<'catalogosDeClases'>>(),
  alumnoId: z.custom<Id<'alumnos'>>(),
  fechaInscripcion: z.number(),
  activa: z.boolean(),
});

export type Clasesporalumno = z.infer<typeof clasesPorAlumnoSchema>;

export const calificacionesSchema = z.object({
  _id: z.custom<Id<'calificaciones'>>(),
  escuelaId: z.custom<Id<'escuelas'>>(),
  clasePorAlumnoId: z.custom<Id<'clasesPorAlumno'>>(),
  periodo: z.string(),
  calificacion: z.number(),
  comentarios: z.optional(z.string()),
  fechaRegistro: z.number(),
});

export type Calificaciones = z.infer<typeof calificacionesSchema>;

export const asistenciaSchema = z.object({
  _id: z.custom<Id<'asistencia'>>(),
  escuelaId: z.custom<Id<'escuelas'>>(),
  clasePorAlumnoId: z.custom<Id<'clasesPorAlumno'>>(),
  fecha: z.number(),
  presente: z.boolean(),
  justificada: z.optional(z.boolean()),
  comentarios: z.optional(z.string()),
  fechaRegistro: z.number(),
});

export type Asistencia = z.infer<typeof asistenciaSchema>;

export const eventosEscolaresSchema = z.object({
  id: z.custom<Id<'eventosEscolares'>>(),
  escuelaId: z.custom<Id<'escuelas'>>(),
  nombre: z.string(),
  descripcion: z.optional(z.string()),
  tipo: z.string(),
  activo: z.boolean(),
});

export type Eventosescolares = z.infer<typeof eventosEscolaresSchema>;

export const calendarioSchema = z.object({
  _id: z.custom<Id<'calendario'>>(),
  cicloEscolarId: z.custom<Id<'ciclosEscolares'>>(),
  escuelaId: z.custom<Id<'escuelas'>>(),
  fecha: z.number(),
  tipo: z.string(),
  descripcion: z.optional(z.string()),
  activo: z.boolean(),
});

export type Calendario = z.infer<typeof calendarioSchema>;

export const eventoPorClasesSchema = z.object({
  id: z.custom<Id<'eventoPorClases'>>(),
  escuelaId: z.custom<Id<'escuelas'>>(),
  catalogoClaseId: z.custom<Id<'catalogosDeClases'>>(),
  calendarioId: z.custom<Id<'calendario'>>(),
  cicloEscolarId: z.custom<Id<'ciclosEscolares'>>(),
  eventoEscolarId: z.custom<Id<'eventosEscolares'>>(),
  fecha: z.number(),
  descripcion: z.optional(z.string()),
  activo: z.boolean(),
});

export type Eventoporclases = z.infer<typeof eventoPorClasesSchema>;
