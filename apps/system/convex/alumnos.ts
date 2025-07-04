import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Crear
export const crearAlumno = mutation({
  args: {
    escuelaId: v.id("escuelas"),
    padreId: v.id("padres"),
    grupoId: v.id("grupos"),
    matricula: v.string(),
    nombre: v.string(),
    apellidos: v.string(),
    fechaNacimiento: v.string(),
    email: v.optional(v.string()),
    telefono: v.optional(v.number()),
    direccion: v.optional(v.string()),
    activo: v.boolean()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('alumnos', { ...args })
  }
})

// Obtener todos los alumnos
export const obtenerAlumnos = query({
  args: { escuelaId: v.id("escuelas") },
  handler: async (ctx, args) => {
    const alumnos = await ctx.db
      .query("alumnos")
      .withIndex("by_escuela", q => q.eq("escuelaId", args.escuelaId))
      .collect()

    return alumnos.map(( _id, ...rest) => ({
      id: _id,
      ...rest
    }))
  }
})

// Oprener un alimno
export const alumnoById = query({
  args: {
    id: v.id("alumnos"),
    esculaId: v.id("escuelas")
  },
  handler: async (ctx, args) => {
    const alumno = await ctx.db.get(args.id)
    if (!alumno || alumno.escuelaId !== args.esculaId) return null
    return alumno
  }
})

// actualizar alumno
export const upadateAlumno = mutation({
  args: {
    id: v.id("alumnos"),
    escuelaId: v.id("escuelas"),
    matricula: v.string(),
    nombre: v.string(),
    apellidos: v.string(),
    fechaNacimiento: v.string(),
    email: v.optional(v.string()),
    telefono: v.optional(v.number()),
    direccion: v.optional(v.string()),
    activo: v.boolean()
  },
  handler: async (ctx, args) => {
    const alumno = await ctx.db.get(args.id)
    if (!alumno || alumno.escuelaId !== args.escuelaId) throw new Error ("Acceso denegado")
    
    const { id, ...data } = args
    await ctx.db.patch(id, data)
  }
})

// Eliminer alumno
export const deleteAlumno = mutation({
  args: {
    id: v.id("alumnos"),
    escuelaId: v.id("escuelas")
  },
  handler: async (ctx, args) => {
    const alumno = await ctx.db.get(args.id)
    if (!alumno || alumno.escuelaId !== args.escuelaId) throw new Error ("Acceso denegado")
    
    await ctx.db.delete(args.id)
  }
})