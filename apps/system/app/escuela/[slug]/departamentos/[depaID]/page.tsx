// app/escuela/[slug]/departamentos/[departamentoId]/page.tsx
"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useEscuela } from '@/app/store/useEscuela';

// Componentes de Shadcn UI
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";

import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";

export default function DetallesDepartamentoPage() {
  const params = useParams();
  const router = useRouter();

  const slug = typeof params?.slug === "string" ? params.slug : "";
  
  // Versión más robusta para obtener el departamentoId
  const departamentoId = (() => {
    const rawId = params?.departamentoId;
    const idString = Array.isArray(rawId) ? rawId[0] : rawId;
    return (typeof idString === "string" && idString.trim() !== "") 
      ? idString as Id<'departamento'> 
      : null;
  })();

  // Debug logging
  console.log("Debugging params:", {
    allParams: params,
    departamentoIdRaw: params?.departamentoId,
    isArray: Array.isArray(params?.departamentoId),
    type: typeof params?.departamentoId,
    finalId: departamentoId
  });

  const { escuela } = useEscuela();

  const departamento = useQuery(api.departamento.obtenerDepartamentosPorId,
    departamentoId ? { id: departamentoId } : "skip"
  );

  const setItems = useBreadcrumbStore(state => state.setItems);

  // Monitor changes for debugging
  useEffect(() => {
    console.log("Params changed:", params);
    console.log("DepartamentoId extracted:", departamentoId);
  }, [params, departamentoId]);

  // Efecto para actualizar las migas de pan (breadcrumb)
  useEffect(() => {
    if (escuela && departamento) {
      setItems([
        { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
        { label: 'Departamentos', href: `/escuela/${slug}/departamentos` },
        { label: `${departamento?.nombre}`, isCurrentPage: true },
      ]);
    }
  }, [departamento, escuela, setItems, slug]);

  // --- Renderizado Condicional para Estados de Carga y Errores ---

  if (!departamentoId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-red-600">Error: ID del departamento no proporcionado en la URL.</h2>
          <p className="text-muted-foreground">
            Parámetros recibidos: {JSON.stringify(params)}
          </p>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    );
  }

  if (departamento === undefined || escuela === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando detalles del departamento...</p>
        </div>
      </div>
    );
  }

  if (departamento === null || escuela === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-red-600">Departamento no encontrado o escuela no seleccionada.</h2>
          <p className="text-muted-foreground">Asegúrate de que el departamento exista y de haber seleccionado una escuela.</p>
          <Button onClick={() => router.push('/escuelas')}>Ir a Escuelas</Button>
        </div>
      </div>
    );
  }

  // Función para navegar a la página de edición
  const handleEditClick = () => {
    router.push(`/escuela/${slug}/departamentos/${departamentoId}/edit`);
  };

  // --- Renderizado de los Detalles del Departamento ---
  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Detalles del Departamento: <span className="text-primary">{departamento.nombre}</span>
          </h1>
        </div>
        <Button onClick={handleEditClick} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Editar Departamento
        </Button>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>Detalles completos del departamento.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nombre:</p>
            <p className="text-lg font-semibold">{departamento.nombre}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Descripción:</p>
            <p>{departamento.descripcion || "No hay descripción disponible."}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Estado:</p>
            <p>{departamento.activo ? "Activo" : "Inactivo"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">ID del Departamento:</p>
            <p className="font-mono text-sm break-all">{departamento._id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Creado el:</p>
            <p>{new Date(departamento._creationTime).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Escuela:</p>
            <p className="text-lg font-medium">{escuela.nombre}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}