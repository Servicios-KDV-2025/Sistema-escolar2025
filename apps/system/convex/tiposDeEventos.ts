import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const crearTipoEvento = mutation({
  args: {
    escuelaId: v.id("escuelas"),
    nombre: v.string(),
    clave: v.string(),
    descripcion: v.optional(v.string()),
    color: v.optional(v.string()),
    icono: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tiposDeEventos", {
      ...args,
      activo: true,
    });
  },
});

export const editarTipoEvento = mutation({
  args: {
    escuelaId: v.id("escuelas"),
    tipoEventoId: v.id("tiposDeEventos"),
    nombre: v.optional(v.string()),
    clave: v.optional(v.string()),
    descripcion: v.optional(v.string()),
    color: v.optional(v.string()),
    icono: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const evento = await ctx.db.get(args.tipoEventoId);
    if (!evento || evento.escuelaId !== args.escuelaId) throw new Error("No autorizado o no encontrado");
    await ctx.db.patch(args.tipoEventoId, {
      nombre: args.nombre, 
      clave: args.clave,
      descripcion: args.descripcion,
      color: args.color,
      icono: args.icono
    });
  },
});

export const obtenerTiposDeEventos= query({
  args: {
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tiposDeEventos")
      .withIndex("by_escuela", (q) => q.eq("escuelaId", args.escuelaId))
      .filter((q) => q.eq(q.field("activo"), true))
      .collect();
  },
});


export const obtenerTiposDeEventosPorId = query({
  args: {
    escuelaId: v.id("escuelas"),
    tipoEventoId: v.id("tiposDeEventos"),
  },
  handler: async (ctx, args) => {
    const evento = await ctx.db.get(args.tipoEventoId);
    if (!evento || evento.escuelaId !== args.escuelaId) {
      throw new Error("Tipo de Evento no encontrado o no pertenece a esta escuela.");
    }
    return evento;
  },
});

export const eliminarTipoEvento = mutation({
  args: {
    escuelaId: v.id("escuelas"),
    tipoEventoId: v.id("tiposDeEventos"),
  },
  handler: async (ctx, args) => {
    const evento = await ctx.db.get(args.tipoEventoId);
    if (!evento || evento.escuelaId !== args.escuelaId) throw new Error("No autorizado o no encontrado");
    return await ctx.db.patch(args.tipoEventoId, { activo: false });
},
});