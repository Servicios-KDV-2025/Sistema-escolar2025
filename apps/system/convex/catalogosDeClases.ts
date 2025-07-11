import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create
export const crearCatalogoDeCases = mutation({
    args: {
        escuelaId: v.id("escuelas"),
        cicloEscolarId: v.id("ciclosEscolares"),
        materiaId: v.id("materias"),
        salonId: v.id("salones"),
        maestroId: v.id("personal"),
        grupoId: v.optional(v.id("grupos")),
        nombre: v.string(),
        activa: v.boolean(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("catalogosDeClases", { ...args });
    },
});

// Read all
export const verTodosLosCatalogosDeClases = query({
    args: {
        escuelaId: v.id("escuelas"),
    },
    handler: async (ctx, args) => {
        const catalogos = await ctx.db
            .query("catalogosDeClases")
            .filter(q => q.eq(q.field("escuelaId"), args.escuelaId))
            .collect();

        return catalogos.map(({ _id, ...rest }) => ({
            _id,
            ...rest,
        }));
    },
});

// Read one
export const verUnCatalogoDeClase = query({
    args: {
        _id: v.id("catalogosDeClases"),
        escuelaId: v.id("escuelas"),
    },
    handler: async (ctx, args) => {
        const catalogo = await ctx.db.get(args._id);
        if (!catalogo || catalogo.escuelaId !== args.escuelaId) return null;
        return catalogo;
    },
});

export const getCatalogoDeClasesConNombres = query({
    args: { escuelaId: v.id("escuelas") },
    handler: async (ctx, { escuelaId }) => {
        const catalogos = await ctx.db
            .query("catalogosDeClases")
            .withIndex("by_escuela", (q) => q.eq("escuelaId", escuelaId))
            .collect();

        const resultado = await Promise.all(
            catalogos.map(async (clase) => {
                const [ciclo, materia, salon, maestro, grupo] = await Promise.all([
                    ctx.db.get(clase.cicloEscolarId),
                    ctx.db.get(clase.materiaId),
                    ctx.db.get(clase.salonId),
                    ctx.db.get(clase.maestroId),
                    clase.grupoId ? ctx.db.get(clase.grupoId) : Promise.resolve(null),
                ]);

                return {
                    _id: clase._id,
                    nombre: clase.nombre,
                    cicloEscolar: ciclo?.nombre ?? "Sin ciclo",
                    materia: materia?.nombre ?? "Sin materia",
                    salon: salon?.nombre ?? "Sin salón",
                    maestro: maestro
                        ? `${maestro.nombre} ${maestro.apellidos}`
                        : "Sin maestro",
                    grupo: grupo?.nombre ?? "Sin grupo",
                    activo: clase.activa,
                };
            })
        );

        return resultado;
    },
});

// Update
export const actualizarCatalogoDeClase = mutation({
    args: {
        _id: v.id("catalogosDeClases"),
        escuelaId: v.id("escuelas"),
        cicloEscolarId: v.id("ciclosEscolares"),
        materiaId: v.id("materias"),
        salonId: v.id("salones"),
        maestroId: v.id("personal"),
        grupoId: v.optional(v.id("grupos")),
        nombre: v.string(),
        activa: v.boolean(),
    },
    handler: async (ctx, args) => {
        const catalogo = await ctx.db.get(args._id);
        if (!catalogo || catalogo.escuelaId !== args.escuelaId) throw new Error("Acceso denegado");

        const { _id, ...data } = args;
        await ctx.db.patch(_id, data);
    },
});

// Delete
export const eliminarCatalogoDeClase = mutation({
    args: {
        _id: v.id("catalogosDeClases"),
        escuelaId: v.id("escuelas"),
    },
    handler: async (ctx, args) => {
        const catalogo = await ctx.db.get(args._id);
        if (!catalogo || catalogo.escuelaId !== args.escuelaId) throw new Error("Acceso denegado");
        await ctx.db.delete(args._id);
    },
});
