// src/components/TablaMaterias.tsx
"use client";

import { useQuery, useMutation } from "convex/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/shadcn/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";
import { toast } from "sonner";

export function TablaMaterias() {
  const router = useRouter();
  const escuela = useEscuela((s) => s.escuela);

  // Hook para obtener las materias de la escuela actual
  const materias = useQuery(
    api.materias.obtenerMateriasPorEscuela, // Asume que tienes esta función en tu API Convex
    escuela ? { escuelaId: escuela._id as Id<"escuelas"> } : "skip"
  );

  // Hook para la mutación de eliminar materia
  const eliminarMateria = useMutation(
    api.materias.eliminarMateriaConEscuela
  );

  const setItems = useBreadcrumbStore((state) => state.setItems);
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  useEffect(() => {
    if (escuela) {
      setItems([
        { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
        { label: "Materias", isCurrentPage: true },
      ]);
    }
  }, [escuela, setItems, slug]);

  const handleEditarMateria = (id: Id<"materias">) => {
    router.push(`/escuela/${slug}/materias/${id}/edit`);
  };

  const handleVerDetallesMateria = (id: Id<"materias">) => {
    router.push(`/escuela/${slug}/materias/${id}`);
  };

  const handleCrear = () => {
    if (escuela?._id) {
      router.push(`/escuela/${slug}/materias/create?escuelaId=${escuela._id}`);
    } else {
      toast.error("Error", {
        description:
          "Por favor, selecciona una escuela antes de crear una materia.",
      });
    }
  };

  const handleDeleteMateria = async (
    materiaId: Id<"materias">,
    nombreMateria: string
  ) => {
    if (!escuela?._id) {
      toast.error("Error", {
        description:
          "No hay una escuela seleccionada para eliminar la materia.",
      });
      return;
    }

    const confirmed = confirm(
      `¿Estás seguro de que quieres eliminar la materia "${nombreMateria}"? Esta acción no se puede deshacer.`
    );

    if (confirmed) {
      try {
        await eliminarMateria({
          id: materiaId       
        });
        toast.success("Materia eliminada", {
          description: `"${nombreMateria}" ha sido eliminada correctamente.`,
        });
      } catch (error: unknown) { 
  let errorMessage = "Ocurrió un error desconocido al eliminar la materia.";

  // Verifica si el error es una instancia de Error (lo más común)
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  // Puedes añadir más verificaciones si sabes que pueden ocurrir otros tipos de errores.
  // Por ejemplo, si tu Convex API a veces devuelve un objeto con un campo 'data.message'
  else if (typeof error === 'object' && error !== null && 'message' in error) {
    errorMessage = (error as { message: string }).message;
  }
  // O si el error es simplemente una cadena
  else if (typeof error === 'string') {
    errorMessage = error;
  }

  toast.error("Error al eliminar", {
    description: errorMessage,
  });
  console.error("Error al eliminar materia:", error);
}
    }
  };

  if (materias === undefined) {
    return (
      <div className="text-center text-gray-600 py-8">
        Cargando las Materias...
      </div>
    );
  }

  if (!escuela) {
    return (
      <div className="text-center text-red-500 py-8">
        Por favor, selecciona una escuela para ver sus materias.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Materias</h2>
        <Button onClick={handleCrear} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Materia
        </Button>
      </div>

      <Table>
        <TableCaption>
          Lista de materias registradas para {escuela.nombre}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Créditos</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materias.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                No hay materias registradas para esta escuela.
              </TableCell>
            </TableRow>
          ) : (
            materias.map((materia) => (
              <TableRow key={materia._id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{materia.nombre}</TableCell>
                <TableCell>{materia.descripcion || "N/A"}</TableCell>
                <TableCell>{materia.creditos || "N/A"}</TableCell>
                <TableCell>{materia.activa ? "Activa" : "Inactiva"}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerDetallesMateria(materia._id);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditarMateria(materia._id);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMateria(materia._id, materia.nombre);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
