
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Create
export const crearCalificacion = mutation({
    args: {
        escuelaId: v.id("escuelas"),
        clasePorAlumnoId: v.id("clasesPorAlumno"),
        cicloEscolarId: v.id("ciclosEscolares"),
        periodo: v.string(),
        calificacion: v.number(),
        esFinal: v.optional(v.boolean()),
        comentarios: v.optional(v.string()),
        registradoPorId: v.id("personal"),
        fechaRegistro: v.number(),
        createdBy: v.id("personal"),
    },
    handler: async (ctx, args) => {
        const existe = await ctx.db
            .query("calificaciones")
            .withIndex("by_clase_alumno", q =>
                q.eq("clasePorAlumnoId", args.clasePorAlumnoId)
            )
            .filter(q =>
                q.and(
                    q.eq(q.field("periodo"), args.periodo),
                    q.eq(q.field("escuelaId"), args.escuelaId)
                )
            )
            .first();

        if (existe) throw new Error("La calificación para este periodo ya existe.");

        return ctx.db.insert("calificaciones", args);
    },
});

// Read
export const obtenerCalificacionesDeAlumno = query({
    args: {
        clasePorAlumnoId: v.id("clasesPorAlumno"),
        escuelaId: v.id("escuelas"),
    },
    handler: async (ctx, { clasePorAlumnoId, escuelaId }) => {
        return await ctx.db
            .query("calificaciones")
            .withIndex("by_clase_alumno", q =>
                q.eq("clasePorAlumnoId", clasePorAlumnoId)
            )
            .filter(q => q.eq(q.field("escuelaId"), escuelaId))
            .collect();
    },
});

export const obtenerPromedioFinal = query({
    args: {
        clasePorAlumnoId: v.id("clasesPorAlumno"),
        escuelaId: v.id("escuelas"),
    },
    handler: async (ctx, { clasePorAlumnoId, escuelaId }) => {
        const calificaciones = await ctx.db
            .query("calificaciones")
            .withIndex("by_clase_alumno", q =>
                q.eq("clasePorAlumnoId", clasePorAlumnoId)
            )
            .filter(q => q.eq(q.field("escuelaId"), escuelaId))
            .collect();
        if (calificaciones.length === 0) return null;

        const suma = calificaciones.reduce((acc, c) => acc + c.calificacion, 0);
        return suma / calificaciones.length;
    },
});

// Update
export const editarCalificacion = mutation({
    args: {
        id: v.id("calificaciones"),
        escuelaId: v.id("escuelas"),
        calificacion: v.number(),
        comentarios: v.optional(v.string()),
        updatedBy: v.optional(v.id("personal")),
        updatedAt: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const calificacionExistente = await ctx.db.get(args.id);
        if (!calificacionExistente || calificacionExistente.escuelaId !== args.escuelaId) {
            throw new Error("No autorizado para editar esta calificación.");
        }

        await ctx.db.patch(args.id, {
            calificacion: args.calificacion,
            comentarios: args.comentarios,
            updatedBy: args.updatedBy,
            updatedAt: args.updatedAt,
        });
    }
});

// Delete
export const borrarCalificacion = mutation({
    args: {
        id: v.id("calificaciones"),
        escuelaId: v.id("escuelas"),
    },
    handler: async (ctx, { id, escuelaId }) => {
        const calificacion = await ctx.db.get(id);
        if (!calificacion || calificacion.escuelaId !== escuelaId) {
            throw new Error("No autorizado para eliminar esta calificación.");
        }

        await ctx.db.delete(id);
    }
})
