"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useEscuela } from '@/app/store/useEscuela';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/shadcn/table'; //originalmente tenía: '@/components/ui/table'
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';


// Tipado simplificado
interface Padre {
  _id: Id<'padres'>;
  escuelaId: Id<'escuelas'>;
  nombre: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  activo: boolean;
  _creationTime: number;
}

export default function PadresPage() {
  //const searchParams = useSearchParams();
  const router = useRouter();
  //const urlEscuelaId = searchParams.get('escuelaId') as Id<'escuelas'> | null;
 

 /*const { escuela: zustandEscuela } = useEscuela();

  const fetchedEscuela = useQuery(
    api.escuelas.obtenerEscuelaPorId,
    zustandEscuela === null && urlEscuelaId !== null ? { id: urlEscuelaId } : "skip"
  );

  const escuela = zustandEscuela || fetchedEscuela;*/

  const escuela = useEscuela((s) => s.escuela);
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";  

  


  const padres = useQuery(
    api.padres.obtenerPadresPorEscuela,
    escuela?._id as Id<"escuelas">  ? { escuelaId: escuela?._id as Id<"escuelas"> } : "skip"
  )

  

  const eliminarPadre = useMutation(api.padres.eliminarPadreConEscuela);

  const handleCrearPadre = () => {
    if (escuela?._id) {
      router.push(`/padres/create?escuelaId=${escuela._id}`);
    }
  };

  const handleEditarPadre = (padreId: Id<'padres'>) => {
    if (escuela?._id) {
      router.push(`/padres/${padreId}/edit?escuelaId=${escuela._id}`);
    }
  };

  const handleEliminarPadre = async (padreId: Id<'padres'>, nombreCompleto: string) => {
    if (!escuela?._id) return;
    if (confirm(`¿Estás seguro de que quieres eliminar a "${nombreCompleto}"? Esta acción es irreversible.`)) {
      try {
        await eliminarPadre({ id: padreId, escuelaId : escuela?._id  as Id<'escuelas'>});
        alert(`Padre "${nombreCompleto}" eliminado con éxito.`);
      } catch (err: any) {
        alert('Error al eliminar padre: ' + err.message);
      }
    }
  };

  if (!escuela) {
    return (
      <div className="text-center text-red-600 py-10">
        No se ha seleccionado una escuela. Por favor, selecciona una desde la página de Escuelas.
      </div>
    );
  }

  if (escuela === undefined || padres === undefined) {
    return (
      <div className="text-center py-10">
        Cargando padres para {escuela?.nombre || 'la escuela seleccionada'}...
      </div>
    );
  }

  if (escuela === null) {
    return (
      <div className="text-center text-red-600 py-10">
        La escuela seleccionada no fue encontrada.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        Padres de la Escuela: <span className="text-blue-600">{escuela.nombre}</span>
      </h1>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Padres</h2>
        <Button onClick={handleCrearPadre} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Padre
        </Button>
      </div>

      <Table>
        <TableCaption>Lista de padres registrados</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {padres.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No hay padres registrados para esta escuela.
              </TableCell>
            </TableRow>
          ) : (
            padres.map((padre) => (
              <TableRow
                key={padre._id}
                className="hover:bg-muted/50"
              >
                <TableCell className="font-medium">
                  {padre.nombre} {padre.apellidos}
                </TableCell>
                <TableCell>{padre.email || '—'}</TableCell>
                <TableCell>{padre.telefono || '—'}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      padre.activo
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {padre.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditarPadre(padre._id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      handleEliminarPadre(padre._id, `${padre.nombre} ${padre.apellidos}`)
                    }
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
