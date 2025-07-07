// app/escuela/[slug]/departamentos/[depaID]/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useEscuela } from '@/app/store/useEscuela';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';
import { useBreadcrumbStore } from '@/app/store/breadcrumbStore';

export default function DetallesDepartamentoPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === 'string' ? params.slug : '';

  // Extraer ID robustamente
  const getId = (): Id<'departamento'> | null => {
    const possible = [params?.depaID, params?.departamentoId, params?.id];
    for (const p of possible) {
      if (p) {
        const s = Array.isArray(p) ? p[0] : p;
        if (typeof s === 'string' && s) return s as Id<'departamento'>;
      }
    }
    return null;
  };
  const departamentoId = getId();
  const { escuela } = useEscuela();

  const departamento = useQuery(
    api.departamento.obtenerDepartamentosPorId,
    departamentoId ? { id: departamentoId } : 'skip'
  );

  const setItems = useBreadcrumbStore(s => s.setItems);
  useEffect(() => {
    // Verificar que escuela no sea null antes de usar sus propiedades
    if (escuela && departamento) {
      setItems([
        { label: escuela.nombre, href: `/escuela/${slug}` },
        { label: 'Departamentos', href: `/escuela/${slug}/departamentos` },
        { label: departamento.nombre, isCurrentPage: true },
      ]);
    }
  }, [escuela, departamento, setItems, slug]);

  if (!departamentoId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>ID de departamento no válido.</p>
        <Button onClick={() => router.back()}>Volver</Button>
      </div>
    );
  }
  if (departamento === undefined || escuela === undefined) {
    return <p>Cargando detalles...</p>;
  }
  if (departamento === null) {
    return <p>Departamento no encontrado.</p>;
  }

  const handleEdit = () => {
    router.push(`/escuela/${slug}/departamentos/${departamentoId}/edit`);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Detalles: {departamento.nombre}</h1>
        </div>
        <Button onClick={handleEdit} className="flex items-center gap-2">
          <Edit className="h-4 w-4" /> Editar
        </Button>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Información General</CardTitle>
          <CardDescription>Detalles completos del departamento.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium text-sm">Nombre:</p>
            <p className="text-lg">{departamento.nombre}</p>
          </div>
          <div>
            <p className="font-medium text-sm">Descripción:</p>
            <p>{departamento.descripcion || 'Sin descripción.'}</p>
          </div>
          <div>
            <p className="font-medium text-sm">Estado:</p>
            <p>{departamento.activo ? 'Activo' : 'Inactivo'}</p>
          </div>
          <div>
            <p className="font-medium text-sm">Creado el:</p>
            <p>{new Date(departamento._creationTime).toLocaleString()}</p>
          </div>
          <div>
            <p className="font-medium text-sm">Escuela:</p>
            <p>{escuela?.nombre || 'Sin escuela asignada'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}