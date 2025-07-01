'use client'

import { useEscuela } from "@/app/store/useEscuela"
import { api } from "@/convex/_generated/api"
import { useMutation, useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { alumnoSchema, AlumnoFormValues } from "@/app/shemas/alumno"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore"
import { Id } from "@/convex/_generated/dataModel"
import { grupoPorId } from "@/convex/grupos"
import { toast } from "sonner"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@repo/ui/components/shadcn/form"
import { Input } from "@repo/ui/components/shadcn/input"
import { Button } from "@repo/ui/components/shadcn/button"

export default function CrearAlumnoPage () {
  const router = useRouter()
  const escuela = useEscuela((s) => s.escuela)
  const crearAlumno = useMutation(api.alumnos.crearAlumno)
  const grupos = useQuery(api.grupos.verTodosLosGrupos, {escuelaId: escuela?._id as Id<"escuelas">});

  const form = useForm<AlumnoFormValues>({
    resolver: zodResolver(alumnoSchema),
    defaultValues: {
      matricula: "",
      nombre: "",
      apellidos: "",
      fechaNacimiento: "",
      email: "",
      telefono: undefined,
      direccion: "",
      activo: true
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const setItems = useBreadcrumbStore(state => state.setItems)

  useEffect(() => {
    setItems([
      { label: `${escuela?.nombre}`, href: '/' },
      { label: 'Alumnos', href: '/alumnos' },
      { label: 'Crear Alumno', isCurrentPage: true }
    ])
  }, [setItems, escuela])

  const onSubmit = async (values: AlumnoFormValues) => {
    try {
      setIsSubmitting(true)
      await crearAlumno({
        escuelaId: escuela?._id as Id<"escuelas">,
        padreId: padres as Id<"padres">,
        grupoId: grupos as Id<"grupos">,
        matricula: values.matricula,
        nombre: values.nombre,
        apellidos: values.apellidos,
        fechaNacimiento: values.fechaNacimiento,
        email: values.email,
        telefono: values.telefono,
        direccion: values.direccion,
        activo: values.activo
      })
      toast.success("Alumno creado", { description: "El alumno se a creado correctamente" })
      router.back()
    } catch (error) {
      toast.error("Error", {
        description: "Ocurrió un error al guardar el alumno"
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
            Crear Nuevo Alumno
          </h1>
        </div>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-semibold text-center">Información del Alumno</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardContent className="grid grid-cols-1 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="matricula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matricula</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} placeholder="Matricula"/>
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
                  name="fechaNacimiento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} placeholder="DD/MM/AAAA"/>
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
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input type='text' {...field} placeholder="direccion"/>
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
                {isSubmitting ? "Creando..." : "Crear Alumno"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}