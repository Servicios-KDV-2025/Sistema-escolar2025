"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/shadcn/table";
import { Button } from "@repo/ui/components/shadcn/button";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";
import { Input } from "@/components/ui/input";
import { CrudDialog, useCrudDialog } from "@/components/ui/crud-dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";
import { useCicloEscolar } from "@/app/store/useCicloEscolarStore";
import { calendarioSchema } from "@/app/shemas/calendario";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function CiclosEscolaresPage() {
  const router = useRouter();
  //const escuela = useEscuela((s) => s.escuela);
  // const ciclosEscolares = useQuery(
  //   api.ciclosEscolares.obtenerCiclosEscolares,
  //   escuela ? { escuelaId: escuela._id as Id<"escuelas"> } : "skip"
  // );
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const setItems = useBreadcrumbStore(state => state.setItems)
  const { user } = useUser()
  const {
    escuela
  } = useEscuela()
  useEffect(() => {
    if (escuela) {
      setItems([
        { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
        { label: 'Ciclos Escolares', isCurrentPage: true },
      ])
    }
  }, [escuela, setItems, slug])





  // Ejemplo de CRUD para ciclos escolares
  const {
    ciclosEscolares,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError,
    crearCicloEscolar,
    actualizarCicloEscolar,
    eliminarCicloEscolar,
    clearErrors: clearErrors,
  } = useCicloEscolar(escuela?._id)

  const {
    isOpen,
    operation,
    data,
    openCreate,
    openEdit,
    openView,
    openDelete,
    close
  } = useCrudDialog(calendarioSchema, {
    nombre: "",
    fechaInicio: "",
    fechaFin: "",
    activo: true
  })

  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log("Entro1")
    if (!escuela?._id) {
      toast.error('Error', { description: 'No se pudo identificar la escuela' })
      return
    }
    console.log("Entro")
    try {
      if (operation === 'create') {
        console.log("crear")
        await crearCicloEscolar({
          escuelaId: escuela._id,
          nombre: values.nombre as string,
          fechaInicio: new Date(values.fechaInicio as number).getTime(),
          fechaFin: new Date(values.fechaFin as number).getTime()
        })
      } else if (operation === 'edit' && data?._id) {
        console.log("editar")
        await actualizarCicloEscolar({
          id: data._id,
          escuelaId: escuela._id,
          nombre: values.nombre as string,
          fechaInicio: new Date(values.fechaInicio as number).getTime(),
          fechaFin: new Date(values.fechaFin as number).getTime(),
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

  const handleVerCicloEscolar = (id: string) => {
    router.push(`/escuela/${slug}/ciclosEscolares` + `/${id}`);
  };

  if (ciclosEscolares === undefined) {
    return <div>Cargando los Ciclos Escolares...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Sistema de Ciclos Escolares</h1>
      <p className="text-muted-foreground mb-6">
        Haz clic en cualquier ciclo escolar para ver sus detalles completos,
        editarlo o eliminarlo. Para crear una nueva ciclo escolar, usa el botón
        Nueva Ciclo Escolar.
      </p>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Ciclos Escolares</h2>
        <Button onClick={openCreate} disabled={isCreating} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Ciclo Escolar
        </Button>
      </div>

      <Table>
        <TableCaption>Lista de ciclosEscolares registrados</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nombre</TableHead>
            <TableHead>Fecha Inicio</TableHead>
            <TableHead>Fecha Fin</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ciclosEscolares.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No hay ciclosEscolares registrados
              </TableCell>
            </TableRow>
          ) : (
            ciclosEscolares.map((cicloEscolar) => (
              <TableRow key={cicloEscolar._id}>
                <TableCell className="font-medium">
                  {cicloEscolar.nombre}
                </TableCell>
                <TableCell>{new Date(cicloEscolar.fechaInicio).toISOString().split("T")[0]}</TableCell>
                <TableCell>{new Date(cicloEscolar.fechaFin).toISOString().split("T")[0]}</TableCell>
                <TableCell>{cicloEscolar.activo ? "Activo" : "Inactivo"}</TableCell>
                <TableCell>
                  {(createError || updateError || deleteError) && (
                    <div className="mb-2 text-sm text-red-500">
                      {createError && <div>Error al crear cicloEscolar: {createError}</div>}
                      {updateError && <div>Error al actualizar : {updateError}</div>}
                      {deleteError && <div>Error al eliminar : {deleteError}</div>}
                      <button onClick={clearErrors} className="text-xs text-blue-500 underline">Limpiar errores</button>
                    </div>
                  )}
                  <div className="flex gap-4">
                    {ciclosEscolares?.map((cicloEscolar) => (
                      <div key={cicloEscolar._id} >
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleVerCicloEscolar(cicloEscolar._id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        openEdit(cicloEscolar);
                      }} disabled={isUpdating}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => openDelete(cicloEscolar)} disabled={isDeleting}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {ciclosEscolares?.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No hay ciclos escolares creados. Crea el primer ciclo escolar usando el botón &quot;Nuevo &quot;.
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <CrudDialog
        operation={operation}
        title={operation === 'create' ? 'Crear Nuevo Ciclo Escolar' :
          operation === 'edit' ? 'Editar Ciclo Escolar' : 'Ver Ciclo Escolar'}
        description={operation === 'create' ? 'Completa la información del nuevo ciclo escolar' :
          operation === 'edit' ? 'Modifica la información del ciclo escolar' : 'Información del ciclo escolar'}
        schema={calendarioSchema}
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
                    <Input type="date" disabled={operation === 'view'} {...field}
                      value={
                        field.value
                          ? new Date(field.value as string).toISOString().split("T")[0]
                          : ''
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))} />
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
                    <Input type="date" disabled={operation === 'view'} {...field}
                      value={
                        field.value
                          ? new Date(field.value as string).toISOString().split("T")[0]
                          : ''
                      }
                      onChange={(e) => field.onChange(new Date(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
        )}
      </CrudDialog>
    </div>
  );
}