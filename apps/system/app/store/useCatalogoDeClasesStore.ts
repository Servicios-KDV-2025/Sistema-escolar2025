import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

// Tipo de CatalogoDeClase basado en tu schema de Convex
export type CatalogoDeClase = {
  _id: string;
  escuelaId: string;
  cicloEscolarId: string;
  materiaId: string;
  salonId: string;
  maestroId: string;
  grupoId?: string;
  nombre: string;
  activa: boolean;
};

// Tipos para crear y actualizar catálogo de clase
export type CrearCatalogoDeClaseData = {
  escuelaId: string;
  cicloEscolarId: string;
  materiaId: string;
  salonId: string;
  maestroId: string;
  grupoId?: string;
  nombre: string;
  activa: boolean;
};

export type ActualizarCatalogoDeClaseData = {
  _id: string;
  escuelaId: string;
  cicloEscolarId: string;
  materiaId: string;
  salonId: string;
  maestroId: string;
  grupoId?: string;
  nombre: string;
  activa: boolean;
};

// Store de CatalogoDeClase con CRUD completo
export type CatalogoDeClaseStore = {
  catalogosDeClases: CatalogoDeClase[];
  catalogoDeClaseSeleccionado: CatalogoDeClase | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  setCatalogosDeClases: (catalogosDeClases: CatalogoDeClase[]) => void;
  setCatalogoDeClaseSeleccionado: (catalogoDeClase: CatalogoDeClase | null) => void;
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
  catalogosDeClases: [],
  catalogoDeClaseSeleccionado: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const useCatalogoDeClaseStore = create<CatalogoDeClaseStore>((set) => ({
  ...initialState,
  setCatalogosDeClases: (catalogosDeClases) => set({ catalogosDeClases }),
  setCatalogoDeClaseSeleccionado: (catalogoDeClaseSeleccionado) => set({ catalogoDeClaseSeleccionado }),
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

type CatalogoDeClaseQueryResult = {
  _id: string;
  escuelaId: string;
  cicloEscolarId: string;
  materiaId: string;
  salonId: string;
  maestroId: string;
  grupoId?: string;
  nombre: string;
  activa: boolean;
};

export const useCatalogoDeClase = (escuelaId?: string) => {
  const {
    catalogosDeClases,
    catalogoDeClaseSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    setCatalogosDeClases,
    setCatalogoDeClaseSeleccionado,
    setCreating,
    setUpdating,
    setDeleting,
    setCreateError,
    setUpdateError,
    setDeleteError,
    clearErrors,
  } = useCatalogoDeClaseStore();

  // Query para obtener los catálogos de clases de la escuela
  const catalogosDeClasesQuery = useQuery(
    api.catalogosDeClases.verTodosLosCatalogosDeClases,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );

  // Mutations
  const crearCatalogoDeClaseMutation = useMutation(api.catalogosDeClases.crearCatalogoDeCases);
  const actualizarCatalogoDeClaseMutation = useMutation(api.catalogosDeClases.actualizarCatalogoDeClase);
  const eliminarCatalogoDeClaseMutation = useMutation(api.catalogosDeClases.eliminarCatalogoDeClase);

  // CREATE
  const crearCatalogoDeClase = useCallback(async (data: CrearCatalogoDeClaseData) => {
    setCreating(true);
    setCreateError(null);
    try {
      await crearCatalogoDeClaseMutation({
        ...data,
        escuelaId: data.escuelaId as Id<"escuelas">,
        cicloEscolarId: data.cicloEscolarId as Id<"ciclosEscolares">,
        materiaId: data.materiaId as Id<"materias">,
        salonId: data.salonId as Id<"salones">,
        maestroId: data.maestroId as Id<"personal">,
        grupoId: data.grupoId as Id<"grupos"> | undefined,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear catálogo de clase';
      setCreateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [crearCatalogoDeClaseMutation, setCreating, setCreateError]);

  // UPDATE
  const actualizarCatalogoDeClase = useCallback(async (data: ActualizarCatalogoDeClaseData) => {
    setUpdating(true);
    setUpdateError(null);
    try {
      await actualizarCatalogoDeClaseMutation({
        _id: data._id as Id<"catalogosDeClases">,
        escuelaId: data.escuelaId as Id<"escuelas">,
        cicloEscolarId: data.cicloEscolarId as Id<"ciclosEscolares">,
        materiaId: data.materiaId as Id<"materias">,
        salonId: data.salonId as Id<"salones">,
        maestroId: data.maestroId as Id<"personal">,
        grupoId: data.grupoId as Id<"grupos"> | undefined,
        nombre: data.nombre,
        activa: data.activa,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar catálogo de clase';
      setUpdateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [actualizarCatalogoDeClaseMutation, setUpdating, setUpdateError]);

  // DELETE
  const eliminarCatalogoDeClase = useCallback(async (id: string, escuelaId: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await eliminarCatalogoDeClaseMutation({
        _id: id as Id<"catalogosDeClases">,
        escuelaId: escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar catálogo de clase';
      setDeleteError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [eliminarCatalogoDeClaseMutation, setDeleting, setDeleteError]);

  // Refrescar catálogos de clases cuando cambie la query
  useEffect(() => {
    if (catalogosDeClasesQuery) {
      setCatalogosDeClases(
        (catalogosDeClasesQuery as CatalogoDeClaseQueryResult[]).map((c) => ({
          _id: c._id,
          escuelaId: c.escuelaId,
          cicloEscolarId: c.cicloEscolarId,
          materiaId: c.materiaId,
          salonId: c.salonId,
          maestroId: c.maestroId,
          grupoId: c.grupoId,
          nombre: c.nombre,
          activa: c.activa,
        }))
      );
    }
  }, [catalogosDeClasesQuery, setCatalogosDeClases]);

  return {
    catalogosDeClases,
    catalogoDeClaseSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    crearCatalogoDeClase,
    actualizarCatalogoDeClase,
    eliminarCatalogoDeClase,
    setCatalogoDeClaseSeleccionado,
    clearErrors,
  };
}; 