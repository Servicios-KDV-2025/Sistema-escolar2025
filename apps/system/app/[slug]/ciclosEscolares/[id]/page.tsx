"use client";

import { use, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@repo/ui/components/shadcn/dialog";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@repo/ui/components/shadcn/skeleton";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";

export default function DetalleCicloEscolarPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const idCicloEscolar = id as Id<"ciclosEscolares">;
    const escuela = useEscuela((s) => s.escuela);
    const router = useRouter();
    const eliminarCicloEscolar = useMutation(api.ciclosEscolares.eliminarCicloEscolar);

    const [modalEliminar, setModalEliminar] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems)

    const cicloEscolar = useQuery(api.ciclosEscolares.obtenerCicloEscolarPorId , { escuelaId: escuela?._id as Id<"escuelas">, cicloId: idCicloEscolar });

    useEffect(() => {
        if (cicloEscolar && escuela) {
            setItems([
                { label: `${escuela?.nombre}`, href: '/' },
                { label: 'Ciclos Escolares', href: '/ciclosEscolares' },
                { label: `${cicloEscolar?.nombre}`, isCurrentPage: true }
            ]);
        }
    }, [escuela, cicloEscolar, setItems]);
    if (cicloEscolar === undefined) {
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

    if (!cicloEscolar) {
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
        router.push(`/ciclosEscolares/${id}/edit`);
    };

    const handleEliminar = async () => {
        setIsSubmitting(true);
        try {
            await eliminarCicloEscolar({ cicloId: cicloEscolar._id, escuelaId: escuela?._id as Id<"escuelas"> });
            router.push("/ciclosEscolares");
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
                            {cicloEscolar?.nombre}
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
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Nombre</h3>
                        <div className="p-2 bg-muted rounded-md">{cicloEscolar.nombre}</div>
                    </div>

                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Fecha de Inicio</h3>
                        <div className="p-2 bg-muted rounded-md">
                            {cicloEscolar.fechaInicio
                                ? new Date(cicloEscolar.fechaInicio).toLocaleDateString("es-MX", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })
                                : ""}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Fecha Final</h3>
                        <div className="p-2 bg-muted rounded-md">
                            {cicloEscolar.fechaFin
                                ? new Date(cicloEscolar.fechaFin).toLocaleDateString("es-MX", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })
                                : ""}
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