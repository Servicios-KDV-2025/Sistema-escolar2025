// convex/eventosEscolares.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1. Obtener Eventos Escolares por escuela (lo más común)
// Ahora requiere un escuelaId para obtener los eventos asociados.
export const obtenerEventosEscolaresPorEscuela = query({
  args: {
    escuelaId: v.id("escuelas"), // <-- Este argumento es ahora obligatorio
  },
  handler: async (ctx, args) => {
    // Opcional: Puedes validar si la escuela existe antes de buscar eventos
    const escuela = await ctx.db.get(args.escuelaId);
    if (!escuela) {
      throw new Error("La escuela especificada no existe.");
    }

    // Usamos el índice 'by_escuela' para una consulta eficiente
    return await ctx.db
      .query("eventosEscolares")
      .withIndex("by_escuela", (q) => q.eq("escuelaId", args.escuelaId))
      .collect();
  },
});

// Opcional: Obtener todos los Eventos (sin filtro de escuela).
// Solo si realmente necesitas ver TODOS los eventos de TODAS las escuelas.
export const obtenerTodosLosEventosEscolares = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("eventosEscolares").collect();
  },
});


// 2. Crear un nuevo Evento Escolar
// Requiere escuelaId explícitamente.
export const crearEventoEscolar = mutation({
  args: {
    escuelaId: v.id("escuelas"), // <-- Argumento requerido
    nombre: v.string(),
    descripcion: v.optional(v.string()),
    tipo: v.string(), // "examen", "evento", "suspension", etc.
    activo: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Opcional: Validar que la escuela existe antes de insertar
    const escuelaExiste = await ctx.db.get(args.escuelaId);
    if (!escuelaExiste) {
      throw new Error("No se puede crear el evento: La escuela especificada no existe.");
    }
    return await ctx.db.insert("eventosEscolares", args);
  },
});

// 3. Actualizar un Evento Escolar existente
// Ahora requiere el escuelaId para verificar que el evento pertenece a la escuela correcta.
export const actualizarEventoEscolar = mutation({
  args: {
    id: v.id("eventosEscolares"), // ID del evento a actualizar
    escuelaId: v.id("escuelas"), // <-- Argumento requerido para validación
    nombre: v.optional(v.string()),
    descripcion: v.optional(v.string()),
    tipo: v.optional(v.string()),
    activo: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, escuelaId, ...data } = args; // Separamos ID y escuelaId

    // Verificamos que el evento exista y que pertenezca a la escuela correcta
    const eventoExistente = await ctx.db.get(id);
    if (!eventoExistente || eventoExistente.escuelaId !== escuelaId) {
      throw new Error("No se puede actualizar: Evento no encontrado o no pertenece a la escuela especificada.");
    }

    await ctx.db.patch(id, data); // Actualiza el evento
    return await ctx.db.get(id); // Devuelve el evento actualizado
  },
});

// 4. Eliminar un Evento Escolar
// Ahora requiere el escuelaId para verificar que el evento pertenece a la escuela correcta.
export const eliminarEventoEscolar = mutation({
  args: {
    id: v.id("eventosEscolares"), // ID del evento a eliminar
    escuelaId: v.id("escuelas"), // <-- Argumento requerido para validación
  },
  handler: async (ctx, args) => {
    // Verificamos que el evento exista y que pertenezca a la escuela correcta
    const eventoExistente = await ctx.db.get(args.id);
    if (!eventoExistente || eventoExistente.escuelaId !== args.escuelaId) {
      throw new Error("No se puede eliminar: Evento no encontrado o no pertenece a la escuela especificada.");
    }

    await ctx.db.delete(args.id);
    return true; // Retorna true si la eliminación fue exitosa
  },
});