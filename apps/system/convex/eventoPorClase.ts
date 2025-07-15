import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


// Crear
export const crearEventoXClase = mutation({
  args: {
    escuelaId: v.id("escuelas"),
    catalogoClaseId: v.id("catalogosDeClases"),
    calendarioId: v.id("calendario"),
    cicloEscolarId: v.id("ciclosEscolares"),
    eventoEscolarId: v.optional(v.id("eventosEscolares")),
    fecha: v.number(),
    descripcion: v.optional(v.string()),
    activo: v.boolean(),
    createdBy: v.id("personal"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("eventoPorClases", { ...args });
  },
});

// Read all
export const verTodosLosEventosXClases = query({
  args: {
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    const eventos = await ctx.db
      .query("eventoPorClases")
      .filter(q => q.eq(q.field("escuelaId"), args.escuelaId))
      .collect();

    return eventos.map(({ _id, ...rest }) => ({
      _id,
      ...rest,
    }));
  },
});

// Read one
export const verUnEventoXClase = query({
  args: {
    _id: v.id("eventoPorClases"),
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    const evento = await ctx.db.get(args._id);
    if (!evento || evento.escuelaId !== args.escuelaId) return null;
    return evento;
  },
});

// Get all from name
export const getEventoPorClaseConNombres = query({
  args: { escuelaId: v.id("escuelas") },
  handler: async (ctx, { escuelaId }) => {
    const eventos = await ctx.db
      .query("eventoPorClases")
      .withIndex("by_escuela", q => q.eq("escuelaId", escuelaId))
      .collect();

    const res = await Promise.all(
      eventos.map(async evento => {
        const [catalogoClase, calendario, cicloEscolar, eventoEscolar, creadoPor, actualizadoPor] = await Promise.all([
          ctx.db.get(evento.catalogoClaseId),
          ctx.db.get(evento.calendarioId),
          ctx.db.get(evento.cicloEscolarId),
          evento.eventoEscolarId
            ? ctx.db.get(evento.eventoEscolarId)
            : Promise.resolve(null),
          ctx.db.get(evento.createdBy),
          evento.updatedBy
            ? ctx.db.get(evento.updatedBy)
            : Promise.resolve(null),
        ]);

        const nombreCompleto = `${creadoPor?.nombre} ${creadoPor?.apellidos}`;
        const nombreCompletoActu = `${actualizadoPor?.nombre} ${actualizadoPor?.apellidos}`;

        return {
          _id: evento._id,
          catalogoClase: catalogoClase?.nombre ?? "Sin Catálogo de Clases",
          calendario: calendario?.fecha ?? "Sin Fecha",
          cicloEscolar: cicloEscolar?.nombre ?? "Sin Ciclo Escolar",
          eventoEscolar: eventoEscolar?.nombre ?? "Sin Evento Escolar",
          fecha: evento.fecha,
          descripcion: evento.descripcion ?? "",
          createdBy: nombreCompleto ?? 'Nadie lo ha creado',
          updatedBy: nombreCompletoActu ?? 'Nadie lo ha actualizado',
          activo: evento.activo,
          
          catalogoClaseId: evento.catalogoClaseId,
          calendarioId: evento.calendarioId,
          cicloEscolarId: evento.cicloEscolarId,
          eventoEscolarId: evento.eventoEscolarId ?? null,
          createdById: evento.createdBy,
          updatedById: evento.updatedBy,
        };
      })
    );

    return res;
  },
});

// Update
export const actualizarEventoXClase = mutation({
  args: {
    _id: v.id("eventoPorClases"),
    catalogoClaseId: v.id("catalogosDeClases"),
    calendarioId: v.id("calendario"),
    cicloEscolarId: v.id("ciclosEscolares"),
    eventoEscolarId: v.optional(v.id("eventosEscolares")),
    escuelaId: v.id("escuelas"),
    fecha: v.number(),
    descripcion: v.optional(v.string()),
    activo: v.boolean(),

    updatedBy: v.id("personal"),
  },
  handler: async (ctx, args) => {
    const evento = await ctx.db.get(args._id);
    if (!evento || evento.escuelaId !== args.escuelaId) throw new Error("Acceso denegado");

    const { _id, ...data } = args;
    await ctx.db.patch(_id, data);
  },
});

// Delete
export const eliminarEventoXClase = mutation({
  args: {
    _id: v.id("eventoPorClases"),
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    const evento = await ctx.db.get(args._id);
    if (!evento || evento.escuelaId !== args.escuelaId) throw new Error("Acceso denegado");
    await ctx.db.delete(args._id);
  },
});