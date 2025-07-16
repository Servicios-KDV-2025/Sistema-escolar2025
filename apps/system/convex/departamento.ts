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
            return null;
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
        const ahora = Date.now();
        
        const nuevoDepartamento = await ctx.db.insert("departamento", {
            escuelaId,
            nombre,
            descripcion,
            activo,
            createdAt: ahora,
            updatedAt: ahora, // Se establece igual que createdAt al crear
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
        const ahora = Date.now();
        
        // Crear objeto con solo los campos que se van a actualizar
        const camposActualizados: any = {
            updatedAt: ahora,
        };
        
        if (nombre !== undefined) camposActualizados.nombre = nombre;
        if (descripcion !== undefined) camposActualizados.descripcion = descripcion;
        if (activo !== undefined) camposActualizados.activo = activo;
        
        const departamentoActualizado = await ctx.db.patch(id, camposActualizados);
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

// Función adicional para soft delete (marcar como inactivo)
export const desactivarDepartamento = mutation({
    args: { id: v.id("departamento") },
    handler: async (ctx, { id }) => {
        const ahora = Date.now();
        
        const departamentoDesactivado = await ctx.db.patch(id, {
            activo: false,
            updatedAt: ahora,
        });
        return departamentoDesactivado;
    }
});

// Query para obtener solo departamentos activos
export const obtenerDepartamentosActivos = query({
    args: { escuelaId: v.id("escuelas") },
    handler: async (ctx, { escuelaId }) => {
        const departamentos = await ctx.db.query("departamento")
            .withIndex("by_escuela", (q) => q.eq("escuelaId", escuelaId))
            .filter((q) => q.eq(q.field("activo"), true))
            .collect();
        return departamentos;
    }    
});