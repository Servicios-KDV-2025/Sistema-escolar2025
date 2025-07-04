"use client";

import { useQuery } from "convex/react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/shadcn/table";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";
import { Button } from "@repo/ui/components/shadcn/button";

export function TablaCatalogoClases() {
  const router = useRouter();
  const escuela = useEscuela((s) => s.escuela);
  const clases = useQuery(api.catalogosDeClases.verTodosLosCatalogosDeClases, {escuelaId: escuela?._id as Id<"escuelas">});
  const setItems = useBreadcrumbStore(state => state.setItems)
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  useEffect(() => {
    if (escuela){
      setItems([
      { label: `${escuela?.nombre}` , href: `/escuela/${slug}` },
      { label: 'Catalogo de Clases', isCurrentPage: true },
    ])
    }
  }, [escuela, setItems, slug])

  if (clases === undefined) {
    return <div>Cargando las Clases...</div>;
  }

  const handleVerClase = (id: string) => {
    router.push(`/escuela/${slug}/catalogoDeClases/${id}`);
  };

  const handleCrear = () => {
    router.push(`/escuela/${slug}/catalogoDeClases/create`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Grupos</h2>
        <Button onClick={handleCrear} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Clase
        </Button>
      </div>

      <Table>
        <TableCaption>Lista de Grupos Registrados</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nombre</TableHead>
            <TableHead>Salón</TableHead>
            <TableHead>Maestro</TableHead>
            <TableHead>Grupo</TableHead>
            <TableHead>Materia</TableHead>
            <TableHead>Activo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No hay Clases registradas
              </TableCell>
            </TableRow>
          ) : (
            clases.map((clase) => (
              <TableRow
                key={clase.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleVerClase(clase.id)}
              >
                <TableCell className="font-medium">
                  {clase.nombre}
                </TableCell>
                <TableCell>{clase.salonId}</TableCell>
                <TableCell>{clase.maestroId}</TableCell>
                <TableCell>{clase.grupoId}</TableCell>
                <TableCell>{clase.materiaId}</TableCell>
                <TableCell>{clase.activa ? 'Activa' : 'No activa'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}