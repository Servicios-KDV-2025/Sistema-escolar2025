'use client'

import { PersonalFormValues, personalSchema } from "@/app/shemas/personal"
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore"
import { useEscuela } from "@/app/store/useEscuela"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@repo/ui/components/shadcn/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card"
import { useMutation, useQuery } from "convex/react"
import { ArrowLeft } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select"

export default function EditarPersonal ({params}: {params: Promise<{id: string}>}) {
  const {id} = use(params)
  const idPersonal = id as Id<"personal">
  const router = useRouter()
  const actualizarPersonal = useMutation(api.personal.upadatePersonal)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const setItems = useBreadcrumbStore(state => state.setItems)
  const escuela = useEscuela((s) => s.escuela)
  const empleado = useQuery(api.personal.PersonalById, { id: idPersonal, esculaId: escuela?._id as Id<"escuelas"> })
  const allParams = useParams()
  const slug = typeof allParams?.slug === "string" ? allParams.slug : ""

  const form = useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      nombre: "",
      apellidos: "",
      email: "",
      telefono: undefined,
      puesto: "",
      fechaIngreso: undefined,
      activo: true
    }
  })

  useEffect(() => {
    if (empleado) {
      form.reset({
        nombre: empleado.nombre,
        apellidos: empleado.apellidos,
        email: empleado.email,
        telefono: empleado.telefono,
        puesto: empleado.puesto,
        fechaIngreso: empleado.fechaIngreso,
      })
    }
  }, [empleado, form])

  useEffect(() => {
    if (empleado) {
      setItems([
        { label: `${escuela?.nombre}`, href: '/' },
        { label: 'Personal', href: '/personal' },
        { label: `${empleado?.nombre}`, href: `/personal/${empleado._id}` },
        { label: 'Editar', isCurrentPage: true }
      ])
    }
  }, [setItems, escuela, empleado])

  const onSubmit = async (values: PersonalFormValues) => {
    try {
      setIsSubmitting(true)
      await actualizarPersonal({
        id: idPersonal,
        escuelaId: escuela?._id as Id<"escuelas">,
        nombre: values.nombre,
        apellidos: values.apellidos,
        email: values.email,
        telefono: values.telefono,
        puesto: values.puesto,
        fechaIngreso: values.fechaIngreso,
        activo: values.activo
      })
      toast.success("Empleado actualizado", { description: "El empleado se ha actualizado correctamente" })
      router.push(`/escuela/${slug}/personal`)
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al guardar empleado"
      })
      console.error(error)
    } finally{
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Button variant='outline' size='icon' onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4"/>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Editar Empleado
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
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} placeholder="Nombre"/>
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
                        <Input type="text" {...field} placeholder="Apellidos"/>
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
                        <Input type="email" {...field} placeholder="Correo electrónico"/>
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
                        <Input type='number' {...field} placeholder="Telefono"/>
                      </FormControl>
                    </FormItem>
                  )}
                /> 
                <FormField
                  control={form.control}
                  name="puesto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Puesto</FormLabel>
                      <FormControl>
                        <Input type='text' {...field} placeholder="Maestro"/>
                      </FormControl>
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
                        <Input type='text' {...field} placeholder="AAAA"/>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="activo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activo</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === "true")}
                        value={field.value ? "true" : "false"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Cambiar estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Activo</SelectItem>
                          <SelectItem value="false">No activo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
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
                {isSubmitting ? "Actualizando..." : "Guardar Cambios"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}