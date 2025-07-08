import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1. Obtener periodos POR una escuela específica
export const obtenerPeriodosPorEscuela = query({
  args: {
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    const escuela = await ctx.db.get(args.escuelaId);
    if (!escuela) {
      throw new Error("La escuela especificada no existe.");
    }
    return await ctx.db
      .query("periodos")
      .withIndex("by_escuela", (q) => q.eq("escuelaId", args.escuelaId))
      .collect();
  },
});

// 2. Obtener un solo periodo por su ID
export const obtenerPeriodoPorId = query({
  args: {
    id: v.id("periodos"),
  },
  handler: async (ctx, args) => {
    const periodo = await ctx.db.get(args.id);
    if (!periodo) {
      throw new Error("Periodo no encontrado.");
    }
    return periodo;
  },
});

// --- MUTATIONS ---

// 3. Crear un nuevo periodo DENTRO de una escuela específica
export const crearPeriodo = mutation({
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
      throw new Error("No se puede crear el periodo: La escuela especificada no existe.");
    }
    return await ctx.db.insert("periodos", args);
  },
});

// 4. Actualizar un periodo existente, asegurándose de que pertenezca a la escuela
export const actualizarPeriodo = mutation({
  args: {
    id: v.id("periodos"),
    escuelaId: v.id("escuelas"),
    nombre: v.optional(v.string()),
    horaInicio: v.optional(v.string()),
    horaFin: v.optional(v.string()),
    activo: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, escuelaId, ...data } = args;
    const periodoExistente = await ctx.db.get(id);
    if (!periodoExistente || periodoExistente.escuelaId !== escuelaId) {
      throw new Error("No se puede actualizar: Periodo no encontrado o no pertenece a la escuela especificada.");
    }
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

// 5. Eliminar un periodo, asegurándose de que pertenezca a la escuela
export const eliminarPeriodo = mutation({
  args: {
    id: v.id("periodos"),
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    const periodoExistente = await ctx.db.get(args.id);
    if (!periodoExistente || periodoExistente.escuelaId !== args.escuelaId) {
      throw new Error("No se puede eliminar: Periodo no encontrado o no pertenece a la escuela especificada.");
    }
    await ctx.db.delete(args.id);
    return true;
  },
});