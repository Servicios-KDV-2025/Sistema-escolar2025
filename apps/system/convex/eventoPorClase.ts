import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear
export const crearEventoXClase = mutation({
  args: {
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

// Leer todos
export const verTodosLosEventosXClases = query({
  handler: async (ctx) => {
    const eventos = await ctx.db.query("eventoPorClases").collect();
    return eventos.map(({ _id, ...rest }) => ({
      id: _id,
      ...rest,
    }));
  },
});

// Leer uno
export const verUnEventoXClase = query({
  args: { id: v.id("eventoPorClases") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Actualizar
export const actualizarEventoXClase = mutation({
  args: {
    id: v.id("eventoPorClases"),
    fecha: v.number(),
    descripcion: v.optional(v.string()),
    activo: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

// Eliminar
export const eliminarEventoXClase = mutation({
  args: { id: v.id("eventoPorClases") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
