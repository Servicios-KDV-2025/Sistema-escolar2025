import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

// Tipo de Padre basado en tu schema de Convex
export type Padre = {
  _id: string;
  escuelaId: string;
  nombre: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo: boolean;
};

// Tipos para crear y actualizar padre
export type CrearPadreData = {
  escuelaId: string;
  nombre: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo: boolean;
};

export type ActualizarPadreData = {
  id: string;
  escuelaId: string;
  nombre: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo: boolean;
};

// Store de Padre con CRUD completo
export type PadreStore = {
  padres: Padre[];
  padreSeleccionado: Padre | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  setPadres: (padres: Padre[]) => void;
  setPadreSeleccionado: (padre: Padre | null) => void;
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
  padres: [],
  padreSeleccionado: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const usePadreStore = create<PadreStore>((set) => ({
  ...initialState,
  setPadres: (padres) => set({ padres }),
  setPadreSeleccionado: (padreSeleccionado) => set({ padreSeleccionado }),
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

type PadreQueryResult = {
  _id: string;
  escuelaId: string;
  nombre: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo: boolean;
};

export const usePadre = (escuelaId?: string) => {
  const {
    padres,
    padreSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    setPadres,
    setPadreSeleccionado,
    setCreating,
    setUpdating,
    setDeleting,
    setCreateError,
    setUpdateError,
    setDeleteError,
    clearErrors,
  } = usePadreStore();

  // Query para obtener los padres de la escuela
  const padresQuery = useQuery(
    api.padres.obtenerPadres,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );

  // Mutations
  const crearPadreMutation = useMutation(api.padres.crearPadre);
  const actualizarPadreMutation = useMutation(api.padres.actualizarPadre);
  const eliminarPadreMutation = useMutation(api.padres.eliminarPadre);

  // CREATE
  const crearPadre = useCallback(async (data: CrearPadreData) => {
    setCreating(true);
    setCreateError(null);
    try {
      await crearPadreMutation({
        ...data,
        escuelaId: data.escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear padre';
      setCreateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [crearPadreMutation, setCreating, setCreateError]);

  // UPDATE
  const actualizarPadre = useCallback(async (data: ActualizarPadreData) => {
    setUpdating(true);
    setUpdateError(null);
    try {
      await actualizarPadreMutation({
        id: data.id as Id<"padres">,
        escuelaId: data.escuelaId as Id<"escuelas">,
        nombre: data.nombre,
        apellidos: data.apellidos,
        email: data.email,
        telefono: data.telefono,
        direccion: data.direccion,
        activo: data.activo,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar padre';
      setUpdateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [actualizarPadreMutation, setUpdating, setUpdateError]);

  // DELETE
  const eliminarPadre = useCallback(async (id: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await eliminarPadreMutation({
        id: id as Id<"padres">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar padre';
      setDeleteError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [eliminarPadreMutation, setDeleting, setDeleteError]);

  // Refrescar padres cuando cambie la query
  useEffect(() => {
    if (padresQuery) {
      setPadres(
        (padresQuery as PadreQueryResult[]).map((p) => ({
          _id: p._id,
          escuelaId: p.escuelaId,
          nombre: p.nombre,
          apellidos: p.apellidos,
          email: p.email,
          telefono: p.telefono,
          direccion: p.direccion,
          activo: p.activo,
        }))
      );
    }
  }, [padresQuery, setPadres]);

  return {
    padres,
    padreSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    crearPadre,
    actualizarPadre,
    eliminarPadre,
    setPadreSeleccionado,
    clearErrors,
  };
}; 