import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { CicloEscolar } from "@/types/convex-zod-types";

// Tipos para crear y actualizar ciclo escolar
export type CrearCicloEscolarData = Pick<CicloEscolar, "escuelaId" | "nombre" | "fechaInicio" | "fechaFin">;

export type ActualizarCicloEscolarData = CicloEscolar;

// Store de CicloEscolar con CRUD completo
export type CicloEscolarStore = {
  ciclosEscolares: CicloEscolar[];
  cicloEscolarSeleccionado: CicloEscolar | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  setCiclosEscolares: (ciclosEscolares: CicloEscolar[]) => void;
  setCicloEscolarSeleccionado: (cicloEscolar: CicloEscolar | null) => void;
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
  ciclosEscolares: [],
  cicloEscolarSeleccionado: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const useCicloEscolarStore = create<CicloEscolarStore>((set) => ({
  ...initialState,
  setCiclosEscolares: (ciclosEscolares) => set({ ciclosEscolares }),
  setCicloEscolarSeleccionado: (cicloEscolarSeleccionado) => set({ cicloEscolarSeleccionado }),
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

export const useCicloEscolar = (escuelaId?: string) => {
  const {
    ciclosEscolares,
    cicloEscolarSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    setCiclosEscolares,
    setCicloEscolarSeleccionado,
    setCreating,
    setUpdating,
    setDeleting,
    setCreateError,
    setUpdateError,
    setDeleteError,
    clearErrors,
  } = useCicloEscolarStore();

  // Query para obtener los ciclos escolares de la escuela
  const ciclosEscolaresQuery = useQuery(
    api.ciclosEscolares.obtenerCiclosEscolares,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );

  // Mutations
  const crearCicloEscolarMutation = useMutation(api.ciclosEscolares.crearCicloEscolar);
  const actualizarCicloEscolarMutation = useMutation(api.ciclosEscolares.actualizarCicloEscolar);
  const eliminarCicloEscolarMutation = useMutation(api.ciclosEscolares.eliminarCicloEscolar);

  // CREATE
  const crearCicloEscolar = useCallback(async (data: CrearCicloEscolarData) => {
    setCreating(true);
    setCreateError(null);
    try {
      await crearCicloEscolarMutation({
        ...data,
        escuelaId: data.escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear ciclo escolar';
      setCreateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [crearCicloEscolarMutation, setCreating, setCreateError]);

  // UPDATE
  const actualizarCicloEscolar = useCallback(async (data: ActualizarCicloEscolarData) => {
    setUpdating(true);
    setUpdateError(null);
    try {
      await actualizarCicloEscolarMutation({
        cicloId: data._id as Id<"ciclosEscolares">,
        escuelaId: data.escuelaId as Id<"escuelas">,
        nombre: data.nombre,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
        activo: data.activo,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar ciclo escolar';
      setUpdateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [actualizarCicloEscolarMutation, setUpdating, setUpdateError]);

  // DELETE
  const eliminarCicloEscolar = useCallback(async (id: string, escuelaId: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await eliminarCicloEscolarMutation({
        cicloId: id as Id<"ciclosEscolares">,
        escuelaId: escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar ciclo escolar';
      setDeleteError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [eliminarCicloEscolarMutation, setDeleting, setDeleteError]);

  // Refrescar ciclos escolares cuando cambie la query
  useEffect(() => {
    if (ciclosEscolaresQuery) {
      setCiclosEscolares(
        (ciclosEscolaresQuery as CicloEscolar[]).map((c) => ({
          _id: c._id,
          escuelaId: c.escuelaId,
          nombre: c.nombre,
          fechaInicio: c.fechaInicio,
          fechaFin: c.fechaFin,
          activo: c.activo,
        }))
      );
    }
  }, [ciclosEscolaresQuery, setCiclosEscolares]);

  return {
    ciclosEscolares,
    cicloEscolarSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    crearCicloEscolar,
    actualizarCicloEscolar,
    eliminarCicloEscolar,
    setCicloEscolarSeleccionado,
    clearErrors,
  };
}; 