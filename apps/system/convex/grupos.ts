import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear
export const crearGrupo = mutation({
  args: {
    escuelaId: v.id("escuelas"),
    nombre: v.string(),
    grado: v.string(),
    seccion: v.string(),
    activo: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("grupos", { ...args });
  },
});

// Leer todos
export const verTodosLosGrupos = query({
  handler: async (ctx) => {
    const grupos = await ctx.db.query("grupos").collect();
    return grupos.map(({ _id, ...rest }) => ({
      id: _id,
      ...rest,
    }));
  },
});

// Leer uno
export const grupoPorId = query({
  args: { id: v.id("grupos") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Actualizar
export const actualizarGrupo = mutation({
  args: {
    id: v.id("grupos"),
    nombre: v.string(),
    grado: v.string(),
    seccion: v.string(),
    activo: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

// Eliminar
export const eliminarGrupo = mutation({
  args: { id: v.id("grupos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
