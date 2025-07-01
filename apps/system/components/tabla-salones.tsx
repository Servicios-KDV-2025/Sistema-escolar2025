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

export function TablaSalones() {
  const router = useRouter();
  const escuela = useEscuela((s) => s.escuela);
  const salones = useQuery(
    api.salones.obtenerSalones,
    escuela ? { escuelaId: escuela._id as Id<"escuelas"> } : "skip"
  );
  const setItems = useBreadcrumbStore(state => state.setItems)
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  useEffect(() => {
    if (escuela) {
      setItems([
        { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
        { label: 'Salones', isCurrentPage: true },
      ])
    }
  }, [escuela, setItems, slug])

  const handleVersalon = (id: string) => {
    router.push(`/escuela/${slug}/salones` + `/${id}`);
  };

  const handleCrear = () => {
    router.push(`/escuela/${slug}/salones/create`);
  };

  if (salones === undefined) {
    return <div>Cargando los Salones...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Salones</h2>
        <Button onClick={handleCrear} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Salón
        </Button>
      </div>

      <Table>
        <TableCaption>Lista de salones registrados</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nombre</TableHead>
            <TableHead>Capacidad</TableHead>
            <TableHead>Ubicación</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salones.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No hay salones registrados
              </TableCell>
            </TableRow>
          ) : (
            salones.map((salon) => (
              <TableRow
                key={salon._id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleVersalon(salon._id)}
              >
                <TableCell className="font-medium">
                  {salon.nombre}
                </TableCell>
                <TableCell>{salon.capacidad}</TableCell>
                <TableCell>{salon.ubicacion}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}