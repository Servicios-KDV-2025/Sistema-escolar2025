'use client';

import { useEscuela } from "@/app/store/useEscuela";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CrudDialog, useCrudDialog } from "@/components/ui/crud-dialog";
import { eventoPorClaseSchema } from "@/app/shemas/eventoPorClase";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { Button } from "@repo/ui/components/shadcn/button";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select";
import { Input } from "@/components/ui/input";

export default function Page() {
    const { escuela } = useEscuela();

    // CRUD Eventos por clase
    const crearEventoXClase = useMutation(api.eventoPorClase.crearEventoXClase);
    const eventosPorClase = useQuery(api.eventoPorClase.verTodosLosEventosXClases, {
        escuelaId: escuela?._id as Id<'escuelas'>,
    });
    const actualizarEventoXClase = useMutation(api.eventoPorClase.actualizarEventoXClase);
    const eliminarEventoXClase = useMutation(api.eventoPorClase.eliminarEventoXClase);

    const catalogoClases = useQuery(api.catalogosDeClases.verTodosLosCatalogosDeClases, { escuelaId: escuela?._id as Id<"escuelas"> });
    const calendario = useQuery(api.calendario.obtenerEventosCalendario, { escuelaId: escuela?._id as Id<"escuelas"> });
    const cicloEscolar = useQuery(api.ciclosEscolares.obtenerCiclosEscolares, { escuelaId: escuela?._id as Id<"escuelas"> });
    const eventosEscolares = useQuery(api.eventosEscolares.obtenerTodosLosEventosEscolares);

    const {
        isOpen,
        operation,
        data,
        openCreate,
        openEdit,
        openView,
        openDelete,
        close,
    } = useCrudDialog(eventoPorClaseSchema, {
        catalogoClases: '',
        calendario: '',
        cicloEscolar: '',
        eventosEscolares: '',
        fecha: "",
        descripcion: "",
        activo: true
    });

    const handleSubmit = async (values: Record<string, unknown>) => {
        if (!escuela?._id) {
            toast.error('Error', { description: 'No se pudo identificar la escuela' });
            return;
        }

        try {
            if (operation === 'create') {
                await crearEventoXClase({
                    escuelaId: escuela?._id as Id<"escuelas">,
                    catalogoClaseId: values.catalogoClases as Id<"catalogosDeClases">,
                    calendarioId: values.calendario as Id<"calendario">,
                    cicloEscolarId: values.cicloEscolar as Id<"ciclosEscolares">,
                    eventoEscolarId: values.eventosEscolares as Id<"eventosEscolares">,
                    fecha: new Date(values.fecha as string).getTime(),
                    descripcion: values.descripcion as string,
                    activo: values.activo as boolean,
                });
            } else if (operation === 'edit' && data?._id) {
                await actualizarEventoXClase({
                    id: values.id as Id<"eventoPorClases">,
                    escuelaId: escuela?._id as Id<"escuelas">,
                    catalogoClaseId: values.catalogoClases as Id<"catalogosDeClases">,
                    calendarioId: values.calendario as Id<"calendario">,
                    cicloEscolarId: values.cicloEscolar as Id<"ciclosEscolares">,
                    eventoEscolarId: values.eventosEscolares as Id<"eventosEscolares">,
                    fecha: new Date(values.fecha as string).getTime(),
                    descripcion: values.descripcion as string,
                    activo: values.activo as boolean,
                })
            } else {
                console.error('Operación no válida o datos faltantes:', { operation, data });
                throw new Error('Operación no válida o datos faltantes:');
            }
        } catch (error) {
            console.error('Error en la operación de CRUD:', error);
            throw error;
        }
    }

    const handleDelete = async (id: string) => {
        if (!escuela?._id) {
            toast.error('Error', { description: 'No se pudo identificar la escuela' })
            return
        }

        try {
            await eliminarEventoXClase({
                id: id as Id<"eventoPorClases">,
                escuelaId: escuela._id as Id<"escuelas">,
            });
        } catch (error) {
            console.error('Error al eliminar evento:', error);
            throw error;
        }
    }

    return (
        <main className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Eventos por Clase</h1>
            <p className="text-muted-foreground mb-6">
                Haz clic en cualquier Evento para ver sus detalles completos,
                editarlo o eliminarlo. Para crear una nuevo Evento, usa el botón
                Nuevo Evento.
            </p>

            {escuela && (
                <Card className="w-full">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Gestión de Eventos por Clase</CardTitle>
                            <Button onClick={openCreate}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nuevo Evento
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            {eventosPorClase?.map(evento => (
                                <div
                                    key={evento.id}
                                    className="flex justify-between items-center p-3 border rounded-lg"
                                >
                                    <div className="flex gap-2">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Estado: {evento.activo ? 'Activo' : 'Inactivo'}
                                            </p>
                                            <p className="font-medium">Descripción {evento.descripcion}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant='outline' size='sm' onClick={() => openView({ ...evento, _id: evento.id })}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant='outline' size='sm' onClick={() => openEdit({ ...evento, _id: evento.id })}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant='destructive' size='sm' onClick={() => openDelete({ ...evento, _id: evento.id })}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {eventosPorClase?.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">
                                    No hay eventos creados. Crea el primer evento usando el botón &quot;Nuevo Evento&quot;.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* CrudDialog */}
            <CrudDialog
                operation={operation}
                title={operation === 'create'
                    ? 'Crear Nuevo Evento'
                    : operation === 'edit'
                        ? 'Editar Evento'
                        : 'Ver Evento'
                }
                description={operation === 'create'
                    ? 'Completa la información del Evento'
                    : operation === 'edit'
                        ? 'Modifica la información del Evento'
                        : 'Información del Evento'
                }
                schema={eventoPorClaseSchema}
                defaultValues={{
                    catalogoClases: '',
                    calendario: '',
                    cicloEscolar: '',
                    eventosEscolares: '',
                    fecha: "",
                    descripcion: "",
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
                            name="catalogoClases"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Clases</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value as string}
                                        disabled={operation === 'view'}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una Clase" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                catalogoClases?.map(catClas => (
                                                    <SelectItem key={catClas.id} value={catClas.id}>
                                                        {catClas.nombre}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="calendario"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value as string}
                                        disabled={operation === 'view'}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona una fecha" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                calendario?.map(cal => (
                                                    <SelectItem key={cal._id} value={cal._id}>
                                                        {cal.fecha}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cicloEscolar"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ciclo Escolar</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value as string}
                                        disabled={operation === 'view'}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un Ciclo Escolar" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                cicloEscolar?.map(ciclEsc => (
                                                    <SelectItem key={ciclEsc._id} value={ciclEsc._id}>
                                                        {ciclEsc.nombre}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="eventosEscolares"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Evento Escolar (Opcional)</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value as string}
                                        disabled={operation === 'view'}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un Evento Escolar (Opcionl)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                eventosEscolares?.map(eventEsc => (
                                                    <SelectItem key={eventEsc._id} value={eventEsc._id}>
                                                        {eventEsc.nombre}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="fecha"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value as string || ''}
                                            placeholder="Fecha del evento"
                                            type="date"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="descripcion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descripcion</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value as string || ''}
                                            placeholder="Descripción del Evento"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="activo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(value) => field.onChange(value === 'true')}
                                            value={field.value ? 'true' : 'false'}
                                            disabled={operation === 'view'}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar estado" />
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
                    </div>
                )}
            </CrudDialog>
        </main>
    );
}