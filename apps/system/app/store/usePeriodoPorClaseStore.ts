import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

// Tipo de Periodo por Clase basado en tu schema de Convex
export type PeriodoPorClase = {
  _id: string;
  escuelaId: string;
  catalogoClaseId: string;
  periodoId: string;
  diaSemana: number; // 1=Lunes, 2=Martes, etc.
  activo: boolean;
};

// Tipos para crear y actualizar periodo por clase
export type CrearPeriodoPorClaseData = {
  escuelaId: string;
  catalogoClaseId: string;
  periodoId: string;
  diaSemana: number;
  activo: boolean;
};

export type ActualizarPeriodoPorClaseData = {
  id: string;
  escuelaId: string;
  catalogoClaseId: string;
  periodoId: string;
  diaSemana?: number;
  activo?: boolean;
};

// Store de Periodo por Clase con CRUD completo
export type PeriodoPorClaseStore = {
  periodosPorClase: PeriodoPorClase[];
  periodoPorClaseSeleccionado: PeriodoPorClase | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  setPeriodosPorClase: (periodosPorClase: PeriodoPorClase[]) => void;
  setPeriodoPorClaseSeleccionado: (periodoPorClase: PeriodoPorClase | null) => void;
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
  periodosPorClase: [],
  periodoPorClaseSeleccionado: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const usePeriodoPorClaseStore = create<PeriodoPorClaseStore>((set) => ({
  ...initialState,
  setPeriodosPorClase: (periodosPorClase) => set({ periodosPorClase }),
  setPeriodoPorClaseSeleccionado: (periodoPorClaseSeleccionado) => set({ periodoPorClaseSeleccionado }),
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



export const usePeriodoPorClase = (escuelaId?: string) => {
  const {
    periodosPorClase,
    periodoPorClaseSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    setPeriodosPorClase,
    setPeriodoPorClaseSeleccionado,
    setCreating,
    setUpdating,
    setDeleting,
    setCreateError,
    setUpdateError,
    setDeleteError,
    clearErrors,
  } = usePeriodoPorClaseStore();

  // Query para obtener todos los periodos por clase de la escuela
  const periodosPorClaseQuery = useQuery(
    api.periodoporClase.obtenerPeriodosPorClasePorEscuela,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );



  // Mutations
  const crearPeriodoPorClaseMutation = useMutation(api.periodoporClase.crearPeriodoPorClase);
  const actualizarPeriodoPorClaseMutation = useMutation(api.periodoporClase.actualizarPeriodoPorClase);
  const eliminarPeriodoPorClaseMutation = useMutation(api.periodoporClase.eliminarPeriodoPorClase);

  // CREATE
  const crearPeriodoPorClase = useCallback(async (data: CrearPeriodoPorClaseData) => {
    setCreating(true);
    setCreateError(null);
    try {
      await crearPeriodoPorClaseMutation({
        ...data,
        escuelaId: data.escuelaId as Id<"escuelas">,
        catalogoClaseId: data.catalogoClaseId as Id<"catalogosDeClases">,
        periodoId: data.periodoId as Id<"periodos">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear periodo por clase';
      setCreateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [crearPeriodoPorClaseMutation, setCreating, setCreateError]);

  // UPDATE
  const actualizarPeriodoPorClase = useCallback(async (data: ActualizarPeriodoPorClaseData) => {
    setUpdating(true);
    setUpdateError(null);
    try {
      await actualizarPeriodoPorClaseMutation({
        id: data.id as Id<"periodoPorClase">,
        escuelaId: data.escuelaId as Id<"escuelas">,
        catalogoClaseId: data.catalogoClaseId as Id<"catalogosDeClases">,
        periodoId: data.periodoId as Id<"periodos">,
        diaSemana: data.diaSemana,
        activo: data.activo,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar periodo por clase';
      setUpdateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [actualizarPeriodoPorClaseMutation, setUpdating, setUpdateError]);

  // DELETE
  const eliminarPeriodoPorClase = useCallback(async (id: string, escuelaId: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await eliminarPeriodoPorClaseMutation({
        id: id as Id<"periodoPorClase">,
        escuelaId: escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar periodo por clase';
      setDeleteError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [eliminarPeriodoPorClaseMutation, setDeleting, setDeleteError]);

  // Refrescar periodos por clase cuando cambie la query
  useEffect(() => {
    if (periodosPorClaseQuery) {
      setPeriodosPorClase(
        (periodosPorClaseQuery as unknown as Array<{
          _id: string;
          escuelaId: string;
          catalogoClaseId: string;
          periodoId: string;
          diaSemana: number;
          activo: boolean;
        }>).map((p) => ({
          _id: p._id,
          escuelaId: p.escuelaId,
          catalogoClaseId: p.catalogoClaseId,
          periodoId: p.periodoId,
          diaSemana: p.diaSemana,
          activo: p.activo,
        }))
      );
    }
  }, [periodosPorClaseQuery, setPeriodosPorClase]);

  // Funciones helper
  const periodosPorClasePorCatalogo = (catalogoClaseId: string) => {
    return periodosPorClase.filter(p => p.catalogoClaseId === catalogoClaseId);
  };

  const periodosPorClasePorPeriodo = (periodoId: string) => {
    return periodosPorClase.filter(p => p.periodoId === periodoId);
  };

  const periodosPorClasePorDia = (diaSemana: number) => {
    return periodosPorClase.filter(p => p.diaSemana === diaSemana);
  };

  const periodosPorClaseActivos = periodosPorClase.filter(p => p.activo);

  const obtenerNombreDia = (diaSemana: number) => {
    const dias = [
      'Domingo', 'Lunes', 'Martes', 'Miércoles', 
      'Jueves', 'Viernes', 'Sábado'
    ];
    return dias[diaSemana] || 'Día inválido';
  };

  const obtenerDiaCorto = (diaSemana: number) => {
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return dias[diaSemana] || 'Inv';
  };

  const ordenarPorDiaYPeriodo = (periodos: PeriodoPorClase[]) => {
    return periodos.sort((a, b) => {
      if (a.diaSemana !== b.diaSemana) {
        return a.diaSemana - b.diaSemana;
      }
      // Si es el mismo día, ordenar por periodo (asumiendo que periodoId tiene orden)
      return a.periodoId.localeCompare(b.periodoId);
    });
  };

  return {
    periodosPorClase,
    periodosPorClaseActivos,
    periodoPorClaseSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    crearPeriodoPorClase,
    actualizarPeriodoPorClase,
    eliminarPeriodoPorClase,
    setPeriodoPorClaseSeleccionado,
    periodosPorClasePorCatalogo,
    periodosPorClasePorPeriodo,
    periodosPorClasePorDia,
    obtenerNombreDia,
    obtenerDiaCorto,
    ordenarPorDiaYPeriodo,
    clearErrors,
  };
}; 