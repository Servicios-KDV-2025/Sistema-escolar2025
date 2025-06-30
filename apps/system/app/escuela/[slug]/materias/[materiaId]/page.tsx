// src/app/escuela/[slug]/materias/[materiaId]/page.tsx
"use client";

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useEscuela } from '@/app/store/useEscuela';

// Shadcn UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/shadcn//card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";

import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";

export default function DetallesMateriaPage() {
  const params = useParams();
  const router = useRouter();

  const slug = typeof params?.slug === "string" ? params.slug : "";
  // Cast the ID to the correct Convex type for 'materias'
  const materiaId = typeof params?.materiaId === "string" ? params.materiaId as Id<'materias'> : null;

  const { escuela } = useEscuela();

  // Convex query to get the materia data by ID
  const materia = useQuery(
    api.materias.obtenerMateriaPorIdConEscuela,
    materiaId ? { id: materiaId } : "skip"
  );

  const setItems = useBreadcrumbStore(state => state.setItems);

  // Effect to update the breadcrumbs
  useEffect(() => {
    if (escuela && materia) {
      setItems([
        { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
        { label: 'Materias', href: `/escuela/${slug}/materias` },
        { label: `${materia?.nombre}`, isCurrentPage: true },
      ]);
    }
  }, [materia, escuela, setItems, slug]);

  // --- Conditional Rendering for Loading and Error States ---

  if (!materiaId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-red-600">Error: ID de la materia no proporcionado en la URL.</h2>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    );
  }

  if (materia === undefined || escuela === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando detalles de la materia...</p>
        </div>
      </div>
    );
  }

  if (materia === null || escuela === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-red-600">Materia no encontrada o escuela no seleccionada.</h2>
          <p className="text-muted-foreground">Asegúrate de que la materia exista y de haber seleccionado una escuela.</p>
          <Button onClick={() => router.push('/escuelas')}>Ir a Escuelas</Button>
        </div>
      </div>
    );
  }

  // Function to navigate to the edit page
  const handleEditClick = () => {
    router.push(`/escuela/${slug}/materias/${materiaId}/edit`);
  };

  // --- Render Details of the Materia ---
  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Detalles de la Materia: <span className="text-primary">{materia.nombre}</span>
          </h1>
        </div>
        <Button onClick={handleEditClick} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Editar Materia
        </Button>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>Detalles completos de la materia escolar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nombre:</p>
            <p className="text-lg font-semibold">{materia.nombre}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Descripción:</p>
            <p>{materia.descripcion || "No hay descripción disponible."}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Créditos:</p>
            <p>{materia.creditos !== undefined && materia.creditos !== null ? materia.creditos : "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Estado:</p>
            <p>{materia.activa ? "Activa" : "Inactiva"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">ID de la Materia:</p>
            <p className="font-mono text-sm break-all">{materia._id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Creada el:</p>
            <p>{new Date(materia._creationTime).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}