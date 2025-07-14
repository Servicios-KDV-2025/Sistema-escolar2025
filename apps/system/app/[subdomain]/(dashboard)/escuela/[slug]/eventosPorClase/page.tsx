'use client';

import { useEscuela } from "@/app/store/useEscuela";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CrudDialog, useCrudDialog } from "@/components/ui/crud-dialog";
import { eventoPorClaseSchema } from "@/app/shemas/eventoPorClase";
import { toast } from "sonner";
import { Button } from "@repo/ui/components/shadcn/button";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select";
import { Input } from "@/components/ui/input";
import { useEventoPorClase } from "@/app/store/useEventoPorClaseStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/shadcn/table";
import { useCatalogoDeClase } from "@/app/store/useCatalogoDeClasesStore";
import { useCicloEscolar } from "@/app/store/useCicloEscolarStore";
import { useEventoEscolar } from "@/app/store/useEventoEscolarStore";

export default function Page() {
    const { escuela } = useEscuela();
    const eventoConNombres = useQuery(api.eventoPorClase.getEventoPorClaseConNombres, { escuelaId: escuela?._id as Id<"escuelas"> });

    const { crearEventoPorClase, actualizarEventoPorClase, eliminarEventoPorClase } = useEventoPorClase(escuela?._id);

    const { catalogosDeClases } = useCatalogoDeClase(escuela?._id);
    const { ciclosEscolares } = useCicloEscolar(escuela?._id);
    const { eventosEscolares } = useEventoEscolar(escuela?._id);

    const calendario = useQuery(api.calendario.obtenerEventosCalendario, { escuelaId: escuela?._id as Id<"escuelas"> });

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
                await crearEventoPorClase({
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
                await actualizarEventoPorClase({
                    _id: values.id as Id<"eventoPorClases">,
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
            await eliminarEventoPorClase(id, escuela?._id);
        } catch (error) {
            console.error('Error al eliminar evento:', error);
            throw error;
        }
    }

    return (
        <main className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Eventos por Clase</h1>
            <p className="text-muted-foreground mb-6">
                Aquí puedes ver y gestionar todos los Eventos por Clases disponibles en la escuela.
                Haz clic en los botones para ver información más precisa, editar o eliminarlo.
                Para crear un nuevo Evento, usa el botón Nuevo Evento.
            </p>

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Gestión de Eventos por Clase</h2>
                <Button onClick={openCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Evento
                </Button>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">Fecha</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead>Clase</TableHead>
                            <TableHead>Calendario</TableHead>
                            <TableHead>Evento Escolar</TableHead>
                            <TableHead>Activo</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {eventoConNombres?.length === 0
                            ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        No hay salones registrados para esta escuela.
                                    </TableCell>
                                </TableRow>
                            )
                            : (
                                eventoConNombres?.map(evento => (
                                    <TableRow key={evento._id}>
                                        <TableCell className="font-medium">{evento.fecha}</TableCell>
                                        <TableCell>{evento.descripcion}</TableCell>
                                        <TableCell>{evento.catalogoClase}</TableCell>
                                        <TableCell>{evento.calendario}</TableCell>
                                        <TableCell>{evento.eventoEscolar}</TableCell>
                                        <TableCell>{evento.activo}</TableCell>
                                        <TableCell className="flex justify-end gap-2">
                                            <Button variant='outline' size='sm' onClick={() => openView({ ...evento, _id: evento._id })}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant='outline' size='sm' onClick={() => openEdit({ ...evento, _id: evento._id })}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant='destructive' size='sm' onClick={() => openDelete({ ...evento, _id: evento._id })}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )
                        }
                    </TableBody>
                </Table>
            </div>

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
                                                catalogosDeClases?.map(catClas => (
                                                    <SelectItem key={catClas._id} value={catClas._id}>
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
                                                ciclosEscolares?.map(ciclEsc => (
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