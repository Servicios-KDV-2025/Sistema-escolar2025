"use client";

import { useQuery } from "convex/react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/shadcn/table";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";

export function TablaCiclosEscolares() {
  const router = useRouter();
  const escuela = useEscuela((s) => s.escuela);
  const ciclosEscolares = useQuery(
    api.ciclosEscolares.obtenerCiclosEscolares,
    escuela ? { escuelaId: escuela._id as Id<"escuelas"> } : "skip"
  );
  const setItems = useBreadcrumbStore(state => state.setItems)
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  useEffect(() => {
    if (escuela) {
      setItems([
        { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
        { label: 'Ciclos Escolares', isCurrentPage: true },
      ])
    }
  }, [escuela, setItems, slug])

  const handleVerCicloEscolar = (id: string) => {
    router.push(`/escuela/${slug}/ciclosEscolares` + `/${id}`);
  };

  const handleCrear = () => {
    router.push(`/escuela/${slug}/ciclosEscolares/create`);
  };

  if (ciclosEscolares === undefined) {
    return <div>Cargando los Ciclos Escolares...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Ciclos Escolares</h2>
        <Button onClick={handleCrear} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Ciclo Escolar
        </Button>
      </div>

      <Table>
        <TableCaption>Lista de ciclosEscolares registrados</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nombre</TableHead>
            <TableHead>Fecha Inicio</TableHead>
            <TableHead>Fecha Fin</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ciclosEscolares.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No hay ciclosEscolares registrados
              </TableCell>
            </TableRow>
          ) : (
            ciclosEscolares.map((cicloEscolar) => (
              <TableRow
                key={cicloEscolar._id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleVerCicloEscolar(cicloEscolar._id)}
              >
                <TableCell className="font-medium">
                  {cicloEscolar.nombre}
                </TableCell>
                <TableCell>{new Date(cicloEscolar.fechaInicio).toISOString().split("T")[0]}</TableCell>
                <TableCell>{new Date(cicloEscolar.fechaFin).toISOString().split("T")[0]}</TableCell>
                <TableCell>{cicloEscolar.activo ? "Activo" : "Inactivo"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}