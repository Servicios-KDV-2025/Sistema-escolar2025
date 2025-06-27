"use client";

import { use, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/shadcn/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@repo/ui/components/shadcn/dialog";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@repo/ui/components/shadcn/skeleton";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";

export default function DetalleCalendarioPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const idCalendario = id as Id<"calendario">;
    const escuela = useEscuela((s) => s.escuela);
    const router = useRouter();
    const eliminarCalendario = useMutation(api.calendario.eliminarEventoCalendario);

    const [modalEliminar, setModalEliminar] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems)
    const calendario = useQuery(api.calendario.obtenerEventoCalendarioPorId,
        escuela?._id && idCalendario
            ? { escuelaId: escuela?._id as Id<"escuelas">, eventoId: idCalendario }
            : "skip");

    useEffect(() => {
        if (calendario) {
            setItems([
                { label: 'Escuela Limón', href: '/' },
                { label: 'Ciclos Escolares', href: '/calendarios' },
                { label: `${calendario?.fecha}`, isCurrentPage: true }
            ]);
        }
    }, [calendario, setItems]);
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
                    <h1 className="text-3xl font-bold">Ciclo Escolar no encontrado</h1>
                </div>
                <p>No se pudo encontrar el ciclo escolar con el ID proporcionado.</p>
            </div>
        );
    }

    const handleEditar = () => {
        router.push(`/calendarios/${id}/edit`);
    };

    const handleEliminar = async () => {
        setIsSubmitting(true);
        try {
            await eliminarCalendario({ eventoId: calendario._id, escuelaId: escuela?._id as Id<"escuelas"> });
            router.push("/calendarios");
        } catch (error) {
            console.error("Error al eliminar ciclo escolar:", error);
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
                <h1 className="text-3xl font-bold">Detalle del Ciclo Escolar</h1>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl">
                            {calendario?.fecha}
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
                        <div className="p-2 bg-muted rounded-md">{calendario.fecha}</div>
                    </div>

                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Fecha</h3>
                        <div className="p-2 bg-muted rounded-md">
                            {calendario.fecha
                                ? new Date(calendario.fecha).toLocaleDateString("es-MX", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })
                                : ""}
                        </div>
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
                </CardContent>
            </Card>

            {/* Modal de confirmación para eliminar */}
            <Dialog open={modalEliminar} onOpenChange={setModalEliminar}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Estás completamente seguro?</DialogTitle>
                        <DialogDescription>
                            Esta acción no se puede deshacer. El ciclo escolar será eliminado permanentemente
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