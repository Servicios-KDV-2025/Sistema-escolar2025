// src/components/TablaEventosEscolares.tsx
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
import { Plus, Trash2, Edit, Eye } from "lucide-react"; // Importa los iconos Edit y Eye
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";
import { toast } from "sonner";

export function TablaEventosEscolares() {
  const router = useRouter();
  const escuela = useEscuela((s) => s.escuela);

  const eventosEscolares = useQuery(
    api.eventosEscolares.obtenerEventosEscolaresPorEscuela,
    escuela ? { escuelaId: escuela._id as Id<"escuelas"> } : "skip"
  );

  const eliminarEvento = useMutation(
    api.eventosEscolares.eliminarEventoEscolar
  );

  const setItems = useBreadcrumbStore((state) => state.setItems);
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  useEffect(() => {
    if (escuela) {
      setItems([
        { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
        { label: "Eventos Escolares", isCurrentPage: true },
      ]);
    }
  }, [escuela, setItems, slug]);

  // handleVerEventoEscolar ahora es solo para el botón "Editar"
  const handleEditarEventoEscolar = (id: Id<"eventosEscolares">) => {
    router.push(`/escuela/${slug}/eventosEscolares/${id}/edit`);
  };

  // Nueva función para ver los detalles del evento
  const handleVerDetallesEventoEscolar = (id: Id<"eventosEscolares">) => {
    // Asumiendo que tendrás una ruta para ver detalles del evento, por ejemplo:
    router.push(`/escuela/${slug}/eventosEscolares/${id}`);
    // Si no tienes una página de detalles aún, podrías redirigir a la edición o simplemente alertar:
    // alert(`Ver detalles del evento con ID: ${id}`);
  };

  const handleCrear = () => {
    if (escuela?._id) {
      router.push(
        `/escuela/${slug}/eventosEscolares/create?escuelaId=${escuela._id}`
      );
    } else {
      alert("Por favor, selecciona una escuela antes de crear un evento.");
    }
  };

  const handleDeleteEventoEscolar = async (
    eventoId: Id<"eventosEscolares">,
    nombreEvento: string
  ) => {
    if (!escuela?._id) {
      toast.error("Error", {
        description: "No hay una escuela seleccionada para eliminar el evento.",
      });
      return;
    }

    const confirmed = confirm(
      `¿Estás seguro de que quieres eliminar el evento "${nombreEvento}"? Esta acción no se puede deshacer.`
    );

    if (confirmed) {
      try {
        await eliminarEvento({
          id: eventoId,
          escuelaId: escuela._id as Id<"escuelas">,
        });
        toast.success("Evento eliminado", {
          description: `"${nombreEvento}" ha sido eliminado correctamente.`,
        });
      } catch (error: unknown) { // Cambia 'any' por 'unknown' para un manejo de tipos seguro
  let errorMessage = "Ocurrió un error desconocido al eliminar el evento.";

  // Verifica el tipo de error para acceder a su mensaje de forma segura
  if (error instanceof Error) { // Si el error es una instancia de la clase Error estándar
    errorMessage = error.message;
  }
  // Si el error es un objeto plano con una propiedad 'message' (común en algunas APIs)
  else if (typeof error === 'object' && error !== null && 'message' in error) {
    errorMessage = (error as { message: string }).message;
  }
  // Si el error es simplemente una cadena de texto
  else if (typeof error === 'string') {
    errorMessage = error;
  }

  // Muestra la notificación de error con el mensaje determinado
  toast.error("Error al eliminar", {
    description: errorMessage,
  });

  // Registra el error completo en la consola para depuración
  console.error("Error al eliminar evento:", error);
}
    }
  };

  if (eventosEscolares === undefined) {
    return (
      <div className="text-center text-gray-600 py-8">
        Cargando los Eventos Escolares...
      </div>
    );
  }

  if (!escuela) {
    return (
      <div className="text-center text-red-500 py-8">
        Por favor, selecciona una escuela para ver sus eventos escolares.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Eventos Escolares</h2>
        <Button onClick={handleCrear} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Evento Escolar
        </Button>
      </div>

      <Table>
        <TableCaption>
          Lista de eventos escolares registrados para {escuela.nombre}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>{" "}
            {/* Mantén una sola columna de acciones */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {eventosEscolares.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                No hay eventos escolares registrados para esta escuela.
              </TableCell>
            </TableRow>
          ) : (
            eventosEscolares.map((eventoEscolar) => (
              <TableRow
                key={eventoEscolar._id}
                className="hover:bg-muted/50" // Mantén el hover visual
              >
                {/* La celda del nombre ya no tiene un onClick */}
                <TableCell className="font-medium">
                  {eventoEscolar.nombre}
                </TableCell>
                <TableCell>{eventoEscolar.descripcion || "N/A"}</TableCell>
                <TableCell>{eventoEscolar.tipo}</TableCell>
                <TableCell>
                  {eventoEscolar.activo ? "Activo" : "Inactivo"}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {/* Grupo de botones de acciones */}
                  <div className="flex justify-end gap-2">
                    {/* Botón Ver */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el clic propague
                        handleVerDetallesEventoEscolar(eventoEscolar._id);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {/* Botón Editar */}
                    <Button
                      variant="secondary" // Puedes usar "secondary", "outline", o dejarlo por defecto
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el clic propague
                        handleEditarEventoEscolar(eventoEscolar._id);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    {/* Botón Eliminar */}
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el clic propague
                        handleDeleteEventoEscolar(
                          eventoEscolar._id,
                          eventoEscolar.nombre
                        );
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
