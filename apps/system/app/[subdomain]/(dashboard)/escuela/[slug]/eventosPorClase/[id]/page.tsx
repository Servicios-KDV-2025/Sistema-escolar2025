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

export default function DetalleEventosPorClasePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const idEventoClase = id as Id<"eventoPorClases">;
    const escuela = useEscuela((s) => s.escuela);
    const router = useRouter();
    const eliminarEventoPorClase = useMutation(api.eventoPorClase.eliminarEventoXClase);
    const allParams = useParams();
    const slug = typeof allParams?.slug === "string" ? allParams.slug : "";

    const [modalEliminar, setModalEliminar] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems)
    const evento = useQuery(api.eventoPorClase.verUnEventoXClase , { escuelaId: escuela?._id as Id<"escuelas">, id: idEventoClase });
    const catalogoClases = useQuery(api.catalogosDeClases.verUnCatalogoDeClase, { escuelaId: escuela?._id as Id<"escuelas">, id: evento?.catalogoClaseId as Id<'catalogosDeClases'> });
    const calendario = useQuery(api.calendario.obtenerEventosCalendario, { escuelaId: escuela?._id as Id<"escuelas"> });
    const cicloEscolar = useQuery(api.ciclosEscolares.obtenerCicloEscolarPorId, { escuelaId: escuela?._id as Id<"escuelas">,  cicloId: evento?.cicloEscolarId as Id<'ciclosEscolares'>});
    const eventosEscolares = useQuery(api.eventosEscolares.obtenerEventoPorId, { escuelaId: escuela?._id as Id<"escuelas">, id: evento?.eventoEscolarId as Id<'eventosEscolares'> });

    useEffect(() => {
        if (evento) {
            setItems([
                { label: `${escuela?.nombre}`, href: '/' },
                { label: 'Eventos de la Clase', href: '/eventosPorClase' },
                { label: `${evento?._id}`, isCurrentPage: true }
            ]);
        }
    }, [evento, setItems, escuela]);

    if (evento === undefined) {
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

    if (!evento) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center gap-2 mb-6">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold">Eventos no encontrados</h1>
                </div>
                <p>No se pudieron encontrar los eventos con el ID proporcionado.</p>
            </div>
        );
    }

    const handleEditar = () => {
        router.push(`/escuela/${slug}/grupos/${id}/edit`);
    };

    const handleEliminar = async () => {
        setIsSubmitting(true);
        try {
            await eliminarEventoPorClase({ id: idEventoClase, escuelaId: escuela?._id as Id<"escuelas"> });
            router.back();
        } catch (error) {
            console.error("Error al eliminar el evento:", error);
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
                <h1 className="text-3xl font-bold">Detalle del Evento</h1>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl">
                            Descripción:
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
                        <div className="p-2 bg-muted rounded-md">{evento.descripcion}</div>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Catálogo de Clases</h3>
                        <div className="p-2 bg-muted rounded-md">{catalogoClases ? catalogoClases.nombre : 'No hay clases asignadas'}</div>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Calendario</h3>
                        <div className="p-2 bg-muted rounded-md">{calendario ? calendario.map(cal => (
                            <div key={cal._id}>
                                <p>Fecha: {cal.fecha}</p>
                                <p>Descripción: {cal.descripcion}</p>
                            </div>
                        )) : 'No Activo'}</div>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Ciclo Escolar</h3>
                        <div className="p-2 bg-muted rounded-md">{cicloEscolar?.nombre}</div>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Eventos Escolares</h3>
                        <div className="p-2 bg-muted rounded-md">{eventosEscolares?.nombre}</div>
                    </div>
                </CardContent>
            </Card>

            {/* Modal de confirmación para eliminar */}
            <Dialog open={modalEliminar} onOpenChange={setModalEliminar}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Estás completamente seguro?</DialogTitle>
                        <DialogDescription>
                            Esta acción no se puede deshacer. El grupo será eliminado permanentemente
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