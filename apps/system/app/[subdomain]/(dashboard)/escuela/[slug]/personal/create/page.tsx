'use client'
 
import { useEscuela } from "@/app/store/useEscuela"
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { personalSchema, PersonalFormValues } from "@/app/shemas/personal"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore"
import { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@repo/ui/components/shadcn/form"
import { Input } from "@repo/ui/components/shadcn/input"
import { Button } from "@repo/ui/components/shadcn/button"
import { Select } from "@repo/ui/components/shadcn/select"
 
export default function CrearPersonalPage() {
  const router = useRouter()
  const escuela = useEscuela((s) => s.escuela)
  const crearPersonal = useMutation(api.personal.crearPersonal)
  const departamentos = useQuery(api.departamento.obtenerDepartamentos, { escuelaId: escuela?._id as Id<"escuelas"> })
 
  const form = useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      departamentoId: "",
      nombre: "",
      apellidos: "",
      email: "",
      telefono: undefined,
      maestro: false,
      fechaIngreso: undefined,
      activo: true
    }
  })
 
  const [isSubmitting, setIsSubmitting] = useState(false)
  const setItems = useBreadcrumbStore(state => state.setItems)
 
  useEffect(() => {
    setItems([
      { label: `${escuela?.nombre}`, href: '/' },
      { label: 'Personal', href: '/empleado' },
      { label: 'Crear Empleado', isCurrentPage: true }
    ])
  }, [setItems, escuela])
 
  const onSubmit = async (values: PersonalFormValues) => {
    try {
      setIsSubmitting(true)
      await crearPersonal({
        escuelaId: escuela?._id as Id<"escuelas">,
        departamentoId: values.departamentoId as Id<"departamento">,
        nombre: values.nombre,
        apellidos: values.apellidos,
        email: values.email,
        telefono: values.telefono,
        fechaIngreso: new Date(values.fechaIngreso).getTime(),
        maestro: values.maestro,
        activo: values.activo
      })
      toast.success("Empleado creado", { description: "El empleado se a creado correctamente" })
      router.back()
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al guardar el empleado"
      })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }
 
  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Crear Nuevo Empleado
          </h1>
        </div>
      </div>
 
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-semibold text-center">Información del Empleado</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardContent className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="departamentoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Padres/Tutor</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                        >
                          <option value="">Seleccionar Padres o Tutor</option>
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
                        <Input type="text" {...field} placeholder="Nombre" />
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
                        <Input type="text" {...field} placeholder="Apellidos" />
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
                        <Input type="email" {...field} placeholder="Correo electrónico" />
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
                        <Input type='number' {...field} placeholder="Telefono" />
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
                          checked={field.value}
                          onChange={field.onChange}
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
                        <Input type='date' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Creando..." : "Crear Personal"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}