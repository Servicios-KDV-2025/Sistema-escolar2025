'use client'

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@repo/ui/components/shadcn/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@repo/ui/components/shadcn/table";
import { useEscuela } from "@/app/store/useEscuelaStore";

interface GroupAlumnosModalPropos{
  isOpen: boolean;
  onClose: () => void;
  grupoId: Id<"grupos"> | null;
  // escuelaId: Id<"escuelas"> | null;
}

export function GruposAlumnosModal({isOpen, onClose, grupoId}: GroupAlumnosModalPropos) {
  const {escuela} = useEscuela()
  const escuelaId = escuela?._id as Id<"escuelas"> | null;

  const alumnos = useQuery(api.alumnos.obtenerAlumnosPorGrupo, grupoId && escuelaId ? { grupoId, escuelaId } : "skip")
  const alumnosPorGrupos = alumnos?.filter(alumno => alumno.grupoId === grupoId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Alumnos del Grupo</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          {alumnosPorGrupos && alumnosPorGrupos.length > 0 ? (
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellidos</TableHead>
                <TableHead>Matrícula</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alumnosPorGrupos.map((alumno) => (
                <TableRow key={alumno._id}>
                  <TableCell>{alumno.nombre}</TableCell>
                  <TableCell>{alumno.apellidos}</TableCell>
                  <TableCell>{alumno.matricula}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          ) : (
            <p>No hay alumnos en este grupo.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}