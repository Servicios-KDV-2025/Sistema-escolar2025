'use client';

import { useEscuela } from "@/app/store/useEscuela";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CrudDialog, useCrudDialog } from "@/components/ui/crud-dialog";
import { catalogoDeClaseSchema } from "@/app/shemas/catalogoDeClases";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { FormularioCatalogoDeClases } from "./FormularioCatalogoDeClases";

export default function Page() {
    const { escuela } = useEscuela();

    // CRUD Catlálogo de Clases
    const crearCatalogoDeClases = useMutation(api.catalogosDeClases.crearCatalogoDeCases);
    const verTodosLosCatalogos = useQuery(api.catalogosDeClases.verTodosLosCatalogosDeClases, {
        escuelaId: escuela?._id as Id<'escuelas'>
    });
    const actualizarCatalogo = useMutation(api.catalogosDeClases.actualizarCatalogoDeClase);
    const eliminarCatalogo = useMutation(api.catalogosDeClases.eliminarCatalogoDeClase);

    const ciclosEscolares = useQuery(api.ciclosEscolares.obtenerCiclosEscolares, { escuelaId: escuela?._id as Id<"escuelas"> });
    const materias = useQuery(api.materias.obtenerMateriasPorEscuela, { escuelaId: escuela?._id as Id<"escuelas"> });
    const salones = useQuery(api.salones.obtenerSalones, { escuelaId: escuela?._id as Id<"escuelas"> });
    const maestros = useQuery(api.personal.verMaestrosDelPersonal, { escuelaId: escuela?._id as Id<"escuelas"> });
    const grupos = useQuery(api.grupos.verTodosLosGrupos, { escuelaId: escuela?._id as Id<"escuelas"> });

    const maestrosAdaptados = maestros?.map(maestro => ({
        ...maestro,
        fechaIngreso: typeof maestro.fechaIngreso === 'string'
            ? new Date(maestro.fechaIngreso).getTime()
            : maestro.fechaIngreso,
        email: maestro.email ?? null,
        telefono: maestro.telefono ?? null,
    }));

    const {
        isOpen,
        operation,
        data,
        openCreate,
        openView,
        openEdit,
        openDelete,
        close,
    } = useCrudDialog(catalogoDeClaseSchema, {
        cicloEscolarId: '',
        materiaId: '',
        salonId: '',
        maestroId: '',
        grupoId: '',
        nombre: '',
        activa: true,
    });

    const handleSubmit = async (values: Record<string, unknown>) => {
        if (!escuela?._id) {
            toast.error('Error', { description: 'No se pudo identificar la escuela' });
            return;
        }

        try {
            if (operation === 'create') {
                await crearCatalogoDeClases({
                    escuelaId: escuela?._id as Id<"escuelas">,
                    cicloEscolarId: values?.cicloEscolarId as Id<'ciclosEscolares'>,
                    materiaId: values?.materiaId as Id<'materias'>,
                    salonId: values?.salonId as Id<'salones'>,
                    maestroId: values?.maestroId as Id<'personal'>,
                    grupoId: values?.grupoId as Id<'grupos'>,
                    nombre: values?.nombre as string,
                    activa: values?.activa as boolean,
                })
            } else if (operation === 'edit' && data?._id) {
                await actualizarCatalogo({
                    _id: values.id as Id<"catalogosDeClases">,
                    escuelaId: escuela?._id as Id<"escuelas">,
                    cicloEscolarId: values?.cicloEscolarId as Id<'ciclosEscolares'>,
                    materiaId: values?.materiaId as Id<'materias'>,
                    salonId: values?.salonId as Id<'salones'>,
                    maestroId: values?.maestroId as Id<'personal'>,
                    grupoId: values?.grupoId as Id<'grupos'>,
                    nombre: values?.nombre as string,
                    activa: values?.activa as boolean,
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
            await eliminarCatalogo({
                _id: id as Id<"catalogosDeClases">,
                escuelaId: escuela._id as Id<"escuelas">
            })
        } catch (error) {
            console.error('Error al eliminar evento:', error);
            throw error;
        }
    }

    return (
        <main className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Catalogo de Clases</h1>
            <p className="text-muted-foreground mb-6">
                Haz clic en cualquier Clase para ver sus detalles completos,
                editarlo o eliminarlo. Para crear una nueva Clase, usa el botón
                Nueva Clase.
            </p>

            {escuela && (
                <Card className="w-full">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Gestión de Catálogo por Clase</CardTitle>
                            <Button onClick={openCreate}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nueva Clase
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            {verTodosLosCatalogos?.map(evento => (
                                <div
                                    key={evento._id}
                                    className="flex justify-between items-center p-3 border rounded-lg"
                                >
                                    <div className="flex gap-2">
                                        <div>
                                            <p className="font-medium">{evento.nombre}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Estado: {evento.activa ? 'Activa' : 'Inactiva'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant='outline' size='sm' onClick={() => openView({ ...evento, _id: evento._id })}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant='outline' size='sm' onClick={() => openEdit({ ...evento, _id: evento._id })}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant='destructive' size='sm' onClick={() => openDelete({ ...evento, _id: evento._id })}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {verTodosLosCatalogos?.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">
                                    No hay catálogo de clases creados. Crea la primer clase usando el botón &quot;Nueva Clase&quot;.
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
                schema={catalogoDeClaseSchema}
                defaultValues={{
                    cicloEscolarId: '',
                    materiaId: '',
                    salonId: '',
                    maestroId: '',
                    grupoId: '',
                    nombre: '',
                    activa: true,
                }}
                data={data}
                isOpen={isOpen}
                onOpenChange={close}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
            >
                {(form, operation) => (
                    <FormularioCatalogoDeClases
                        form={form}
                        operation={operation}
                        materias={materias}
                        grupos={grupos || []}
                        ciclosEscolares={ciclosEscolares || []}
                        salones={salones || []}
                        maestros={maestrosAdaptados || []}
                    />
                )}
            </CrudDialog>
        </main>
    );
}