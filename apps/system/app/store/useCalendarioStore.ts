import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

// Tipo de Calendario basado en tu schema de Convex
export type Calendario = {
  _id: string;
  cicloEscolarId: string;
  escuelaId: string;
  fecha: number;
  tipo: string;
  descripcion?: string;
  activo: boolean;
};

// Tipos para crear y actualizar evento de calendario
export type CrearEventoCalendarioData = {
  cicloEscolarId: string;
  escuelaId: string;
  fecha: number;
  tipo: string;
  descripcion?: string;
};

export type ActualizarEventoCalendarioData = {
  eventoId: string;
  escuelaId: string;
  fecha: number;
  tipo: string;
  descripcion?: string;
  activo?: boolean;
};

// Store de Calendario con CRUD completo
export type CalendarioStore = {
  eventosCalendario: Calendario[];
  eventoCalendarioSeleccionado: Calendario | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  setEventosCalendario: (eventosCalendario: Calendario[]) => void;
  setEventoCalendarioSeleccionado: (eventoCalendario: Calendario | null) => void;
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
  eventosCalendario: [],
  eventoCalendarioSeleccionado: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const useCalendarioStore = create<CalendarioStore>((set) => ({
  ...initialState,
  setEventosCalendario: (eventosCalendario) => set({ eventosCalendario }),
  setEventoCalendarioSeleccionado: (eventoCalendarioSeleccionado) => set({ eventoCalendarioSeleccionado }),
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

type CalendarioQueryData = {
  _id: string;
  cicloEscolarId: string;
  escuelaId: string;
  fecha: number;
  tipo: string;
  descripcion?: string;
  activo: boolean;
};

export const useCalendario = (escuelaId?: string, cicloEscolarId?: string) => {
  const {
    eventosCalendario,
    eventoCalendarioSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    setEventosCalendario,
    setEventoCalendarioSeleccionado,
    setCreating,
    setUpdating,
    setDeleting,
    setCreateError,
    setUpdateError,
    setDeleteError,
    clearErrors,
  } = useCalendarioStore();

  // Query para obtener todos los eventos del calendario de la escuela
  const eventosCalendarioQuery = useQuery(
    api.calendario.obtenerEventosCalendario,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );



  // Mutations
  const crearEventoCalendarioMutation = useMutation(api.calendario.crearEventoCalendario);
  const actualizarEventoCalendarioMutation = useMutation(api.calendario.actualizarEventoCalendario);
  const eliminarEventoCalendarioMutation = useMutation(api.calendario.eliminarEventoCalendario);

  // CREATE
  const crearEventoCalendario = useCallback(async (data: CrearEventoCalendarioData) => {
    setCreating(true);
    setCreateError(null);
    try {
      await crearEventoCalendarioMutation({
        ...data,
        cicloEscolarId: data.cicloEscolarId as Id<"ciclosEscolares">,
        escuelaId: data.escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear evento de calendario';
      setCreateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [crearEventoCalendarioMutation, setCreating, setCreateError]);

  // UPDATE
  const actualizarEventoCalendario = useCallback(async (data: ActualizarEventoCalendarioData) => {
    setUpdating(true);
    setUpdateError(null);
    try {
      await actualizarEventoCalendarioMutation({
        eventoId: data.eventoId as Id<"calendario">,
        escuelaId: data.escuelaId as Id<"escuelas">,
        fecha: data.fecha,
        tipo: data.tipo,
        descripcion: data.descripcion,
        activo: data.activo,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar evento de calendario';
      setUpdateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [actualizarEventoCalendarioMutation, setUpdating, setUpdateError]);

  // DELETE
  const eliminarEventoCalendario = useCallback(async (eventoId: string, escuelaId: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await eliminarEventoCalendarioMutation({
        eventoId: eventoId as Id<"calendario">,
        escuelaId: escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar evento de calendario';
      setDeleteError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [eliminarEventoCalendarioMutation, setDeleting, setDeleteError]);

  // Refrescar eventos del calendario cuando cambie la query
  useEffect(() => {
    if (eventosCalendarioQuery) {
      setEventosCalendario(
        (eventosCalendarioQuery as CalendarioQueryData[]).map((e) => ({
          _id: e._id,
          cicloEscolarId: e.cicloEscolarId,
          escuelaId: e.escuelaId,
          fecha: e.fecha,
          tipo: e.tipo,
          descripcion: e.descripcion,
          activo: e.activo,
        }))
      );
    }
  }, [eventosCalendarioQuery, setEventosCalendario]);

  // Función helper para obtener eventos de un ciclo específico
  const eventosPorCiclo = cicloEscolarId 
    ? eventosCalendario.filter(evento => evento.cicloEscolarId === cicloEscolarId)
    : eventosCalendario;

  // Función helper para formatear fecha
  const formatearFecha = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return {
    eventosCalendario,
    eventosPorCiclo,
    eventoCalendarioSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    crearEventoCalendario,
    actualizarEventoCalendario,
    eliminarEventoCalendario,
    setEventoCalendarioSeleccionado,
    formatearFecha,
    clearErrors,
  };
}; 