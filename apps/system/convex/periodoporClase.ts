import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Crear
export const crearPeriodoPorClase = mutation({
  args: {
    escuelaId: v.id("escuelas"),
    catalogoClaseId: v.id("catalogosDeClases"),
    periodoId: v.id("periodos"),
    diaSemana: v.number(), // 1=Lunes, 2=Martes, etc.
    activo: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Validar existencia de la escuela y clase
    const escuela = await ctx.db.get(args.escuelaId);
    const clase = await ctx.db.get(args.catalogoClaseId);
    const periodo = await ctx.db.get(args.periodoId);
    if (!escuela) throw new Error("Escuela no encontrada.");
    if (!clase) throw new Error("Catálogo de clase no encontrado.");
    if (!periodo) throw new Error("Periodo no encontrado.");
    return await ctx.db.insert("periodoPorClase", args);
  },
});

// Leer todos por escuela
export const obtenerPeriodosPorClasePorEscuela = query({
  args: { escuelaId: v.id("escuelas") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("periodoPorClase")
      .withIndex("by_escuela", (q) => q.eq("escuelaId", args.escuelaId))
      .collect();
  },
});

// Leer todos por catálogo de clase
export const obtenerPeriodosPorClasePorCatalogo = query({
  args: { catalogoClaseId: v.id("catalogosDeClases") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("periodoPorClase")
      .withIndex("by_catalogo_clase", (q) => q.eq("catalogoClaseId", args.catalogoClaseId))
      .collect();
  },
});

// Leer uno por ID
export const obtenerPeriodoPorClasePorId = query({
  args: { id: v.id("periodoPorClase") },
  handler: async (ctx, args) => {
    const registro = await ctx.db.get(args.id);
    if (!registro) throw new Error("Registro no encontrado.");
    return registro;
  },
});

// Actualizar
export const actualizarPeriodoPorClase = mutation({
  args: {
    id: v.id("periodoPorClase"),
    escuelaId: v.id("escuelas"),
    catalogoClaseId: v.id("catalogosDeClases"),
    periodoId: v.id("periodos"),
    diaSemana: v.optional(v.number()),
    activo: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, escuelaId, catalogoClaseId, periodoId, ...data } = args;
    const registro = await ctx.db.get(id);
    if (
      !registro ||
      registro.escuelaId !== escuelaId ||
      registro.catalogoClaseId !== catalogoClaseId ||
      registro.periodoId !== periodoId
    ) {
      throw new Error("No se puede actualizar: Registro no encontrado o no pertenece a los IDs especificados.");
    }
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

// Eliminar
export const eliminarPeriodoPorClase = mutation({
  args: {
    id: v.id("periodoPorClase"),
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    const registro = await ctx.db.get(args.id);
    if (!registro || registro.escuelaId !== args.escuelaId) {
      throw new Error("No se puede eliminar: Registro no encontrado o no pertenece a la escuela especificada.");
    }
    await ctx.db.delete(args.id);
    return true;
  },
});