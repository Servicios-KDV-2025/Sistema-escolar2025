import {mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";


// 1. Obtener Padres por una escuela específica
export const obtenerPadresPorEscuela = query({
  args: {
    escuelaId: v.id("escuelas"), // ID de la escuela es OBLIGATORIO
  },
  handler: async (ctx, args) => {
    // Opcional: Validar si la escuela existe antes de buscar sus padres
    const escuela = await ctx.db.get(args.escuelaId);
    if (!escuela) {
      throw new Error("La escuela especificada no existe.");
    }

    return await ctx.db
      .query("padres")
      .withIndex("by_escuela", (q) => q.eq("escuelaId", args.escuelaId))
      .collect();
  },
});

//2. Obtener un solo padre por su ID 
export const obtenerPadrePorId = query({
  args: {id: v.id("padres")},
  handler: async (ctx, args) => {
    return  await ctx.db.get(args.id); //busca el padre por id
  }
})


// Mutations: creación, actualizacion y eliminación de padres

//3. Crear un nuevo padre DENTRO de una escuela específica
export const crearPadreConEscuela = mutation({
  args: {
    escuelaId: v.id("escuelas"),
    nombre: v.string(),
    apellidos: v.string(),
    email: v.optional(v.string()),
    telefono: v.optional(v.string()),
    direccion: v.optional(v.string()),
    activo: v.boolean(),
  },

  handler: async (ctx, args) => {
    const { escuelaId, nombre, apellidos, email, telefono, direccion, activo} = args;
    // verificamos que la escuela exista antes de crear el padre
    const escuela = await ctx.db.get(escuelaId);
    if (!escuela) {
      throw new Error("No se puede crear el padre: La escuela especificada no existe.")
    }

    //verificamos que no haya otro padre con el mismo email (si se proporcionó)
    if (email) {
      const padreExistente = await ctx.db
        .query("padres")
        .filter((q) => q.eq(q.field("email"), email))
        .first();
      //si existe un padre con el mismo email, lanzamos un error
      if (padreExistente) {
        throw new Error(`Ya existe un padre con este email: ${email}`);
      }
    }

    //se agrega el nuevo padre en la base de datos 
    return await ctx.db.insert("padres", args);
  },
});


//4. mutación para actualizar un padre existente
export const actualizarPadre = mutation({
  args: {
    id: v.id("padres"),
    escuelaId: v.id("escuelas"),
    nombre: v.string(),
    apellidos: v.string(),
    email: v.optional(v.string()),
    telefono: v.optional(v.string()),
    direccion: v.optional(v.string()),
    activo: v.boolean(),
  },

  handler: async (ctx, args) => {
    const { id, ...camposAActualizar } = args;


    // buscamos al padre para asegurarnos que existe
    const padre = await ctx.db.get(id);
    if (!padre) {
      throw new Error("No se encontró padre de familia con el ID proporcionado.");
    }

    //si se intenta actualizar el email, verificamos que no exista otro padre con el mismo email(duplicado)
    if (camposAActualizar.email) {
      const padreConismoEmail = await ctx.db
        .query("padres")
        .filter((q) => q.eq(q.field("email"), camposAActualizar.email))
        .first();
      //si existe un padre con el mismo email, lanzamos un error
      if (padreConismoEmail && padreConismoEmail._id.toString() !== id.toString()) {
        throw new Error(`Ya existe un padre con el email: ${camposAActualizar.email}`);
      }
    }

    // actualizamos el padre con los nuevos datos usando "ctx.db.patch"
    await ctx.db.patch(id, camposAActualizar);

    //optcionalmente, podemos retornar el padre actualizado (para confirmar la actualización)
    return await ctx.db.get(id)

  }


});



// Mutación para eliminar un padre de familia
/*export const eliminarPadre = mutation({
  args: {
    id: v.id("padres"),
  },
  handler: async (ctx, args) => {
    // Verificamos si el registro existe antes de eliminarlo
    const padre = await ctx.db.get(args.id);
    if (!padre) {
        throw new Error("No se encontró el padre de familia para eliminar.");
    }

    // Eliminamos el registro de la tabla `padres`
    return await ctx.db.delete(args.id);
  },
});*/


// 5. Eliminar un Padre, asegurándose de que pertenezca a la escuela
export const eliminarPadreConEscuela = mutation({
  args: {
    id: v.id("padres"), // ID del padre a eliminar
    escuelaId: v.id("escuelas"), // ID de la escuela a la que pertenece el padre (para validación)
  },
  handler: async (ctx, args) => {
    // Verificar que el padre existe y pertenece a la escuela antes de eliminar
    const padreExistente = await ctx.db.get(args.id);
    if (!padreExistente || padreExistente.escuelaId !== args.escuelaId) {
      throw new Error("No se puede eliminar: Padre no encontrado o no pertenece a la escuela especificada.");
    }

    await ctx.db.delete(args.id);
    return true;
  },
});


// 4. Actualizar un Padre existente, asegurándose de que pertenezca a la escuela
export const actualizarPadreConEscuela = mutation({
  args: {
    id: v.id("padres"), // ID del padre a actualizar
    escuelaId: v.id("escuelas"), // ID de la escuela a la que pertenece el padre (para validación)
    nombre: v.optional(v.string()),
    apellidos: v.optional(v.string()),
    email: v.optional(v.string()),
    telefono: v.optional(v.string()),
    direccion: v.optional(v.string()),
    activo: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, escuelaId, ...data } = args;

    // Primero, obtener el padre para verificar que existe y que su escuelaId coincida
    const padreExistente = await ctx.db.get(id);
    if (!padreExistente || padreExistente.escuelaId !== escuelaId) {
      throw new Error("No se puede actualizar: Padre no encontrado o no pertenece a la escuela especificada.");
    }

    await ctx.db.patch(id, data);
    return await ctx.db.get(id);
  },
});