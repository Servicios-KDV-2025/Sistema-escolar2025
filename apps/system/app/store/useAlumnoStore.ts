import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

// Tipo de Alumno basado en tu schema de Convex
export type Alumno = {
  _id: string;
  escuelaId: string;
  padreId: string;
  grupoId: string;
  matricula: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo: boolean;
};

// Tipos para crear y actualizar alumno
export type CrearAlumnoData = {
  escuelaId: string;
  padreId: string;
  grupoId: string;
  matricula: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo: boolean;
};

export type ActualizarAlumnoData = {
  id: string;
  escuelaId: string;
  grupoId: string;
  matricula: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo: boolean;
};

// Store de Alumno con CRUD completo
export type AlumnoStore = {
  alumnos: Alumno[];
  alumnoSeleccionado: Alumno | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  setAlumnos: (alumnos: Alumno[]) => void;
  setAlumnoSeleccionado: (alumno: Alumno | null) => void;
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
  alumnos: [],
  alumnoSeleccionado: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const useAlumnoStore = create<AlumnoStore>((set) => ({
  ...initialState,
  setAlumnos: (alumnos) => set({ alumnos }),
  setAlumnoSeleccionado: (alumnoSeleccionado) => set({ alumnoSeleccionado }),
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



export const useAlumno = (escuelaId?: string) => {
  const {
    alumnos,
    alumnoSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    setAlumnos,
    setAlumnoSeleccionado,
    setCreating,
    setUpdating,
    setDeleting,
    setCreateError,
    setUpdateError,
    setDeleteError,
    clearErrors,
  } = useAlumnoStore();

  // Query para obtener los alumnos de la escuela
  const alumnosQuery = useQuery(
    api.alumnos.obtenerAlumnos,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );

  // Mutations
  const crearAlumnoMutation = useMutation(api.alumnos.crearAlumno);
  const actualizarAlumnoMutation = useMutation(api.alumnos.upadateAlumno);
  const eliminarAlumnoMutation = useMutation(api.alumnos.deleteAlumno);

  // CREATE
  const crearAlumno = useCallback(async (data: CrearAlumnoData) => {
    setCreating(true);
    setCreateError(null);
    try {
      await crearAlumnoMutation({
        ...data,
        escuelaId: data.escuelaId as Id<"escuelas">,
        padreId: data.padreId as Id<"padres">,
        grupoId: data.grupoId as Id<"grupos">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear alumno';
      setCreateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [crearAlumnoMutation, setCreating, setCreateError]);

  // UPDATE
  const actualizarAlumno = useCallback(async (data: ActualizarAlumnoData) => {
    setUpdating(true);
    setUpdateError(null);
    try {
      await actualizarAlumnoMutation({
        id: data.id as Id<"alumnos">,
        escuelaId: data.escuelaId as Id<"escuelas">,
        grupoId: data.grupoId as Id<"grupos">,
        matricula: data.matricula,
        nombre: data.nombre,
        apellidos: data.apellidos,
        fechaNacimiento: data.fechaNacimiento,
        email: data.email,
        telefono: data.telefono,
        direccion: data.direccion,
        activo: data.activo,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar alumno';
      setUpdateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [actualizarAlumnoMutation, setUpdating, setUpdateError]);

  // DELETE
  const eliminarAlumno = useCallback(async (id: string, escuelaId: string) => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await eliminarAlumnoMutation({
        id: id as Id<"alumnos">,
        escuelaId: escuelaId as Id<"escuelas">,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar alumno';
      setDeleteError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [eliminarAlumnoMutation, setDeleting, setDeleteError]);

  // Refrescar alumnos cuando cambie la query
  useEffect(() => {
    if (alumnosQuery) {
      setAlumnos(
        (alumnosQuery as unknown as Array<{
          _id: string;
          escuelaId: string;
          padreId: string;
          grupoId: string;
          matricula: string;
          nombre: string;
          apellidos: string;
          fechaNacimiento: string;
          email?: string;
          telefono?: string;
          direccion?: string;
          activo: boolean;
        }>).map((a) => ({
          _id: a._id,
          escuelaId: a.escuelaId,
          padreId: a.padreId,
          grupoId: a.grupoId,
          matricula: a.matricula,
          nombre: a.nombre,
          apellidos: a.apellidos,
          fechaNacimiento: a.fechaNacimiento,
          email: a.email,
          telefono: a.telefono,
          direccion: a.direccion,
          activo: a.activo,
        }))
      );
    }
  }, [alumnosQuery, setAlumnos]);

  // Funciones helper
  const alumnosPorGrupo = (grupoId: string) => {
    return alumnos.filter(alumno => alumno.grupoId === grupoId);
  };

  const alumnosPorPadre = (padreId: string) => {
    return alumnos.filter(alumno => alumno.padreId === padreId);
  };

  const buscarAlumnoPorMatricula = (matricula: string) => {
    return alumnos.find(alumno => alumno.matricula === matricula);
  };

  const alumnosActivos = alumnos.filter(alumno => alumno.activo);

  const formatearFechaNacimiento = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    
    return edad;
  };

  return {
    alumnos,
    alumnosActivos,
    alumnoSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    crearAlumno,
    actualizarAlumno,
    eliminarAlumno,
    setAlumnoSeleccionado,
    alumnosPorGrupo,
    alumnosPorPadre,
    buscarAlumnoPorMatricula,
    formatearFechaNacimiento,
    calcularEdad,
    clearErrors,
  };
}; 