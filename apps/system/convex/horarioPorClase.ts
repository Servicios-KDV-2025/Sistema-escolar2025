import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Crear
export const crearHorarioPorClase = mutation({
  args: {
    escuelaId: v.id("escuelas"),
    catalogoClaseId: v.id("catalogosDeClases"),
    horarioId: v.id("horarios"),
    diaSemana: v.number(), // 1=Lunes, 2=Martes, etc.
    activo: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Validar existencia de la escuela y clase
    const escuela = await ctx.db.get(args.escuelaId);
    const clase = await ctx.db.get(args.catalogoClaseId);
    const horario = await ctx.db.get(args.horarioId);
    if (!escuela) throw new Error("Escuela no encontrada.");
    if (!clase) throw new Error("Catálogo de clase no encontrado.");
    if (!horario) throw new Error("Horario no encontrado.");
    return await ctx.db.insert("horarioPorClase", args);
  },
});

// Leer todos por escuela
export const obtenerHorariosPorClasePorEscuela = query({
  args: { escuelaId: v.id("escuelas") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("horarioPorClase")
      .withIndex("by_escuela", (q) => q.eq("escuelaId", args.escuelaId))
      .collect();
  },  
});   

// Leer todos por catálogo de clase
export const obtenerHorariosPorClasePorCatalogo = query({
  args: { catalogoClaseId: v.id("catalogosDeClases") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("horarioPorClase")
      .withIndex("by_catalogo_clase", (q) => q.eq("catalogoClaseId", args.catalogoClaseId))
      .collect();
  },
});

// Leer uno por ID
export const obtenerHorarioPorClasePorId = query({
  args: { id: v.id("horarioPorClase") },
  handler: async (ctx, args) => {
    const registro = await ctx.db.get(args.id);
    if (!registro) throw new Error("Registro no encontrado.");
    return registro;
  },
});

// Actualizar 
export const actualizarHorarioPorClase = mutation({
  args: {
    id: v.id("horarioPorClase"),
    escuelaId: v.id("escuelas"),
    catalogoClaseId: v.id("catalogosDeClases"),
    horarioId: v.id("horarios"),
    diaSemana: v.optional(v.number()),
    activo: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, escuelaId, ...data } = args;
    const registro = await ctx.db.get(id);
    if (!registro || registro.escuelaId !== escuelaId) {
      throw new Error("No se puede actualizar: Registro no encontrado o no pertenece a la escuela.");
    }
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

// Eliminar
  export const eliminarHorarioPorClase = mutation({
  args: {
    id: v.id("horarioPorClase"),
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