import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

// Tipo de Evento por Clase basado en tu schema de Convex
export type EventoPorClase = {
  _id: string;
  escuelaId: string;
  catalogoClaseId: string;
  calendarioId: string;
  cicloEscolarId: string;
  eventoEscolarId: string;
  fecha: number;
  descripcion?: string;
  activo: boolean;
  createdBy: string;
  updatedBy: string;
};

// Tipos para crear y actualizar evento por clase
export type CrearEventoPorClaseData = {
  escuelaId: string;
  catalogoClaseId: string;
  calendarioId: string;
  cicloEscolarId: string;
  eventoEscolarId: string;
  fecha: number;
  descripcion?: string;
  activo: boolean;
  createdBy: string;
};

export type ActualizarEventoPorClaseData = {
  _id: string;
  escuelaId: string;
  catalogoClaseId: string;
  calendarioId: string;
  cicloEscolarId: string;
  eventoEscolarId: string;
  fecha: number;
  descripcion?: string;
  activo: boolean;
  createdBy: string;
  updatedBy: string;
};

// Store de Evento por Clase con CRUD completo
export type EventoPorClaseStore = {
  eventosPorClase: EventoPorClase[];
  eventoPorClaseSeleccionado: EventoPorClase | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  setEventosPorClase: (eventosPorClase: EventoPorClase[]) => void;
  setEventoPorClaseSeleccionado: (eventoPorClase: EventoPorClase | null) => void;
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
  eventosPorClase: [],
  eventoPorClaseSeleccionado: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const useEventoPorClaseStore = create<EventoPorClaseStore>((set) => ({
  ...initialState,
  setEventosPorClase: (eventosPorClase) => set({ eventosPorClase }),
  setEventoPorClaseSeleccionado: (eventoPorClaseSeleccionado) => set({ eventoPorClaseSeleccionado }),
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

type EventoPorClaseQueryResult = {
  _id: string;
  escuelaId: string;
  catalogoClaseId: string;
  calendarioId: string;
  cicloEscolarId: string;
  eventoEscolarId: string;
  fecha: number;
  descripcion?: string;
  activo: boolean;
  createdBy: string;
  updatedBy: string;
};

export const useEventoPorClase = (escuelaId?: string) => {
  const {
    eventosPorClase,
    eventoPorClaseSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    setEventosPorClase,
    setEventoPorClaseSeleccionado,
    setCreating,
    setUpdating,
    setDeleting,
    setCreateError,
    setUpdateError,
    setDeleteError,
    clearErrors,
  } = useEventoPorClaseStore();

  // Query para obtener todos los eventos por clase de la escuela
  const eventosPorClaseQuery = useQuery(
    api.eventoPorClase.verTodosLosEventosXClases,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );

  // Mutations
  const crearEventoPorClaseMutation = useMutation(api.eventoPorClase.crearEventoXClase);
  const actualizarEventoPorClaseMutation = useMutation(api.eventoPorClase.actualizarEventoXClase);
  const eliminarEventoPorClaseMutation = useMutation(api.eventoPorClase.eliminarEventoXClase);

  // CREATE
  const crearEventoPorClase = useCallback(async (data: CrearEventoPorClaseData) => {
    setCreating(true);
    setCreateError(null);
    try {
      await crearEventoPorClaseMutation({
        ...data,
        escuelaId: data.escuelaId as Id<"escuelas">,
        catalogoClaseId: data.catalogoClaseId as Id<"catalogosDeClases">,
        calendarioId: data.calendarioId as Id<"calendario">,
        cicloEscolarId: data.cicloEscolarId as Id<"ciclosEscolares">,
        eventoEscolarId: data.eventoEscolarId ? data.eventoEscolarId as Id<"eventosEscolares"> : undefined,
        createdBy: data.createdBy as Id<"personal">
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear evento por clase';
      setCreateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [crearEventoPorClaseMutation, setCreating, setCreateError]);

  // UPDATE
  const actualizarEventoPorClase = useCallback(async (data: ActualizarEventoPorClaseData) => {
    setUpdating(true);
    setUpdateError(null);
    try {
      await actualizarEventoPorClaseMutation({
        _id: data._id as Id<"eventoPorClases">,
        escuelaId: data.escuelaId as Id<"escuelas">,
        catalogoClaseId: data.catalogoClaseId as Id<"catalogosDeClases">,
        calendarioId: data.calendarioId as Id<"calendario">,
        cicloEscolarId: data.cicloEscolarId as Id<"ciclosEscolares">,
        eventoEscolarId: data.eventoEscolarId as Id<"eventosEscolares">,
        fecha: data.fecha,
        descripcion: data.descripcion,
        activo: data.activo,
        updatedBy: data.updatedBy as Id<"personal">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar evento por clase';
      setUpdateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [actualizarEventoPorClaseMutation, setUpdating, setUpdateError]);

  // DELETE
  const eliminarEventoPorClase = useCallback(async (id: string, escuelaId: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await eliminarEventoPorClaseMutation({
        _id: id as Id<"eventoPorClases">,
        escuelaId: escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar evento por clase';
      setDeleteError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [eliminarEventoPorClaseMutation, setDeleting, setDeleteError]);

  // Refrescar eventos por clase cuando cambie la query
  useEffect(() => {
    if (eventosPorClaseQuery) {
      setEventosPorClase(
        (eventosPorClaseQuery as EventoPorClaseQueryResult[]).map((e) => ({
          _id: e._id,
          escuelaId: e.escuelaId,
          catalogoClaseId: e.catalogoClaseId,
          calendarioId: e.calendarioId,
          cicloEscolarId: e.cicloEscolarId,
          eventoEscolarId: e.eventoEscolarId,
          fecha: e.fecha,
          descripcion: e.descripcion,
          activo: e.activo,
          createdBy: e.createdBy as Id<"personal">,
          updatedBy: e.updatedBy as Id<"personal">,
        }))
      );
    }
  }, [eventosPorClaseQuery, setEventosPorClase]);

  // Funciones helper
  const eventosPorClasePorCatalogo = (catalogoClaseId: string) => {
    return eventosPorClase.filter(e => e.catalogoClaseId === catalogoClaseId);
  };

  const eventosPorClasePorCiclo = (cicloEscolarId: string) => {
    return eventosPorClase.filter(e => e.cicloEscolarId === cicloEscolarId);
  };

  const eventosPorClasePorEvento = (eventoEscolarId: string) => {
    return eventosPorClase.filter(e => e.eventoEscolarId === eventoEscolarId);
  };

  const eventosPorClasePorFecha = (fecha: number) => {
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fecha);
    fechaFin.setHours(23, 59, 59, 999);
    
    return eventosPorClase.filter(e => {
      const eventoFecha = new Date(e.fecha);
      return eventoFecha >= fechaInicio && eventoFecha <= fechaFin;
    });
  };

  const eventosPorClasePorRangoFechas = (fechaInicio: number, fechaFin: number) => {
    return eventosPorClase.filter(e => {
      return e.fecha >= fechaInicio && e.fecha <= fechaFin;
    });
  };

  const eventosPorClaseActivos = eventosPorClase.filter(e => e.activo);

  const formatearFecha = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearFechaCorta = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ordenarPorFecha = (eventos: EventoPorClase[]) => {
    return eventos.sort((a, b) => a.fecha - b.fecha);
  };

  const eventosProximos = (dias: number = 7) => {
    const ahora = Date.now();
    const limite = ahora + (dias * 24 * 60 * 60 * 1000);
    
    return eventosPorClaseActivos
      .filter(e => e.fecha >= ahora && e.fecha <= limite)
      .sort((a, b) => a.fecha - b.fecha);
  };

  return {
    eventosPorClase,
    eventosPorClaseActivos,
    eventoPorClaseSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    crearEventoPorClase,
    actualizarEventoPorClase,
    eliminarEventoPorClase,
    setEventoPorClaseSeleccionado,
    eventosPorClasePorCatalogo,
    eventosPorClasePorCiclo,
    eventosPorClasePorEvento,
    eventosPorClasePorFecha,
    eventosPorClasePorRangoFechas,
    eventosProximos,
    formatearFecha,
    formatearFechaCorta,
    ordenarPorFecha,
    clearErrors,
  };
}; 