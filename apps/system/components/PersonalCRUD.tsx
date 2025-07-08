'use client'
 
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore"
import { useEscuela } from "@/app/store/useEscuela"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@repo/ui/components/shadcn/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableRow } from "@repo/ui/components/shadcn/table"
import { useMutation, useQuery } from "convex/react"
import { Edit, Eye, Pencil, Plus, Trash2 } from "lucide-react"
import { useEffect } from "react"
import { CrudDialog, useCrudDialog } from "./ui/crud-dialog"
import { PersonalFormValues, personalSchema } from "@/app/shemas/personal"
import { toast } from "sonner"
import { PersonalForm } from "./PersonalForm"
import { UseFormReturn } from "react-hook-form"
import { Badge } from "@repo/ui/components/shadcn/badge"

type PersonalConId = PersonalFormValues & {
  _id: Id<'personal'>
}
 
export function PersonalCRUD() {
  const routerSchool = useEscuela((s) => s.escuela)
  const personal = useQuery(api.personal.obtenerPersonal, routerSchool ? {escuelaId: routerSchool?._id as Id<"escuelas">} : 'skip')
  const crearPersonal = useMutation(api.personal.crearPersonal)
  const actualizarPersonal = useMutation(api.personal.upadatePersonal)
  const eliminarPersonal = useMutation(api.personal.deletePersonal)
  const setItems = useBreadcrumbStore(state => state.setItems)
 
  useEffect(() => {
    if (routerSchool){
      setItems([
        { label: routerSchool.nombre, href: `/escuela/${encodeURIComponent(routerSchool.nombre)}` },
        { label: 'Personal', isCurrentPage: true }
      ])
    }
  }, [routerSchool, setItems])
 
  

  const {isOpen, operation, data, openCreate, openEdit, openView, openDelete, close} =
    useCrudDialog(personalSchema, {departamento: '', nombre: '', apellidos: '', email: '', telefono: '', maestro: true, fechaIngreso: '', activo: true})
  
  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!routerSchool?._id) {
      toast.error('Selecciona una escuela antes de continuar')
      return
    }

    const validatedValues = values as PersonalFormValues

    try {
      if (operation === 'create') {
        await crearPersonal({ escuelaId: routerSchool._id as Id<'escuelas'>, ...validatedValues, departamentoId: validatedValues.departamentoId as Id<"departamento">})
        toast.success('Departamento creado')
      } else if (operation === 'edit' && data?._id) {
        await actualizarPersonal({id: data._id as Id<'personal'>, ...validatedValues})
        toast.success('Departamento actualizado')
      }
      close()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error en la operación'
      toast.error(msg)
    }
  }
  
  const handleDelete = async (id: string) => {
    try {
      await eliminarPersonal({id: id as Id<'personal'>})
      toast.success('Departamento eliminado')
      close()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar'
      toast.error(msg)
    }
  }

  if (personal === undefined) {
    return <div>Cargando el Personal...</div>
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
      <Table>
        <TableCaption>Lista de personal registrado en {routerSchool?.nombre}</TableCaption>
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
              key={empleado.id._id} className="cursor-pointer hover:bg-muted/50"
              // onClick={() => handleVerEmpleado(empleado.id._id)}
            >
              <TableCell className="font-medium">{empleado.id.departamentoId}</TableCell>
              <TableCell>{empleado.id.nombre}</TableCell>
              <TableCell>{empleado.id.apellidos}</TableCell>
              <TableCell>{empleado.id.email}</TableCell>
              <TableCell>{empleado.id.telefono}</TableCell>
              <TableCell>{empleado.id.maestro ? 'Si': 'No'}</TableCell>
              <TableCell>{empleado.id.fechaIngreso}</TableCell>
              <TableCell>{empleado.id.activo ? 'Activo' : 'Inactivo'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size='icon' variant='outline' onClick={() => openView(empleado)}>
                    <Eye className="h-4 w-4"/>
                  </Button>
                  <Button size='icon' variant='outline' onClick={() => openEdit(empleado)}>
                    <Edit className="h-4 w-4"/>
                  </Button>
                  <Button size='icon' variant='outline' onClick={() => openDelete(empleado)}>
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
          operation === 'edit'
          ? `Editar empleado: ${data?.nombre}`
          : operation === 'view'
          ? `Detalle: ${(data as PersonalConId)?.nombre}`
          : 'Nuevo empleado'
        }
        description={
          operation === 'view'
          ? `Información de ${(data as PersonalConId)?.nombre}`
          : undefined
        }
        schema={personalSchema}
        data={data}
        onSubmit={handleSubmit}
        onDelete={operation === 'delete' ? handleDelete : undefined}
      >
        {(form) => (
          <>
            {
              operation == 'view' && data ? (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Información del Personal</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <span className="text-blue-600 text-sm font-medium">ID Departamento</span>
                        <div className="font-medium">{(data as PersonalConId).departamentoId}</div>
                      </div>
                      <div>
                        <span className="text-blue-600 text-sm font-medium">Nombre</span>
                        <div className="font-medium">{(data as PersonalConId).nombre}</div>
                      </div>
                      <div>
                        <span className="text-blue-600 text-sm font-medium">Apellidos</span>
                        <div className="font-medium">{(data as PersonalConId).apellidos}</div>
                      </div>
                      <div>
                        <span className="text-blue-600 text-sm font-medium">Email</span>
                        <div className="font-medium">{(data as PersonalConId).email}</div>
                      </div>
                      <div>
                        <span className="text-blue-600 text-sm font-medium">Telefono</span>
                        <div className="font-medium">{(data as PersonalConId).telefono}</div>
                      </div>
                      <div>
                        <span className="text-blue-600 text-sm font-medium">Maestos</span>
                        <div className="font-medium">
                          <Badge
                            variant='secondary'
                            className={
                              (data as PersonalConId).maestro
                              // Cambiar colores
                              ? 'bg-black text-white'
                              : 'bg-black text-white'
                            }
                          >
                            {(data as PersonalConId).maestro}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-blue-600 text-sm font-medium">Fecha de ingreso</span>
                        <div className="font-medium">{(data as PersonalConId).fechaIngreso}</div>
                      </div>
                      <div>
                        <span className="text-blue-600 text-sm font-medium">Estado</span>
                        <div className="font-medium">
                          <Badge
                            variant='secondary'
                            className={
                              (data as PersonalConId).activo
                              ? 'bg-green-800 text-white'
                              : 'bg-red-500 text-white'
                            }
                          >
                            {(data as PersonalConId).activo ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {/* Botonoes para las acciones */}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        variant='outline'
                        onClick={() => {
                          close()
                          setTimeout(() => {
                            openEdit(data as PersonalConId)
                          }, 100)
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2"/>
                        Editar
                      </Button>
                      <Button
                        variant='destructive'
                        onClick={() => {
                          close()
                          setTimeout(() => {
                            openDelete(data as PersonalConId)
                          }, 100)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2"/>
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <PersonalForm form={form as unknown as UseFormReturn<PersonalFormValues>}/>
              )
            }
          </>
        )
        }
      </CrudDialog>
    </>
  )
}