"use client";

import { use, useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/shadcn/table";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@repo/ui/components/shadcn/dialog";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";
import { toast } from "sonner";

export default function DetalleCicloEscolarPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const idCicloEscolar = id as Id<"ciclosEscolares">;
    const escuela = useEscuela((s) => s.escuela);
    const router = useRouter();
    const paramSlug = useParams();
    const slug = typeof paramSlug?.slug === "string" ? paramSlug.slug : "";

    const eliminarCicloEscolar = useMutation(api.ciclosEscolares.eliminarCicloEscolar);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems)
    const cicloEscolar = useQuery(api.ciclosEscolares.obtenerCicloEscolarPorId,
        escuela?._id && idCicloEscolar
            ? { escuelaId: escuela?._id as Id<"escuelas">, cicloId: idCicloEscolar }
            : "skip");

    //Calendario
    const calendarios = useQuery(api.calendario.obtenerCalendarioCicloEscolar,
        escuela?._id && idCicloEscolar
            ? { escuelaId: escuela?._id as Id<"escuelas">, cicloEscolarId: idCicloEscolar }
            : "skip"
    );
    const handleVerCicloEscolar = (id: string) => {
        router.push(`/escuela/${slug}/ciclosEscolares/${cicloEscolar?._id}/calendario/` + `${id}`);
    };

    const handleCrear = () => {
        router.push(`/escuela/${slug}/ciclosEscolares/${cicloEscolar?._id}/calendario/create`);
    };

    useEffect(() => {
        if (cicloEscolar && escuela) {
            setItems([
                { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
                { label: 'Ciclos Escolares', href: `/escuela/${slug}/ciclosEscolares` },
                { label: `${cicloEscolar?.nombre}`, isCurrentPage: true }
            ]);
        }
    }, [escuela, cicloEscolar, setItems, slug,]);

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
        router.push(`/escuela/${slug}/ciclosEscolares/${id}/edit`);
    };

    const handleEliminar = async () => {
        if (!cicloEscolar) return;
        setIsSubmitting(true);
        try {
            await eliminarCicloEscolar({ cicloId: cicloEscolar._id, escuelaId: escuela?._id as Id<"escuelas"> });
            toast.info("Ciclo escolar eliminado", { description: "El ciclo escolar se ha eliminado correctamente" });
            router.push(`/escuela/${slug}/ciclosEscolares`);
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
                            Perido: {cicloEscolar?.nombre}
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
                            {new Date(cicloEscolar.fechaInicio).toISOString().split("T")[0]}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Fecha Final</h3>
                        <div className="p-2 bg-muted rounded-md">
                            {new Date(cicloEscolar.fechaFin).toISOString().split("T")[0]}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium text-sm text-muted-foreground mb-1">Estado</h3>
                        <div className="p-2 bg-muted rounded-md">
                            {cicloEscolar.activo ? "Activo" : "Inactivo"}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="max-w-2xl mx-auto mt-6">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-2xl">
                            Fechas registradas: {calendarios ? calendarios.length : 0}
                        </CardTitle>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCrear}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Table>
                        <TableCaption>Lista de calendarios registrados</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Fecha</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Descripción</TableHead>
                                <TableHead>Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!calendarios || calendarios.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
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
                                            {new Date(calendario.fecha).toISOString().split("T")[0]}
                                        </TableCell>
                                        <TableCell>{calendario.tipo}</TableCell>
                                        <TableCell>{calendario.descripcion}</TableCell>
                                        <TableCell>{calendario.activo ? "Activo" : "Inactivo"}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

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