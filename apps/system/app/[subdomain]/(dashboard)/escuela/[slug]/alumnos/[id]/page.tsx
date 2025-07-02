'use client'

import { useEscuela } from "@/app/store/useEscuela"
import { Id } from "@/convex/_generated/dataModel"
import { use, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore"
import { Button } from "@repo/ui/components/shadcn/button"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card"
import { Skeleton } from "@repo/ui/components/shadcn/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@repo/ui/components/shadcn/dialog"

export default function DetalleAlumnoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const idAlumno = id as Id<"alumnos">
  const escuela = useEscuela((s) => s.escuela)
  const router = useRouter()
  const eliminarAlumno = useMutation(api.alumnos.deleteAlumno)
  const allParams = useParams()
  const slug = typeof allParams?.slug === "string" ? allParams.slug : ""

  const [modalEliminar, setModalEliminar] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const setItems = useBreadcrumbStore(state => state.setItems)
  const alumno = useQuery(api.alumnos.alumnoById, { esculaId: escuela?._id as Id<"escuelas">, id: idAlumno })

  useEffect(() => {
    if (alumno) {
      setItems([
        { label: `${escuela?.nombre}`, href: '/' },
        { label: 'Alumnos', href: '/alumnos' },
        { label: `${alumno?.nombre}`, isCurrentPage: true },
      ])
    }
  }, [alumno, setItems, escuela])

  if (alumno === undefined) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center gap-2 mb-6">
          <Button variant='outline' size='icon' onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <Skeleton className="h-8 w-full mb-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-24 mr-2" />
              <Skeleton className="h-10 w-24" />
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  if (!alumno) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Alumno no encontrado</h1>
        </div>
        <p>No se pudo encontrar el alumno con el ID proporcionado.</p>
      </div>
    )
  }

  const handleEditar = () => {
    router.push(`/escuela/${slug}/alumos/${id}/edit`)
  }

  const handleEliminar = async () => {
    setIsSubmitting(true)
    try {
      await eliminarAlumno({id: idAlumno, escuelaId: escuela?._id as Id<"escuelas">})
      router.back()
    } catch (error) {
      console.error("Error al eliminar alumno: ", error)
    } finally {
      setIsSubmitting(false)
      setModalEliminar(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4"/>
        </Button>
        <h1 className="text-3xl font-bold">Detalle del alumno</h1>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">
              {`Alumno: ${alumno?.matricula} ${alumno?.nombre} ${alumno?.apellidos}`}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant='outline'
                size='icon'
                onClick={handleEditar}
              >
                <Pencil className="h-4 w-4"/>
              </Button>
              <Button
                variant='outline'
                size='icon'
                onClick={() => setModalEliminar(true)}
              >
                <Trash2 className="h-4 w-4"/>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-1">Activo:</h3>
            <div className="p-2 bg-muted rounded-md">{alumno.activo ? 'Activo' : 'No Activo'}</div>
          </div>
        </CardContent>
      </Card>
      {/* Modal para confirmar eliminacion de un alumno */}
      <Dialog open={modalEliminar} onOpenChange={setModalEliminar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás completamente seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El ALUMNO será eliminado permanentemente
              de la base de datos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
             variant='outline'
             onClick={() => setModalEliminar(false)}
             disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              variant='destructive'
              onClick={handleEliminar}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}