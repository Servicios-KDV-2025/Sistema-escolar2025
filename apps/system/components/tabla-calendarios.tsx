"use client";

import { useQuery } from "convex/react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/shadcn/table";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";

export function TablaCalendarios() {
  const router = useRouter();
  const escuela = useEscuela((s) => s.escuela);
  const calendarios = useQuery(api.calendario.obtenerEventosCalendario, {escuelaId: escuela?._id as Id<"escuelas">});
  const setItems = useBreadcrumbStore(state => state.setItems)

  useEffect(() => {
    if (escuela){
      setItems([
      { label: `${escuela?.nombre}` , href: '/' },
      { label: 'Calendarios', href: '/calendarios', isCurrentPage: true },
    ])
    }
  }, [escuela, setItems])

  if (calendarios === undefined) {
    return <div>Cargando los Calendarios...</div>;
  }

  const handleVerCicloEscolar = (id: string) => {
    router.push(`/calendarios/${id}`);
  };

  const handleCrear = () => {
    router.push("/calendarios/create");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Calendarios</h2>
        <Button onClick={handleCrear} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Calendarios
        </Button>
      </div>

      <Table>
        <TableCaption>Lista de calendarios registrados</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Fecha</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>descripcion</TableHead>
            <TableHead>Activo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calendarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No hay calendarios registrados
              </TableCell>
            </TableRow>
          ) : (
            calendarios.map((calendario) => (
              <TableRow
                key={calendario._id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleVerCicloEscolar(calendario._id)}
              >
                <TableCell className="font-medium">
                  {calendario.fecha}
                </TableCell>
                <TableCell>{calendario.tipo}</TableCell>
                <TableCell>{calendario.descripcion}</TableCell>
                <TableCell>{calendario.activo}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}