import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Periodo } from "@/types/convex-zod-types";
import { useMutation, useQuery } from "convex/react";
import { useCallback, useEffect } from "react";
import { create } from "zustand";

// Se está tomando de manera específica información del type de Periodo en el type de convex a zod
// Tipos para crear y actualizar grupo
export type CrearPeriodoData = Pick<Periodo, "activo" | "escuelaId" | "horaFin" | "horaInicio" | "nombre">;
export type ActualizarPeriodoData = Periodo;

// El type del Store de Periodos
export type PeriodoStore = {
    periodos: Periodo[];
    periodoSeleccionado: Periodo | null;
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    error: string | null;
    createError: string | null;
    updateError: string | null;
    deleteError: string | null;
    setPeriodos: (periodos: Periodo[]) => void;
    setPeriodoSeleccinado: (periodo: Periodo | null) => void;
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
}

// Valores iniciales del Store de Periodos
const initialState = {
    periodos: [],
    periodoSeleccionado: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    error: null,
    createError: null,
    updateError: null,
    deleteError: null,
};

// Store de Periodos con el CRUD completo
export const usePeriodoStore = create<PeriodoStore>(set => ({
    ...initialState,
    setPeriodos: (periodos) => set({ periodos }),
    setPeriodoSeleccinado: (periodoSeleccionado) => set({ periodoSeleccionado }),
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

export const usePeriodo = (escuelaId?: string) => {
    const {
        periodos,
        periodoSeleccionado,
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
        error,
        createError,
        updateError,
        deleteError,
        setPeriodos,
        setPeriodoSeleccinado,

        setCreating,
        setUpdating,
        setDeleting,

        setCreateError,
        setUpdateError,
        setDeleteError,
        clearErrors,
    } = usePeriodoStore();

    // Query para obrener todos los periodos
    const periodosQuery = useQuery(
        api.periodos.obtenerPeriodosPorEscuela,
        escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
    );

    // Mutactions de Crear | Actualizar | Eliminar
    const crearPeriodosMutation = useMutation(api.periodos.crearPeriodo);
    const actualizarPeriodosMutation = useMutation(api.periodos.actualizarPeriodo);
    const eliminarPeriodosMutation = useMutation(api.periodos.eliminarPeriodo);

    // CREATE
    const crearPeriodo = useCallback(async (data: CrearPeriodoData) => {
        setCreating(true);
        setCreateError(null);
        try {
            await crearPeriodosMutation({
                ...data,
                escuelaId: escuelaId as Id<"escuelas">
            })
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Error al crear el periodo';
            setCreateError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setCreating(false);
        }
    }, [crearPeriodosMutation, setCreating, setCreateError, escuelaId]);

    // UPDATE
    const actualizarPeriodo = useCallback(async (data: ActualizarPeriodoData) => {
        setUpdating(true);
        setUpdateError(null);
        try {
            await actualizarPeriodosMutation({
                id: data._id as Id<"periodos">,
                escuelaId: escuelaId as Id<"escuelas">,
                nombre: data.nombre,
                horaInicio: data.horaInicio,
                horaFin: data.horaFin,
                activo: data.activo,
            })
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Error al actualizar el periodo';
            setUpdateError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setUpdating(false);
        }
    }, [actualizarPeriodosMutation, setUpdating, setUpdateError, escuelaId]);

    // DELETE
    const eliminarPeriodo = useCallback(async (id: string, escuelaId: string) => {
        setDeleting(true);
        setDeleteError(null);
        try {
            await eliminarPeriodosMutation({
                id: id as Id<"periodos">,
                escuelaId: escuelaId as Id<"escuelas">,
            });
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Error al eliminar el periodo';
            setDeleteError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setDeleting(false);
        }
    }, [eliminarPeriodosMutation, setDeleting, setDeleteError]);

    // Refrescar periodos cuando cambie la query
    useEffect(() => {
        if (periodosQuery) {
            setPeriodos(periodosQuery as Periodo[]);
        }
    }, [periodosQuery, setPeriodos]);

    return {
        periodos,
        periodoSeleccionado,
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
        error,
        createError,
        updateError,
        deleteError,
        crearPeriodo,
        actualizarPeriodo,
        eliminarPeriodo,
        setPeriodoSeleccinado,
        clearErrors,
    }
}