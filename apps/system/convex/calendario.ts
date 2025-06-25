import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const crearEventoCalendario = mutation({
  args: {
    cicloEscolarId: v.id("ciclosEscolares"),
    fecha: v.number(),
    tipo: v.string(),
    descripcion: v.optional(v.string()),
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("calendario", {
      cicloEscolarId: args.cicloEscolarId,
      escuelaId: args.escuelaId,
      fecha: args.fecha,
      tipo: args.tipo,
      descripcion: args.descripcion,
      activo: true,
    });
  },
});

export const obtenerEventosCalendario = query({
  args: { escuelaId: v.id("escuelas") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("calendario")
      .withIndex("by_escuela", (q) => q.eq("escuelaId", args.escuelaId).eq("activo", true))
      .collect();
  },
});

export const obtenerEventoCalendarioPorId = query({
  args: {
    escuelaId: v.id("escuelas"),
    eventoId: v.id("calendario"),
  },
  handler: async (ctx, args) => {
    const evento = await ctx.db.get(args.eventoId);
    if (!evento || evento.escuelaId !== args.escuelaId || !evento.activo) {
      throw new Error("Evento no encontrado o no pertenece a esta escuela.");
    }
    return evento;
  },
});

export const actualizarEventoCalendario = mutation({
  args: {
    eventoId: v.id("calendario"),
    escuelaId: v.id("escuelas"),
    fecha: v.number(),
    tipo: v.string(),
    descripcion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const evento = await ctx.db.get(args.eventoId);
    if (!evento || evento.escuelaId !== args.escuelaId) throw new Error("No autorizado o no encontrado");
    return await ctx.db.patch(args.eventoId, {
      fecha: args.fecha,
      tipo: args.tipo,
      descripcion: args.descripcion,
    });
  },
});

export const eliminarEventoCalendario = mutation({
  args: {
    eventoId: v.id("calendario"),
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    const evento = await ctx.db.get(args.eventoId);
    if (!evento || evento.escuelaId !== args.escuelaId) throw new Error("No autorizado o no encontrado");
    return await ctx.db.patch(args.eventoId, { activo: false });
  },
});
