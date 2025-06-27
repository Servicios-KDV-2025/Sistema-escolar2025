import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create
export const crearGrupo = mutation({
  args: {
    escuelaId: v.id("escuelas"),
    nombre: v.string(),
    grado: v.string(),
    activo: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("grupos", { ...args });
  },
});

// Read all
export const verTodosLosGrupos = query({
  args: { escuelaId: v.id("escuelas") },
  handler: async (ctx, args) => {
    const grupos = await ctx.db
      .query("grupos")
      .withIndex("by_escuela", q => q.eq("escuelaId", args.escuelaId))
      .collect();

    return grupos.map(({ _id, ...rest }) => ({
      id: _id,
      ...rest,
    }));
  },
});

// Read one
export const grupoPorId = query({
  args: {
    id: v.id("grupos"),
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    const grupo = await ctx.db.get(args.id);
    if (!grupo || grupo.escuelaId !== args.escuelaId) return null;
    return grupo;
  },
});

// Upadate
export const actualizarGrupo = mutation({
  args: {
    id: v.id("grupos"),
    escuelaId: v.id("escuelas"),
    nombre: v.string(),
    grado: v.string(),
    activo: v.boolean(),
  },
  handler: async (ctx, args) => {
    const grupo = await ctx.db.get(args.id);
    if (!grupo || grupo.escuelaId !== args.escuelaId) throw new Error("Acceso denegado");

    const { id, ...data } = args;
    await ctx.db.patch(id, data);
  },
});

// Delete
export const eliminarGrupo = mutation({
  args: {
    id: v.id("grupos"),
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    const grupo = await ctx.db.get(args.id);
    if (!grupo || grupo.escuelaId !== args.escuelaId) throw new Error("Acceso denegado");
    await ctx.db.delete(args.id);
  },
});
