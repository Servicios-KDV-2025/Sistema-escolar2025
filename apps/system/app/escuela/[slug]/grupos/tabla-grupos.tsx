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

export function TablaGrupos() {
  const router = useRouter();
  const escuela = useEscuela((s) => s.escuela);
  const grupos = useQuery(api.grupos.verTodosLosGrupos, {escuelaId: escuela?._id as Id<"escuelas">});
  const setItems = useBreadcrumbStore(state => state.setItems)
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  useEffect(() => {
    if (escuela){
      setItems([
      { label: `${escuela?.nombre}` , href: `/escuela/${slug}` },
      { label: 'Grupos', isCurrentPage: true },
    ])
    }
  }, [escuela, setItems, slug])

  if (grupos === undefined) {
    return <div>Cargando los Grupos...</div>;
  }

  const handleVerGrupo = (id: string) => {
    router.push(`/escuela/${slug}/grupos/create` + `${id}`);
  };

  const handleCrear = () => {
    router.push(`/escuela/${slug}/grupos/create`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Grupos</h2>
        <Button onClick={handleCrear} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Grupo
        </Button>
      </div>

      <Table>
        <TableCaption>Lista de Grupos Registrados</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Grado</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Activo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grupos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No hay Grupos registrados
              </TableCell>
            </TableRow>
          ) : (
            grupos.map((grupo) => (
              <TableRow
                key={grupo.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleVerGrupo(grupo.id)}
              >
                <TableCell className="font-medium">
                  {grupo.grado}
                </TableCell>
                <TableCell>{grupo.nombre}</TableCell>
                <TableCell>{grupo.activo}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}