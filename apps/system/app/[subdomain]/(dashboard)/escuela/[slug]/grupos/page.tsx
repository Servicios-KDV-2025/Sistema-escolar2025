'use client';

import { useEscuela } from "@/app/store/useEscuelaStore";
import { Id } from "@/convex/_generated/dataModel";
import { CrudDialog, useCrudDialog } from "@/components/ui/crud-dialog";
import { grupoSchema } from "@/app/shemas/grupo";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select";
import { Input } from "@/components/ui/input";
import { useGrupo } from "@/app/store/useGrupoStore";

export default function Page() {
    const { escuela } = useEscuela();

    const { crearGrupo, actualizarGrupo, eliminarGrupo, grupos } = useGrupo(escuela?._id);

    // const crearGrupo = useMutation(api.grupos.crearGrupo)
    // const actualizarGrupo = useMutation(api.grupos.actualizarGrupo)
    // const eliminarGrupo = useMutation(api.grupos.eliminarGrupo)
    // const grupos = useQuery(api.grupos.verTodosLosGrupos, {
    //     escuelaId: escuela?._id as Id<"escuelas">
    // });

    const {
        isOpen,
        operation,
        data,
        openCreate,
        openEdit,
        openView,
        openDelete,
        close
    } = useCrudDialog(grupoSchema, {
        grado: "1°",
        nombre: "",
        activo: true
    });

    const handleSubmit = async (values: Record<string, unknown>) => {
        if (!escuela?._id) {
            toast.error('Error', { description: 'No se pudo identificar la escuela' })
            return
        }

        try {
            if (operation === 'create') {
                await crearGrupo({
                    escuelaId: escuela._id as Id<"escuelas">,
                    grado: values.grado as string,
                    nombre: values.nombre as string,
                    activo: values.activo as boolean
                })
            } else if (operation === 'edit' && data?._id) {
                await actualizarGrupo({
                    _id: data._id as Id<"grupos">,
                    escuelaId: escuela._id as Id<"escuelas">,
                    grado: values.grado as string,
                    nombre: values.nombre as string,
                    activo: values.activo as boolean
                })
            } else {
                console.error('Operación no válida o datos faltantes:', { operation, data })
                throw new Error('Operación no válida o datos faltantes')
            }
        } catch (error) {
            console.error('Error en operación CRUD:', error)
            throw error
        }
    }

    const handleDelete = async (id: string) => {
        if (!escuela?._id) {
            toast.error('Error', { description: 'No se pudo identificar la escuela' })
            return
        }

        try {
            await eliminarGrupo(id, escuela?._id)            
        } catch (error) {
            console.error('Error al eliminar grupo:', error)
            throw error
        }
    }

    return (
        <main className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Grupo</h1>
            <p className="text-muted-foreground mb-6">
                Haz clic en cualquier Grupo para ver sus detalles completos,
                editarlo o eliminarlo. Para crear un nuevo Grupo, usa el botón
                Nuevo Grupo.
            </p>

            {escuela && (
                <Card className="w-full">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Gestión de Grupos</CardTitle>
                            <Button onClick={openCreate}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nuevo Grupo
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            {grupos?.map((grupo) => (
                                <div key={grupo._id} className="flex justify-between items-center p-3 border rounded-lg">
                                    <div>
                                        <p className="font-medium">{grupo.grado} - {grupo.nombre}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Estado: {grupo.activo ? 'Activo' : 'Inactivo'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => openView({ ...grupo, _id: grupo._id })}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => openEdit({ ...grupo, _id: grupo._id })}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => openDelete({ ...grupo, _id: grupo._id })}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {grupos?.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">
                                    No hay grupos creados. Crea el primer grupo usando el botón &quot;Nuevo Grupo&quot;.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* CrudDialog */}
            <CrudDialog
                operation={operation}
                title={operation === 'create' ? 'Crear Nuevo Grupo' :
                    operation === 'edit' ? 'Editar Grupo' : 'Ver Grupo'}
                description={operation === 'create' ? 'Completa la información del nuevo grupo' :
                    operation === 'edit' ? 'Modifica la información del grupo' : 'Información del grupo'}
                schema={grupoSchema}
                defaultValues={{
                    grado: "1°",
                    nombre: "",
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
                            name="grado"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Grado</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value as string}
                                            disabled={operation === 'view'}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar grado" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1°">1°</SelectItem>
                                                <SelectItem value="2°">2°</SelectItem>
                                                <SelectItem value="3°">3°</SelectItem>
                                                <SelectItem value="4°">4°</SelectItem>
                                                <SelectItem value="5°">5°</SelectItem>
                                                <SelectItem value="6°">6°</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => {
                                // console.log('Campo nombre - field.value:', field.value)
                                // console.log('Campo nombre - operation:', operation)
                                return (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Nombre del grupo"
                                                value={field.value as string}
                                                disabled={operation === 'view'}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
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