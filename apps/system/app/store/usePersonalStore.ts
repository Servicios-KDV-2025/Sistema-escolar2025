import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

// Tipo de Personal basado en tu schema de Convex
export type Personal = {
  _id: string;
  escuelaId: string;
  departamentoId: string;
  nombre: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  maestro: boolean;
  fechaIngreso: string;
  activo: boolean;
};

// Tipos para crear y actualizar personal
export type CrearPersonalData = {
  escuelaId: string;
  departamentoId: string;
  nombre: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  maestro: boolean;
  fechaIngreso: string;
  activo: boolean;
};

export type ActualizarPersonalData = {
  id: string;
  nombre: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  maestro: boolean;
  fechaIngreso: string;
  activo: boolean;
};

// Store de Personal con CRUD completo
export type PersonalStore = {
  personal: Personal[];
  personalSeleccionado: Personal | null;
  maestros: Personal[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  setPersonal: (personal: Personal[]) => void;
  setPersonalSeleccionado: (personal: Personal | null) => void;
  setMaestros: (maestros: Personal[]) => void;
  setLoading: (loading: boolean) => void;
  setCreating: (creating: boolean) => void;
  setUpdating: (updating: boolean) => void;
  setDeleting: (deleting: boolean) => void;
  setError: (error: string | null) => void;
  setCreateError: (error: string | null) => void;
  setUpdateError: (error: string | null) => void;
  setDeleteError: (error: string | null) => void;
  clearErrors: () => void;
  reset: () => void;
};

const initialState = {
  personal: [],
  personalSeleccionado: null,
  maestros: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const usePersonalStore = create<PersonalStore>((set) => ({
  ...initialState,
  setPersonal: (personal) => set({ personal }),
  setPersonalSeleccionado: (personalSeleccionado) => set({ personalSeleccionado }),
  setMaestros: (maestros) => set({ maestros }),
  setLoading: (isLoading) => set({ isLoading }),
  setCreating: (isCreating) => set({ isCreating }),
  setUpdating: (isUpdating) => set({ isUpdating }),
  setDeleting: (isDeleting) => set({ isDeleting }),
  setError: (error) => set({ error }),
  setCreateError: (createError) => set({ createError }),
  setUpdateError: (updateError) => set({ updateError }),
  setDeleteError: (deleteError) => set({ deleteError }),
  clearErrors: () => set({
    error: null,
    createError: null,
    updateError: null,
    deleteError: null,
  }),
  reset: () => set(initialState),
}));

// Tipo para el resultado de las queries de Convex
type PersonalQueryData = {
  _id: string;
  escuelaId: string;
  departamentoId: string;
  nombre: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  maestro: boolean;
  fechaIngreso: string;
  activo: boolean;
};

export const usePersonal = (escuelaId?: string) => {
  const {
    personal,
    personalSeleccionado,
    maestros,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    setPersonal,
    setPersonalSeleccionado,
    setMaestros,
    setCreating,
    setUpdating,
    setDeleting,
    setCreateError,
    setUpdateError,
    setDeleteError,
    clearErrors,
  } = usePersonalStore();

  // Query para obtener todo el personal de la escuela
  const personalQuery = useQuery(
    api.personal.obtenerPersonal,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );

  // Query para obtener solo los maestros
  const maestrosQuery = useQuery(
    api.personal.verMaestrosDelPersonal,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );

  // Mutations
  const crearPersonalMutation = useMutation(api.personal.crearPersonal);
  const actualizarPersonalMutation = useMutation(api.personal.upadatePersonal);
  const eliminarPersonalMutation = useMutation(api.personal.deletePersonal);

  // CREATE
  const crearPersonal = useCallback(async (data: CrearPersonalData) => {
    setCreating(true);
    setCreateError(null);
    try {
      await crearPersonalMutation({
        ...data,
        escuelaId: data.escuelaId as Id<"escuelas">,
        departamentoId: data.departamentoId as Id<"departamento">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear personal';
      setCreateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [crearPersonalMutation, setCreating, setCreateError]);

  // UPDATE
  const actualizarPersonal = useCallback(async (data: ActualizarPersonalData) => {
    setUpdating(true);
    setUpdateError(null);
    try {
      await actualizarPersonalMutation({
        id: data.id as Id<"personal">,
        nombre: data.nombre,
        apellidos: data.apellidos,
        email: data.email,
        telefono: data.telefono,
        maestro: data.maestro,
        fechaIngreso: data.fechaIngreso,
        activo: data.activo,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar personal';
      setUpdateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [actualizarPersonalMutation, setUpdating, setUpdateError]);

  // DELETE
  const eliminarPersonal = useCallback(async (id: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await eliminarPersonalMutation({
        id: id as Id<"personal">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar personal';
      setDeleteError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [eliminarPersonalMutation, setDeleting, setDeleteError]);

  // Refrescar personal cuando cambie la query
  useEffect(() => {
    if (personalQuery) {
      setPersonal(
        (personalQuery as unknown as PersonalQueryData[]).map((p) => ({
          _id: p._id,
          escuelaId: p.escuelaId,
          departamentoId: p.departamentoId,
          nombre: p.nombre,
          apellidos: p.apellidos,
          email: p.email,
          telefono: p.telefono,
          maestro: p.maestro,
          fechaIngreso: p.fechaIngreso,
          activo: p.activo,
        }))
      );
    }
  }, [personalQuery, setPersonal]);

  // Refrescar maestros cuando cambie la query
  useEffect(() => {
    if (maestrosQuery) {
      setMaestros(
        (maestrosQuery as unknown as PersonalQueryData[]).map((m) => ({
          _id: m._id,
          escuelaId: m.escuelaId,
          departamentoId: m.departamentoId,
          nombre: m.nombre,
          apellidos: m.apellidos,
          email: m.email,
          telefono: m.telefono,
          maestro: m.maestro,
          fechaIngreso: m.fechaIngreso,
          activo: m.activo,
        }))
      );
    }
  }, [maestrosQuery, setMaestros]);

  return {
    personal,
    personalSeleccionado,
    maestros,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    crearPersonal,
    actualizarPersonal,
    eliminarPersonal,
    setPersonalSeleccionado,
    clearErrors,
  };
}; 