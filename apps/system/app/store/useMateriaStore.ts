import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Materia } from "@/types/convex-zod-types";

// Tipos para crear y actualizar materia
export type CrearMateriaData = Pick<Materia, "escuelaId" | "nombre" | "descripcion" | "creditos" | "activa">

export type ActualizarMateriaData = Materia

// Store de Materia con CRUD completo
export type MateriaStore = {
  materias: Materia[];
  materiaSeleccionada: Materia | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  setMaterias: (materias: Materia[]) => void;
  setMateriaSeleccionada: (materia: Materia | null) => void;
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
  materias: [],
  materiaSeleccionada: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const useMateriaStore = create<MateriaStore>((set) => ({
  ...initialState,
  setMaterias: (materias) => set({ materias }),
  setMateriaSeleccionada: (materiaSeleccionada) => set({ materiaSeleccionada }),
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

export const useMateria = (escuelaId?: string) => {
  const {
    materias,
    materiaSeleccionada,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    setMaterias,
    setMateriaSeleccionada,
    setCreating,
    setUpdating,
    setDeleting,
    setCreateError,
    setUpdateError,
    setDeleteError,
    clearErrors,
  } = useMateriaStore();

  // Query para obtener las materias de la escuela
  const materiasQuery = useQuery(
    api.materias.obtenerMateriasPorEscuela,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );

  // Mutations
  const crearMateriaMutation = useMutation(api.materias.crearMateriaConEscuela);
  const actualizarMateriaMutation = useMutation(api.materias.actualizarMateriaConEscuela);
  const eliminarMateriaMutation = useMutation(api.materias.eliminarMateriaConEscuela);

  // CREATE
  const crearMateria = useCallback(async (data: CrearMateriaData) => {
    setCreating(true);
    setCreateError(null);
    try {
      await crearMateriaMutation({
        ...data,
        escuelaId: data.escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear materia';
      setCreateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [crearMateriaMutation, setCreating, setCreateError]);

  // UPDATE
  const actualizarMateria = useCallback(async (data: ActualizarMateriaData) => {
    setUpdating(true);
    setUpdateError(null);
    try {
      await actualizarMateriaMutation({
        id: data._id as Id<"materias">,
        escuelaId: data.escuelaId as Id<"escuelas">,
        nombre: data.nombre,
        descripcion: data.descripcion,
        creditos: data.creditos,
        activa: data.activa,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar materia';
      setUpdateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [actualizarMateriaMutation, setUpdating, setUpdateError]);

  // DELETE
  const eliminarMateria = useCallback(async (id: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await eliminarMateriaMutation({
        id: id as Id<"materias">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar materia';
      setDeleteError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [eliminarMateriaMutation, setDeleting, setDeleteError]);

  // Refrescar materias cuando cambie la query
  useEffect(() => {
    if (materiasQuery) {
      setMaterias(
        (materiasQuery as Materia[]).map((m) => ({
          _id: m._id,
          escuelaId: m.escuelaId,
          nombre: m.nombre,
          descripcion: m.descripcion,
          creditos: m.creditos,
          activa: m.activa,
        }))
      );
    }
  }, [materiasQuery, setMaterias]);

  return {
    materias,
    materiaSeleccionada,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    crearMateria,
    actualizarMateria,
    eliminarMateria,
    setMateriaSeleccionada,
    clearErrors,
  };
}; 