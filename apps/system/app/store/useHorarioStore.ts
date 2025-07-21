import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

// Tipo de Periodo basado en tu schema de Convex
export type Horario = {
  _id: string;
  escuelaId: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  activo: boolean;
};

// Tipos para crear y actualizar periodo
export type CrearHorarioData = {
  escuelaId: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  activo: boolean;
};

export type ActualizarHorarioData = {
  id: string;
  escuelaId: string;
  nombre?: string;
  horaInicio?: string;
  horaFin?: string;
  activo?: boolean;
};

// Store de Periodo con CRUD completo
export type HorarioStore = {
  horarios: Horario[];
  horarioSeleccionado: Horario | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  setHorarios: (horarios: Horario[]) => void;
  setHorarioSeleccionado: (horario: Horario | null) => void;
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
  horarios: [],
  horarioSeleccionado: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const useHorarioStore = create<HorarioStore>((set) => ({
  ...initialState,
  setHorarios: (horarios) => set({ horarios }),
  setHorarioSeleccionado: (horarioSeleccionado) => set({ horarioSeleccionado }),
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

type HorarioQueryData = {
  _id: string;
  escuelaId: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  activo: boolean;
};

export const useHorario = (escuelaId?: string) => {
  const {
    horarios,
    horarioSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    setHorarios,
    setHorarioSeleccionado,
    setCreating,
    setUpdating,
    setDeleting,
    setCreateError,
    setUpdateError,
    setDeleteError,
    clearErrors,
    } = useHorarioStore();

  // Query para obtener los horarios de la escuela
  const horariosQuery = useQuery(
    api.horarios.obtenerHorariosPorEscuela,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );

  // Mutations
  const crearHorarioMutation = useMutation(api.horarios.crearHorario);
  const actualizarHorarioMutation = useMutation(api.horarios.actualizarHorario);
  const eliminarHorarioMutation = useMutation(api.horarios.eliminarHorario);

  // CREATE
  const crearHorario = useCallback(async (data: CrearHorarioData) => {
    setCreating(true);
    setCreateError(null);
    try {
      await crearHorarioMutation({
        ...data,
        escuelaId: data.escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear horario';
      setCreateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [crearHorarioMutation, setCreating, setCreateError]);

  // UPDATE
  const actualizarHorario = useCallback(async (data: ActualizarHorarioData) => {
    setUpdating(true);
    setUpdateError(null);
    try {
      await actualizarHorarioMutation({
        id: data.id as Id<"horarios">,
        escuelaId: data.escuelaId as Id<"escuelas">,
        nombre: data.nombre,
        horaInicio: data.horaInicio,
        horaFin: data.horaFin,
        activo: data.activo,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar horario';
      setUpdateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [actualizarHorarioMutation, setUpdating, setUpdateError]);

  // DELETE
  const eliminarHorario = useCallback(async (id: string, escuelaId: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await eliminarHorarioMutation({
        id: id as Id<"horarios">,
        escuelaId: escuelaId as Id<"escuelas">,
      });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al eliminar horario';
      setDeleteError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [eliminarHorarioMutation, setDeleting, setDeleteError]);

  // Refrescar horarios cuando cambie la query
  useEffect(() => {
    if (horariosQuery) {
      setHorarios(
        (horariosQuery as HorarioQueryData[]).map((p) => ({
          _id: p._id,
          escuelaId: p.escuelaId,
          nombre: p.nombre,
          horaInicio: p.horaInicio,
          horaFin: p.horaFin,
          activo: p.activo,
        }))
      );
    }
  }, [horariosQuery, setHorarios]);

  return {
    horarios,
    horarioSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    crearHorario,
    actualizarHorario,
    eliminarHorario,
    setHorarioSeleccionado,
    clearErrors,
  };
}; 