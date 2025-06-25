"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/shadcn/card";
import { Button } from "@repo/ui/components/shadcn/button";
import { Plus, School } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { useEscuela } from "../app/store/useEscuela";
import CrearEscuela from "./crear-escuelas";

export default function MostrarEscuelas() {
  // Obtener todas las escuelas (no una escuela específica por ID)
  const escuelas = useQuery(api.escuelas.obtenerEscuelas);
  const [mostrarCrearEscuela, setMostrarCrearEscuela] = React.useState(false);
  const router = useRouter();
  const setEscuela = useEscuela((state) => state.setEscuela);

  // Función para manejar la selección de escuela
  const handleSeleccionarEscuela = (escuela: any) => {
    // Primero guardar la escuela en el store
    setEscuela(escuela);
    
    // Usar el nombre como slug para mantener URLs legibles
    const slug = encodeURIComponent(escuela.nombre);
    router.push(`/escuela/${slug}`);
  };

  // Si está mostrando el formulario de crear escuela, renderizar solo ese componente
  if (mostrarCrearEscuela) {
    return <CrearEscuela onVolver={() => setMostrarCrearEscuela(false)} />;
  }

  // Manejar estado de carga
  if (!escuelas) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="animate-pulse">
          <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Cargando escuelas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      {/* Header con título y botón */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Escuelas</h1>
        <Button
          onClick={() => setMostrarCrearEscuela(true)}
          className="flex items-center gap-2"
          size="lg"
        >
          <Plus className="h-5 w-5" />
          Crear Nueva Escuela
        </Button>
      </div>

      {/* Grid de escuelas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {escuelas.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <School className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay escuelas registradas
            </h3>
            <p className="text-gray-500 mb-6">
              Comienza creando tu primera escuela en el sistema.
            </p>
          </div>
        ) : (
          escuelas.map((escuela) => (
            <Card 
              key={escuela._id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleSeleccionarEscuela(escuela)}
            >
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3">
                  <School className="h-5 w-5 text-blue-600" />
                  {escuela.nombre}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm flex items-center justify-between">
                  <span className="font-medium">Estado:</span>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    escuela.activa
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {escuela.activa ? "Activa" : "Inactiva"}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Estadísticas rápidas */}
      {escuelas.length > 0 && (
        <div className="w-full max-w-4xl mt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{escuelas.length}</p>
                  <p className="text-sm text-gray-600">Total de Escuelas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {escuelas.filter((e) => e.activa).length}
                  </p>
                  <p className="text-sm text-gray-600">Escuelas Activas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {escuelas.filter((e) => !e.activa).length}
                  </p>
                  <p className="text-sm text-gray-600">Escuelas Inactivas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}