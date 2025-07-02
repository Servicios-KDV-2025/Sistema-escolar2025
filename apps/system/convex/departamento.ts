import { query } from "./_generated/server";
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
