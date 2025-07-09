'use client'
 
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore"
import { useEscuela } from "@/app/store/useEscuelaStore"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@repo/ui/components/shadcn/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableRow } from "@repo/ui/components/shadcn/table"
import { Edit, Eye, Plus, Trash2 } from "lucide-react"
import { useEffect } from "react"
import { CrudDialog, useCrudDialog } from "./ui/crud-dialog"
import { PersonalFormValues, personalSchema } from "@/app/shemas/personal"
import { toast } from "sonner"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useParams } from "next/navigation"
import { usePersonal } from "@/app/store/usePersonalStore"
import { FormControl, FormField, FormItem, FormLabel } from "@repo/ui/components/shadcn/form";
import { Select } from "@repo/ui/components/shadcn/select"
import { Input } from "@repo/ui/components/shadcn/input"
import { Switch } from "@repo/ui/components/shadcn/switch"

export function PersonalCRUD() {

  const {isOpen, operation, data, openCreate, openEdit, openView, openDelete, close} =
    useCrudDialog(personalSchema, {departamento: '', nombre: '', apellidos: '', email: '', telefono: '', maestro: true, fechaIngreso: '', activo: true})
  
  const { escuela } = useEscuela()
  const departamentos = useQuery(api.departamento.obtenerDepartamentos, escuela ? {escuelaId: escuela._id as Id<'escuelas'>} : 'skip')

  const {
    personal,
    isCreating: isCreatingPersonal,
    isUpdating: isUpdatingPersonal,
    isDeleting: isDeletingPersonal,
    createError: createPersonalError,
    updateError: updatePersonalError,
    deleteError: deletePersonalError,
    crearPersonal,
    actualizarPersonal,
    eliminarPersonal,
    clearErrors: clearPersonalErrors
  } = usePersonal(escuela?._id)
  
  const setItems = useBreadcrumbStore(state => state.setItems)
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : ''

  useEffect(() => {
    if (escuela){
      setItems([
        { label: escuela.nombre, href: `/escuela/${slug}` },
        { label: 'Personal', isCurrentPage: true }
      ])
    }
  }, [escuela, setItems, slug])
 
  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!escuela?._id) {
      toast.error('Error', { description: 'No se ha seleccionado una escuela' })
      return
    }

    const validatedValues = values as PersonalFormValues

    try {
      if (operation === 'create') {
        await crearPersonal({
          escuelaId: escuela._id as Id<'escuelas'>,
          departamentoId: validatedValues.departamentoId as Id<"departamento">,
          nombre: validatedValues.nombre as string,
          apellidos: validatedValues.apellidos as string,
          email: validatedValues.email as string | undefined,
          telefono: validatedValues.telefono as string | undefined,
          maestro: validatedValues.maestro as boolean,
          fechaIngreso: validatedValues.fechaIngreso as string,
          activo: validatedValues.activo as boolean,
        })
        toast.success('Departamento creado')
      } else if (operation === 'edit' && data?._id) {
        await actualizarPersonal({
          id: data._id,
          escuelaId: escuela._id,
          departamentoId: validatedValues.departamentoId as Id<'departamento'>,
          nombre: validatedValues.nombre as string,
          apellidos: validatedValues.apellidos as string,
          email: validatedValues.email as string | undefined,
          telefono: validatedValues.telefono as string | undefined,
          maestro: validatedValues.maestro as boolean,
          fechaIngreso: validatedValues.fechaIngreso as string,
          activo: validatedValues.activo as boolean,
        })
        toast.success('Departamento actualizado')
      } else {
        throw new Error('Operación no válida')
      }
      close()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error en la operación'
      toast.error(msg)
    }
  }
  
  const handleDelete = async (id: string) => {
    try {
      await eliminarPersonal(id)
      toast.success('Departamento eliminado')
      close()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar'
      toast.error(msg)
    }
  }

  if (personal === undefined) {
    return <div className="text-center text-gray-600 py-8">Cargando el Personal...</div>
  }

  if (!escuela) {
    return (
      <div className="text-center text-red-500 py-8">
        Por favor, selecciona una escuela para ver el personal.
      </div>
    )
  }

  return(
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Personal</h2>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus />
          Nuevo Empleado
        </Button>
      </div>

      {(createPersonalError || updatePersonalError || deletePersonalError) && (
        <div className="text-sm text-red-600">
          {createPersonalError && <div>Error al crear materia: {createPersonalError}</div>}
          {updatePersonalError && <div>Error al actualizar materia: {updatePersonalError}</div>}
          {deletePersonalError && <div>Error al eliminar materia: {deletePersonalError}</div>}
        </div>
      )}

      <Table>
        <TableCaption>Lista de personal registrado en {escuela?.nombre}</TableCaption>
        <TableHead>
          <TableRow>
            <TableHead>ID Departamento</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellidos</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefono</TableHead>
            <TableHead>Maestro</TableHead>
            <TableHead>Fecha de Ingreso</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHead>
        <TableBody>
          {personal.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No hay Personal registrados
              </TableCell>
            </TableRow>
          )}
          {personal.map((empleado) => (
            <TableRow
              key={empleado._id} className="cursor-pointer hover:bg-muted/50"
              // onClick={() => handleVerEmpleado(empleado.id._id)}
            >
              <TableCell className="font-medium">{empleado.departamentoId}</TableCell>
              <TableCell>{empleado.nombre}</TableCell>
              <TableCell>{empleado.apellidos}</TableCell>
              <TableCell>{empleado.email}</TableCell>
              <TableCell>{empleado.telefono}</TableCell>
              <TableCell>{empleado.maestro ? 'Si': 'No'}</TableCell>
              <TableCell>{empleado.fechaIngreso}</TableCell>
              <TableCell>{empleado.activo ? 'Activo' : 'Inactivo'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    size='icon' variant='outline' 
                    onClick={(e) => {
                      e.stopPropagation()
                      openView(empleado)
                    }}
                    disabled={isUpdatingPersonal || isDeletingPersonal}
                  >
                    <Eye className="h-4 w-4"/>
                  </Button>
                  <Button 
                    size='icon' variant='outline' 
                    onClick={(e) => {
                      e.stopPropagation()
                      openEdit(empleado)
                    }}
                    disabled={isUpdatingPersonal || isDeletingPersonal}
                  >
                    <Edit className="h-4 w-4"/>
                  </Button>
                  <Button 
                    size='icon' variant='outline' 
                    onClick={(e) => {
                      e.stopPropagation()
                      openDelete(empleado)
                    }}
                  >
                    <Trash2 className="h-4 w-4"/>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CrudDialog
        isOpen={isOpen}
        operation={operation}
        title={
          operation === 'create'
          ? 'Crear nuevo empleado'
          : operation === 'edit'
          ? 'Editar empleado'
          : 'Ver empleado'
        }
        description={
          operation === 'create'
          ? 'Completa la información del nuevo empleado'
          : operation === 'edit'
          ? 'Edita la información del empleado'
          : 'Información del empleado seleccionado'
        }
        schema={personalSchema}
        defaultValues={{
          departamentoId: data?.departamentoId || '',
          nombre: data?.nombre || '',
          apellidos: data?.apellidos || '',
          email: data?.email || '',
          telefono: data?.telefono || '',
          maestro: data?.maestro ?? true,
          fechaIngreso: data?.fechaIngreso || '',
          activo: data?.activo ?? true,
        }}
        data={data}
        onOpenChange={close}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isSubmitting={isCreatingPersonal || isUpdatingPersonal}
        isDeleting={isDeletingPersonal}
      >
        {(form, operation) => (
          <>
            {/* <PersonalForm form={form as unknown as UseFormReturn<PersonalFormValues>}/> */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="departamentoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departamento</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value as string}
                        disabled={operation === 'view'}
                        onValueChange={field.onChange}
                      >
                        <option value="">Seleccionar departamento</option>
                        {departamentos?.map((departamento) => (
                          <option key={departamento._id} value={departamento._id}>
                            {departamento.nombre}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} placeholder="Nombre" value={field.value as string} disabled={operation === 'view'} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apellidos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellidos</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} placeholder="Apellidos" value={field.value as string} disabled={operation === 'view'}/>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} placeholder="Correo electrónico" value={field.value as string} disabled={operation === 'view'}/>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numero de telefono</FormLabel>
                    <FormControl>
                      <Input type='number' {...field} placeholder="Telefono" value={field.value as string} disabled={operation === 'view'}/>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maestro"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value as boolean}
                        onChange={field.onChange}
                        disabled={operation === 'view'}
                        className="mt-1 h-4 w-4"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">
                        ¿Es maestro?
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Marca si este empleado será maestro.
                      </p>
                    </div>
                  </FormItem>
                )}
              /> 
              <FormField
                control={form.control}
                name="fechaIngreso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de ingreso</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} value={field.value as string} disabled={operation === 'view'}/>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Estado Activo</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Determina si el empleado está activo o inactivo
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value as boolean}
                        onCheckedChange={(val) => field.onChange(val)}
                        disabled={operation === 'view'}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </>
        )
        }
      </CrudDialog>
    </>
  )
}