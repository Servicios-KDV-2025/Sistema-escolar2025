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

export default function DetalleClasePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const idCatalogoClases = id as Id<"catalogosDeClases">;
    const escuela = useEscuela((s) => s.escuela);
    const router = useRouter();
    const eliminarCatalogo = useMutation(api.catalogosDeClases.eliminarCatalogoDeClase);
    const allParams = useParams();
    const slug = typeof allParams?.slug === "string" ? allParams.slug : "";

    const [modalEliminar, setModalEliminar] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems)
    const catalogo = useQuery(api.catalogosDeClases.verUnCatalogoDeClase, { escuelaId: escuela?._id as Id<"escuelas">, id: idCatalogoClases });

    const salon = useQuery(api.salones.obtenerSalonPorId, { escuelaId: escuela?._id as Id<'escuelas'>, salonId: catalogo?.salonId as Id<'salones'> });
    const maestro = useQuery(api.personal.verMaestrosDelPersonal, { escuelaId: escuela?._id as Id<'escuelas'> });
    const maestroAsignado = maestro?.find(m => m._id === catalogo?.maestroId);
    const grupo = useQuery(api.grupos.grupoPorId, { escuelaId: escuela?._id as Id<'escuelas'>, id: catalogo?.grupoId as Id<'grupos'> });
    const materia = useQuery(api.materias.obtenerMateriaPorIdConEscuela, { id: catalogo?.materiaId as Id<'materias'> });

    useEffect(() => {
        if (catalogo) {
            setItems([
                { label: `${escuela?.nombre}`, href: '/' },
                { label: 'Catalogo de Clase', href: '/catalogoDeClases' },
                { label: `${catalogo?.nombre}`, isCurrentPage: true }
            ]);
        }
    }, [catalogo, setItems, escuela]);

    if (catalogo === undefined) {
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

    if (!catalogo) {
        return (
            <div className="container mx-auto py-10">
                <div className="flex items-center gap-2 mb-6">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold">Clase no encontrada</h1>
                </div>
                <p>No se pudo encontrar la clase con el ID proporcionado.</p>
            </div>
        );
    }

    const handleEditar = () => {
        router.push(`/escuela/${slug}/catalogoDeClases/${id}/edit`);
    };

    const handleEliminar = async () => {
        setIsSubmitting(true);
        try {
            await eliminarCatalogo({ id: idCatalogoClases, escuelaId: escuela?._id as Id<"escuelas"> });
            router.back();
        } catch (error) {
            console.error("Error al eliminar la Clase:", error);
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
                <h1 className="text-3xl font-bold">Detalle de la Clase</h1>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl">
                            {`Nombre: ${catalogo?.nombre}`}
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
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Maestro</h3>
                        <div className="p-2 bg-muted rounded-md">{maestroAsignado ? `${maestroAsignado.nombre} ${maestroAsignado.apellidos}` : 'Sin Asignar'}</div>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Materia</h3>
                        <div className="p-2 bg-muted rounded-md">{materia?.nombre}</div>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Salón</h3>
                        <div className="p-2 bg-muted rounded-md">{salon?.nombre}</div>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Grupo</h3>
                        <div className="p-2 bg-muted rounded-md">{grupo?.nombre}</div>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Activo</h3>
                        <div className="p-2 bg-muted rounded-md">{catalogo.activa ? 'Activo' : 'No Activo'}</div>
                    </div>
                </CardContent>
            </Card>

            {/* Modal de confirmación para eliminar */}
            <Dialog open={modalEliminar} onOpenChange={setModalEliminar}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Estás completamente seguro?</DialogTitle>
                        <DialogDescription>
                            Esta acción no se puede deshacer. La clase será eliminado permanentemente
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