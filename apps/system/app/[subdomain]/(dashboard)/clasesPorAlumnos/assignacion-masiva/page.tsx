"use client"

import { useState } from "react"
import { Users, BookOpen, ArrowRight, CheckCircle, AlertTriangle, Clock, MapPin, User, GraduationCap, Search,ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@repo/ui/components/shadcn/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/shadcn/alert"
import { Badge } from "@repo/ui/components/shadcn/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/shadcn/table"
import { ScrollArea } from "@repo/ui/components/shadcn/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/shadcn/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select"
import { Progress } from "@repo/ui/components/shadcn/progress"
import { useRouter } from "next/navigation"

// Datos simulados basados en el schema
const mockData = {
  cicloActual: "2024-2025",
  grupos: [
    { id: "1", nombre: "1°A", grado: "1°", totalAlumnos: 28, activo: true },
    { id: "2", nombre: "1°B", grado: "1°", totalAlumnos: 25, activo: true },
    { id: "3", nombre: "2°A", grado: "2°", totalAlumnos: 30, activo: true },
    { id: "4", nombre: "2°B", grado: "2°", totalAlumnos: 27, activo: true },
    { id: "5", nombre: "3°A", grado: "3°", totalAlumnos: 29, activo: true },
    { id: "6", nombre: "3°B", grado: "3°", totalAlumnos: 26, activo: true },
  ],
  alumnos: [
    { id: "1", nombre: "Ana García", apellidos: "López", matricula: "2024001", grupoId: "1", grupoNombre: "1°A" },
    { id: "2", nombre: "Carlos Ruiz", apellidos: "Martínez", matricula: "2024002", grupoId: "1", grupoNombre: "1°A" },
    {
      id: "3",
      nombre: "María Fernández",
      apellidos: "Sánchez",
      matricula: "2024003",
      grupoId: "1",
      grupoNombre: "1°A",
    },
    // ... más alumnos
  ],
  catalogoClases: [
    {
      id: "1",
      nombre: "Matemáticas 2°A",
      materia: "Matemáticas",
      grado: "2°",
      grupo: "2°A",
      maestro: "Prof. Juan Pérez",
      salon: "Aula 201",
      horario: "Lun-Vie 8:00-9:00",
      capacidad: 35,
      inscritos: 0,
    },
    {
      id: "2",
      nombre: "Español 2°A",
      materia: "Español",
      grado: "2°",
      grupo: "2°A",
      maestro: "Prof. María González",
      salon: "Aula 201",
      horario: "Lun-Vie 9:00-10:00",
      capacidad: 35,
      inscritos: 0,
    },
    {
      id: "3",
      nombre: "Ciencias 2°A",
      materia: "Ciencias Naturales",
      grado: "2°",
      grupo: "2°A",
      maestro: "Prof. Luis Rodríguez",
      salon: "Lab. Ciencias",
      horario: "Mar-Jue 10:00-11:00",
      capacidad: 25,
      inscritos: 0,
    },
    // ... más clases
  ],
}

type Step = "select-students" | "select-classes" | "preview" | "confirm"

export default function AssignStudentsToClasses() {
  const [currentStep, setCurrentStep] = useState<Step>("select-students")
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [assignmentMode, setAssignmentMode] = useState<"by-group" | "individual">("by-group")
  const [targetGrade, setTargetGrade] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [previewMateriaFilter, setPreviewMateriaFilter] = useState<string>("all")
  const router = useRouter();
  // Filtrar estudiantes basado en grupos seleccionados
  const getSelectedStudents = () => {
    if (assignmentMode === "by-group") {
      return mockData.alumnos.filter((alumno) => selectedGroups.includes(alumno.grupoId))
    }
    return mockData.alumnos.filter((alumno) => selectedStudents.includes(alumno.id))
  }

  // Filtrar clases por grado objetivo
  const getAvailableClasses = () => {
    if (!targetGrade) return []
    return mockData.catalogoClases.filter((clase) => clase.grado === targetGrade)
  }

  // Generar vista previa de asignaciones
  const generateAssignmentPreview = () => {
    const students = getSelectedStudents()
    const classes = mockData.catalogoClases.filter((clase) => selectedClasses.includes(clase.id))

    const assignments = []
    for (const student of students) {
      for (const clase of classes) {
        assignments.push({
          studentId: student.id,
          studentName: `${student.nombre} ${student.apellidos}`,
          studentMatricula: student.matricula,
          classId: clase.id,
          className: clase.nombre,
          materia: clase.materia,
          maestro: clase.maestro,
          salon: clase.salon,
          horario: clase.horario,
        })
      }
    }
    return assignments
  }

  const handleProcessAssignments = async () => {
    setIsProcessing(true)
    // Simular procesamiento
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsProcessing(false)
    setShowConfirmation(true)
  }

  const assignments = generateAssignmentPreview()
  const totalStudents = getSelectedStudents().length
  const totalClasses = selectedClasses.length
  const totalAssignments = assignments.length

  const stepProgress = {
    "select-students": 25,
    "select-classes": 50,
    preview: 75,
    confirm: 100,
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-white">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Asignación Masiva de Alumnos a Clases</h1>
              <p className="text-gray-600">Escuela Primaria Benito Juárez • Ciclo: {mockData.cicloActual}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progreso de Asignación</span>
              <span>{stepProgress[currentStep]}% completado</span>
            </div>
            <Progress value={stepProgress[currentStep]} className="h-2" />
          </div>

          {/* Steps Navigation */}
          <div className="flex items-center gap-4 text-sm">
            <div
              className={`flex items-center gap-2 ${currentStep === "select-students" ? "text-blue-600 font-medium" : "text-gray-500"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep === "select-students" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                1
              </div>
              Seleccionar Alumnos
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div
              className={`flex items-center gap-2 ${currentStep === "select-classes" ? "text-blue-600 font-medium" : "text-gray-500"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep === "select-classes" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                2
              </div>
              Seleccionar Clases
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div
              className={`flex items-center gap-2 ${currentStep === "preview" ? "text-blue-600 font-medium" : "text-gray-500"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep === "preview" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                3
              </div>
              Vista Previa
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div
              className={`flex items-center gap-2 ${currentStep === "confirm" ? "text-blue-600 font-medium" : "text-gray-500"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep === "confirm" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                4
              </div>
              Confirmar
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            {/* Step 1: Seleccionar Alumnos */}
            {currentStep === "select-students" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Seleccionar Alumnos
                  </CardTitle>
                  <CardDescription>Elija los estudiantes que desea inscribir en las clases</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Modo de Selección */}
                  <div className="space-y-4">
                    <Label>Modo de Selección</Label>
                    <Tabs
                      value={assignmentMode}
                      onValueChange={(value) => setAssignmentMode(value as "by-group" | "individual")}
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="by-group">Por Grupos</TabsTrigger>
                        <TabsTrigger value="individual">Individual</TabsTrigger>
                      </TabsList>

                      <TabsContent value="by-group" className="space-y-4">
                        <Alert>
                          <GraduationCap className="h-4 w-4" />
                          <AlertTitle>Selección por Grupos</AlertTitle>
                          <AlertDescription>
                            Seleccione grupos completos para inscribir a todos sus estudiantes automáticamente.
                          </AlertDescription>
                        </Alert>

                        <div className="grid gap-3 md:grid-cols-2">
                          {mockData.grupos.map((grupo) => (
                            <div key={grupo.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                              <Checkbox
                                id={`grupo-${grupo.id}`}
                                checked={selectedGroups.includes(grupo.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedGroups([...selectedGroups, grupo.id])
                                  } else {
                                    setSelectedGroups(selectedGroups.filter((id) => id !== grupo.id))
                                  }
                                }}
                              />
                              <div className="flex-1">
                                <Label htmlFor={`grupo-${grupo.id}`} className="font-medium">
                                  {grupo.nombre}
                                </Label>
                                <p className="text-sm text-gray-600">{grupo.grado} Grado</p>
                              </div>
                              <Badge variant="outline">{grupo.totalAlumnos} alumnos</Badge>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="individual" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="Buscar por nombre o matrícula..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                            <Select>
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Filtrar por grupo" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Todos los grupos</SelectItem>
                                {mockData.grupos.map((grupo) => (
                                  <SelectItem key={grupo.id} value={grupo.id}>
                                    {grupo.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <ScrollArea className="h-80">
                            <div className="space-y-2">
                              {mockData.alumnos.map((alumno) => (
                                <div key={alumno.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                                  <Checkbox
                                    id={`alumno-${alumno.id}`}
                                    checked={selectedStudents.includes(alumno.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedStudents([...selectedStudents, alumno.id])
                                      } else {
                                        setSelectedStudents(selectedStudents.filter((id) => id !== alumno.id))
                                      }
                                    }}
                                  />
                                  <div className="flex-1">
                                    <Label htmlFor={`alumno-${alumno.id}`} className="font-medium">
                                      {alumno.nombre} {alumno.apellidos}
                                    </Label>
                                    <p className="text-sm text-gray-600">
                                      {alumno.matricula} • {alumno.grupoNombre}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => setCurrentStep("select-classes")} disabled={totalStudents === 0}>
                      Continuar ({totalStudents} estudiantes seleccionados)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Seleccionar Clases */}
            {currentStep === "select-classes" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Seleccionar Clases
                  </CardTitle>
                  <CardDescription>
                    Elija las materias y clases donde inscribir a los estudiantes seleccionados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Selección de Grado Objetivo */}
                  <div className="space-y-2">
                    <Label>Grado Objetivo</Label>
                    <Select value={targetGrade} onValueChange={setTargetGrade}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el grado de las clases" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1°">1° Grado</SelectItem>
                        <SelectItem value="2°">2° Grado</SelectItem>
                        <SelectItem value="3°">3° Grado</SelectItem>
                        <SelectItem value="4°">4° Grado</SelectItem>
                        <SelectItem value="5°">5° Grado</SelectItem>
                        <SelectItem value="6°">6° Grado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {targetGrade && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Clases Disponibles - {targetGrade} Grado</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const availableClasses = getAvailableClasses()
                            const allSelected = availableClasses.every((c) => selectedClasses.includes(c.id))

                            if (allSelected) {
                              // Deseleccionar todas
                              setSelectedClasses([])
                            } else {
                              // Seleccionar todas
                              setSelectedClasses(availableClasses.map((c) => c.id))
                            }
                          }}
                        >
                          {getAvailableClasses().every((c) => selectedClasses.includes(c.id))
                            ? "Deseleccionar Todas"
                            : "Seleccionar Todas"}
                        </Button>
                      </div>

                      <ScrollArea className="h-80">
                        <div className="space-y-3">
                          {getAvailableClasses().map((clase) => (
                            <div key={clase.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                              <Checkbox
                                id={`clase-${clase.id}`}
                                checked={selectedClasses.includes(clase.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedClasses([...selectedClasses, clase.id])
                                  } else {
                                    setSelectedClasses(selectedClasses.filter((id) => id !== clase.id))
                                  }
                                }}
                              />
                              <div className="flex-1 space-y-2">
                                <div>
                                  <Label htmlFor={`clase-${clase.id}`} className="font-medium text-base">
                                    {clase.materia}
                                  </Label>
                                  <p className="text-sm text-gray-600">{clase.nombre}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {clase.maestro}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {clase.salon}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {clase.horario}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {clase.inscritos}/{clase.capacidad} alumnos
                                  </div>
                                </div>
                              </div>
                              <Badge
                                variant={clase.capacidad - clase.inscritos >= totalStudents ? "default" : "destructive"}
                              >
                                {clase.capacidad - clase.inscritos >= totalStudents ? "Disponible" : "Sin cupo"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep("select-students")}>
                      Anterior
                    </Button>
                    <Button onClick={() => setCurrentStep("preview")} disabled={selectedClasses.length === 0}>
                      Continuar ({selectedClasses.length} clases seleccionadas)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Vista Previa */}
            {currentStep === "preview" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Vista Previa de Asignaciones
                  </CardTitle>
                  <CardDescription>Revise las asignaciones que se van a crear antes de confirmar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Resumen de Asignaciones</AlertTitle>
                    <AlertDescription>
                      Se crearán <strong>{totalAssignments}</strong> inscripciones para <strong>{totalStudents}</strong>{" "}
                      estudiantes en <strong>{totalClasses}</strong> clases.
                    </AlertDescription>
                  </Alert>

                  {/* Filtro por Materia */}
                  <div className="flex items-center gap-4">
                    <Label>Filtrar por materia:</Label>
                    <Select value={previewMateriaFilter} onValueChange={setPreviewMateriaFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Todas las materias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las materias</SelectItem>
                        {Array.from(new Set(assignments.map((a) => a.materia))).map((materia) => (
                          <SelectItem key={materia} value={materia}>
                            {materia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Badge variant="outline">
                      {previewMateriaFilter === "all"
                        ? `${assignments.length} asignaciones`
                        : `${assignments.filter((a) => a.materia === previewMateriaFilter).length} asignaciones`}
                    </Badge>
                  </div>

                  <ScrollArea className="h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Estudiante</TableHead>
                          <TableHead>Matrícula</TableHead>
                          <TableHead>Materia</TableHead>
                          <TableHead>Maestro</TableHead>
                          <TableHead>Salón</TableHead>
                          <TableHead>Horario</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assignments
                          .filter(
                            (assignment) =>
                              previewMateriaFilter === "all" || assignment.materia === previewMateriaFilter,
                          )
                          .slice(0, 50)
                          .map((assignment, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{assignment.studentName}</TableCell>
                              <TableCell>{assignment.studentMatricula}</TableCell>
                              <TableCell>{assignment.materia}</TableCell>
                              <TableCell>{assignment.maestro}</TableCell>
                              <TableCell>{assignment.salon}</TableCell>
                              <TableCell>{assignment.horario}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    {assignments.filter(
                      (assignment) => previewMateriaFilter === "all" || assignment.materia === previewMateriaFilter,
                    ).length > 50 && (
                      <p className="text-center text-sm text-gray-500 mt-4">
                        ... y{" "}
                        {assignments.filter(
                          (assignment) => previewMateriaFilter === "all" || assignment.materia === previewMateriaFilter,
                        ).length - 50}{" "}
                        asignaciones más
                      </p>
                    )}
                  </ScrollArea>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep("select-classes")}>
                      Anterior
                    </Button>
                    <Button onClick={() => setCurrentStep("confirm")}>Proceder a Confirmación</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Confirmar */}
            {currentStep === "confirm" && (
              <div className="space-y-6">
                {/* Header Card */}
                <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                      <AlertTriangle className="h-6 w-6 text-amber-600" />
                      Confirmación Final de Asignaciones
                    </CardTitle>
                    <CardDescription className="text-lg">
                      Está a punto de crear <strong className="text-blue-700">{totalAssignments}</strong> inscripciones
                      masivas
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Resumen Visual */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Estadísticas Principales */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Resumen de Inscripciones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                          <p className="text-3xl font-bold text-blue-700">{totalStudents}</p>
                          <p className="text-sm text-blue-600 font-medium">Estudiantes</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-600" />
                          <p className="text-3xl font-bold text-green-700">{totalClasses}</p>
                          <p className="text-sm text-green-600 font-medium">Clases</p>
                        </div>
                      </div>
                      <div className="mt-4 text-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <CheckCircle className="h-6 w-6 text-purple-600" />
                          <p className="text-4xl font-bold text-purple-700">{totalAssignments}</p>
                        </div>
                        <p className="text-purple-600 font-medium">Total de Inscripciones a Crear</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Desglose por Materia */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-indigo-600" />
                        Desglose por Materia
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-3">
                          {Array.from(new Set(assignments.map((a) => a.materia))).map((materia) => {
                            const materiaAssignments = assignments.filter((a) => a.materia === materia).length
                            const percentage = Math.round((materiaAssignments / totalAssignments) * 100)
                            return (
                              <div key={materia} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-sm">{materia}</span>
                                  <Badge variant="outline">{materiaAssignments} inscripciones</Badge>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-gray-500">{percentage}% del total</p>
                              </div>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                {/* Advertencia y Detalles Técnicos */}
                <Card className="border-amber-200 bg-amber-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-800">
                      <AlertTriangle className="h-5 w-5" />
                      Información Técnica del Proceso
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>⚠️ Proceso Irreversible</AlertTitle>
                      <AlertDescription>
                        Esta operación creará {totalAssignments} registros permanentes en la tabla{" "}
                        <code className="bg-gray-200 px-1 rounded">clasesPorAlumno</code> de la base de datos.
                      </AlertDescription>
                    </Alert>

                    <div className="grid gap-4 md:grid-cols-2 text-sm">
                      <div className="space-y-2">
                        <h4 className="font-medium text-amber-800">Acciones que se ejecutarán:</h4>
                        <ul className="space-y-1 text-amber-700">
                          <li>✓ Crear {totalAssignments} registros en clasesPorAlumno</li>
                          <li>✓ Actualizar contadores de inscripciones por clase</li>
                          <li>✓ Generar fechas de inscripción automáticas</li>
                          <li>✓ Activar todas las inscripciones creadas</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-amber-800">Tiempo estimado:</h4>
                        <ul className="space-y-1 text-amber-700">
                          <li>• Menos de 100 inscripciones: ~30 segundos</li>
                          <li>• 100-500 inscripciones: ~2 minutos</li>
                          <li>• Más de 500 inscripciones: ~5 minutos</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Botones de Acción */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <Button variant="outline" onClick={() => setCurrentStep("preview")} size="lg">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Revisar Vista Previa
                      </Button>
                      <div className="flex gap-3">
                        <Button variant="outline" size="lg">
                          Cancelar Proceso
                        </Button>
                        <Button
                          onClick={handleProcessAssignments}
                          disabled={isProcessing}
                          size="lg"
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8"
                        >
                          {isProcessing ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Procesando {totalAssignments} Inscripciones...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirmar y Crear {totalAssignments} Inscripciones
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Resumen Actual */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumen de Selección</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Estudiantes:</span>
                    <Badge variant="outline">{totalStudents}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Clases:</span>
                    <Badge variant="outline">{totalClasses}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Inscripciones:</span>
                    <Badge>{totalAssignments}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consejos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Consejos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <p className="font-medium text-green-700">✓ Recomendaciones:</p>
                  <ul className="space-y-1 text-gray-600 ml-4">
                    <li>• Verifique la capacidad de los salones</li>
                    <li>• Revise conflictos de horarios</li>
                    <li>• Confirme la disponibilidad de maestros</li>
                    <li>• Valide los prerrequisitos de materias</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Advertencias */}
            {currentStep === "confirm" && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Importante</AlertTitle>
                <AlertDescription>
                  Las asignaciones masivas pueden tomar varios minutos en procesarse dependiendo del número de
                  inscripciones.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Confirmación Final */}
        {showConfirmation && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">¡Asignaciones Creadas Exitosamente!</AlertTitle>
            <AlertDescription className="text-green-700">
              <div className="space-y-2">
                <p>Se han procesado correctamente {totalAssignments} inscripciones.</p>
                <p>✅ {totalStudents} estudiantes inscritos</p>
                <p>✅ {totalClasses} clases asignadas</p>
                <p>✅ Registros creados en clasesPorAlumno</p>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
