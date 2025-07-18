'use client';

import { useEscuela } from "@/app/store/useEscuela";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CrudDialog, useCrudDialog } from "@/components/dialog/crud-dialog";
import { eventoPorClaseSchema } from "@/app/shemas/eventoPorClase";
import { toast } from "sonner";
import { Button } from "@repo/ui/components/shadcn/button";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useEventoPorClase } from "@/app/store/useEventoPorClaseStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/shadcn/table";
import { useCatalogoDeClase } from "@/app/store/useCatalogoDeClasesStore";
import { useCicloEscolar } from "@/app/store/useCicloEscolarStore";
import { useEventoEscolar } from "@/app/store/useEventoEscolarStore";
import FormularioEventoPorClase from "./FormularioEventoPorClase";
import { usePersonal } from "@/app/store/usePersonalStore";

const fechaLegible = (timestamp: number) => {
    return new Intl.DateTimeFormat('es-MX', {
        dateStyle: 'medium',
    }).format(new Date(timestamp));
}

export default function Page() {
    const { escuela } = useEscuela();

    const eventoConNombres = useQuery(api.eventoPorClase.getEventoPorClaseConNombres, { escuelaId: escuela?._id as Id<"escuelas"> });

    const { crearEventoPorClase, actualizarEventoPorClase, eliminarEventoPorClase } = useEventoPorClase(escuela?._id);

    const { catalogosDeClases } = useCatalogoDeClase(escuela?._id);
    const { ciclosEscolares } = useCicloEscolar(escuela?._id);
    const { eventosEscolares } = useEventoEscolar(escuela?._id);
    const { personal } = usePersonal(escuela?._id);

    const personalAdaptado = personal?.map(p => ({
        ...p,
        _id: p._id as Id<'personal'>, // 👈 fuerza el tipo correcto
        telefono: p.telefono ?? null,
        email: p.email ?? null,
        escuelaId: p.escuelaId as Id<'escuelas'>,
        departamentoId: p.departamentoId as Id<'departamento'>,
        fechaIngreso: typeof p.fechaIngreso === 'string'
            ? new Date(p.fechaIngreso).getTime()
            : p.fechaIngreso,
    }));

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
                    createdBy: values.createdBy as Id<"personal">,
                });
                toast.success('Creado correctamente')
            } else if (operation === 'edit' && data?._id) {
                await actualizarEventoPorClase({
                    _id: values?._id as Id<"eventoPorClases">,
                    escuelaId: escuela?._id as Id<"escuelas">,
                    catalogoClaseId: values.catalogoClases as Id<"catalogosDeClases">,
                    calendarioId: values.calendario as Id<"calendario">,
                    cicloEscolarId: values.cicloEscolar as Id<"ciclosEscolares">,
                    eventoEscolarId: values.eventosEscolares as Id<"eventosEscolares">,
                    fecha: new Date(values.fecha as string).getTime(),
                    descripcion: values.descripcion as string,
                    activo: values.activo as boolean,
                    createdBy: values.createdBy as Id<"personal">,
                    updatedBy: values.updatedBy as Id<"personal">,
                })
                toast.success('Actualizado correctamente')
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
            toast.success('Eliminado correctamente')
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
                                        <TableCell className="font-medium">{fechaLegible(evento.fecha)}</TableCell>
                                        <TableCell>{evento.descripcion}</TableCell>
                                        <TableCell>{evento.catalogoClase}</TableCell>
                                        <TableCell>{fechaLegible(+evento.calendario)}</TableCell>
                                        <TableCell>{evento.eventoEscolar}</TableCell>
                                        <TableCell>{evento.activo ? 'Activo' : 'Inactivo'}</TableCell>
                                        <TableCell className="flex justify-end gap-2">
                                            <Button variant='outline' size='sm' onClick={() => openView({
                                                _id: evento._id, // usado internamente
                                                catalogoClases: evento.catalogoClaseId,
                                                cicloEscolar: evento.cicloEscolarId,
                                                calendario: evento.calendarioId,
                                                eventosEscolares: evento.eventoEscolarId,
                                                fecha: new Date(evento.fecha).toISOString().split("T")[0], // valor en formato YYYY-MM-DD para <input type="date" />
                                                descripcion: evento.descripcion,
                                                activo: evento.activo,
                                                createdBy: evento.createdBy,
                                                updatedBy: evento.updatedBy, // si existe
                                            })}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant='outline' size='sm' onClick={() => openEdit({
                                                _id: evento._id, // usado internamente
                                                catalogoClases: evento.catalogoClaseId,
                                                cicloEscolar: evento.cicloEscolarId,
                                                calendario: evento.calendarioId,
                                                eventosEscolares: evento.eventoEscolarId,
                                                fecha: new Date(evento.fecha).toISOString().split("T")[0], // valor en formato YYYY-MM-DD para <input type="date" />
                                                descripcion: evento.descripcion,
                                                activo: evento.activo,
                                                createdBy: evento.createdBy,
                                                updatedBy: evento.updatedBy, // si existe
                                            })}>
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
                    <FormularioEventoPorClase
                        form={form}
                        operation={operation}
                        escuelaId={escuela?._id as Id<"escuelas">}
                        catalogosDeClases={catalogosDeClases}
                        eventosEscolares={eventosEscolares}
                        ciclosEscolares={ciclosEscolares}
                        personal={personalAdaptado}
                    />
                )}
            </CrudDialog>
        </main>
    );
}