'use client'

import { useBreadcrumbStore } from "@/app/store/breadcrumbStore"
import { useEscuela } from "@/app/store/useEscuelaStore"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@repo/ui/components/shadcn/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/shadcn/table"
import { Edit, Eye, Plus, Trash2 } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { CrudDialog, useCrudDialog } from "../../../../../../components/ui/crud-dialog"
import { AlumnoFormValues, alumnoSchema } from "@/app/shemas/alumno"
import { useAlumno } from "@/app/store/useAlumnoStore"
import { toast } from "sonner"
import { FormControl, FormField, FormItem, FormLabel } from "@repo/ui/components/shadcn/form"
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@repo/ui/components/shadcn/select"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Input } from "@repo/ui/components/shadcn/input"
import { Switch } from "@repo/ui/components/shadcn/switch"

export default function Page() {
  const { escuela } = useEscuela()
  const padres = useQuery(api.padres.obtenerPadres, escuela ? {escuelaId: escuela._id as Id<'escuelas'>} : 'skip')
  const grupos = useQuery(api.grupos.verTodosLosGrupos, escuela ? {escuelaId: escuela._id as Id<'escuelas'>} : 'skip')

  const {
    isOpen,
    operation,
    data,
    openCreate,
    openEdit,
    openView,
    openDelete,
    close
  } = useCrudDialog(alumnoSchema, {
    padreId: '', grupoId: '', matricula: '', nombre: '', apellidos: '', fechaNacimiento: '', telefono: '', direccion: '', activo: true
  })

  const {
    alumnos,
    isCreating: isCreatingAlumno,
    isUpdating: isUpdatingAlumno,
    isDeleting: isDeletingAlumno,
    createError: createAlumnoError,
    updateError: updateAlumnoError,
    deleteError: deleteAlumnoError,
    crearAlumno,
    actualizarAlumno,
    eliminarAlumno,
    clearErrors: clearAlumnoErrors
  } = useAlumno(escuela?._id)

  const setItems = useBreadcrumbStore(state => state.setItems)
  const params = useParams()
  const slug = typeof params?.slug === "string" ? params.slug : ""

  useEffect(() => {
    if (escuela){
      setItems([
        { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
        { label: 'Alumnos', isCurrentPage: true }
      ])
    }
  }, [escuela, setItems, slug])

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!escuela?._id){
      toast.error('Error', {description: 'No se ha encontrado la escuela.'})
    }

    const validatedValues = values as AlumnoFormValues

    try {
      if (operation === 'create') {
        await crearAlumno({
          escuelaId: escuela?._id as Id<"escuelas">,
          padreId: validatedValues.padreId as Id<"padres">,
          grupoId: validatedValues.grupoId as Id<"grupos">,
          matricula: validatedValues.matricula,
          nombre: validatedValues.nombre,
          apellidos: validatedValues.apellidos,
          fechaNacimiento: validatedValues.fechaNacimiento,
          email: validatedValues.email,
          telefono: validatedValues.telefono,
          direccion: validatedValues.direccion,
          activo: validatedValues.activo,
          updatedAt: Date.now() // Asignar la fecha actual como actualizado
        })
        toast.success('creado correctamente')
        toast.success('Alumno creado correctamente')
      } else if (operation === 'edit') {
        await actualizarAlumno({
          id: data?._id as Id<"alumnos">,
          escuelaId: escuela?._id as Id<"escuelas">,
          grupoId: validatedValues.grupoId as Id<"grupos">,
          matricula: validatedValues.matricula,
          nombre: validatedValues.nombre,
          apellidos: validatedValues.apellidos,
          fechaNacimiento: validatedValues.fechaNacimiento,
          email: validatedValues.email,
          telefono: validatedValues.telefono,
          direccion: validatedValues.direccion,
          activo: validatedValues.activo,
          updatedAt: Date.now() // Asignar la fecha actual si no se proporciona
        })
        toast.success('Alumno actualizado correctamente')
      } else {
        throw new Error('Operación no válida')
      }
      close()
    } catch(err){
      const errorMessage = err instanceof Error ? err.message : 'Error en la operación'
      toast.error(errorMessage)
    }
  }

  const handleDelete = async (id: string) => {
    try{
      await eliminarAlumno(id, escuela?._id as Id<"escuelas">)
      toast.success('Alumno eliminado correctamente')
      close()
    } catch(err){
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el alumno'
      toast.error(errorMessage)
    }
  }

  if (alumnos === undefined) {
    return <div className="text-center text-gray-600 py-8 m-auto">Cargando los Alumnos...</div>
  }

  if(!escuela){
    return (
      <div className="text-center text-red-500 py-8">
        La escuela seleccionada no existe. 
      </div>
    )
  }

  return( 
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Alumnos</h1>
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground mb-6">
          Aquí puedes ver y gestionar todos los Alumnos disponibles en la escuela.
          Haz clic en los botones para ver información más precisa, editar o eliminarlo.
          Para crear un nuevo alumno, usa el botón Nuevo Alumno.
        </p>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus />
          Nuevo Alumno
        </Button>
      </div>

      {(createAlumnoError || updateAlumnoError || deleteAlumnoError) && (
        <div>
          <div className="text-sm text-red-600">
            {createAlumnoError && <div>Error al crear alumno: {createAlumnoError}:</div>}
            {updateAlumnoError && <div>Error al actualizar alumno: {updateAlumnoError}</div>}
            {deleteAlumnoError && <div>Error al eliminar alumno: {deleteAlumnoError}</div>}
          </div>
          <Button
            onClick={clearAlumnoErrors}
            className="text-xs text-blue-500 underline mt-1"
          >
            Limpiar errores
          </Button>
        </div>
      )}

      <Table>
        <TableCaption>Lista de alumnos registrados en {escuela?.nombre}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Matricula</TableHead>
            {/* <TableHead>ID Padre/Tutor</TableHead>
            <TableHead>ID Grupo</TableHead> */}
            <TableHead>Nombre</TableHead>
            <TableHead>Apellidos</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Fecha de nacimiento</TableHead>
            <TableHead>Telefono</TableHead>
            <TableHead>Direccion</TableHead>
            <TableHead>Activo</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alumnos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                No hay Alumnos registrados
              </TableCell>
            </TableRow>
          ) : (
            alumnos.map((alumno) => (
              <TableRow
                key={alumno._id}
                className="cursor-pointer hover:bg-muted/50"
              >
                <TableCell className="font-medium">{alumno.matricula}</TableCell>
                {/* <TableCell>{alumno.padreId}</TableCell>
                <TableCell>{alumno.grupoId}</TableCell> */}
                <TableCell>{alumno.nombre}</TableCell>
                <TableCell>{alumno.apellidos}</TableCell>
                <TableCell>{alumno.email}</TableCell>
                <TableCell>{alumno.fechaNacimiento}</TableCell>
                <TableCell>{alumno.telefono}</TableCell>
                <TableCell>{alumno.direccion}</TableCell>
                <TableCell>{alumno.activo ? 'Activo' : 'Inactivo'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size='icon'
                      variant='outline'
                      onClick={(e) => {
                        e.stopPropagation()
                        openView(alumno)
                      }}
                      disabled={isUpdatingAlumno || isDeletingAlumno}
                    >
                      <Eye className="h-4 w-4"/>
                    </Button>
                    <Button
                      size='icon'
                      variant='outline'
                      onClick={(e) =>{
                        e.stopPropagation()
                        openEdit(alumno)
                      }}
                      disabled={isCreatingAlumno || isDeletingAlumno}
                    >
                      <Edit className="h-4 w-4"/>
                    </Button>
                    <Button
                      size='icon'
                      variant='outline'
                      onClick={(e) => {
                        e.stopPropagation()
                        openDelete(alumno)
                      }}
                      className="text-white bg-red-500 hover:bg-red-700 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4"/>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <CrudDialog
        isOpen={isOpen}
        operation={operation}
        title={
          operation === 'create' ? 'Crear nuevo alumno' :
          operation === 'edit' ? 'Editar alumno' : 'Ver empleado'
        }
        description={
          operation === 'create' ? 'Completa los campos para crear un nuevo alumno.' :
          operation === 'edit' ? 'Actualizar los datos del alumno.' : 'Detalles del alumno'
        }
        schema={alumnoSchema}
        defaultValues={{
          padreId: '',
          grupoId: '',
          matricula: '',
          nombre: '',
          apellidos: '',
          fechaNacimiento: '',
          email: '',
          telefono: '',
          direccion: '',
          activo: true
        }}
        data={data}
        onOpenChange={close}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isSubmitting={isCreatingAlumno || isUpdatingAlumno}
        isDeleting={isDeletingAlumno}
      >
        {(form, operation) => (
          <div className="space-y-6">
            {operation === 'edit' ? <></> :  
            <FormField
              control={form.control}
              name="padreId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Padres/Tutor</FormLabel>
                  <FormControl>
                    <Select 
                      {...field}
                      value={field.value as string}
                      disabled={operation === 'view'}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder='seleccionar Padre/Tutor'/>
                      </SelectTrigger>
                      <SelectContent>
                        {padres?.map((padre) => (
                          <SelectItem key={padre._id} value={padre._id}>
                            {padre.nombre} {padre.apellidos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />}
            <FormField
              control={form.control}
              name="grupoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grupo</FormLabel>
                  <FormControl>
                    <Select 
                      {...field}
                      value={field.value as string}
                      disabled={operation === 'view'}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder='Seleccionar un Grupo'/>
                      </SelectTrigger>
                      <SelectContent>
                        {grupos?.map((grupo) => (
                          <SelectItem key={grupo._id} value={grupo._id}>
                            {grupo.grado} {grupo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            /> 
            <FormField
              control={form.control}
              name="matricula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Matricula</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} placeholder="Matricula" value={field.value as string} disabled={operation === 'view'}
                    />
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
                    <Input type="text" {...field} placeholder="Nombre"
                    value={field.value as string} disabled={operation === 'view'}/>
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
                    <Input type="text" {...field} placeholder="Apellidos"
                    value={field.value as string} disabled={operation === 'view'}/>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fechaNacimiento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Nacimiento</FormLabel>
                  <FormControl>
                    <Input type='date' {...field} placeholder="DD/MM/AAAA"
                    value={field.value as string} disabled={operation === 'view'}/>
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
                    <Input type="email" {...field} placeholder="Correo electrónico"
                    value={field.value as string} disabled={operation === 'view'}/>
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
                    <Input type='text' {...field} placeholder="Telefono"
                    value={field.value as string} disabled={operation === 'view'}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/[^0-9]/g, '')
                      field.onChange(onlyNumbers)
                    }}
                    />
                  </FormControl>
                </FormItem>
              )}
            /> 
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input type='text' {...field} placeholder="direccion"
                    value={field.value as string} disabled={operation === 'view'}/>
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
        )}
      </CrudDialog>
    </main>
  )
}