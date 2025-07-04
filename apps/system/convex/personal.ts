import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

// Crear
export const crearPersonal = mutation({
  args: {
    escuelaId: v.id("escuelas"),
    departamentoId: v.id("departamento"),
    nombre: v.string(),
    apellidos: v.string(),
    email: v.optional(v.string()),
    telefono: v.optional(v.string()),
    maestro: v.boolean(), // "maestro", "director", "administrativo", etc.
    fechaIngreso: v.number(),
    activo: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('personal', { ...args })
  }
})

// Obtener todos los alumnos
export const obtenerPersonal = query({
  args: { escuelaId: v.id("escuelas") },
  handler: async (ctx, args) => {
    const perosnal = await ctx.db
      .query("personal")
      .withIndex("by_escuela", q => q.eq("escuelaId", args.escuelaId))
      .collect()

    return perosnal.map((_id, ...rest) => ({
      id: _id,
      ...rest
    }))
  }
})

// Oprener un alimno
export const PersonalById = query({
  args: {
    id: v.id("personal"),
    esculaId: v.id("escuelas")
  },
  handler: async (ctx, args) => {
    const personal = await ctx.db.get(args.id)
    if (!personal || personal.escuelaId !== args.esculaId) return null
    return personal
  }
})

// actualizar alumno
export const upadatePersonal = mutation({
  args: {
    id: v.id("personal"),
    escuelaId: v.id("escuelas"),
    nombre: v.string(),
    apellidos: v.string(),
    email: v.optional(v.string()),
    telefono: v.optional(v.string()),
    maestro: v.boolean(), // "maestro", "director", "administrativo", etc.
    fechaIngreso: v.number(),
    activo: v.boolean()
  },
  handler: async (ctx, args) => {
    const personal = await ctx.db.get(args.id)
    if (!personal || personal.escuelaId !== args.escuelaId) throw new Error("Acceso denegado")

    const { id, ...data } = args
    await ctx.db.patch(id, data)
  }
})

// Eliminer alumno
export const deletePersonal = mutation({
  args: {
    id: v.id("personal"),
    escuelaId: v.id("escuelas")
  },
  handler: async (ctx, args) => {
    const personal = await ctx.db.get(args.id)
    if (!personal || personal.escuelaId !== args.escuelaId) throw new Error("Acceso denegado")

    await ctx.db.delete(args.id)
  }
})