import { create } from "zustand";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useConvex } from "convex/react";
import { useEffect, useCallback } from "react";
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

// Estado de carga
type LoadingState = {
  isLoading: boolean;
  error: string | null;
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
  loadingState: LoadingState;
  
  // Setters
  setEscuela: (escuela: Escuela) => void;
  setSubdomain: (subdomain: string | null) => void;
  setUserEmail: (email: string | null) => void;
  setLoadingState: (state: Partial<LoadingState>) => void;
  
  // Funciones de detección y fetch
  detectAndLoadSubdomain: () => void;
  loadEscuelaByEmail: (email: string) => Promise<void>;
  fetchEscuela: (subdomain: string) => Promise<void>;
  
  // Funciones de mutación
  updateEscuela: (data: Partial<Escuela>) => Promise<void>;
  
  // Utilidades
  resetEscuela: () => void;
  clearError: () => void;
};

// Estado inicial
const initialState = {
  escuela: null,
  subdomain: null,
  userEmail: null,
  loadingState: {
    isLoading: false,
    error: null,
  },
};

export const useEscuelaStore = create<EscuelaStore>((set, get) => ({
  ...initialState,
  
  // Setters
  setEscuela: (escuela) => set({ escuela }),
  setSubdomain: (subdomain) => set({ subdomain }),
  setUserEmail: (email) => set({ userEmail: email }),
  
  setLoadingState: (state) => 
    set((prev) => ({
      loadingState: { ...prev.loadingState, ...state }
    })),
  
  // Función para detectar y cargar el subdomain automáticamente
  detectAndLoadSubdomain: () => {
    const { setSubdomain, fetchEscuela } = get();
    
    // Detectar subdomain del hostname
    const hostname = window.location.hostname;
    let detectedSubdomain: string | null = null;
    
    // Local development environment
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      const match = hostname.match(/^([^.]+)\.localhost/);
      if (match && match[1]) {
        detectedSubdomain = match[1];
      }
    } else {
      // Production environment - extract subdomain
      const parts = hostname.split('.');
      if (parts.length > 2) {
        detectedSubdomain = parts[0];
      }
    }
    
    // Guardar el subdomain detectado
    setSubdomain(detectedSubdomain);
    
    // Si se detectó un subdomain, cargar la escuela
    if (detectedSubdomain) {
      fetchEscuela(detectedSubdomain);
    }
  },
  
  // Función para cargar escuela por email del usuario
  loadEscuelaByEmail: async (email: string) => {
    const { setLoadingState, setUserEmail } = get();
    
    setUserEmail(email);
    setLoadingState({ isLoading: true, error: null });
    
    try {
      // Esta función se implementará en el hook personalizado
      console.log(`Loading escuela by email: ${email}`);
      
    } catch (error) {
      setLoadingState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      });
    } finally {
      setLoadingState({ isLoading: false });
    }
  },
  
  // Función principal para obtener la escuela por subdominio
  fetchEscuela: async (subdomain: string) => {
    const { setLoadingState } = get();
    
    setLoadingState({ isLoading: true, error: null });
    
    try {
      // Esta función se implementará en el hook personalizado
      console.log(`Fetching escuela for subdomain: ${subdomain}`);
      
    } catch (error) {
      setLoadingState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      });
    } finally {
      setLoadingState({ isLoading: false });
    }
  },
  
  // Función para actualizar datos de la escuela
  updateEscuela: async (data: Partial<Escuela>) => {
    const { setLoadingState, escuela } = get();
    
    if (!escuela) {
      setLoadingState({ error: 'No hay escuela cargada' });
      return;
    }
    
    setLoadingState({ isLoading: true, error: null });
    
    try {
      // Esta función se implementará en el hook personalizado
      console.log('Updating escuela:', data);
      
    } catch (error) {
      setLoadingState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error al actualizar' 
      });
    } finally {
      setLoadingState({ isLoading: false });
    }
  },
  
  // Utilidades
  resetEscuela: () => set(initialState),
  
  clearError: () => set((prev) => ({
    loadingState: { ...prev.loadingState, error: null }
  })),
}));

// Hook personalizado para usar el store con Convex
export const useEscuela = () => {
  const convex = useConvex();
  const { 
    escuela, 
    subdomain,
    userEmail,
    loadingState, 
    setEscuela, 
    setSubdomain,
    setUserEmail,
    setLoadingState, 
    detectAndLoadSubdomain,
    clearError 
  } = useEscuelaStore();
  
  // Query para obtener la escuela por subdomain
  const escuelaQuery = useQuery(
    api.escuelas.obtenerEscuelaPorNombreCorto,
    subdomain ? { nombreCorto: subdomain } : "skip"
  );
  
  // Query para obtener la escuela por email (nuevo)
  const escuelaByEmailQuery = useQuery(
    api.escuelas.obtenerEscuelaPorEmail,
    userEmail ? { email: userEmail } : "skip"
  );
  
  // Mutation para actualizar escuela
  const updateEscuelaMutation = useMutation(api.escuelas.actualizarEscuela);
  
  // Función para detectar y cargar automáticamente (memoizada)
  const autoLoadEscuela = useCallback(() => {
    detectAndLoadSubdomain();
  }, [detectAndLoadSubdomain]);
  
  // Función para cargar la escuela por email (memoizada)
  const loadEscuelaByEmail = useCallback(async (email: string) => {
    if (!email) return;
    
    setUserEmail(email);
    setLoadingState({ isLoading: true, error: null });
    
    try {
      // Verificar que el email existe en alguna escuela
      const escuelaData = await convex.query(api.escuelas.obtenerEscuelaPorEmail, { email });
      
      if (!escuelaData) {
        throw new Error(`No se encontró escuela con el email: ${email}`);
      }
      
      // La escuela se cargará automáticamente con el query de arriba
      
    } catch (error) {
      setLoadingState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      });
    } finally {
      setLoadingState({ isLoading: false });
    }
  }, [convex, setUserEmail, setLoadingState]);
  
  // Función para cargar la escuela manualmente (memoizada)
  const loadEscuela = useCallback(async (subdomain: string) => {
    if (!subdomain) return;
    
    setSubdomain(subdomain);
    setLoadingState({ isLoading: true, error: null });
    
    try {
      // Verificar que el subdomain existe
      const subdomainData = await convex.query(api.subdomains.getSubdomainData, { subdomain });
      
      if (!subdomainData) {
        throw new Error(`Subdomain '${subdomain}' no encontrado`);
      }
      
      // La escuela se cargará automáticamente con el query de arriba
      
    } catch (error) {
      setLoadingState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      });
    } finally {
      setLoadingState({ isLoading: false });
    }
  }, [convex, setSubdomain, setLoadingState]);
  
  // Función para actualizar la escuela (memoizada)
  const updateEscuela = useCallback(async (data: Partial<Escuela>) => {
    if (!escuela) {
      setLoadingState({ error: 'No hay escuela cargada' });
      return;
    }
    
    setLoadingState({ isLoading: true, error: null });
    
    try {
      const escuelaActualizada = await updateEscuelaMutation({
        id: escuela._id as Id<"escuelas">, // Type assertion para el ID de Convex
        ...data
      });
      
      if (escuelaActualizada) {
        setEscuela(escuelaActualizada);
      }
      
    } catch (error) {
      setLoadingState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Error al actualizar' 
      });
    } finally {
      setLoadingState({ isLoading: false });
    }
  }, [escuela, updateEscuelaMutation, setEscuela, setLoadingState]);
  
  // Actualizar el store cuando cambie el query (prioridad: email > subdomain)
  useEffect(() => {
    if (escuelaByEmailQuery && !escuela) {
      setEscuela(escuelaByEmailQuery);
    } else if (escuelaQuery && !escuela) {
      setEscuela(escuelaQuery);
    }
  }, [escuelaByEmailQuery, escuelaQuery, escuela, setEscuela]);
  
  return {
    escuela: escuelaByEmailQuery || escuelaQuery || escuela,
    subdomain,
    userEmail,
    loadingState,
    autoLoadEscuela,
    loadEscuelaByEmail,
    loadEscuela,
    updateEscuela,
    clearError,
  };
}; 