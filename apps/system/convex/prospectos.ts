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
        const nuevoProspecto = await ctx.db.insert("prospectos", {
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

export const transferirProspectoAEscuela = mutation({
    args: { 
        prospectoId: v.id("prospectos"),
        direccion: v.optional(v.string()),
        telefono: v.optional(v.string()),
        director: v.optional(v.string()),
    },
    handler: async (ctx, { prospectoId, direccion, telefono, director }) => {
        // Obtener el prospecto
        const prospecto = await ctx.db.get(prospectoId);
        if (!prospecto) {
            throw new Error("Prospecto no encontrado");
        }

        // Crear la escuela con los datos del prospecto
        const nuevaEscuela = await ctx.db.insert("escuelas", {
            nombre: prospecto.nombre,
            nombreCorto: prospecto.nombreCorto,
            logoUrl: prospecto.logoUrl,
            descripcion: prospecto.descripcion,
            direccion: direccion || prospecto.direccion || "",
            telefono: telefono || prospecto.telefono,
            email: prospecto.email,
            director: director || prospecto.director,
            activa: true, // La escuela se crea como activa
        });

        // Eliminar el prospecto después de transferirlo
        await ctx.db.delete(prospectoId);

        return {
            escuelaId: nuevaEscuela,
            prospectoEliminado: prospectoId,
            mensaje: "Prospecto transferido exitosamente a escuela"
        };
    }
});