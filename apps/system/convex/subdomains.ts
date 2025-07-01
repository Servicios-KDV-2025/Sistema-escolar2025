import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getSubdomainData = query({
  args: { subdomain: v.string() },
  handler: async (ctx, args) => {
    const sanitizedSubdomain = args.subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
    
    const subdomain = await ctx.db
      .query("subdominios")
      .withIndex("by_subdomain", (q) => q.eq("subdomain", sanitizedSubdomain))
      .filter((q) => q.eq(q.field("activo"), true))
      .first();
    
    return subdomain;
  },
});

export const getAllSubdomains = query({
  handler: async (ctx) => {
    const subdomains = await ctx.db.query("subdominios").collect();
    
    return subdomains.map((subdomain) => ({
      subdomain: subdomain.subdomain,
      createdAt: subdomain.createdAt,
    }));
  },
});

export const createSubdomain = mutation({
  args: { subdomain: v.string() },
  handler: async (ctx, args) => {
    const sanitizedSubdomain = args.subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
    
    const existing = await ctx.db
      .query("subdominios")
      .withIndex("by_subdomain", (q) => q.eq("subdomain", sanitizedSubdomain))
      .first();
    
    if (existing) {
      throw new Error("Subdomain already exists");
    }
    
    return await ctx.db.insert("subdominios", {
      subdomain: sanitizedSubdomain,
      createdAt: Date.now(),
      activo: true,
    });
  },
});

export const deleteSubdomain = mutation({
    args: { subdomain: v.string() },
    handler: async (ctx, args) => {
      const sanitizedSubdomain = args.subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
      
      const existing = await ctx.db
        .query("subdominios")
        .withIndex("by_subdomain", (q) => q.eq("subdomain", sanitizedSubdomain))
        .first();
      
      if (!existing) {
        throw new Error("Subdomain not found");
      }
      
      await ctx.db.delete(existing._id);
      return { success: true };
    },
  });