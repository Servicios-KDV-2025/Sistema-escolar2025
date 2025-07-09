import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

// Tipo de Departamento basado en tu schema de Convex
export type Departamento = {
  _id: string;
  escuelaId: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
};

// Tipos para crear y actualizar departamento
export type CrearDepartamentoData = {
  escuelaId: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
};

export type ActualizarDepartamentoData = {
  id: string;
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
};

// Store de Departamento con CRUD completo
export type DepartamentoStore = {
  departamentos: Departamento[];
  departamentoSeleccionado: Departamento | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  setDepartamentos: (departamentos: Departamento[]) => void;
  setDepartamentoSeleccionado: (departamento: Departamento | null) => void;
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
  departamentos: [],
  departamentoSeleccionado: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const useDepartamentoStore = create<DepartamentoStore>((set) => ({
  ...initialState,
  setDepartamentos: (departamentos) => set({ departamentos }),
  setDepartamentoSeleccionado: (departamentoSeleccionado) => set({ departamentoSeleccionado }),
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

type DepartamentoQueryResult = {
  _id: string;
  escuelaId: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
};

export const useDepartamento = (escuelaId?: string) => {
  const {
    departamentos,
    departamentoSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    setDepartamentos,
    setDepartamentoSeleccionado,
    setCreating,
    setUpdating,
    setDeleting,
    setCreateError,
    setUpdateError,
    setDeleteError,
    clearErrors,
  } = useDepartamentoStore();

  // Query para obtener los departamentos de la escuela
  const departamentosQuery = useQuery(
    api.departamento.obtenerDepartamentos,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );

  // Mutations
  const crearDepartamentoMutation = useMutation(api.departamento.crearDepartamento);
  const actualizarDepartamentoMutation = useMutation(api.departamento.actualizarDepartamento);
  const eliminarDepartamentoMutation = useMutation(api.departamento.eliminarDepartamento);

  // CREATE
  const crearDepartamento = useCallback(async (data: CrearDepartamentoData) => {
    setCreating(true);
    setCreateError(null);
    try {
      await crearDepartamentoMutation({
        ...data,
        escuelaId: data.escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear departamento';
      setCreateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [crearDepartamentoMutation, setCreating, setCreateError]);

  // UPDATE
  const actualizarDepartamento = useCallback(async (data: ActualizarDepartamentoData) => {
    setUpdating(true);
    setUpdateError(null);
    try {
      await actualizarDepartamentoMutation({
        id: data.id as Id<"departamento">,
        nombre: data.nombre,
        descripcion: data.descripcion,
        activo: data.activo,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar departamento';
      setUpdateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [actualizarDepartamentoMutation, setUpdating, setUpdateError]);

  // DELETE
  const eliminarDepartamento = useCallback(async (id: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await eliminarDepartamentoMutation({
        id: id as Id<"departamento">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar departamento';
      setDeleteError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [eliminarDepartamentoMutation, setDeleting, setDeleteError]);

  // Refrescar departamentos cuando cambie la query
  useEffect(() => {
    if (departamentosQuery) {
      setDepartamentos(
        (departamentosQuery as DepartamentoQueryResult[]).map((d) => ({
          _id: d._id,
          escuelaId: d.escuelaId,
          nombre: d.nombre,
          descripcion: d.descripcion,
          activo: d.activo,
        }))
      );
    }
  }, [departamentosQuery, setDepartamentos]);

  return {
    departamentos,
    departamentoSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    crearDepartamento,
    actualizarDepartamento,
    eliminarDepartamento,
    setDepartamentoSeleccionado,
    clearErrors,
  };
}; 