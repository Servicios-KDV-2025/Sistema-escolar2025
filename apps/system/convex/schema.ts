import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
 
const applicationTables = {
  // Tabla principal de escuelas
  escuelas: defineTable({
    nombre: v.string(),
    direccion: v.string(),
    telefono: v.optional(v.string()),
    email: v.optional(v.string()),
    director: v.optional(v.string()),
    activa: v.boolean(),
  }),
 
  // Ciclos escolares
  ciclosEscolares: defineTable({
    escuelaId: v.id("escuelas"),
    nombre: v.string(), // ej: "2024-2025"
    fechaInicio: v.number(), // timestamp
    fechaFin: v.number(), // timestamp
    activo: v.boolean(),
  }).index("by_escuela", ["escuelaId", "activo"]),
 
  // Departamentos
  departamento: defineTable({
    escuelaId: v.id("escuelas"),
    nombre: v.string(),
    descripcion: v.optional(v.string()),
    activo: v.boolean(),
  }).index("by_escuela", ["escuelaId"]),
 
  // Personal (maestros, administrativos, etc.)
  personal: defineTable({
    escuelaId: v.id("escuelas"),
    departamentoId: v.id("departamento"),
    nombre: v.string(),
    apellidos: v.string(),
    email: v.optional(v.string()),
    telefono: v.optional(v.string()),
    puesto: v.string(), // "maestro", "director", "administrativo", etc.
    fechaIngreso: v.number(),
    activo: v.boolean(),
  })
    .index("by_escuela", ["escuelaId"])
    .index("by_departamento", ["departamentoId"]),
 
  // Materias
  materias: defineTable({
    escuelaId: v.id("escuelas"),
    nombre: v.string(),
    descripcion: v.optional(v.string()),
    creditos: v.optional(v.number()),
    activa: v.boolean(),
  }).index("by_escuela", ["escuelaId"]),
 
  // Salones
  salones: defineTable({
    escuelaId: v.id("escuelas"),
    nombre: v.string(), // ej: "Aula 101"
    capacidad: v.number(),
    ubicacion: v.optional(v.string()),
    activo: v.boolean(),
  }).index("by_escuela", ["escuelaId"]),
 
  // Grupos
  grupos: defineTable({
    escuelaId: v.id("escuelas"),
    nombre: v.string(), // ej: "1°A", "2°B"
    grado: v.string(),
    activo: v.boolean(),
  }).index("by_escuela", ["escuelaId"]),
 
  // Periodos (horarios)
  periodos: defineTable({
    escuelaId: v.id("escuelas"),
    nombre: v.string(), // ej: "1ra hora", "2da hora"
    horaInicio: v.string(), // formato "HH:MM"
    horaFin: v.string(), // formato "HH:MM"
    activo: v.boolean(),
  }).index("by_escuela", ["escuelaId"]),
 
  // Catálogo de clases (programación de materias)
  catalogosDeClases: defineTable({
    escuelaId: v.id("escuelas"),
    cicloEscolarId: v.id("ciclosEscolares"),
    materiaId: v.id("materias"),
    salonId: v.id("salones"),
    maestroId: v.id("personal"),
    grupoId: v.optional(v.id("grupos")),
    nombre: v.string(), // ej: "Matemáticas 1°A"
    activa: v.boolean(),
  })
    .index("by_escuela", ["escuelaId"])
    .index("by_ciclo", ["cicloEscolarId"])
    .index("by_materia", ["materiaId"])
    .index("by_salon", ["salonId"])
    .index("by_maestro", ["maestroId"]),
 
  // Relación periodo por clase (horarios de clases)
  periodoPorClase: defineTable({
    escuelaId: v.id("escuelas"),
    catalogoClaseId: v.id("catalogosDeClases"),
    periodoId: v.id("periodos"),
    diaSemana: v.number(), // 1=Lunes, 2=Martes, etc.
    activo: v.boolean(),
  })
    .index("by_escuela", ["escuelaId"])
    .index("by_catalogo_clase", ["catalogoClaseId"])
    .index("by_periodo", ["periodoId"]),
 
  // Padres de familia
  padres: defineTable({
    escuelaId: v.id("escuelas"),
    nombre: v.string(),
    apellidos: v.string(),
    email: v.optional(v.string()),
    telefono: v.optional(v.string()),
    direccion: v.optional(v.string()),
    activo: v.boolean(),
  }).index("by_escuela", ["escuelaId"]),
 
  // Alumnos
  alumnos: defineTable({
    escuelaId: v.id("escuelas"),
    padreId: v.id("padres"),
    grupoId: v.id("grupos"),
    matricula: v.string(),
    nombre: v.string(),
    apellidos: v.string(),
    fechaNacimiento: v.number(),
    email: v.optional(v.string()),
    telefono: v.optional(v.string()),
    direccion: v.optional(v.string()),
    activo: v.boolean(),
  })
    .index("by_escuela", ["escuelaId"])
    .index("by_padre", ["padreId"])
    .index("by_grupo", ["grupoId"])
    .index("by_matricula", ["matricula"]),
 
  // Clases por alumno (inscripciones)
  clasesPorAlumno: defineTable({
    escuelaId: v.id("escuelas"),
    catalogoClaseId: v.id("catalogosDeClases"),
    alumnoId: v.id("alumnos"),
    fechaInscripcion: v.number(),
    activa: v.boolean(),
  })
    .index("by_escuela", ["escuelaId"])
    .index("by_catalogo_clase", ["catalogoClaseId"])
    .index("by_alumno", ["alumnoId"]),
 
  // Calificaciones
  calificaciones: defineTable({
    escuelaId: v.id("escuelas"),
    clasePorAlumnoId: v.id("clasesPorAlumno"),
    periodo: v.string(), // "1er Parcial", "2do Parcial", etc.
    calificacion: v.number(),
    comentarios: v.optional(v.string()),
    fechaRegistro: v.number(),
  })
    .index("by_escuela", ["escuelaId"])
    .index("by_clase_alumno", ["clasePorAlumnoId"]),
 
  // Asistencia
  asistencia: defineTable({
    escuelaId: v.id("escuelas"),
    clasePorAlumnoId: v.id("clasesPorAlumno"),
    fecha: v.number(), // timestamp del día
    presente: v.boolean(),
    justificada: v.optional(v.boolean()),
    comentarios: v.optional(v.string()),
    fechaRegistro: v.number(),
  })
    .index("by_escuela", ["escuelaId"])
    .index("by_clase_alumno", ["clasePorAlumnoId"])
    .index("by_fecha", ["fecha"]),
 
  // Eventos escolares
  eventosEscolares: defineTable({
    escuelaId: v.id("escuelas"),
    nombre: v.string(),
    descripcion: v.optional(v.string()),
    tipo: v.string(), // "examen", "evento", "suspension", etc.
    activo: v.boolean(),
  }).index("by_escuela", ["escuelaId"]),
 
  // Calendario escolar
  calendario: defineTable({
    cicloEscolarId: v.id("ciclosEscolares"),
    escuelaId: v.id("escuelas"),
    fecha: v.number(), // timestamp
    tipo: v.string(), // "clase", "feriado", "examen", etc.
    descripcion: v.optional(v.string()),
    activo: v.boolean(),
  })
    .index("by_escuela", ["escuelaId", "activo"])
    .index("by_ciclo", ["cicloEscolarId"])
    .index("by_fecha", ["fecha"]),
 
  // Eventos por clases
  eventoPorClases: defineTable({
    escuelaId: v.id("escuelas"),
    catalogoClaseId: v.id("catalogosDeClases"),
    calendarioId: v.id("calendario"),
    cicloEscolarId: v.id("ciclosEscolares"),
    eventoEscolarId: v.id("eventosEscolares"),
    fecha: v.number(),
    descripcion: v.optional(v.string()),
    activo: v.boolean(),
  })
    .index("by_escuela", ["escuelaId"])
    .index("by_catalogo_clase", ["catalogoClaseId"])
    .index("by_calendario", ["calendarioId"])
    .index("by_ciclo", ["cicloEscolarId"])
    .index("by_evento", ["eventoEscolarId"]),
};
 
export default defineSchema({
  ...authTables,
  ...applicationTables,
});