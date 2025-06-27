import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1. Obtener materias POR una escuela específica
export const obtenerMateriasPorEscuela = query({
  args: {
    escuelaId: v.id("escuelas"), // Ahora el ID de la escuela es OBLIGATORIO
  },
  handler: async (ctx, args) => {
    // Validar si la escuela existe antes de buscar sus materias
    const escuela = await ctx.db.get(args.escuelaId);
    if (!escuela) {
      throw new Error("La escuela especificada no existe.");
    }
    return await ctx.db
      .query("materias")
      .withIndex("by_escuela", (q) => q.eq("escuelaId", args.escuelaId))
      .collect();
  },
});

// 2. Obtener una sola materia por su ID, asegurándose de que pertenezca a una escuela
export const obtenerMateriaPorIdConEscuela = query({
  args: {
    id: v.id("materias")
  },
  handler: async (ctx, args) => {
    const materia = await ctx.db.get(args.id);
    // Verificamos que la materia exista y que pertenezca a la escuela correcta
    if (!materia) {
      throw new Error("Materia no encontrada o no pertenece a esta escuela.");
    }
    return materia;
  },
});

// --- MUTATIONS (Modificaciones) ---

// 3. Crear una nueva materia DENTRO de una escuela específica
export const crearMateriaConEscuela = mutation({
  args: {
    escuelaId: v.id("escuelas"), // El ID de la escuela es OBLIGATORIO para crear la materia
    nombre: v.string(),
    descripcion: v.optional(v.string()),
    creditos: v.optional(v.number()),
    activa: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Validación: Asegurarse de que la escuela exista antes de crear la materia
    const escuelaExiste = await ctx.db.get(args.escuelaId);
    if (!escuelaExiste) {
      throw new Error(
        "No se puede crear la materia: La escuela especificada no existe."
      );
    }
    return await ctx.db.insert("materias", args);
  },
});

// 4. Actualizar una materia existente, asegurándose de que pertenezca a la escuela
export const actualizarMateriaConEscuela = mutation({
  args: {
    id: v.id("materias"), // ID de la materia a actualizar
    escuelaId: v.id("escuelas"), // ID de la escuela a la que pertenece la materia
    nombre: v.optional(v.string()),
    descripcion: v.optional(v.string()),
    creditos: v.optional(v.number()),
    activa: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, escuelaId, ...data } = args;

    // Primero, obtener la materia para verificar que existe y que su escuelaId coincida
    const materiaExistente = await ctx.db.get(id);
    if (!materiaExistente || materiaExistente.escuelaId !== escuelaId) {
      throw new Error(
        "No se puede actualizar: Materia no encontrada o no pertenece a la escuela especificada."
      );
    }
    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});

// 5. Eliminar una materia, asegurándose de que pertenezca a la escuela
export const eliminarMateriaConEscuela = mutation({
  args: {
    id: v.id("materias"), // ID de la materia a eliminar
  },
  handler: async (ctx, args) => {
    // Verificar que la materia existe y pertenece a la escuela antes de eliminar
    const materiaExistente = await ctx.db.get(args.id);
    if (!materiaExistente) {
      throw new Error(
        "No se puede eliminar: Materia no encontrada o no pertenece a la escuela especificada."
      );
    }
    await ctx.db.delete(args.id);
    return true;
  },
});
