import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1. Obtener periodos por escuela
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

// 2. Obtener periodos por ciclo escolar
export const obtenerPeriodosPorCiclo = query({
  args: {
    cicloEscolarId: v.id("ciclosEscolares"),
  },
  handler: async (ctx, args) => {
    const ciclo = await ctx.db.get(args.cicloEscolarId);
    if (!ciclo) {
      throw new Error("El ciclo escolar especificado no existe.");
    }
    return await ctx.db
      .query("periodos")
      .withIndex("by_ciclo", (q) => q.eq("cicloEscolarId", args.cicloEscolarId))
      .collect();
  },
});

// 3. Obtener un periodo por su ID
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

// 4. Crear un nuevo periodo
export const crearPeriodo = mutation({
  args: {
    escuelaId: v.id("escuelas"),
    cicloEscolarId: v.id("ciclosEscolares"),
    nombre: v.string(),
    clave: v.string(),
    fechaInicio: v.number(),
    fechaFin: v.number(),
    activo: v.boolean(),
  },
  handler: async (ctx, args) => {
    const escuela = await ctx.db.get(args.escuelaId);
    const ciclo = await ctx.db.get(args.cicloEscolarId);
    if (!escuela) {
      throw new Error("No se puede crear el periodo: La escuela especificada no existe.");
    }
    if (!ciclo) {
      throw new Error("No se puede crear el periodo: El ciclo escolar especificado no existe.");
    }
    const now = Date.now();
    return await ctx.db.insert("periodos", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// 5. Actualizar un periodo existente
export const actualizarPeriodo = mutation({
  args: {
    id: v.id("periodos"),
    escuelaId: v.id("escuelas"),
    cicloEscolarId: v.id("ciclosEscolares"),
    nombre: v.optional(v.string()),
    clave: v.optional(v.string()),
    fechaInicio: v.optional(v.number()),
    fechaFin: v.optional(v.number()),
    activo: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, escuelaId, cicloEscolarId, ...data } = args;
    const periodo = await ctx.db.get(id);
    if (!periodo || periodo.escuelaId !== escuelaId || periodo.cicloEscolarId !== cicloEscolarId) {
      throw new Error("No se puede actualizar: Periodo no encontrado o no pertenece a la escuela/ciclo especificado.");
    }
    await ctx.db.patch(id, { ...data, updatedAt: Date.now() });
    return await ctx.db.get(id);
  },
});

// 6. Eliminar un periodo
export const eliminarPeriodo = mutation({
  args: {
    id: v.id("periodos"),
    escuelaId: v.id("escuelas"),
    cicloEscolarId: v.id("ciclosEscolares"),
  },
  handler: async (ctx, args) => {
    const periodo = await ctx.db.get(args.id);
    if (!periodo || periodo.escuelaId !== args.escuelaId || periodo.cicloEscolarId !== args.cicloEscolarId) {
      throw new Error("No se puede eliminar: Periodo no encontrado o no pertenece a la escuela/ciclo especificado.");
    }
    await ctx.db.delete(args.id);
    return true;
  },
});
