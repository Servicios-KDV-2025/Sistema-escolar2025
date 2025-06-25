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
            throw new Error("Escuela no encontrada");
        }
        return escuela;
    }
});

export const obtenerEscuelaPorNombre = query({
    args: { nombre: v.string() },
    handler: async (ctx, { nombre }) => {
        const escuela = await ctx.db.query("escuelas")
        .filter((e) => e.eq(e.field("nombre"), nombre))
        .collect();
        if (escuela.length === 0) {
            throw new Error("Escuela no encontrada");
        }
        return escuela[0];
    }
});

export const crearEscuela = mutation({
    args: {
        nombre: v.string(),
        direccion: v.string(),
        telefono: v.optional(v.string()),
        email: v.optional(v.string()),
        director: v.optional(v.string()),
        activa: v.boolean(),
    },
    handler: async (ctx, { nombre, direccion, telefono, email, director, activa }) => {
        const nuevaEscuela = await ctx.db.insert("escuelas", {
            nombre,
            direccion,
            telefono,
            email,
            director,
            activa,
        });
        return nuevaEscuela;
    }
});