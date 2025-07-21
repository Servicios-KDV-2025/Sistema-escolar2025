import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1. Obtener horarios POR una escuela específica
export const obtenerHorariosPorEscuela = query({
  args: {
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    const escuela = await ctx.db.get(args.escuelaId);
    if (!escuela) {
      throw new Error("La escuela especificada no existe.");
    }
    return await ctx.db
      .query("horarios")
      .withIndex("by_escuela", (q) => q.eq("escuelaId", args.escuelaId))
      .collect();
  },
});

// 2. Obtener un solo horario por su ID
export const obtenerHorarioPorId = query({
  args: {
    id: v.id("horarios"),
  },
  handler: async (ctx, args) => {
    const horario = await ctx.db.get(args.id);
    if (!horario) {
      throw new Error("Horario no encontrado.");
    }
    return horario;
  },
});

// --- MUTATIONS ---

// 3. Crear un nuevo horario DENTRO de una escuela específica
export const crearHorario = mutation({
  args: {
    escuelaId: v.id("escuelas"),
    nombre: v.string(),
    horaInicio: v.string(),
    horaFin: v.string(),
    activo: v.boolean(),
  },
  handler: async (ctx, args) => {
    const escuelaExiste = await ctx.db.get(args.escuelaId);
    if (!escuelaExiste) {
      throw new Error("No se puede crear el horario: La escuela especificada no existe.");
    }
    return await ctx.db.insert("horarios", args);
  },
});

// 4. Actualizar un horario existente, asegurándose de que pertenezca a la escuela
export const actualizarHorario = mutation({
  args: {
    id: v.id("horarios"),
    escuelaId: v.id("escuelas"),
    nombre: v.optional(v.string()),
    horaInicio: v.optional(v.string()),
    horaFin: v.optional(v.string()),
    activo: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, escuelaId, ...data } = args;
    const horarioExistente = await ctx.db.get(id);
    if (!horarioExistente || horarioExistente.escuelaId !== escuelaId) {
      throw new Error("No se puede actualizar: Horario no encontrado o no pertenece a la escuela especificada.");
    }
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

// 5. Eliminar un horario, asegurándose de que pertenezca a la escuela
export const eliminarHorario = mutation({
  args: {
    id: v.id("horarios"),
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
      const horarioExistente = await ctx.db.get(args.id);
    if (!horarioExistente || horarioExistente.escuelaId !== args.escuelaId) {
      throw new Error("No se puede eliminar: Horario no encontrado o no pertenece a la escuela especificada.");
    }
    await ctx.db.delete(args.id);
    return true;
  },
});