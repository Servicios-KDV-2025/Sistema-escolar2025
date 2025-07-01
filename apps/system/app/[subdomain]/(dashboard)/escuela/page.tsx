"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { Button } from "@/components/ui/button";
import { School, Loader2 } from "lucide-react";

export default function EscuelaRedirectPage() {
  const router = useRouter();
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mutations
  const crearEscuela = useMutation(api.escuelas.crearEscuela);

  // Obtener el subdominio del hostname
  useEffect(() => {
    const hostname = window.location.hostname;
    
    // Local development environment
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      const match = hostname.match(/^([^.]+)\.localhost/);
      if (match && match[1]) {
        setSubdomain(match[1]);
      }
    } else {
      // Production environment - extract subdomain
      const parts = hostname.split('.');
      if (parts.length > 2) {
        setSubdomain(parts[0]);
      }
    }
    
    setIsLoading(false);
  }, []);

  // Buscar la escuela por el subdominio
  const escuela = useQuery(api.escuelas.obtenerEscuelaPorNombre, 
    subdomain ? { nombre: subdomain } : "skip"
  );

  // Crear escuela de prueba si no existe y el subdominio es "test"
  useEffect(() => {
    const crearEscuelaDePrueba = async () => {
      if (subdomain === "test" && escuela === null && !isLoading) {
        try {
          await crearEscuela({
            nombre: "test",
            nombreCorto: "TEST",
            direccion: "Dirección de prueba para desarrollo",
            email: "test@example.com",
            activa: true,
          });
        } catch (error) {
          console.error("Error al crear escuela de prueba:", error);
        }
      }
    };

    crearEscuelaDePrueba();
  }, [subdomain, escuela, isLoading, crearEscuela]);

  // Redirigir cuando se encuentre la escuela
  useEffect(() => {
    if (escuela && subdomain) {
      const encodedNombre = encodeURIComponent(escuela.nombre);
      router.replace(`/escuela/${encodedNombre}`);
    }
  }, [escuela, subdomain, router]);

  // Mostrar error si no se encuentra la escuela (solo si no es "test")
  if (!isLoading && subdomain && escuela === null && subdomain !== "test") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <School className="h-6 w-6 text-red-500" />
              Escuela no encontrada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              No se encontró una escuela asociada al subdominio <strong>{subdomain}</strong>.
            </p>
            <div className="flex justify-center">
              <Button onClick={() => router.push('/')}>
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Mostrar loading mientras se busca la escuela
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            {subdomain === "test" && escuela === null ? "Creando escuela de prueba..." : "Redirigiendo..."}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            {subdomain === "test" && escuela === null 
              ? "Creando una escuela de prueba para el subdominio test..."
              : `Buscando la escuela asociada al subdominio <strong>${subdomain}</strong>...`
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 