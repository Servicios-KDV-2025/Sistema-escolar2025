import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

// Tipo de Periodo basado en tu schema de Convex
export type Periodo = {
  _id: string;
  escuelaId: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  activo: boolean;
};

// Tipos para crear y actualizar periodo
export type CrearPeriodoData = {
  escuelaId: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  activo: boolean;
};

export type ActualizarPeriodoData = {
  id: string;
  escuelaId: string;
  nombre?: string;
  horaInicio?: string;
  horaFin?: string;
  activo?: boolean;
};

// Store de Periodo con CRUD completo
export type PeriodoStore = {
  periodos: Periodo[];
  periodoSeleccionado: Periodo | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  setPeriodos: (periodos: Periodo[]) => void;
  setPeriodoSeleccionado: (periodo: Periodo | null) => void;
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
  periodos: [],
  periodoSeleccionado: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const usePeriodoStore = create<PeriodoStore>((set) => ({
  ...initialState,
  setPeriodos: (periodos) => set({ periodos }),
  setPeriodoSeleccionado: (periodoSeleccionado) => set({ periodoSeleccionado }),
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

type PeriodoQueryData = {
  _id: string;
  escuelaId: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  activo: boolean;
};

export const usePeriodo = (escuelaId?: string) => {
  const {
    periodos,
    periodoSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    setPeriodos,
    setPeriodoSeleccionado,
    setCreating,
    setUpdating,
    setDeleting,
    setCreateError,
    setUpdateError,
    setDeleteError,
    clearErrors,
  } = usePeriodoStore();

  // Query para obtener los periodos de la escuela
  const periodosQuery = useQuery(
    api.periodos.obtenerPeriodosPorEscuela,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );

  // Mutations
  const crearPeriodoMutation = useMutation(api.periodos.crearPeriodo);
  const actualizarPeriodoMutation = useMutation(api.periodos.actualizarPeriodo);
  const eliminarPeriodoMutation = useMutation(api.periodos.eliminarPeriodo);

  // CREATE
  const crearPeriodo = useCallback(async (data: CrearPeriodoData) => {
    setCreating(true);
    setCreateError(null);
    try {
      await crearPeriodoMutation({
        ...data,
        escuelaId: data.escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear periodo';
      setCreateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [crearPeriodoMutation, setCreating, setCreateError]);

  // UPDATE
  const actualizarPeriodo = useCallback(async (data: ActualizarPeriodoData) => {
    setUpdating(true);
    setUpdateError(null);
    try {
      await actualizarPeriodoMutation({
        id: data.id as Id<"periodos">,
        escuelaId: data.escuelaId as Id<"escuelas">,
        nombre: data.nombre,
        horaInicio: data.horaInicio,
        horaFin: data.horaFin,
        activo: data.activo,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar periodo';
      setUpdateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [actualizarPeriodoMutation, setUpdating, setUpdateError]);

  // DELETE
  const eliminarPeriodo = useCallback(async (id: string, escuelaId: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await eliminarPeriodoMutation({
        id: id as Id<"periodos">,
        escuelaId: escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar periodo';
      setDeleteError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [eliminarPeriodoMutation, setDeleting, setDeleteError]);

  // Refrescar periodos cuando cambie la query
  useEffect(() => {
    if (periodosQuery) {
      setPeriodos(
        (periodosQuery as PeriodoQueryData[]).map((p) => ({
          _id: p._id,
          escuelaId: p.escuelaId,
          nombre: p.nombre,
          horaInicio: p.horaInicio,
          horaFin: p.horaFin,
          activo: p.activo,
        }))
      );
    }
  }, [periodosQuery, setPeriodos]);

  return {
    periodos,
    periodoSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    crearPeriodo,
    actualizarPeriodo,
    eliminarPeriodo,
    setPeriodoSeleccionado,
    clearErrors,
  };
}; 