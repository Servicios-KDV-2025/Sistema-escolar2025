import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const obtenerProspectos = query({
    handler: async (ctx) => {
        const prospectos = await ctx.db.query("prospectos").collect();
        return prospectos;
    }
});

// Obtener solo prospectos activos
export const obtenerProspectosActivos = query({
    handler: async (ctx) => {
        const prospectos = await ctx.db.query("prospectos")
            .filter((q) => q.eq(q.field("activo"), true))
            .collect();
        return prospectos;
    }
});

export const obtenerProspectoPorId = query({
    args: { id: v.id("prospectos") },
    handler: async (ctx, { id }) => {
        const prospecto = await ctx.db.get(id);
        if (!prospecto) {
            return null;
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
            activo: false, // Por defecto, el prospecto se crea como inactivo
        });
        return nuevoProspecto;
    }
});

// Actualizar prospecto
export const actualizarProspecto = mutation({
    args: {
        id: v.id("prospectos"),
        nombre: v.optional(v.string()),
        nombreCorto: v.optional(v.string()),
        logoUrl: v.optional(v.string()),
        descripcion: v.optional(v.string()),
        direccion: v.optional(v.string()),
        telefono: v.optional(v.string()),
        email: v.optional(v.string()),
        director: v.optional(v.string()),
        activo: v.optional(v.boolean()),
    },
    handler: async (ctx, { id, nombre, nombreCorto, logoUrl, descripcion, direccion, telefono, email, director, activo }) => {
        const prospecto = await ctx.db.get(id);
        if (!prospecto) {
            throw new Error("Prospecto no encontrado");
        }

        const datosActualizados: any = {};
        if (nombre !== undefined) datosActualizados.nombre = nombre;
        if (nombreCorto !== undefined) datosActualizados.nombreCorto = nombreCorto;
        if (logoUrl !== undefined) datosActualizados.logoUrl = logoUrl;
        if (descripcion !== undefined) datosActualizados.descripcion = descripcion;
        if (direccion !== undefined) datosActualizados.direccion = direccion;
        if (telefono !== undefined) datosActualizados.telefono = telefono;
        if (email !== undefined) datosActualizados.email = email;
        if (director !== undefined) datosActualizados.director = director;
        if (activo !== undefined) datosActualizados.activo = activo;

        await ctx.db.patch(id, datosActualizados);
        return await ctx.db.get(id);
    }
});

export const eliminarProspecto = mutation({
    args: { id: v.id("prospectos") },
    handler: async (ctx, { id }) => {
        const prospecto = await ctx.db.get(id);
        if (!prospecto) {
            return null;
        }
        await ctx.db.delete(id);
        return prospecto;
    }
});

// Activar/Desactivar prospecto
export const toggleActivoProspecto = mutation({
    args: { id: v.id("prospectos") },
    handler: async (ctx, { id }) => {
        const prospecto = await ctx.db.get(id);
        if (!prospecto) {
            throw new Error("Prospecto no encontrado");
        }
        
        await ctx.db.patch(id, { activo: !prospecto.activo });
        return await ctx.db.get(id);
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
        const prospecto = await ctx.db.get(prospectoId);
        if (!prospecto) {
            throw new Error("Prospecto no encontrado");
        }

        const nuevaEscuela = await ctx.db.insert("escuelas", {
            nombre: prospecto.nombre,
            nombreCorto: prospecto.nombreCorto,
            logoUrl: prospecto.logoUrl,
            descripcion: prospecto.descripcion,
            direccion: direccion || prospecto.direccion || "",
            telefono: telefono || prospecto.telefono,
            email: prospecto.email,
            director: director || prospecto.director,
            activa: true,
        });

        const sanitizedSubdomain = prospecto.nombreCorto
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, '');

        const existing = await ctx.db
            .query("subdominios")
            .withIndex("by_subdomain", (q) => q.eq("subdomain", sanitizedSubdomain))
            .first();

        if (!existing) {
            await ctx.db.insert("subdominios", {
                subdomain: sanitizedSubdomain,
                createdAt: Date.now(),
                activo: true,
            });
        }

        return {
            escuelaId: nuevaEscuela,
            subdominio: sanitizedSubdomain,
            prospectoEliminado: prospectoId,
            mensaje: "Prospecto transferido exitosamente a escuela"
        };
    }
});