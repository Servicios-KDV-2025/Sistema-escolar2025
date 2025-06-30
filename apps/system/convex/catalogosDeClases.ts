import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create
export const crearCatalogoDeCases = mutation({
    args: {
        escuelaId: v.id("escuelas"),
        cicloEscolarId: v.id("ciclosEscolares"),
        materiaId: v.id("materias"),
        salonId: v.id("salones"),
        maestroId: v.id("personal"),
        grupoId: v.optional(v.id("grupos")),
        nombre: v.string(),
        activa: v.boolean(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("catalogosDeClases", { ...args });
    },
});

// Read all
export const verTodosLosCatalogosDeClases = query({
    args: {
        escuelaId: v.id("escuelas"),
    },
    handler: async (ctx, args) => {
        const catalogos = await ctx.db
            .query("catalogosDeClases")
            .filter(q => q.eq(q.field("escuelaId"), args.escuelaId))
            .collect();

        return catalogos.map(({ _id, ...rest }) => ({
            id: _id,
            ...rest,
        }));
    },
});

// Read one
export const verUnCatalogoDeClase = query({
    args: {
        id: v.id("catalogosDeClases"),
        escuelaId: v.id("escuelas"),
    },
    handler: async (ctx, args) => {
        const catalogo = await ctx.db.get(args.id);
        if (!catalogo || catalogo.escuelaId !== args.escuelaId) return null;
        return catalogo;
    },
});

// Update
export const actualizarCatalogoDeClase = mutation({
    args: {
        id: v.id("catalogosDeClases"),
        escuelaId: v.id("escuelas"),
        cicloEscolarId: v.id("ciclosEscolares"),
        materiaId: v.id("materias"),
        salonId: v.id("salones"),
        maestroId: v.id("personal"),
        grupoId: v.optional(v.id("grupos")),
        nombre: v.string(),
        activa: v.boolean(),
    },
    handler: async (ctx, args) => {
        const catalogo = await ctx.db.get(args.id);
        if (!catalogo || catalogo.escuelaId !== args.escuelaId) throw new Error("Acceso denegado");

        const { id, ...data } = args;
        await ctx.db.patch(id, data);
    },
});

// Delete
export const eliminarCatalogoDeClase = mutation({
  args: {
    id: v.id("catalogosDeClases"),
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    const catalogo = await ctx.db.get(args.id);
    if (!catalogo || catalogo.escuelaId !== args.escuelaId) throw new Error("Acceso denegado");
    await ctx.db.delete(args.id);
  },
});
