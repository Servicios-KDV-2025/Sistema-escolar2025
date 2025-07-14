"use client";

import { use, useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/shadcn/table";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { ArrowLeft, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuelaStore";
import { toast } from "sonner";
import EventoDialog from "@/components/dialog/eventoDialog";
import { Calendario } from "@/app/types/calendario";
import { useCicloEscolar } from "@/app/store/useCicloEscolarStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select";
import { cicloEscolarSchema } from "@/app/shemas/cicloEscolar";
import { CrudDialog, useCrudDialog } from "@/components/ui/crud-dialog";
import { Input } from "@repo/ui/components/shadcn/input";

export default function DetalleCicloEscolarPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const idCicloEscolar = id as Id<"ciclosEscolares">;
    const { escuela } = useEscuela();
    const router = useRouter();
    const paramSlug = useParams();
    const slug = typeof paramSlug?.slug === "string" ? paramSlug.slug : "";

    const {
        isUpdating,
        isDeleting,
        actualizarCicloEscolar,
        eliminarCicloEscolar,
    } = useCicloEscolar(escuela?._id)

    const {
        isOpen,
        operation,
        data,
        openEdit,
        openDelete,
        close
    } = useCrudDialog(cicloEscolarSchema, {
        _id: '',
        nombre: "",
        fechaInicio: "",
        fechaFin: "",
        activo: true
    })

    const setItems = useBreadcrumbStore(state => state.setItems)
    const cicloEscolar = useQuery(api.ciclosEscolares.obtenerCicloEscolarPorId,
        escuela?._id && idCicloEscolar
            ? { escuelaId: escuela?._id as Id<"escuelas">, cicloId: idCicloEscolar }
            : "skip");
    const calendario = useQuery(api.calendario.obtenerCalendarioCicloEscolar,
        escuela?._id && idCicloEscolar
            ? { escuelaId: escuela?._id as Id<"escuelas">, cicloEscolarId: idCicloEscolar }
            : "skip"
    );
    const tiposDeEventos = useQuery(
        api.tiposDeEventos.obtenerTiposDeEventos,
        escuela ? { escuelaId: escuela._id as Id<"escuelas"> } : "skip"
    )

    // Calendarios
    const [modalAbierto, setModalAbierto] = useState(false);
    const [eventoEditar, setEventoEditar] = useState<Calendario | null>(null);
    type ModoEvento = "editar" | "ver" | "eliminar" | null;
    const [modoDialogo, setModoDialogo] = useState<ModoEvento>();

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

    const handleSubmit = async (values: Record<string, unknown>) => {
        if (!escuela?._id) {
            toast.error('Error', { description: 'No se pudo identificar la escuela' })
            return
        }

        try {
            if (operation === 'edit' && data?._id) {
                await actualizarCicloEscolar({
                    _id: data._id as Id<"ciclosEscolares">,
                    escuelaId: escuela._id as Id<"escuelas">,
                    nombre: values.nombre as string,
                    fechaInicio: new Date(values.fechaInicio as string).getTime(),
                    fechaFin: new Date(values.fechaFin as string).getTime(),
                    activo: values.activo as boolean
                })
            } else {
                throw new Error('Operación no válida o datos faltantes')
            }
        } catch (error) {
            toast.error('Error en operación CRUD', { description: (error as Error).message })
            throw error
        }
    }

    const handleDelete = async (id: string) => {
        if (!escuela?._id) {
            toast.error('Error', { description: 'No se pudo identificar la escuela' })
            return
        }
        try {
            await eliminarCicloEscolar(id, escuela._id)
        } catch (error) {
            toast.error('Error al eliminar grupo', { description: (error as Error).message })
            throw error
        }
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center gap-2 mb-6">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold">Detalle del Ciclo Escolar</h1>
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
                <Card className="flex flex-1">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-2xl">
                                Perido: {cicloEscolar?.nombre}
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openEdit(cicloEscolar);
                                    }} disabled={isUpdating}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => openDelete(cicloEscolar)} disabled={isDeleting}
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
                <Card className="flex flex-2">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-2xl">
                                Calendario
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" onClick={() => {
                                    setEventoEditar(null)
                                    setModoDialogo(null);
                                    setModalAbierto(true)
                                }}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Table>
                            <TableCaption>Lista de fechas registradas</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Fecha</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!calendario || calendario.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            No hay calendarios registrados
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    calendario.map((calendario_p) => (
                                        <TableRow
                                            key={calendario_p._id}
                                            className="cursor-pointer hover:bg-muted/50"
                                        >
                                            <TableCell className="font-medium">
                                                {new Date(calendario_p.fecha).toISOString().split("T")[0]}
                                            </TableCell>
                                            <TableCell className="max-w-[80px] truncate">{tiposDeEventos?.find(t => t._id === calendario_p.tipoEventoId)?.nombre ??
                                                "Cargando..."}</TableCell>
                                            <TableCell className="max-w-[100px] truncate">{calendario_p.descripcion}</TableCell>
                                            <TableCell>{calendario_p.activo ? "Activo" : "Inactivo"}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => {
                                                        setEventoEditar(calendario_p as Calendario)
                                                        setModoDialogo("ver");
                                                        setModalAbierto(true)
                                                    }}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="cursor-pointer" onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEventoEditar(calendario_p as Calendario)
                                                        setModoDialogo("editar")
                                                        setModalAbierto(true)
                                                    }}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="destructive" size="sm" className="cursor-pointer" onClick={() => {
                                                        setEventoEditar(calendario_p as Calendario)
                                                        setModoDialogo("eliminar");
                                                        setModalAbierto(true)
                                                    }}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <CrudDialog
                operation={operation}
                title={operation === 'create' ? 'Crear Nuevo Ciclo Escolar' :
                    operation === 'edit' ? 'Editar Ciclo Escolar' : 'Ver Ciclo Escolar'}
                description={operation === 'create' ? 'Completa la información del nuevo ciclo escolar' :
                    operation === 'edit' ? 'Modifica la información del ciclo escolar' : 'Información del ciclo escolar'}
                schema={cicloEscolarSchema}
                defaultValues={{
                    nombre: "",
                    fechaInicio: "",
                    fechaFin: "",
                    activo: true
                }}
                data={data}
                isOpen={isOpen}
                onOpenChange={close}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
            >
                {(form, operation) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: 2024-2025" {...field} disabled={operation === 'view'} value={field.value as string} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fechaInicio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha de Inicio</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            disabled={operation === 'view'}
                                            value={
                                                field.value
                                                    ? (typeof field.value === 'number'
                                                        ? new Date(field.value).toISOString().split("T")[0]
                                                        : new Date(field.value as string).toISOString().split("T")[0])
                                                    : ''
                                            }
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="fechaFin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha Final</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            disabled={operation === 'view'}
                                            value={
                                                field.value
                                                    ? (typeof field.value === 'number'
                                                        ? new Date(field.value).toISOString().split("T")[0]
                                                        : new Date(field.value as string).toISOString().split("T")[0])
                                                    : ''
                                            }
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {operation == 'edit' ?
                            <FormField
                                control={form.control}
                                name="activo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={value => field.onChange(value === "true")}
                                                value={field.value ? "true" : "false"}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona el estado" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="true">Activo</SelectItem>
                                                    <SelectItem value="false">Inactivo</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            : ""}


                    </div>
                )}
            </CrudDialog>
            <EventoDialog
                isOpen={modalAbierto}
                onOpenChange={(open) => {
                    if (!open) {
                        setEventoEditar(null);
                    }
                    setModalAbierto(open);
                }}
                modo={modoDialogo}
                escuelaId={escuela?._id as Id<"escuelas">}
                eventoEditar={eventoEditar ?? undefined}
            />
        </div>
    );
}