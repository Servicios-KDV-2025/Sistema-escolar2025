import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Crear un salón
export const crearSalon = mutation({
  args: {
    escuelaId: v.id("escuelas"),
    nombre: v.string(),
    capacidad: v.number(),
    ubicacion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("salones", {
      escuelaId: args.escuelaId,
      nombre: args.nombre,
      capacidad: args.capacidad,
      ubicacion: args.ubicacion,
      activo: true,
    });
  },
});

// Obtener todos los salones activos por escuela
export const obtenerSalones = query({
  args: { escuelaId: v.id("escuelas") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("salones")
      .withIndex("by_escuela", (q) => q.eq("escuelaId", args.escuelaId))
      .filter((q) => q.eq(q.field("activo"), true))
      .collect();
  },
});

// Obtener un salón por su ID
export const obtenerSalonPorId = query({
  args: {
    escuelaId: v.id("escuelas"),
    salonId: v.id("salones"),
  },
  handler: async (ctx, args) => {
    const salon = await ctx.db.get(args.salonId);
    if (!salon || salon.escuelaId !== args.escuelaId || !salon.activo) {
      //throw new Error("Salón no encontrado o no pertenece a esta escuela.");
      return null; // Retornar null si no se encuentra el salón o no es activo
    }
    return salon;
  },
});

// Actualizar un salón
export const actualizarSalon = mutation({
  args: {
    salonId: v.id("salones"),
    escuelaId: v.id("escuelas"),
    nombre: v.string(),
    capacidad: v.number(),
    ubicacion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const salon = await ctx.db.get(args.salonId);
    if (!salon || salon.escuelaId !== args.escuelaId) {
      throw new Error("No autorizado o no encontrado");
    }
    return await ctx.db.patch(args.salonId, {
      nombre: args.nombre,
      capacidad: args.capacidad,
      ubicacion: args.ubicacion,
    });
  },
});

// Eliminar (inhabilitar) un salón
export const eliminarSalon = mutation({
  args: {
    salonId: v.id("salones"),
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    const salon = await ctx.db.get(args.salonId);
    if (!salon || salon.escuelaId !== args.escuelaId) {
      throw new Error("No autorizado o no encontrado");
    }
    return await ctx.db.patch(args.salonId, { activo: false });
  },
});
