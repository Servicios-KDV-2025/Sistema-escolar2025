"use client";

import { use, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/shadcn/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@repo/ui/components/shadcn/dialog";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@repo/ui/components/shadcn/skeleton";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";
import { toast } from "sonner";

export default function DetalleCalendarioPage({ params }: { params: Promise<{ id: string, idCalendario: string }> }) {
    const { id, idCalendario } = use(params);
    const idCalendarioCiclo = idCalendario as Id<"calendario">;
    const idCicloEscolar = id as Id<"ciclosEscolares">;
    const escuela = useEscuela((s) => s.escuela);
    const router = useRouter();
    const eliminarCalendario = useMutation(api.calendario.eliminarEventoCalendario);

    const [modalEliminar, setModalEliminar] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems)
    const calendario = useQuery(api.calendario.obtenerEventoCalendarioPorId,
        escuela?._id && idCalendarioCiclo
            ? { escuelaId: escuela?._id as Id<"escuelas">, eventoId: idCalendarioCiclo }
            : "skip");
    const paramSlug = useParams();
    const slug = typeof paramSlug?.slug === "string" ? paramSlug.slug : "";
    const cicloEscolar = useQuery(api.ciclosEscolares.obtenerCicloEscolarPorId,
        escuela?._id && idCicloEscolar
            ? { escuelaId: escuela?._id as Id<"escuelas">, cicloId: idCicloEscolar }
            : "skip");
    useEffect(() => {
        if (calendario) {
            setItems([
                { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
                { label: 'Ciclos Escolares', href: `/escuela/${slug}/ciclosEscolares` },
                { label: `${cicloEscolar?.nombre}`, href: `/escuela/${slug}/ciclosEscolares/${idCicloEscolar}` },
                { label: 'Calendario', href: `/escuela/${slug}/ciclosEscolares/${idCicloEscolar}/calendario/${idCalendarioCiclo}` },
                { label: `${new Date(calendario.fecha).toISOString().split("T")[0]}`, isCurrentPage: true }
            ]);
        }
    }, [calendario, setItems, escuela, slug, cicloEscolar, idCicloEscolar, idCalendarioCiclo]);
    if (calendario === undefined) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center gap-2 mb-6">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Skeleton className="h-8 w-64" />
                </div>
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <Skeleton className="h-8 w-full mb-2" />
                    </CardHeader>
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

    if (!calendario) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center gap-2 mb-6">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold">Calendario no encontrado</h1>
                </div>
                <p>No se pudo encontrar el calendario con el ID proporcionado.</p>
            </div>
        );
    }

    const handleEditar = () => {
        router.push(`/escuela/${slug}/ciclosEscolares/${idCicloEscolar}/calendario/${idCalendarioCiclo}/edit`);
    };

    const handleEliminar = async () => {
        setIsSubmitting(true);
        try {
            await eliminarCalendario({ eventoId: calendario._id, escuelaId: escuela?._id as Id<"escuelas"> });
            toast.info("Fecha eliminada", { description: "La fecha se ha eliminada correctamente" });
            router.push(`/escuela/${slug}/ciclosEscolares/${idCicloEscolar}`);
        } catch (error) {
            console.error("Error al eliminar calendario:", error);
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
                <h1 className="text-3xl font-bold">Detalle de la Fecha</h1>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl">
                            Fecha: {new Date(calendario.fecha).toISOString().split("T")[0]}
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleEditar}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setModalEliminar(true)}
                                className="text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Fecha</h3>
                        <div className="p-2 bg-muted rounded-md">{new Date(calendario.fecha).toISOString().split("T")[0]}</div>
                    </div>

                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Tipo</h3>
                        <div className="p-2 bg-muted rounded-md">
                            {calendario.tipo}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Descripción</h3>
                        <div className="p-2 bg-muted rounded-md">
                            {calendario.descripcion}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Estado</h3>
                        <div className="p-2 bg-muted rounded-md">
                            {calendario.activo ? "Activo" : "Inactivo"}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={modalEliminar} onOpenChange={setModalEliminar}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Estás completamente seguro?</DialogTitle>
                        <DialogDescription>
                            Esta acción no se puede deshacer. El calendario será eliminado permanentemente
                            de la base de datos.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setModalEliminar(false)}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleEliminar}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Eliminando..." : "Eliminar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}