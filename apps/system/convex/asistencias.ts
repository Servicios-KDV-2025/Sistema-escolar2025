import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const crearAsistencia = mutation({
    args: {
        escuelaId: v.id("escuelas"),
        clasePorAlumnoId: v.id("clasesPorAlumno"),
        cicloEscolarId: v.id("ciclosEscolares"),
        fecha: v.number(),
        presente: v.boolean(),
        justificada: v.optional(v.boolean()),
        comentarios: v.optional(v.string()),
        registradoPorId: v.id("personal"),
        fechaRegistro: v.number(),
        createdBy: v.id("personal")
    },
    handler: async (ctx, args) => {
        const existe = await ctx.db
            .query("asistencia")
            .withIndex("by_clase_alumno", q => q.eq("clasePorAlumnoId", args.clasePorAlumnoId))
            .filter(q =>
                q.and(
                    q.eq(q.field("fecha"), args.fecha),
                    q.eq(q.field("escuelaId"), args.escuelaId)
                )
            )
            .first();

        if (existe) throw new Error('Ya existe una asistencia registrada para este día.');

        return ctx.db.insert("asistencia", args);
    },
});

// Read
export const listaAsistenciaPorClaseYFecha = query({
    args: {
        escuelaId: v.id("escuelas"),
        clasePorAlumnoId: v.id("clasesPorAlumno"),
        fecha: v.number(),
    },
    handler: async (ctx, args) => {
        return ctx.db
            .query("asistencia")
            .withIndex("by_clase_alumno", q => q.eq("clasePorAlumnoId", args.clasePorAlumnoId))
            .filter(q =>
                q.and(
                    q.eq(q.field("fecha"), args.fecha),
                    q.eq(q.field("escuelaId"), args.escuelaId),
                )
            )
            .collect();
    },
});

// Update
export const actualizarAsistencia = mutation({
    args: {
        id: v.id("asistencia"),
        escuelaId: v.id("escuelas"),
        presente: v.boolean(),
        justificada: v.optional(v.boolean()),
        comentarios: v.optional(v.string()),
        updatedBy: v.optional(v.id("personal")),
        updatedAt: v.optional(v.number()),

    },
    handler: async (ctx, args) => {
        const asistencia = await ctx.db.get(args.id);
        if (!asistencia) throw new Error("Asistencia no encontrada.");

        if (asistencia.escuelaId !== args.escuelaId) {
            throw new Error("Acceso denegado.");
        }

        return ctx.db.patch(args.id, {
            presente: args.presente,
            justificada: args.justificada,
            comentarios: args.comentarios,
            updatedBy: args.updatedBy,
            updatedAt: args.updatedAt,
        });
    },
});

// Delete
export const eliminarAsistencia = mutation({
    args: {
        id: v.id("asistencia"),
        escuelaId: v.id("escuelas"),
    },
    handler: async (ctx, args) => {
        const asistencia = await ctx.db.get(args.id);
        if (!asistencia) throw new Error("Asistencia no encontrada.");

        if (asistencia.escuelaId !== args.escuelaId) {
            throw new Error("Acceso denegado.");
        }
        return ctx.db.delete(args.id);
    },
});
