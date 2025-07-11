import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


// Crear
export const crearEventoXClase = mutation({
  args: {
    escuelaId: v.id("escuelas"),
    catalogoClaseId: v.id("catalogosDeClases"),
    calendarioId: v.id("calendario"),
    cicloEscolarId: v.id("ciclosEscolares"),
    eventoEscolarId: v.id("eventosEscolares"),
    fecha: v.number(),
    descripcion: v.optional(v.string()),
    activo: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("eventoPorClases", { ...args });
  },
});



// Read all
export const verTodosLosEventosXClases = query({
  args: {
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    const eventos = await ctx.db
      .query("eventoPorClases")
      .filter(q => q.eq(q.field("escuelaId"), args.escuelaId))
      .collect();
 
    return eventos.map(({ _id, ...rest }) => ({
      _id,
      ...rest,
    }));
  },
});
 
// Read one
export const verUnEventoXClase = query({
  args: {
    _id: v.id("eventoPorClases"),
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    const evento = await ctx.db.get(args._id);
    if (!evento || evento.escuelaId !== args.escuelaId) return null;
    return evento;
  },
});

// Update
export const actualizarEventoXClase = mutation({
  args: {
    _id: v.id("eventoPorClases"),
    catalogoClaseId: v.id("catalogosDeClases"),
    calendarioId: v.id("calendario"),
    cicloEscolarId: v.id("ciclosEscolares"),
    eventoEscolarId: v.id("eventosEscolares"),
    escuelaId: v.id("escuelas"),
    fecha: v.number(),
    descripcion: v.optional(v.string()),
    activo: v.boolean(),
  },
  handler: async (ctx, args) => {
    const evento = await ctx.db.get(args._id);
    if (!evento || evento.escuelaId !== args.escuelaId) throw new Error("Acceso denegado");

    const { _id, ...data } = args;
    await ctx.db.patch(_id, data);
  },
});
 
// Delete
export const eliminarEventoXClase = mutation({
  args: {
    _id: v.id("eventoPorClases"),
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    const evento = await ctx.db.get(args._id);
    if (!evento || evento.escuelaId !== args.escuelaId) throw new Error("Acceso denegado");
    await ctx.db.delete(args._id);
  },
});