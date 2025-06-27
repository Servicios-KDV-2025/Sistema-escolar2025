// File: apps/system/convex/prospectos.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const obtenerProspectos = query({
    handler: async (ctx) => {
        const prospectos = await ctx.db.query("prospectos").collect();
        return prospectos;
    }
});

export const obtenerProspectoPorId = query({
    args: { id: v.id("prospectos") },
    handler: async (ctx, { id }) => {
        const prospecto = await ctx.db.get(id);
        if (!prospecto) {
            return null; // Devolver null en lugar de lanzar error
        }
        return prospecto;
    }
});

export const obtenerProspectoPorEmail = query({
    args: { email: v.string() },    
    handler: async (ctx, { email }) => {
        const prospecto = await ctx.db.query("prospectos")
            .filter(q => q.eq(q.field("email"), email))
            .first();
        
        if (!prospecto) {
            return null; // Devolver null si no se encuentra el prospecto
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
        const nuevoProspectoId = await ctx.db.insert("prospectos", {
            nombre,
            nombreCorto,
            logoUrl,            
            descripcion,
            direccion,
            telefono,
            email,
            director,
        });
        
        // Obtener y devolver el prospecto completo
        const prospecto = await ctx.db.get(nuevoProspectoId);
        return prospecto;
    }
}); 

export const eliminarProspecto = mutation({
    args: { id: v.id("prospectos") },
    handler: async (ctx, { id }) => {
        const prospecto = await ctx.db.get(id);
        if (!prospecto) {
            return null; // Devolver null si no se encuentra el prospecto
        }
        await ctx.db.delete(id);
        return prospecto; // Devolver el prospecto eliminado
    }
});

// Nueva mutación para transferir prospecto a escuela
export const transferirProspectoAEscuela = mutation({
    args: { 
        prospectoId: v.id("prospectos")
    },
    handler: async (ctx, { prospectoId }) => {
        // Obtener el prospecto
        const prospecto = await ctx.db.get(prospectoId);
        if (!prospecto) {
            throw new Error("Prospecto no encontrado");
        }

        // Crear la escuela con los datos del prospecto
        const nuevaEscuelaId = await ctx.db.insert("escuelas", {
            nombre: prospecto.nombre,
            nombreCorto: prospecto.nombreCorto,
            logoUrl: prospecto.logoUrl,
            descripcion: prospecto.descripcion,
            direccion: prospecto.direccion,
            telefono: prospecto.telefono,
            email: prospecto.email,
            director: prospecto.director,
            activa: true, // Nueva escuela activa por defecto
        });

        // Obtener la escuela completa
        const nuevaEscuela = await ctx.db.get(nuevaEscuelaId);

        // Eliminar el prospecto
        await ctx.db.delete(prospectoId);

        return { 
            success: true, 
            escuela: nuevaEscuela,
            message: "Prospecto transferido a escuela exitosamente"
        };
    }
});