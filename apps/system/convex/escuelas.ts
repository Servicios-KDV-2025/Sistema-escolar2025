import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const obtenerEscuelas = query({
    handler: async (ctx) => {
        const escuelas = await ctx.db.query("escuelas").collect();
        return escuelas;
    }
});

export const obtenerEscuelaPorId = query({
    args: { id: v.id("escuelas") },
    handler: async (ctx, { id }) => {
        const escuela = await ctx.db.get(id);
        if (!escuela) {
            return null; // Devolver null en lugar de lanzar error
        }
        return escuela;
    }
});

export const obtenerEscuelaPorNombre = query({
    args: { nombre: v.string() },
    handler: async (ctx, { nombre }) => {
        // Decodificar el nombre que viene de la URL
        const nombreDecodificado = decodeURIComponent(nombre);
        
        const escuela = await ctx.db.query("escuelas")
            .filter((e) => e.eq(e.field("nombre"), nombreDecodificado))
            .collect();
            
        if (escuela.length === 0) {
            return null; // Devolver null en lugar de lanzar error
        }
        return escuela[0];
    }
});

export const obtenerEscuelaPorNombreCorto = query({
    args: { nombreCorto: v.string() },
    handler: async (ctx, { nombreCorto }) => {
      const escuela = await ctx.db.query("escuelas")
        .filter((e) => e.eq(e.field("nombreCorto"), nombreCorto))
        .collect();
      if (escuela.length === 0) {
        return null;
      }
      return escuela[0];
    }
  });

export const obtenerEscuelaPorEmail = query({
    args: { email: v.string() },
    handler: async (ctx, { email }) => {
      const escuela = await ctx.db.query("escuelas")
        .filter((e) => e.eq(e.field("email"), email))
        .collect();
      if (escuela.length === 0) {
        return null;
      }
      return escuela[0];
    }
  });

export const crearEscuela = mutation({
    args: {
        nombre: v.string(),
        nombreCorto: v.string(), // Esto es obligatorio
        logoUrl: v.optional(v.string()),
        descripcion: v.optional(v.string()),
        direccion: v.string(),
        telefono: v.optional(v.string()),
        email: v.string(),
        director: v.optional(v.string()),
        activa: v.boolean(),
    },
    handler: async (ctx, { nombre, nombreCorto, direccion, telefono, email, director, activa }) => { // Agrega nombreCorto aquí
        const nuevaEscuela = await ctx.db.insert("escuelas", {
            nombre,
            nombreCorto, // Agrega nombreCorto aquí
            direccion,
            telefono,
            email,
            director,
            activa,
        });
        return nuevaEscuela;
    }
});

export const actualizarEscuela = mutation({
    args: {
        id: v.id("escuelas"),
        nombre: v.optional(v.string()),
        nombreCorto: v.optional(v.string()),
        logoUrl: v.optional(v.string()),
        descripcion: v.optional(v.string()),
        direccion: v.optional(v.string()),
        telefono: v.optional(v.string()),
        email: v.optional(v.string()),
        director: v.optional(v.string()),
        activa: v.optional(v.boolean()),
    },
    handler: async (ctx, { id, ...data }) => {
        const escuela = await ctx.db.get(id);
        if (!escuela) {
            throw new Error("Escuela no encontrada");
        }
        
        const escuelaActualizada = await ctx.db.patch(id, data);
        return escuelaActualizada;
    }
});

export const eliminarEscuela = mutation({
    args: { id: v.id("escuelas") },
    handler: async (ctx, { id }) => {
        const escuela = await ctx.db.get(id);
        if (!escuela) {
            return null;
        }
        await ctx.db.delete(id);
        return escuela;
    }
});