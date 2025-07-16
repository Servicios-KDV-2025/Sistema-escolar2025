"use client"

import { useState } from "react"
import { Plus, Search, Eye, Edit, Trash2, School } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@repo/ui/components/shadcn/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/shadcn/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/shadcn/tabs"
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore"
import { useEscuela } from "@/app/store/useEscuelaStore"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { CrudDialog, useCrudDialog } from "@/components/dialog/crud-dialog"
import { ClasePorAlumnoFormValues, clasePorAlumnoSchema } from "@/app/shemas/clasePorAlumno"
import { FormControl, FormField, FormItem, FormLabel } from "@repo/ui/components/shadcn/form"
import { Switch } from "@repo/ui/components/shadcn/switch"
import { ClasesPorAlumnos } from "@/app/types/clasesPorAlumnos"
import Link from "next/link"
import { parseConvexErrorMessage } from "@/lib/parseConvexErrorMessage"

export default function StudentClassesDashboard() {
  const { escuela } = useEscuela()
  const params = useParams()
  const slug = typeof params?.slug === "string" ? params.slug : ""

  const setItems = useBreadcrumbStore(state => state.setItems)

  const alumnos = useQuery(api.alumnos.obtenerAlumnos, escuela ? { escuelaId: escuela._id as Id<'escuelas'> } : 'skip')
  const catalogosClases = useQuery(api.catalogosDeClases.getCatalogoDeClasesConNombres, escuela ? { escuelaId: escuela._id as Id<'escuelas'> } : 'skip')
  const ciclosEscolares = useQuery(api.ciclosEscolares.obtenerCiclosEscolares, escuela ? { escuelaId: escuela._id as Id<'escuelas'> } : 'skip')
  const inscripciones = useQuery(
    api.clasesPorAlumno.obtenerClasesPorAlumno,
    escuela?._id ? { escuelaId: escuela._id as Id<'escuelas'> } : 'skip'
  )
  const estadisticas = useQuery(
    api.clasesPorAlumno.obtenerEstadisticasInscripciones,
    escuela?._id ? { escuelaId: escuela._id as Id<'escuelas'> } : 'skip'
  )
  const crearInscripcion = useMutation(api.clasesPorAlumno.crearClasePorAlumno)
  const actualizarInscripcion = useMutation(api.clasesPorAlumno.actualizarClasePorAlumno)
  const eliminarInscripcion = useMutation(api.clasesPorAlumno.eliminarClasePorAlumno)


  const [searchTerm, setSearchTerm] = useState("")
  const [filtroCicloEscolar, setFiltroCicloEscolar] = useState<string>("all")
  const [filterGrado, setFilterGrado] = useState<string>("all")
  const [filterGrupo, setFilterGrupo] = useState<string>("all")
  const [filterEstado, setFilterEstado] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("inscripciones")

  const {
    isOpen,
    operation,
    data,
    openCreate,
    openEdit,
    openView,
    openDelete,
    close
  } = useCrudDialog(clasePorAlumnoSchema, {
    _id: '',
    catalogoClaseId: '',
    alumnoId: '',
    fechaInscripcion: new Date().toISOString().split("T")[0],
    activo: true
  })

  useEffect(() => {
    setFiltroCicloEscolar(ciclosEscolares?.[ciclosEscolares.length - 1]?.nombre || "all")
    if (escuela) {
      setItems([
        { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
        { label: 'Clases por Alumno', isCurrentPage: true }
      ])
    }
  }, [escuela, setItems, slug, ciclosEscolares])

  const filteredInscripciones = (inscripciones?.filter(Boolean) || []).filter((inscripcion) => {
    const matchesSearch =
      inscripcion?.alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscripcion?.alumno.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscripcion?.alumno.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inscripcion?.catalogoClase.materia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inscripcion?.catalogoClase.nombre?.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCicloEscolar = filtroCicloEscolar === "all" || inscripcion?.cicloEscolar?.nombre?.startsWith(filtroCicloEscolar)
    const matchesGrado = filterGrado === "all" || inscripcion?.catalogoClase?.grado?.startsWith(filterGrado)
    const matchesGrupo = filterGrupo === "all" || inscripcion?.catalogoClase?.grupo?.startsWith(filterGrupo)
    const matchesEstado = filterEstado === "all" ||
      (filterEstado === "activo" && inscripcion?.activo) ||
      (filterEstado === "inactiva" && !inscripcion?.activo)

    return matchesSearch && matchesGrado && matchesEstado && matchesGrupo && matchesCicloEscolar
  })

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!escuela?._id) {
      toast.error('Error', { description: 'No se ha encontrado la escuela.' })
      return
    }

    const validatedValues = values as ClasePorAlumnoFormValues

    try {
      if (operation === 'create') {
        await crearInscripcion({
          escuelaId: escuela._id as Id<"escuelas">,
          catalogoClaseId: validatedValues.catalogoClaseId as Id<"catalogosDeClases">,
          alumnoId: validatedValues.alumnoId as Id<"alumnos">,
          cicloEscolarId: validatedValues.cicloEscolarId as Id<"ciclosEscolares">,
          fechaInscripcion: new Date(validatedValues.fechaInscripcion).getTime(),
          activo: validatedValues.activo
        })
        toast.success("Creado correctamente")
      } else if (operation === 'edit') {
        await actualizarInscripcion({
          _id: validatedValues._id as Id<"clasesPorAlumno">,
          escuelaId: escuela._id as Id<"escuelas">,
          catalogoClaseId: validatedValues.catalogoClaseId as Id<"catalogosDeClases">,
          alumnoId: validatedValues.alumnoId as Id<"alumnos">,
          cicloEscolarId: validatedValues.cicloEscolarId as Id<"ciclosEscolares">,
          fechaInscripcion: new Date(validatedValues.fechaInscripcion as string).getTime(),
          activo: validatedValues.activo
        })
        toast.success("Actualizado correctamente")
      } else {
        throw new Error('Operación no válida')
      }
      close()
    } catch (err) {
      const cleanMessage = parseConvexErrorMessage(err)
      toast.error("Error", { description: cleanMessage })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await eliminarInscripcion({ id: id as Id<"clasesPorAlumno">, escuelaId: escuela?._id as Id<"escuelas"> })
      toast.success('Eliminado correctamente')
      close()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la inscripción'
      toast.error(errorMessage)
    }
  }

  function mapInscripcionToFormValues(inscripcion: ClasesPorAlumnos) {
    return {
      _id: inscripcion._id,
      alumnoId: inscripcion.alumno?._id || "",
      cicloEscolarId: inscripcion.cicloEscolar?._id || "",
      catalogoClaseId: inscripcion.catalogoClase?._id || "",
      fechaInscripcion: inscripcion.fechaInscripcion
        ? new Date(inscripcion.fechaInscripcion).toISOString().split("T")[0]
        : "",
      activo: inscripcion.activo ?? true,
    }
  }

  if (inscripciones === undefined) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-gray-600 py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          Cargando las inscripciones...
        </div>
      </div>
    )
  }

  if (!escuela) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-500 py-8">
          La escuela seleccionada no existe.
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Clases por Alumno</h1>
              <p className="text-sm sm:text-base text-gray-600">
                <strong>Gestión completa de inscripciones de alumnos a clases.</strong>
              </p>
            </div>

          </div>
          <div className="hidden sm:block">
            <p className="text-sm text-gray-600">
              Visualiza todas las relaciones registradas, aplica filtros avanzados y accede a información detallada por alumno.
              Permite editar o eliminar inscripciones, generar reportes personalizados y exportar datos en múltiples formatos.
              Ideal para un control académico claro, eficiente y centralizado.
            </p>
          </div>
        </div>
        <div className="flex justify-end items-center  gap-2 mb-6">
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Inscripción
          </Button>
          <Link href={`/escuela/${slug}/clasesPorAlumnos/assignacion-masiva`}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Asignar Clases Masivamente
            </Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="inscripciones" className="text-xs sm:text-sm">
              Inscripciones
            </TabsTrigger>
            <TabsTrigger value="reportes" className="text-xs sm:text-sm">
              Reportes
            </TabsTrigger>
          </TabsList>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col xl:flex-row space-y-4 gap-2">
                <div className="flex-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por alumno, matrícula o materia..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-1 flex-col xl:flex-row gap-3">
                  <div className="flex flex-1 flex-col sm:flex-row gap-3 justify-center">
                    <Select value={filtroCicloEscolar} onValueChange={setFiltroCicloEscolar}>
                      <SelectTrigger className="w-full sm:w-40">
                        <School className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filtrar por ciclo escolar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los ciclos Escolares</SelectItem>
                        {ciclosEscolares?.map((ciclo) => (
                          <SelectItem key={ciclo.nombre} value={ciclo.nombre}>
                            {ciclo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterGrado} onValueChange={setFilterGrado}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Filtrar por grado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los grados</SelectItem>
                        <SelectItem value="1">1° Grado</SelectItem>
                        <SelectItem value="2">2° Grado</SelectItem>
                        <SelectItem value="3">3° Grado</SelectItem>
                        <SelectItem value="4">4° Grado</SelectItem>
                        <SelectItem value="5">5° Grado</SelectItem>
                        <SelectItem value="6">6° Grado</SelectItem>
                      </SelectContent>
                    </Select>


                  </div>
                  <div className="flex flex-1 flex-col sm:flex-row gap-3 justify-center">
                    <Select value={filterGrupo} onValueChange={setFilterGrupo}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Filtrar por grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los grupos</SelectItem>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                        <SelectItem value="E">E</SelectItem>
                        <SelectItem value="F">F</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterEstado} onValueChange={setFilterEstado}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="inactiva">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          <TabsContent value="inscripciones" className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <CardTitle className="text-lg sm:text-xl">Lista de Inscripciones</CardTitle>
                    <CardDescription className="text-sm">
                      Mostrando {filteredInscripciones.length} de {inscripciones?.length || 0} inscripciones
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                      Exportar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto w-full">
                  <div className="w-full">
                    <Table className="w-full table-auto">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[110px] px-4">Alumno</TableHead>
                          <TableHead className="w-[120px]">Grado y Grupo</TableHead>
                          <TableHead className="w-[150px]">Materia</TableHead>
                          <TableHead className="w-[110px]">Maestro</TableHead>
                          <TableHead className="w-[140px]">Fecha Inscripción</TableHead>
                          <TableHead className="w-[100px] text-center">Estado</TableHead>
                          <TableHead className="w-[140px] text-center sticky right-0 bg-white shadow-[-2px_0_5px_rgba(0,0,0,0.1)] z-10">
                            Acciones
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInscripciones.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8">
                              No hay inscripciones registradas
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredInscripciones.map((inscripcion) => (
                            <TableRow key={inscripcion?._id}>
                              <TableCell className="font-medium px-4">
                                <div className="max-w-[180px]">
                                  <div className="truncate font-medium">
                                    {inscripcion?.alumno.nombre} {inscripcion?.alumno.apellidos}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate">
                                    {inscripcion?.alumno.matricula}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="truncate">
                                  {inscripcion?.catalogoClase.grado} {inscripcion?.catalogoClase.grupo}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="truncate">
                                  {inscripcion?.catalogoClase.materia}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="truncate">
                                  {inscripcion?.catalogoClase.maestro}
                                </div>
                              </TableCell>
                              <TableCell className="px-4">
                                <div className="text-sm">
                                  {inscripcion?.fechaInscripcion
                                    ? new Date(inscripcion.fechaInscripcion).toISOString().split("T")[0]
                                    : "Sin fecha"}
                                </div>
                              </TableCell>
                              <TableCell className="px-4 text-center">
                                <Badge className={`text-center text-white font-medium py-1 ${inscripcion?.activo ? "bg-green-600 px-3" : " bg-red-600 "}`}>
                                  {inscripcion?.activo ? "Activo" : "Inactivo"}
                                </Badge>
                              </TableCell>
                              <TableCell className="px-4 sticky right-0 bg-white shadow-[-2px_0_5px_rgba(0,0,0,0.1)] z-10">
                                <div className="flex gap-1 justify-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openView(mapInscripcionToFormValues(inscripcion as unknown as ClasesPorAlumnos))}
                                    className="h-8 w-8 p-0"
                                    title="Ver detalles"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEdit(mapInscripcionToFormValues(inscripcion as unknown as ClasesPorAlumnos))}
                                    className="h-8 w-8 p-0"
                                    title="Editar"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {

                                      openDelete(inscripcion as Record<string, unknown>)
                                    }}
                                    className="h-8 w-8 p-0"
                                    title="Eliminar"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reportes" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Estadísticas Generales</CardTitle>
                  <CardDescription className="text-sm">Resumen de inscripciones en la escuela</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {estadisticas && (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="text-center p-3 sm:p-4 border rounded-lg">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">
                          {estadisticas.totalInscripciones}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">Total Inscripciones</div>
                      </div>
                      <div className="text-center p-3 sm:p-4 border rounded-lg">
                        <div className="text-xl sm:text-2xl font-bold text-green-600">
                          {estadisticas.inscripcionesActivas}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">Inscripciones Activas</div>
                      </div>
                      <div className="text-center p-3 sm:p-4 border rounded-lg">
                        <div className="text-xl sm:text-2xl font-bold text-purple-600">
                          {estadisticas.totalAlumnos}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">Total Alumnos</div>
                      </div>
                      <div className="text-center p-3 sm:p-4 border rounded-lg">
                        <div className="text-xl sm:text-2xl font-bold text-orange-600">
                          {estadisticas.promedioClasesPorAlumno}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">Promedio Clases/Alumno</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Exportar Datos</CardTitle>
                  <CardDescription className="text-sm">Descargue datos en diferentes formatos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent text-sm">
                      Exportar a Excel (.xlsx)
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent text-sm">
                      Exportar a CSV (.csv)
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent text-sm">
                      Exportar a PDF (.pdf)
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent text-sm">
                      Generar Reporte Personalizado
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <CrudDialog
          isOpen={isOpen}
          operation={operation}
          title={
            operation === 'create' ? 'Crear nueva inscripción de alumno por clase' :
              operation === 'edit' ? 'Editar inscripción de alumno por clase' : 'Ver inscripción de alumno por clase'
          }
          description={
            operation === 'create' ? 'Completa los campos para crear una nueva inscripción.' :
              operation === 'edit' ? 'Actualizar los datos de la inscripción.' : 'Detalles de la inscripción'
          }
          schema={clasePorAlumnoSchema}
          defaultValues={{
            _id: '',
            catalogoClaseId: '',
            alumnoId: '',
            cicloEscolarId: '',
            fechaInscripcion: new Date().toISOString().split("T")[0],
            activo: true
          }}
          data={data}
          onOpenChange={close}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        >
          {(form, operation) => (
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="alumnoId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alumno</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value as string}
                        disabled={operation === 'view'}
                        onValueChange={field.onChange}
                        name={field.name}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder='Seleccionar alumno' />
                        </SelectTrigger>
                        <SelectContent>
                          {alumnos?.map((alumno) => (
                            <SelectItem key={alumno._id} value={alumno._id}>
                              {alumno.nombre} {alumno.apellidos} ({alumno.matricula})
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
                name="cicloEscolarId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ciclo Escolar</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value as string}
                        disabled={operation === 'view'}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder='Seleccionar ciclo escolar' />
                        </SelectTrigger>
                        <SelectContent>
                          {ciclosEscolares?.map((ciclo) => (
                            <SelectItem key={ciclo._id} value={ciclo._id}>
                              {ciclo.nombre}
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
                name="catalogoClaseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clase</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value as string}
                        disabled={operation === 'view'}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder='Seleccionar clase' />
                        </SelectTrigger>
                        <SelectContent>
                          {catalogosClases?.map((clase) => (
                            <SelectItem key={clase._id} value={clase._id}>
                              {clase.nombre} - {clase.materia} ({clase.maestro})
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
                name="fechaInscripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Inscripción</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={operation === 'view'}
                        value={
                          field.value
                            ? (typeof field.value === 'number'
                              ? new Date(field.value).toISOString().split("T")[0]
                              : new Date(field.value as string).toISOString().split("T")[0])
                            : ''
                        }
                        onChange={(e) => field.onChange(e.target.value)}
                      />
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
                        Determina si la inscripción está activa o inactiva
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
      </div>
    </div>
  )
}