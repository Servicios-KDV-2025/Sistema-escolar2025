// File: apps/system/convex/escuelas.ts
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

export const crearEscuela = mutation({
    args: {
        nombre: v.string(),
        nombreCorto: v.string(),
        logoUrl: v.optional(v.string()),
        descripcion: v.optional(v.string()),
        direccion: v.optional(v.string()),
        telefono: v.optional(v.string()),
        email: v.string(),
        director: v.optional(v.string()),
        activa: v.boolean(),
    },
    handler: async (ctx, { nombre, nombreCorto, logoUrl, descripcion, direccion, telefono, email, director, activa }) => {
        const nuevaEscuelaId = await ctx.db.insert("escuelas", {
            nombre,
            nombreCorto,
            logoUrl,
            descripcion,
            direccion,
            telefono,
            email,
            director,
            activa,
        });
        
        // Obtener y devolver la escuela completa
        const escuela = await ctx.db.get(nuevaEscuelaId);
        return escuela;
    }
});