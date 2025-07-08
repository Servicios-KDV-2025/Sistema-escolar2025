import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";

// Tipo de Escuela basado en tu schema de Convex
type Escuela = {
  _id: string;
  nombre: string;
  nombreCorto: string;
  email?: string;
  telefono?: string;
  director?: string;
  descripcion?: string;
  direccion?: string;
  logoUrl?: string;
  activa: boolean;
};

// Tipo para crear escuela
type CrearEscuelaData = {
  nombre: string;
  nombreCorto: string;
  logoUrl?: string;
  descripcion?: string;
  direccion: string;
  telefono?: string;
  email: string;
  director?: string;
  activa: boolean;
};

// Tipo para actualizar escuela
type ActualizarEscuelaData = Partial<Omit<Escuela, '_id'>>;

// Store de Escuela con CRUD completo
type EscuelaStore = {
  // Datos de la escuela
  escuela: Escuela | null;
  
  // Lista de todas las escuelas (para admin)
  todasLasEscuelas: Escuela[];
  
  // Estado de carga
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Estados de error
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  
  // Setters
  setEscuela: (escuela: Escuela | null) => void;
  setTodasLasEscuelas: (escuelas: Escuela[]) => void;
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

// Estado inicial
const initialState = {
  escuela: null,
  todasLasEscuelas: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

export const useEscuelaStore = create<EscuelaStore>((set) => ({
  ...initialState,
  
  // Setters
  setEscuela: (escuela) => set({ escuela }),
  setTodasLasEscuelas: (todasLasEscuelas) => set({ todasLasEscuelas }),
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
    deleteError: null 
  }),
  reset: () => set(initialState),
}));

export const useEscuela = () => {
  const { user } = useUser();
  const { 
    escuela, 
    todasLasEscuelas,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    setEscuela, 
    setTodasLasEscuelas,
    setLoading,
    setCreating,
    setUpdating,
    setDeleting,
    setError,
    setCreateError,
    setUpdateError,
    setDeleteError,
    clearErrors 
  } = useEscuelaStore();
  
  // ✅ Queries
  const escuelaQuery = useQuery(
    api.escuelas.obtenerEscuelaPorEmail,
    user?.emailAddresses?.[0]?.emailAddress 
      ? { email: user.emailAddresses[0].emailAddress } 
      : "skip"
  );
  
  const todasLasEscuelasQuery = useQuery(api.escuelas.obtenerEscuelas);
  
  // Debug logs
  console.log('=== STORE DEBUG ===')
  console.log('user email:', user?.emailAddresses?.[0]?.emailAddress)
  console.log('escuelaQuery:', escuelaQuery)
  console.log('escuela (store):', escuela)
  console.log('escuelaActual:', escuelaQuery || escuela)
  console.log('==================')
  
  // ✅ Mutations
  const crearEscuelaMutation = useMutation(api.escuelas.crearEscuela);
  const actualizarEscuelaMutation = useMutation(api.escuelas.actualizarEscuela);
  const eliminarEscuelaMutation = useMutation(api.escuelas.eliminarEscuela);
  
  // ✅ CREATE - Crear nueva escuela
  const crearEscuela = useCallback(async (data: CrearEscuelaData) => {
    setCreating(true);
    setCreateError(null);
    
    try {
      const nuevaEscuelaId = await crearEscuelaMutation(data);
      
      if (nuevaEscuelaId) {
        // Las queries se actualizarán automáticamente
        return nuevaEscuelaId;
      }
      
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear escuela';
      setCreateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreating(false);
    }
  }, [crearEscuelaMutation, setCreating, setCreateError]);
  
  // ✅ UPDATE - Actualizar escuela
  const actualizarEscuela = useCallback(async (data: ActualizarEscuelaData) => {
    const currentEscuela = escuelaQuery || escuela;
    
    if (!currentEscuela) {
      const errorMessage = 'No hay escuela cargada';
      setUpdateError(errorMessage);
      throw new Error(errorMessage);
    }
    
    setUpdating(true);
    setUpdateError(null);
    
    try {
      const escuelaActualizada = await actualizarEscuelaMutation({
        id: currentEscuela._id as Id<"escuelas">,
        ...data
      });
      
      if (escuelaActualizada) {
        // Actualizar la escuela actual
        setEscuela(escuelaActualizada);
        
        // Actualizar en la lista de escuelas
        setTodasLasEscuelas(todasLasEscuelas.map((e: Escuela) => 
          e._id === (escuelaActualizada as Escuela)._id ? escuelaActualizada as Escuela : e
        ));
      }
      
      return escuelaActualizada;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar escuela';
      setUpdateError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [escuelaQuery, escuela, actualizarEscuelaMutation, setUpdating, setUpdateError, setEscuela, todasLasEscuelas, setTodasLasEscuelas]);
  
  // ✅ DELETE - Eliminar escuela
  const eliminarEscuela = useCallback(async (id?: Id<"escuelas">) => {
    const escuelaAEliminar = id ? { _id: id } : escuela;
    
    if (!escuelaAEliminar) {
      const errorMessage = 'No hay escuela para eliminar';
      setDeleteError(errorMessage);
      throw new Error(errorMessage);
    }
    
    setDeleting(true);
    setDeleteError(null);
    
    try {
      const escuelaEliminada = await eliminarEscuelaMutation({
        id: escuelaAEliminar._id as Id<"escuelas">
      });
      
      if (escuelaEliminada) {
        // Remover de la lista de escuelas
        setTodasLasEscuelas(todasLasEscuelas.filter(e => e._id !== escuelaEliminada._id));
        
        // Si era la escuela actual, limpiarla
        if (escuela?._id === escuelaEliminada._id) {
          setEscuela(null);
        }
      }
      
      return escuelaEliminada;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar escuela';
      setDeleteError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  }, [escuela, eliminarEscuelaMutation, setDeleting, setDeleteError, todasLasEscuelas, setTodasLasEscuelas, setEscuela]);
  
  // ✅ Función para refrescar datos
  const refrescarEscuelas = useCallback(() => {
    clearErrors();
  }, [clearErrors]);
  
  // useEffect para actualizar el store
  useEffect(() => {
    if (escuelaQuery && !escuela) {
      setEscuela(escuelaQuery);
    }
  }, [escuelaQuery, escuela, setEscuela]);
  
  // useEffect para actualizar la lista de escuelas
  useEffect(() => {
    if (todasLasEscuelasQuery) {
      setTodasLasEscuelas(todasLasEscuelasQuery);
    }
  }, [todasLasEscuelasQuery, setTodasLasEscuelas]);
  
  // ✅ Escuela actual
  const escuelaActual = escuelaQuery || escuela;
  
  return {
    // ✅ Datos
    escuela: escuelaActual,
    todasLasEscuelas,
    
    // ✅ Estados de carga
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    
    // ✅ Estados de error
    error,
    createError,
    updateError,
    deleteError,
    
    // ✅ Operaciones CRUD
    crearEscuela,
    actualizarEscuela,
    eliminarEscuela,
    
    // ✅ Utilidades
    refrescarEscuelas,
    clearErrors,
    
    // ✅ Información del usuario
    userEmail: user?.emailAddresses?.[0]?.emailAddress || null,
  };
}; 