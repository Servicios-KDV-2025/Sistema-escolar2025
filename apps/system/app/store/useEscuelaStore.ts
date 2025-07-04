import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useCallback, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";

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

// Store de Escuela
type EscuelaStore = {
  // Datos de la escuela
  escuela: Escuela | null;
  
  // Subdomain detectado
  subdomain: string | null;
  
  // Email del usuario (para búsqueda alternativa)
  userEmail: string | null;
  
  // Estado de carga
  isLoading: boolean;
  error: string | null;
  
  // Setters
  setEscuela: (escuela: Escuela) => void;
  setSubdomain: (subdomain: string | null) => void;
  setUserEmail: (email: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
};

// Estado inicial
const initialState = {
  escuela: null,
  subdomain: null,
  userEmail: null,
  isLoading: false,
  error: null,
};

export const useEscuelaStore = create<EscuelaStore>((set) => ({
  ...initialState,
  
  // Setters
  setEscuela: (escuela) => set({ escuela }),
  setSubdomain: (subdomain) => set({ subdomain }),
  setUserEmail: (email) => set({ userEmail: email }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set(initialState),
}));

export const useEscuela = () => {
  const { 
    escuela, 
    subdomain,
    userEmail,
    isLoading,
    error,
    setEscuela, 
    setSubdomain,
    setUserEmail,
    setLoading,
    setError,
    clearError 
  } = useEscuelaStore();
  
  // ✅ Queries de Convex que funcionan correctamente
  const escuelaQuery = useQuery(
    api.escuelas.obtenerEscuelaPorNombreCorto,
    subdomain ? { nombreCorto: subdomain } : "skip"
  );
  
  const escuelaByEmailQuery = useQuery(
    api.escuelas.obtenerEscuelaPorEmail,
    userEmail ? { email: userEmail } : "skip"
  );
  
  // ✅ Mutation para actualizar
  const updateEscuelaMutation = useMutation(api.escuelas.actualizarEscuela);
  
  // ✅ Función para detectar subdomain automáticamente
  const detectSubdomain = useCallback(() => {
    const hostname = window.location.hostname;
    let detectedSubdomain: string | null = null;
    
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      const match = hostname.match(/^([^.]+)\.localhost/);
      detectedSubdomain = match?.[1] || null;
    } else {
      const parts = hostname.split('.');
      detectedSubdomain = parts.length > 2 ? parts[0] : null;
    }
    
    setSubdomain(detectedSubdomain);
  }, [setSubdomain]);
  
  // ✅ Función para actualizar escuela
  const updateEscuela = useCallback(async (data: Partial<Escuela>) => {
    const currentEscuela = escuelaByEmailQuery || escuelaQuery || escuela;
    
    if (!currentEscuela) {
      setError('No hay escuela cargada');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const escuelaActualizada = await updateEscuelaMutation({
        id: currentEscuela._id as Id<"escuelas">,
        ...data
      });
      
      if (escuelaActualizada) {
        setEscuela(escuelaActualizada);
      }
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al actualizar');
    } finally {
      setLoading(false);
    }
  }, [escuelaByEmailQuery, escuelaQuery, escuela, updateEscuelaMutation, setEscuela, setLoading, setError]);
  
  // useEffect para actualizar el store
  useEffect(() => {
    if (escuelaByEmailQuery && !escuela) {
      setEscuela(escuelaByEmailQuery);
    } else if (escuelaQuery && !escuela) {
      setEscuela(escuelaQuery);
    }
  }, [escuelaByEmailQuery, escuelaQuery, escuela, setEscuela]);
  
  // ✅ Escuela actual (sin actualizar el store durante renderizado)
  const escuelaActual = escuelaByEmailQuery || escuelaQuery || escuela;
  
  return {
    escuela: escuelaActual,
    subdomain,
    userEmail,
    isLoading,
    error,
    detectSubdomain,
    setEmail: setUserEmail,
    setSubdomain,
    updateEscuela,
    clearError,
  };
}; 