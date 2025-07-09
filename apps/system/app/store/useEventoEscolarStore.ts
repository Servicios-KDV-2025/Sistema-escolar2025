import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

// Tipo de EventoEscolar basado en tu schema de Convex
export type EventoEscolar = {
  _id: string;
  escuelaId: string;
  nombre: string;
  descripcion?: string;
  tipo: string;
  activo: boolean;
};

// Tipos para crear y actualizar evento escolar
export type CrearEventoEscolarData = {
  escuelaId: string;
  nombre: string;
  descripcion?: string;
  tipo: string;
  activo: boolean;
};

export type ActualizarEventoEscolarData = {
  id: string;
  escuelaId: string;
  nombre?: string;
  descripcion?: string;
  tipo?: string;
  activo?: boolean;
};

// Store de EventoEscolar con CRUD completo
export type EventoEscolarStore = {
  eventosEscolares: EventoEscolar[];
  eventoEscolarSeleccionado: EventoEscolar | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  setEventosEscolares: (eventosEscolares: EventoEscolar[]) => void;
  setEventoEscolarSeleccionado: (eventoEscolar: EventoEscolar | null) => void;
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
  eventosEscolares: [],
  eventoEscolarSeleccionado: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const useEventoEscolarStore = create<EventoEscolarStore>((set) => ({
  ...initialState,
  setEventosEscolares: (eventosEscolares) => set({ eventosEscolares }),
  setEventoEscolarSeleccionado: (eventoEscolarSeleccionado) => set({ eventoEscolarSeleccionado }),
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

type EventoEscolarQueryData = {
  _id: string;
  escuelaId: string;
  nombre: string;
  descripcion?: string;
  tipo: string;
  activo: boolean;
};

export const useEventoEscolar = (escuelaId?: string) => {
  const {
    eventosEscolares,
    eventoEscolarSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    setEventosEscolares,
    setEventoEscolarSeleccionado,
    setCreating,
    setUpdating,
    setDeleting,
    setCreateError,
    setUpdateError,
    setDeleteError,
    clearErrors,
  } = useEventoEscolarStore();

  // Query para obtener los eventos escolares de la escuela
  const eventosEscolaresQuery = useQuery(
    api.eventosEscolares.obtenerEventosEscolaresPorEscuela,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );

  // Mutations
  const crearEventoEscolarMutation = useMutation(api.eventosEscolares.crearEventoEscolar);
  const actualizarEventoEscolarMutation = useMutation(api.eventosEscolares.actualizarEventoEscolar);
  const eliminarEventoEscolarMutation = useMutation(api.eventosEscolares.eliminarEventoEscolar);

  // CREATE
  const crearEventoEscolar = useCallback(async (data: CrearEventoEscolarData) => {
    setCreating(true);
    setCreateError(null);
    try {
      await crearEventoEscolarMutation({
        ...data,
        escuelaId: data.escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear evento escolar';
      setCreateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [crearEventoEscolarMutation, setCreating, setCreateError]);

  // UPDATE
  const actualizarEventoEscolar = useCallback(async (data: ActualizarEventoEscolarData) => {
    setUpdating(true);
    setUpdateError(null);
    try {
      await actualizarEventoEscolarMutation({
        id: data.id as Id<"eventosEscolares">,
        escuelaId: data.escuelaId as Id<"escuelas">,
        nombre: data.nombre,
        descripcion: data.descripcion,
        tipo: data.tipo,
        activo: data.activo,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar evento escolar';
      setUpdateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [actualizarEventoEscolarMutation, setUpdating, setUpdateError]);

  // DELETE
  const eliminarEventoEscolar = useCallback(async (id: string, escuelaId: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await eliminarEventoEscolarMutation({
        id: id as Id<"eventosEscolares">,
        escuelaId: escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar evento escolar';
      setDeleteError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [eliminarEventoEscolarMutation, setDeleting, setDeleteError]);

  // Refrescar eventos escolares cuando cambie la query
  useEffect(() => {
    if (eventosEscolaresQuery) {
      setEventosEscolares(
        (eventosEscolaresQuery as EventoEscolarQueryData[]).map((e) => ({
          _id: e._id,
          escuelaId: e.escuelaId,
          nombre: e.nombre,
          descripcion: e.descripcion,
          tipo: e.tipo,
          activo: e.activo,
        }))
      );
    }
  }, [eventosEscolaresQuery, setEventosEscolares]);

  return {
    eventosEscolares,
    eventoEscolarSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    crearEventoEscolar,
    actualizarEventoEscolar,
    eliminarEventoEscolar,
    setEventoEscolarSeleccionado,
    clearErrors,
  };
}; 