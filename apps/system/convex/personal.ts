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
    fechaIngreso: v.string(),
    activo: v.boolean(),
    updateAt: v.optional(v.number()), // Timestamp para la última actualización
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('personal', { ...args })
  }
})

// Obtener todo el personal de una escuela 
export const obtenerPersonal = query({
  args: { escuelaId: v.id("escuelas") },
  handler: async (ctx, args) => {
    const perosnal = await ctx.db
      .query("personal")
      .withIndex("by_escuela", q => q.eq("escuelaId", args.escuelaId))
      .collect()
    if (!perosnal) {
      throw new Error("La escuela especificada no existe.")
    }

    return perosnal
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
    nombre: v.string(),
    apellidos: v.string(),
    email: v.optional(v.string()),
    telefono: v.optional(v.string()),
    maestro: v.boolean(), // "maestro", "director", "administrativo", etc.
    fechaIngreso: v.string(),
    activo: v.boolean(),
    updateAt: v.optional(v.number()), // Timestamp para la última actualización
  },
  handler: async (ctx, {id, nombre, apellidos, email, telefono, maestro, fechaIngreso, activo, updateAt}) => {
    const personalActualizado = await ctx.db.patch(id, {
      nombre,
      apellidos,
      email,
      telefono,
      maestro,
      fechaIngreso,
      activo,
      updateAt
    });
    return personalActualizado;
  }
})

// Eliminer alumno
export const deletePersonal = mutation({
  args: {
    id: v.id("personal"),
  },
  handler: async (ctx, {id}) => {
    const personalEliminado = await ctx.db.delete(id)

    return personalEliminado
  }
})

export const verMaestrosDelPersonal = query({
  args: {
    escuelaId: v.id("escuelas")
  },
  handler: async (ctx, args) => {
    const personal = await ctx.db
      .query('personal')
      .withIndex("by_escuela", q => q.eq("escuelaId", args.escuelaId))
      .collect();
 
    return personal
      .filter(persona => persona.maestro)
      .map((maestro) => ({
        id: maestro._id,
        ...maestro
      }));
  }
});