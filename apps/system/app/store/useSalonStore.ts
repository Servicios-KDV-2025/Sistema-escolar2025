import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Salon } from "@/types/convex-zod-types";

// Tipos para crear y actualizar salón
export type CrearSalonData = Pick<Salon, "escuelaId" | "nombre" | "capacidad" | "ubicacion">

export type ActualizarSalonData = Pick<Salon, "_id" | "escuelaId" | "nombre" | "capacidad" | "ubicacion">

// Store de Salon con CRUD completo
export type SalonStore = {
  salones: Salon[];
  salonSeleccionado: Salon | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  setSalones: (salones: Salon[]) => void;
  setSalonSeleccionado: (salon: Salon | null) => void;
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
  salones: [],
  salonSeleccionado: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const useSalonStore = create<SalonStore>((set) => ({
  ...initialState,
  setSalones: (salones) => set({ salones }),
  setSalonSeleccionado: (salonSeleccionado) => set({ salonSeleccionado }),
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

export const useSalon = (escuelaId?: string) => {
  const {
    salones,
    salonSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    setSalones,
    setSalonSeleccionado,
    setCreating,
    setUpdating,
    setDeleting,
    setCreateError,
    setUpdateError,
    setDeleteError,
    clearErrors,
  } = useSalonStore();

  // Query para obtener los salones de la escuela
  const salonesQuery = useQuery(
    api.salones.obtenerSalones,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );

  // Mutations
  const crearSalonMutation = useMutation(api.salones.crearSalon);
  const actualizarSalonMutation = useMutation(api.salones.actualizarSalon);
  const eliminarSalonMutation = useMutation(api.salones.eliminarSalon);

  // CREATE
  const crearSalon = useCallback(async (data: CrearSalonData) => {
    setCreating(true);
    setCreateError(null);
    try {
      await crearSalonMutation({
        ...data,
        escuelaId: data.escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear salón';
      setCreateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [crearSalonMutation, setCreating, setCreateError]);

  // UPDATE
  const actualizarSalon = useCallback(async (data: ActualizarSalonData) => {
    setUpdating(true);
    setUpdateError(null);
    try {
      await actualizarSalonMutation({
        salonId: data._id as Id<"salones">,
        escuelaId: data.escuelaId as Id<"escuelas">,
        nombre: data.nombre,
        capacidad: data.capacidad,
        ubicacion: data.ubicacion,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar salón';
      setUpdateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [actualizarSalonMutation, setUpdating, setUpdateError]);

  // DELETE
  const eliminarSalon = useCallback(async (id: string, escuelaId: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await eliminarSalonMutation({
        salonId: id as Id<"salones">,
        escuelaId: escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar salón';
      setDeleteError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [eliminarSalonMutation, setDeleting, setDeleteError]);

  // Refrescar salones cuando cambie la query
  useEffect(() => {
    if (salonesQuery) {
      setSalones(
        (salonesQuery as Salon[]).map((s) => ({
          _id: s._id,
          escuelaId: s.escuelaId,
          nombre: s.nombre,
          capacidad: s.capacidad,
          ubicacion: s.ubicacion,
          activo: s.activo,
        }))
      );
    }
  }, [salonesQuery, setSalones]);

  return {
    salones,
    salonSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    crearSalon,
    actualizarSalon,
    eliminarSalon,
    setSalonSeleccionado,
    clearErrors,
  };
}; 