'use client';

import { useEscuela } from "@/app/store/useEscuelaStore";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CrudDialog, useCrudDialog } from "@/components/dialog/crud-dialog";
import { catalogoDeClaseSchema } from "@/app/shemas/catalogoDeClases";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { FormularioCatalogoDeClases } from "./FormularioCatalogoDeClases";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/shadcn/table";
import { useCatalogoDeClase } from "@/app/store/useCatalogoDeClasesStore";
import { useCicloEscolar } from "@/app/store/useCicloEscolarStore";
import { useMateria } from "@/app/store/useMateriaStore";
import { useSalon } from "@/app/store/useSalonStore";
import { useGrupo } from "@/app/store/useGrupoStore";
import { usePersonal } from "@/app/store/usePersonalStore";

export default function Page() {
    const { escuela } = useEscuela();
    const catalogoConNombre = useQuery(
        api.catalogosDeClases.getCatalogoDeClasesConNombres,
        escuela ? { escuelaId: escuela._id as Id<"escuelas"> } : "skip"
    );

    const { crearCatalogoDeClase, actualizarCatalogoDeClase, eliminarCatalogoDeClase } = useCatalogoDeClase(escuela?._id);

    const { ciclosEscolares } = useCicloEscolar(escuela?._id);
    const { materias } = useMateria(escuela?._id);
    const { salones } = useSalon(escuela?._id);
    const { grupos } = useGrupo(escuela?._id);

    const { personal } = usePersonal(escuela?._id)
    const maestros = useQuery(api.personal.verMaestrosDelPersonal, { escuelaId: escuela?._id as Id<"escuelas"> });

    const maestrosAdaptados = maestros?.map(maestro => ({
        ...maestro,
        fechaIngreso: typeof maestro.fechaIngreso === 'string'
            ? new Date(maestro.fechaIngreso).getTime()
            : maestro.fechaIngreso,
        email: maestro.email ?? null,
        telefono: maestro.telefono ?? null,
    }));

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
                await crearCatalogoDeClase({
                    escuelaId: escuela?._id as Id<"escuelas">,
                    cicloEscolarId: values?.cicloEscolarId as Id<'ciclosEscolares'>,
                    materiaId: values?.materiaId as Id<'materias'>,
                    salonId: values?.salonId as Id<'salones'>,
                    maestroId: values?.maestroId as Id<'personal'>,
                    grupoId: values?.grupoId as Id<'grupos'>,
                    nombre: values?.nombre as string,
                    activa: values?.activa as boolean,
                    createdBy: values?.createdBy as Id<'personal'>
                })
                toast.success('Creado correctamente')
            } else if (operation === 'edit' && data?._id) {
                await actualizarCatalogoDeClase({
                    _id: values.id as Id<"catalogosDeClases">,
                    escuelaId: escuela?._id as Id<"escuelas">,
                    cicloEscolarId: values?.cicloEscolarId as Id<'ciclosEscolares'>,
                    materiaId: values?.materiaId as Id<'materias'>,
                    salonId: values?.salonId as Id<'salones'>,
                    maestroId: values?.maestroId as Id<'personal'>,
                    grupoId: values?.grupoId as Id<'grupos'>,
                    nombre: values?.nombre as string,
                    activa: values?.activa as boolean,
                    createdBy: values?.createdBy as Id<'personal'>
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
            await eliminarCatalogoDeClase(id, escuela._id)
            toast.success('Eliminado correctamente')
        } catch (error) {
            console.error('Error al eliminar evento:', error);
            throw error;
        }
    }

    return (
        <main className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Catalogo de Clases</h1>
            <p className="text-muted-foreground mb-6">
                Aquí puedes ver y gestionar todos los Catálogos de Clases disponibles en la escuela.
                Haz clic en los botones para ver información más precisa, editar o eliminarlo.
                Para crear una nueva Clase, usa el botón Nueva Clase.
            </p>

            <div className="flex flex-row items-center justify-between mt-6 mb-2">
                <h2 className="text-xl font-semibold">Gestión de Catálogo por Clase</h2>
                <Button onClick={openCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Clase
                </Button>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">Nombre</TableHead>
                            <TableHead>Ciclo Escolar</TableHead>
                            <TableHead>Materia</TableHead>
                            <TableHead>Salón</TableHead>
                            <TableHead>Maestro</TableHead>
                            <TableHead>Grupo</TableHead>
                            <TableHead>Activo</TableHead>
                            <TableHead>Creado Por</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {catalogoConNombre?.length === 0
                            ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center text-muted-foreground">
                                        No hay salones registrados para esta escuela.
                                    </TableCell>
                                </TableRow>
                            )
                            : (
                                catalogoConNombre?.map(clase => (
                                    <TableRow key={clase._id}>
                                        <TableCell className="font-medium">{clase.nombre}</TableCell>
                                        <TableCell>{clase.cicloEscolar}</TableCell>
                                        <TableCell>{clase.materia}</TableCell>
                                        <TableCell>{clase.salon}</TableCell>
                                        <TableCell>{clase.maestro}</TableCell>
                                        <TableCell>{clase.grupo}</TableCell>
                                        <TableCell>
                                            <span className={`${clase.activa ? 'bg-green-600' : 'bg-red-600'} text-white rounded-2xl p-2`}>
                                                {clase.activa ? 'Activa' : 'Inactiva'}
                                            </span>
                                        </TableCell>
                                        <TableCell>{clase.createdBy}</TableCell>
                                        <TableCell className="flex justify-end gap-2">
                                            <Button variant='outline' size='sm' onClick={() => openView({ ...clase, _id: clase._id })}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant='outline' size='sm' onClick={() => openEdit({ ...clase, _id: clase._id })}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant='destructive' size='sm' onClick={() => openDelete({ ...clase, _id: clase._id })}>
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
                    ? 'Crear Nuevo Catálogo de Clase'
                    : operation === 'edit'
                        ? 'Editar Catálogo de Clase'
                        : 'Ver Catálogo de Clase'
                }
                description={operation === 'create'
                    ? 'Completa la información del Catálogo de Clase'
                    : operation === 'edit'
                        ? 'Modifica la información del Catálogo de Clase'
                        : 'Información del Catálogo de Clase'
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
                        personal={personalAdaptado || []}
                    />
                )}
            </CrudDialog>
        </main>
    );
}