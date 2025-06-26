import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const obtenerProspectos = query({
    handler: async (ctx) => {
        const prospectos = await ctx.db.query("prospetos").collect();
        return prospectos;
    }
});

export const obtenerProspectoPorId = query({
    args: { id: v.id("prospetos") },
    handler: async (ctx, { id }) => {
        const prospecto = await ctx.db.get(id);
        if (!prospecto) {
            return null; // Devolver null en lugar de lanzar error
        }
        return prospecto;
    }
});

export const crearProspecto = mutation({
    args: {
        nombre: v.string(),
        nombreCorto: v.string(),
        logoUrl: v.optional(v.string()),
        descripcion: v.optional(v.string()),
        direccion: v.optional(v.string()),
        telefono: v.optional(v.string()),
        email: v.string(),
        director: v.optional(v.string()),
    },
    handler: async (ctx, { nombre, nombreCorto, logoUrl, descripcion, direccion, telefono, email, director }) => {
        const nuevoProspecto = await ctx.db.insert("prospetos", {
            nombre,
            nombreCorto,
            logoUrl,            
            descripcion,
            direccion,
            telefono,
            email,
            director,
        });
        return nuevoProspecto;
    }
}); 