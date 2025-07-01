"use client"; 

import { use, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@repo/ui/components/shadcn/dialog";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@repo/ui/components/shadcn/skeleton";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";
import { toast } from "sonner";

export default function DetalleSalonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const idSalon = id as Id<"salones">;
  const router = useRouter();
  const escuela = useEscuela((s) => s.escuela);
  const eliminarSalon = useMutation(api.salones.eliminarSalon);

  const salon = useQuery(api.salones.obtenerSalonPorId, 
    escuela?._id && idSalon
      ? { escuelaId: escuela?._id as Id<"escuelas">, salonId: idSalon } 
      : "skip"); 

  const [modalEliminar, setModalEliminar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setItems = useBreadcrumbStore(state => state.setItems);
  const paramSlug = useParams();
  const slug = typeof paramSlug?.slug === "string" ? paramSlug.slug : "";

  useEffect(() => {
    if (salon && escuela) {
      setItems([
        { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
        { label: "Salones", href: `/escuela/${slug}/salones` },
        { label: `${salon?.nombre}`, isCurrentPage: true },
      ]);
    }
  }, [escuela, salon, setItems, slug]);

  if (salon === undefined) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader><Skeleton className="h-8 w-full mb-2" /></CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-24 mr-2" />
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Salón no encontrado</h1>
        </div>
        <p>No se pudo encontrar el salón con el ID proporcionado.</p>
      </div>
    );
  }

  const handleEditar = () => {
    router.push(`/escuela/${slug}/salones/${id}/edit`);
  };

  const handleEliminar = async () => {
    if (!salon) return;
    setIsSubmitting(true);
    try {
      await eliminarSalon({
        salonId: salon._id,
        escuelaId: escuela?._id as Id<"escuelas">,
      });

      toast.info("Salón eliminado", {
        description: "El salón se ha eliminado correctamente",
      });

      router.push(`/escuela/${slug}/salones`);
    } catch (error) {
      console.error("Error al eliminar salón:", error);
      toast.error("Ocurrió un error al eliminar el salón.");
    } finally {
      setIsSubmitting(false);
      setModalEliminar(false);
    }
  };


  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Detalle del Salón</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">{salon?.nombre}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleEditar}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setModalEliminar(true)} className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Nombre</h3>
            <div className="p-2 bg-muted rounded-md">{salon.nombre}</div>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Capacidad</h3>
            <div className="p-2 bg-muted rounded-md">{salon.capacidad}</div>
          </div>
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Ubicación</h3>
            <div className="p-2 bg-muted rounded-md">{salon.ubicacion || "No especificada"}</div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={modalEliminar} onOpenChange={setModalEliminar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás completamente seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El salón será eliminado permanentemente de la base de datos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalEliminar(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleEliminar} disabled={isSubmitting}>
              {isSubmitting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
