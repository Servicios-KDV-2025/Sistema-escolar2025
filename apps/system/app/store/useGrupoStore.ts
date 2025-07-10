import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

// Tipo de Grupo basado en tu schema de Convex
export type Grupo = {
  _id: string;
  escuelaId: string;
  nombre: string;
  grado: string;
  activo: boolean;
};

// Tipos para crear y actualizar grupo
export type CrearGrupoData = {
  escuelaId: string;
  nombre: string;
  grado: string;
  activo: boolean;
};

export type ActualizarGrupoData = {
  _id: string;
  escuelaId: string;
  nombre: string;
  grado: string;
  activo: boolean;
};

// Store de Grupo con CRUD completo
export type GrupoStore = {
  grupos: Grupo[];
  grupoSeleccionado: Grupo | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  setGrupos: (grupos: Grupo[]) => void;
  setGrupoSeleccionado: (grupo: Grupo | null) => void;
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
  grupos: [],
  grupoSeleccionado: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const useGrupoStore = create<GrupoStore>((set) => ({
  ...initialState,
  setGrupos: (grupos) => set({ grupos }),
  setGrupoSeleccionado: (grupoSeleccionado) => set({ grupoSeleccionado }),
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

type GrupoQueryResult = {
  _id: string;
  escuelaId: string;
  nombre: string;
  grado: string;
  activo: boolean;
};

export const useGrupo = (escuelaId?: string) => {
  const {
    grupos,
    grupoSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    setGrupos,
    setGrupoSeleccionado,

    setCreating,
    setUpdating,
    setDeleting,

    setCreateError,
    setUpdateError,
    setDeleteError,
    clearErrors,
  } = useGrupoStore();

  // Query para obtener los grupos de la escuela
  const gruposQuery = useQuery(
    api.grupos.verTodosLosGrupos,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );

  // Mutations
  const crearGrupoMutation = useMutation(api.grupos.crearGrupo);
  const actualizarGrupoMutation = useMutation(api.grupos.actualizarGrupo);
  const eliminarGrupoMutation = useMutation(api.grupos.eliminarGrupo);

  // CREATE
  const crearGrupo = useCallback(async (data: CrearGrupoData) => {
    setCreating(true);
    setCreateError(null);
    try {
      await crearGrupoMutation({
        ...data,
        escuelaId: data.escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear grupo';
      setCreateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [crearGrupoMutation, setCreating, setCreateError]);

  // UPDATE
  const actualizarGrupo = useCallback(async (data: ActualizarGrupoData) => {
    setUpdating(true);
    setUpdateError(null);
    try {
      await actualizarGrupoMutation({
        _id: data._id as Id<"grupos">,
        escuelaId: data.escuelaId as Id<"escuelas">,
        nombre: data.nombre,
        grado: data.grado,
        activo: data.activo,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar grupo';
      setUpdateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [actualizarGrupoMutation, setUpdating, setUpdateError]);

  // DELETE
  const eliminarGrupo = useCallback(async (id: string, escuelaId: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await eliminarGrupoMutation({
        _id: id as Id<"grupos">,
        escuelaId: escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar grupo';
      setDeleteError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [eliminarGrupoMutation, setDeleting, setDeleteError]);

  // Refrescar grupos cuando cambie la query
  useEffect(() => {
    if (gruposQuery) {
      setGrupos(
        (gruposQuery as GrupoQueryResult[]).map((g) => ({
          _id: g._id,
          escuelaId: g.escuelaId,
          nombre: g.nombre,
          grado: g.grado,
          activo: g.activo,
        }))
      );
    }
  }, [gruposQuery, setGrupos]);

  return {
    grupos,
    grupoSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    crearGrupo,
    actualizarGrupo,
    eliminarGrupo,
    setGrupoSeleccionado,
    clearErrors,
  };
}; 