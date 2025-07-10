'use client'

import { useEscuela } from '@/app/store/useEscuela'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { toast } from 'sonner'
import { salonSchema, SalonFormValues } from '@/app/shemas/salon'
import { CrudDialog, useCrudDialog } from '@/components/ui/crud-dialog'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@repo/ui/components/shadcn/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@repo/ui/components/shadcn/form'
import { Input } from '@repo/ui/components/shadcn/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@repo/ui/components/shadcn/select'
import { Button } from '@repo/ui/components/shadcn/button'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/shadcn/table'

export default function Page() {
  const escuela = useEscuela((s) => s.escuela)

  const crearSalon = useMutation(api.salones.crearSalon)
  const actualizarSalon = useMutation(api.salones.actualizarSalon)
  const eliminarSalon = useMutation(api.salones.eliminarSalon)
  const salones = useQuery(
    api.salones.obtenerSalones,
    escuela ? { escuelaId: escuela._id as Id<'escuelas'> } : 'skip'
  )

  const {
    isOpen,
    operation,
    data,
    openCreate,
    openEdit,
    openView,
    openDelete,
    close
  } = useCrudDialog(salonSchema, {
    nombre: '',
    capacidad: 1,
    ubicacion: 'Planta baja'
  })

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (!escuela?._id) {
      toast.error('No se pudo identificar la escuela')
      return
    }

    let parsed: SalonFormValues
    try {
      parsed = salonSchema.parse(data)
    } catch (err) {
      toast.error("Error en el formulario")
      console.error(err)
      return
    }

    try {
      if (operation === 'create') {
        await crearSalon({
          escuelaId: escuela._id as Id<'escuelas'>,
          nombre: parsed.nombre,
          capacidad: parsed.capacidad,
          ubicacion: parsed.ubicacion
        })
      } else if (operation === 'edit' && data?._id) {
        console.log('Actualizando salón', data._id)
        await actualizarSalon({
          salonId: data._id as Id<'salones'>,
          escuelaId: escuela._id as Id<'escuelas'>,
          nombre: parsed.nombre,
          capacidad: parsed.capacidad,
          ubicacion: parsed.ubicacion
        })
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  const handleDelete = async (id: string) => {
    if (!escuela?._id) {
      toast.error('No se pudo identificar la escuela')
      return
    }

    try {
      await eliminarSalon({
        salonId: id as Id<'salones'>,
        escuelaId: escuela._id as Id<'escuelas'>
      })
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Salones</CardTitle>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo salón
          </Button>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Nombre</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salones?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No hay salones registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  salones?.map((salon) => (
                    <TableRow key={salon._id}>
                      <TableCell className="font-medium">{salon.nombre}</TableCell>
                      <TableCell>{salon.capacidad}</TableCell>
                      <TableCell>{salon.ubicacion}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openView({ ...salon })}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit({ ...salon })}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDelete({ ...salon })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

      </Card>

      <CrudDialog
        operation={operation}
        title={
          operation === 'create'
            ? 'Nuevo salón'
            : operation === 'edit'
              ? 'Editar salón'
              : 'Ver salón'
        }
        description="Formulario para gestionar salones escolares."
        schema={salonSchema}
        defaultValues={{
          nombre: '',
          capacidad: 1,
          ubicacion: 'Planta baja'
        }}
        data={data}
        isOpen={isOpen}
        onOpenChange={close}
        onSubmit={handleSubmit}
        onDelete={(data && data._id && handleDelete) || undefined}
      >
        {(form, operation) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del salón</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value as string}
                      disabled={operation === 'view'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona nombre" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A", "B", "C", "D", "E", "F", "G", "H", "I"].map((letra) => (
                          <SelectItem key={letra} value={letra}>
                            {`Salón ${letra}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidad</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value as number}
                      disabled={operation === 'view'}
                      placeholder="30"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ubicacion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value as string}
                      disabled={operation === 'view'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona ubicación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planta baja">Planta baja</SelectItem>
                        <SelectItem value="Primer piso">Primer piso</SelectItem>
                        <SelectItem value="Segundo piso">Segundo piso</SelectItem>
                        <SelectItem value="Tercer piso">Tercer piso</SelectItem>
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
    </div>
  )
}
