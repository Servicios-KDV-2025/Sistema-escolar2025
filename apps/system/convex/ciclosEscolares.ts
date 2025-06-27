import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const crearCicloEscolar = mutation({
  args: {
    escuelaId: v.id("escuelas"),
    nombre: v.string(),
    fechaInicio: v.number(),
    fechaFin: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ciclosEscolares", {
      escuelaId: args.escuelaId,
      nombre: args.nombre,
      fechaInicio: args.fechaInicio,
      fechaFin: args.fechaFin,
      activo: true,
    });
  },
});

export const obtenerCiclosEscolares = query({
  args: { escuelaId: v.id("escuelas") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ciclosEscolares")
      .withIndex("by_escuela", (q) => q.eq("escuelaId", args.escuelaId))
      .collect();
  },
});

export const obtenerCicloEscolarPorId = query({
  args: {
    escuelaId: v.id("escuelas"),
    cicloId: v.id("ciclosEscolares"),
  },
  handler: async (ctx, args) => {
    const ciclo = await ctx.db.get(args.cicloId);
    if (!ciclo || ciclo.escuelaId !== args.escuelaId) {
      throw new Error("Ciclo no encontrado o no pertenece a esta escuela.");
    }
    return ciclo;
  },
});

export const actualizarCicloEscolar = mutation({
  args: {
    cicloId: v.id("ciclosEscolares"),
    escuelaId: v.id("escuelas"),
    nombre: v.string(),
    fechaInicio: v.number(),
    fechaFin: v.number(),
    activo: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const ciclo = await ctx.db.get(args.cicloId);
    if (!ciclo || ciclo.escuelaId !== args.escuelaId) throw new Error("No autorizado o no encontrado");
    return await ctx.db.patch(args.cicloId, {
      nombre: args.nombre,
      fechaInicio: args.fechaInicio,
      fechaFin: args.fechaFin,
      activo: args.activo
    });
  },
});

export const eliminarCicloEscolar = mutation({
  args: {
    cicloId: v.id("ciclosEscolares"),
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    const ciclo = await ctx.db.get(args.cicloId);
    if (!ciclo || ciclo.escuelaId !== args.escuelaId) throw new Error("No autorizado o no encontrado");
    return await ctx.db.patch(args.cicloId, { activo: false });
  },
});