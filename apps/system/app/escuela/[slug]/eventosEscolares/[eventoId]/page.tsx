// src/app/escuela/[slug]/eventosEscolares/[eventoId]/page.tsx
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
import { ArrowLeft, Edit } from "lucide-react"; // Importa los iconos necesarios

import { useBreadcrumbStore } from "@/app/store/breadcrumbStore"; // Asegura que esta ruta sea correcta

export default function DetallesEventoEscolarPage() {
  const params = useParams();
  const router = useRouter();

  const slug = typeof params?.slug === "string" ? params.slug : "";
  // Es crucial el casting para que TypeScript reconozca el ID de Convex
  const eventoId = typeof params?.eventoId === "string" ? params.eventoId as Id<'eventosEscolares'> : null;

  const { escuela } = useEscuela();

  const eventoEscolar = useQuery(api.eventosEscolares.obtenerEventoPorId,
    escuela?._id && eventoId 
    ? { id: eventoId, escuelaId: escuela?._id as Id<"escuelas"> } : "skip"
  );

  const setItems = useBreadcrumbStore(state => state.setItems);

  // Efecto para actualizar las migas de pan (breadcrumb)
  useEffect(() => {
    if (escuela && eventoEscolar) {
      setItems([
        { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
        { label: 'Eventos Escolares', href: `/escuela/${slug}/eventosEscolares` },
        { label: `${eventoEscolar?.nombre}`, isCurrentPage: true },
      ]);
    }
  }, [eventoEscolar, escuela, setItems, slug]);

  // --- Renderizado Condicional para Estados de Carga y Errores ---

  if (!eventoId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-red-600">Error: ID del evento no proporcionado en la URL.</h2>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    );
  }

  if (eventoEscolar === undefined || escuela === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando detalles del evento...</p>
        </div>
      </div>
    );
  }

  if (eventoEscolar === null || escuela === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-red-600">Evento no encontrado o escuela no seleccionada.</h2>
          <p className="text-muted-foreground">Asegúrate de que el evento exista y de haber seleccionado una escuela.</p>
          <Button onClick={() => router.push('/escuelas')}>Ir a Escuelas</Button>
        </div>
      </div>
    );
  }

  // Función para navegar a la página de edición
  const handleEditClick = () => {
    router.push(`/escuela/${slug}/eventosEscolares/${eventoId}/edit`);
  };

  // --- Renderizado de los Detalles del Evento ---
  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Detalles del Evento: <span className="text-primary">{eventoEscolar.nombre}</span>
          </h1>
        </div>
        <Button onClick={handleEditClick} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Editar Evento
        </Button>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>Detalles completos del evento escolar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nombre:</p>
            <p className="text-lg font-semibold">{eventoEscolar.nombre}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Descripción:</p>
            <p>{eventoEscolar.descripcion || "No hay descripción disponible."}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tipo:</p>
            <p className="capitalize">{eventoEscolar.tipo}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Estado:</p>
            <p>{eventoEscolar.activo ? "Activo" : "Inactivo"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">ID del Evento:</p>
            <p className="font-mono text-sm break-all">{eventoEscolar._id}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Creado el:</p>
            <p>{new Date(eventoEscolar._creationTime).toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}