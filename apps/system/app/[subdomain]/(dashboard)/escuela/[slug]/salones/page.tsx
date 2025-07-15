'use client'

import { useEscuela } from '@/app/store/useEscuela'
import { salonSchema, SalonFormValues } from '@/app/shemas/salon'
import { CrudDialog, useCrudDialog } from '@/components/ui/crud-dialog'
import { useSalon } from '@/app/store/useSalonStore'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/components/shadcn/form'
import { Input } from '@repo/ui/components/shadcn/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@repo/ui/components/shadcn/select'
import { Button } from '@repo/ui/components/shadcn/button'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/shadcn/table'
import { toast } from 'sonner'
import PDFGenerator, { ColumnDataMap } from "@/components/pdf-generator";


export default function Page() {
  const escuela = useEscuela((s) => s.escuela)

  const {
    salones,
    crearSalon,
    actualizarSalon,
    eliminarSalon,
  } = useSalon(escuela?._id)

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
    _id: '',
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
          escuelaId: escuela._id,
          nombre: parsed.nombre,
          capacidad: parsed.capacidad,
          ubicacion: parsed.ubicacion
        })
      } else if (operation === 'edit' && data?._id) {
        await actualizarSalon({
          id: data._id as string,
          escuelaId: escuela._id as string,
          nombre: parsed.nombre,
          capacidad: parsed.capacidad,
          ubicacion: parsed.ubicacion
        })
      }
    } catch (err) {
      toast.error("Ocurrió un error al guardar")
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!escuela?._id) {
      toast.error('No se pudo identificar la escuela')
      return
    }
    try {
      await eliminarSalon(id, escuela._id)
    } catch (err) {
      toast.error("Ocurrió un error al eliminar")
      console.error(err)
    }
  }

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">Gestión de Salones</h1>
      <p className="text-muted-foreground">
        Aquí puedes ver y gestionar todos los salones disponibles en la escuela. Haz clic en cualquier salón para ver sus detalles o crear uno nuevo.
      </p>
      
      <div className="flex flex-row items-center justify-between mt-6 mb-2">
        {salones.length > 0 && (
  <div className="mb-4">
    <PDFGenerator
      schoolInfo={{
        nombre: escuela?.nombre || "Escuela",
        direccion: escuela?.direccion,
        telefono: escuela?.telefono,
        email: escuela?.email,
        logo: "O",
      }}
      tableTitle="Listado de Salones"
      tableColumns={["Nombre", "Capacidad", "Ubicación"]}
      tableData={salones}
      columnDataMap={{
        Nombre: (data) => data.nombre,
        Capacidad: (data) => data.capacidad,
        Ubicación: (data) => data.ubicacion,
      }}
      fileName="salones.pdf"
      buttonText="Exportar a PDF"
      buttonVariant="outline"
    />
  </div>
)}

        <h2 className="text-xl font-semibold">Lista de Salones</h2>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo salón
        </Button>
      </div>

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
            {salones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No hay salones registrados para esta escuela.
                </TableCell>
              </TableRow>
            ) : (
              salones.map((salon) => (
                <TableRow key={salon._id}>
                  <TableCell className="font-medium">{salon.nombre}</TableCell>
                  <TableCell>{salon.capacidad}</TableCell>
                  <TableCell>{salon.ubicacion}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => openView({ ...salon })}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEdit({ ...salon })}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => openDelete({ ...salon })}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
