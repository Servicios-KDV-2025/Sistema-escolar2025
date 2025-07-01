import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const obtenerDepartamentos = query({
    args: { escuelaId: v.id("escuelas") },
    handler: async (ctx, { escuelaId }) => {
        const departamentos = await ctx.db.query("departamento")
            .withIndex("by_escuela", (q) => q.eq("escuelaId", escuelaId))
            .collect();
        return departamentos;
    }    
});

export const obtenerDepartamentosPorId = query({
    args: { id: v.id("departamento") },                
    handler: async (ctx, { id }) => {
        const departamento = await ctx.db.get(id);
        if (!departamento) {
            return null; // Devolver null si no se encuentra el departamento
        }
        return departamento;    
    }
});

export const crearDepartamento = mutation({
    args: {
        escuelaId: v.id("escuelas"),
        nombre: v.string(),
        descripcion: v.optional(v.string()),
        activo: v.boolean(),
    },
    handler: async (ctx, { escuelaId, nombre, descripcion, activo }) => {
        const nuevoDepartamento = await ctx.db.insert("departamento", {
            escuelaId,
            nombre,
            descripcion,
            activo,
        });
        return nuevoDepartamento;
    }
}); 

export const actualizarDepartamento = mutation({
    args: {
        id: v.id("departamento"),
        nombre: v.optional(v.string()),
        descripcion: v.optional(v.string()),
        activo: v.optional(v.boolean()),
    },
    handler: async (ctx, { id, nombre, descripcion, activo }) => {
        const departamentoActualizado = await ctx.db.patch(id, {
            nombre,
            descripcion,
            activo,
        });
        return departamentoActualizado;
    }
});

export const eliminarDepartamento = mutation({
    args: { id: v.id("departamento") },
    handler: async (ctx, { id }) => {
        const departamentoEliminado = await ctx.db.delete(id);
        return departamentoEliminado;
    }
});

