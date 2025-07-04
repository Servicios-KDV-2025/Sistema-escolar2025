import { v } from "convex/values"
import { query } from "./_generated/server"

// Obtener todos los padres o tutores
export const obtenerPadres = query({
  args: { escuelaId: v.id("escuelas") },
  handler: async (ctx, args) => {
    const padres = await ctx.db
      .query("padres")
      .withIndex("by_escuela", q => q.eq("escuelaId", args.escuelaId))
      .collect()

    return padres
  }
})