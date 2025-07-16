import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const crearClasePorAlumno = mutation({
  args: {
    escuelaId: v.id("escuelas"),
    catalogoClaseId: v.id("catalogosDeClases"),
    alumnoId: v.id("alumnos"),
    cicloEscolarId: v.id("ciclosEscolares"),
    fechaInscripcion: v.number(),
    activo: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existe = await ctx.db
      .query("clasesPorAlumno")
      .withIndex("by_alumno", q => q.eq("alumnoId", args.alumnoId))
      .filter(q =>
        q.and(
          q.eq(q.field("catalogoClaseId"), args.catalogoClaseId),
          q.eq(q.field("escuelaId"), args.escuelaId)
        )
      )
      .first();

    if (existe) {
      throw "El alumno ya está inscrito en esta clase.";
    }

    return await ctx.db.insert("clasesPorAlumno", args);
  },
});

export const obtenerClasesPorAlumno = query({
  args: { escuelaId: v.id("escuelas") },
  handler: async (ctx, args) => {
    const inscripciones = await ctx.db
      .query("clasesPorAlumno")
      .withIndex("by_escuela", q => q.eq("escuelaId", args.escuelaId))
      .collect();

    const resultado = await Promise.all(
      inscripciones.map(async (inscripcion) => {
        const [alumno, catalogoClase] = await Promise.all([
          ctx.db.get(inscripcion.alumnoId),
          ctx.db.get(inscripcion.catalogoClaseId),
        ]);

        if (!alumno || !catalogoClase) {
          return null;
        }

        const [materia, maestro, grupo, cicloEscolar] = await Promise.all([
          ctx.db.get(catalogoClase.materiaId),
          ctx.db.get(catalogoClase.maestroId),
          catalogoClase.grupoId ? ctx.db.get(catalogoClase.grupoId) : Promise.resolve(null),
          ctx.db.get(inscripcion.cicloEscolarId),
        ]);

        return {
          _id: inscripcion._id,
          fechaInscripcion: inscripcion.fechaInscripcion,
          activo: inscripcion.activo,
          alumno: {
            _id: alumno._id,
            nombre: alumno.nombre,
            apellidos: alumno.apellidos,
            matricula: alumno.matricula,
          },
          catalogoClase: {
            _id: catalogoClase._id,
            nombre: catalogoClase.nombre,
            materia: materia?.nombre || "Sin materia",
            maestro: maestro ? `${maestro.nombre} ${maestro.apellidos}` : "Sin maestro",
            grupo: grupo?.nombre || "Sin grupo",
            grado: grupo?.grado || "Sin grado",
          },
          cicloEscolar: {
            _id: cicloEscolar?._id,
            nombre: cicloEscolar?.nombre,
            fechaInicio: cicloEscolar?.fechaInicio,
            fechaFin: cicloEscolar?.fechaFin,
            activo: cicloEscolar?.activo,
          }
        };
      })
    );

    return resultado.filter(Boolean);
  },
});

export const obtenerClasesPorAlumnoId = query({
  args: {
    escuelaId: v.id("escuelas"),
    alumnoId: v.id("alumnos")
  },
  handler: async (ctx, args) => {
    const inscripciones = await ctx.db
      .query("clasesPorAlumno")
      .withIndex("by_alumno", q => q.eq("alumnoId", args.alumnoId))
      .filter(q => q.eq(q.field("escuelaId"), args.escuelaId))
      .collect();

    const resultado = await Promise.all(
      inscripciones.map(async (inscripcion) => {
        const catalogoClase = await ctx.db.get(inscripcion.catalogoClaseId);
        if (!catalogoClase) return null;

        const [materia, maestro, grupo, cicloEscolar] = await Promise.all([
          ctx.db.get(catalogoClase.materiaId),
          ctx.db.get(catalogoClase.maestroId),
          catalogoClase.grupoId ? ctx.db.get(catalogoClase.grupoId) : Promise.resolve(null),
          ctx.db.get(inscripcion.cicloEscolarId),
        ]);

        return {
          _id: inscripcion._id,
          fechaInscripcion: inscripcion.fechaInscripcion,
          activo: inscripcion.activo,
          clase: {
            _id: catalogoClase._id,
            nombre: catalogoClase.nombre,
            materia: materia?.nombre || "Sin materia",
            maestro: maestro ? `${maestro.nombre} ${maestro.apellidos}` : "Sin maestro",
            grupo: grupo?.nombre || "Sin grupo",
          },
          cicloEscolar: {
            _id: cicloEscolar?._id,
            nombre: cicloEscolar?.nombre,
            fechaInicio: cicloEscolar?.fechaInicio,
            fechaFin: cicloEscolar?.fechaFin,
            activo: cicloEscolar?.activo,
          }
        };
      })
    );

    return resultado.filter(Boolean);
  },
});

export const obtenerAlumnosPorClase = query({
  args: {
    escuelaId: v.id("escuelas"),
    catalogoClaseId: v.id("catalogosDeClases")
  },
  handler: async (ctx, args) => {
    const inscripciones = await ctx.db
      .query("clasesPorAlumno")
      .withIndex("by_catalogo_clase", q => q.eq("catalogoClaseId", args.catalogoClaseId))
      .filter(q => q.eq(q.field("escuelaId"), args.escuelaId))
      .collect();

    const resultado = await Promise.all(
      inscripciones.map(async (inscripcion) => {
        const alumno = await ctx.db.get(inscripcion.alumnoId);
        if (!alumno) return null;

        return {
          _id: inscripcion._id,
          fechaInscripcion: inscripcion.fechaInscripcion,
          activo: inscripcion.activo,
          alumno: {
            _id: alumno._id,
            nombre: alumno.nombre,
            apellidos: alumno.apellidos,
            matricula: alumno.matricula,
          },
        };
      })
    );

    return resultado.filter(Boolean);
  },
});

export const actualizarClasePorAlumno = mutation({
  args: {
    _id: v.id("clasesPorAlumno"),
    escuelaId: v.id("escuelas"),
    catalogoClaseId: v.id("catalogosDeClases"),
    alumnoId: v.id("alumnos"),
    cicloEscolarId: v.id("ciclosEscolares"),
    fechaInscripcion: v.number(),
    activo: v.boolean(),
  },
  handler: async (ctx, args) => {
    const inscripcion = await ctx.db.get(args._id);
    if (!inscripcion || inscripcion.escuelaId !== args.escuelaId) {
      throw "El alumno ya está inscrito en esta clase."

    }
    if (inscripcion.alumnoId !== args.alumnoId || inscripcion.catalogoClaseId !== args.catalogoClaseId) {
      const existe = await ctx.db
        .query("clasesPorAlumno")
        .withIndex("by_alumno", q => q.eq("alumnoId", args.alumnoId))
        .filter(q =>
          q.and(
            q.eq(q.field("catalogoClaseId"), args.catalogoClaseId),
            q.eq(q.field("escuelaId"), args.escuelaId)
          )
        )
        .first();

      if (existe) {
        throw "El alumno ya está inscrito en esta clase.";
      }
    }

    return ctx.db.patch(args._id, {
      catalogoClaseId: args.catalogoClaseId,
      alumnoId: args.alumnoId,
      cicloEscolarId: args.cicloEscolarId,
      fechaInscripcion: args.fechaInscripcion,
      activo: args.activo
    });
  },
});

export const eliminarClasePorAlumno = mutation({
  args: {
    id: v.id("clasesPorAlumno"),
    escuelaId: v.id("escuelas"),
  },
  handler: async (ctx, args) => {
    const inscripcion = await ctx.db.get(args.id);
    if (!inscripcion || inscripcion.escuelaId !== args.escuelaId) {
      throw new Error("Inscripción no encontrada o no pertenece a la escuela.");
    }

    await ctx.db.patch(args.id, { activo: false });
  },
});

export const obtenerInscripcionesPorCiclo = query({
  args: {
    escuelaId: v.id("escuelas"),
    cicloEscolarId: v.id("ciclosEscolares")
  },
  handler: async (ctx, args) => {
    const inscripciones = await ctx.db
      .query("clasesPorAlumno")
      .withIndex("by_ciclo", q => q.eq("cicloEscolarId", args.cicloEscolarId))
      .filter(q => q.eq(q.field("escuelaId"), args.escuelaId))
      .collect();

    const resultado = await Promise.all(
      inscripciones.map(async (inscripcion) => {
        const [alumno, catalogoClase] = await Promise.all([
          ctx.db.get(inscripcion.alumnoId),
          ctx.db.get(inscripcion.catalogoClaseId),
        ]);

        if (!alumno || !catalogoClase) {
          return null;
        }

        const [materia, maestro, grupo] = await Promise.all([
          ctx.db.get(catalogoClase.materiaId),
          ctx.db.get(catalogoClase.maestroId),
          catalogoClase.grupoId ? ctx.db.get(catalogoClase.grupoId) : Promise.resolve(null),
        ]);

        return {
          _id: inscripcion._id,
          fechaInscripcion: inscripcion.fechaInscripcion,
          activo: inscripcion.activo,
          alumno: {
            _id: alumno._id,
            nombre: alumno.nombre,
            apellidos: alumno.apellidos,
            matricula: alumno.matricula,
          },
          clase: {
            _id: catalogoClase._id,
            nombre: catalogoClase.nombre,
            materia: materia?.nombre || "Sin materia",
            maestro: maestro ? `${maestro.nombre} ${maestro.apellidos}` : "Sin maestro",
            grupo: grupo?.nombre || "Sin grupo",
          },
        };
      })
    );

    return resultado.filter(Boolean);
  },
});

export const obtenerEstadisticasInscripciones = query({
  args: { escuelaId: v.id("escuelas") },
  handler: async (ctx, args) => {
    const inscripciones = await ctx.db
      .query("clasesPorAlumno")
      .withIndex("by_escuela", q => q.eq("escuelaId", args.escuelaId))
      .collect();

    const alumnos = await ctx.db
      .query("alumnos")
      .withIndex("by_escuela", q => q.eq("escuelaId", args.escuelaId))
      .collect();

    const catalogosClases = await ctx.db
      .query("catalogosDeClases")
      .withIndex("by_escuela", q => q.eq("escuelaId", args.escuelaId))
      .collect();

    const inscripcionesActivas = inscripciones.filter(i => i.activo).length;
    const totalAlumnos = alumnos.length;
    const totalClases = catalogosClases.filter(c => c.activa).length;

    return {
      totalInscripciones: inscripciones.length,
      inscripcionesActivas,
      totalAlumnos,
      totalClases,
      promedioClasesPorAlumno: totalAlumnos > 0 ? (inscripcionesActivas / totalAlumnos).toFixed(1) : "0",
    };
  },
}); 