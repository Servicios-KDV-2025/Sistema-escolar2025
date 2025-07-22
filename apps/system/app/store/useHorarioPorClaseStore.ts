import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

// Tipo de Horario por Clase basado en tu schema de Convex
export type HorarioPorClase = {
  _id: string;
  escuelaId: string;
  catalogoClaseId: string;
  horarioId: string;
  diaSemana: number; // 1=Lunes, 2=Martes, etc.
  activo: boolean;
};

// Tipos para crear y actualizar horario por clase
export type CrearHorarioPorClaseData = {
  escuelaId: string;
  catalogoClaseId: string;
  horarioId: string;
  diaSemana: number;
  activo: boolean;
};

export type ActualizarHorarioPorClaseData = {
  id: string;
  escuelaId: string;
  catalogoClaseId: string;
  horarioId: string;
  diaSemana?: number;
  activo?: boolean;
};

// Store de Horario por Clase con CRUD completo
export type HorarioPorClaseStore = {
  horariosPorClase: HorarioPorClase[];
  horarioPorClaseSeleccionado: HorarioPorClase | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  setHorariosPorClase: (horariosPorClase: HorarioPorClase[]) => void;
  setHorarioPorClaseSeleccionado: (horarioPorClase: HorarioPorClase | null) => void;
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
  horariosPorClase: [],
  horarioPorClaseSeleccionado: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const useHorarioPorClaseStore = create<HorarioPorClaseStore>((set) => ({
  ...initialState,
  setHorariosPorClase: (horariosPorClase) => set({ horariosPorClase }),
  setHorarioPorClaseSeleccionado: (horarioPorClaseSeleccionado) => set({ horarioPorClaseSeleccionado }),
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



export const useHorarioPorClase = (escuelaId?: string) => {
  const {
    horariosPorClase,
    horarioPorClaseSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    setHorariosPorClase,
    setHorarioPorClaseSeleccionado,
    setCreating,
    setUpdating,
    setDeleting,
    setCreateError,
    setUpdateError,
    setDeleteError,
    clearErrors,
  } = useHorarioPorClaseStore();

  // Query para obtener todos los periodos por clase de la escuela
  const horariosPorClaseQuery = useQuery(
      api.horarioPorClase.obtenerHorariosPorClasePorEscuela,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );



  // Mutations
  const crearHorarioPorClaseMutation = useMutation(api.horarioPorClase.crearHorarioPorClase);
  const actualizarHorarioPorClaseMutation = useMutation(api.horarioPorClase.actualizarHorarioPorClase);
  const eliminarHorarioPorClaseMutation = useMutation(api.horarioPorClase.eliminarHorarioPorClase);

  // CREATE
  const crearHorarioPorClase = useCallback(async (data: CrearHorarioPorClaseData) => {
    setCreating(true);
    setCreateError(null);
    try {
      await crearHorarioPorClaseMutation({
        ...data,
        escuelaId: data.escuelaId as Id<"escuelas">,
        catalogoClaseId: data.catalogoClaseId as Id<"catalogosDeClases">,
        horarioId: data.horarioId as Id<"horarios">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear horario por clase';
      setCreateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [crearHorarioPorClaseMutation, setCreating, setCreateError]);

  // UPDATE
  const actualizarHorarioPorClase = useCallback(async (data: ActualizarHorarioPorClaseData) => {
    setUpdating(true);
    setUpdateError(null);
    try {
      await actualizarHorarioPorClaseMutation({
        id: data.id as Id<"horarioPorClase">,
        escuelaId: data.escuelaId as Id<"escuelas">,
        catalogoClaseId: data.catalogoClaseId as Id<"catalogosDeClases">,
        horarioId: data.horarioId as Id<"horarios">,
        diaSemana: data.diaSemana,
        activo: data.activo,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar horario por clase';
      setUpdateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [actualizarHorarioPorClaseMutation, setUpdating, setUpdateError]);

  // DELETE
  const eliminarHorarioPorClase = useCallback(async (id: string, escuelaId: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
        await eliminarHorarioPorClaseMutation({
        id: id as Id<"horarioPorClase">,
        escuelaId: escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar horario por clase';
      setDeleteError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [eliminarHorarioPorClaseMutation, setDeleting, setDeleteError]);

  // Refrescar horarios por clase cuando cambie la query
  useEffect(() => {
    if (horariosPorClaseQuery) {
      setHorariosPorClase(
        (horariosPorClaseQuery as unknown as Array<{
          _id: string;
          escuelaId: string;
          catalogoClaseId: string;
          horarioId: string;
          diaSemana: number;
          activo: boolean;
        }>).map((p) => ({
          _id: p._id,
          escuelaId: p.escuelaId,
          catalogoClaseId: p.catalogoClaseId,
          horarioId: p.horarioId,
          diaSemana: p.diaSemana,
          activo: p.activo,
        }))
      );
    }
  }, [horariosPorClaseQuery, setHorariosPorClase]);

  // Funciones helper
  const horariosPorClasePorCatalogo = (catalogoClaseId: string) => {
    return horariosPorClase.filter(p => p.catalogoClaseId === catalogoClaseId);
  };

  const horariosPorClasePorDia = (diaSemana: number) => {
      return horariosPorClase.filter(p => p.diaSemana === diaSemana);
  };

  const horariosPorClaseActivos = horariosPorClase.filter(p => p.activo);

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

  const ordenarPorDiaYPeriodo = (horarios: HorarioPorClase[]) => {
    return horarios.sort((a, b) => {
      if (a.diaSemana !== b.diaSemana) {
        return a.diaSemana - b.diaSemana;
      }
      // Si es el mismo día, ordenar por periodo (asumiendo que periodoId tiene orden)
      return a.horarioId.localeCompare(b.horarioId);
    });
  };

  return {
    horariosPorClase,
    horariosPorClaseActivos,
    horarioPorClaseSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    crearHorarioPorClase,
    actualizarHorarioPorClase,
    eliminarHorarioPorClase,
    setHorarioPorClaseSeleccionado,
    horariosPorClasePorCatalogo,
    horariosPorClasePorDia,
    obtenerNombreDia,
    obtenerDiaCorto,
    ordenarPorDiaYPeriodo,
    clearErrors,
  };
}; 