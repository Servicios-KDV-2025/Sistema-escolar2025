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

export default function DetallePersonalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const idPersonal = id as Id<"personal">
  const escuela = useEscuela((s) => s.escuela)
  const router = useRouter()
  const eliminarPersonal = useMutation(api.personal.deletePersonal)
  const allParams = useParams()
  const slug = typeof allParams?.slug === "string" ? allParams.slug : ""

  const [modalEliminar, setModalEliminar] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const setItems = useBreadcrumbStore(state => state.setItems)
  const empleado = useQuery(api.personal.PersonalById, { esculaId: escuela?._id as Id<"escuelas">, id: idPersonal })

  useEffect(() => {
    if (empleado) {
      setItems([
        { label: `${escuela?.nombre}`, href: '/' },
        { label: 'Personal', href: '/personal' },
        { label: `${empleado?.nombre}`, isCurrentPage: true },
      ])
    }
  }, [empleado, setItems, escuela])

  if (empleado === undefined) {
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

  if (!empleado) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Empleado no encontrado</h1>
        </div>
        <p>No se pudo encontrar el empleado con el ID proporcionado.</p>
      </div>
    )
  }

  const handleEditar = () => {
    router.push(`/escuela/${slug}/personal/${id}/edit`)
  }

  const handleEliminar = async () => {
    setIsSubmitting(true)
    try {
      await eliminarPersonal({id: idPersonal, escuelaId: escuela?._id as Id<"escuelas">})
      router.back()
    } catch (error) {
      console.error("Error al eliminar empleado: ", error)
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
        <h1 className="text-3xl font-bold">Detalle del empleado</h1>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">
              {`Emoleado: ${empleado?.departamentoId} ${empleado?.nombre} ${empleado?.apellidos}`}
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
            <div className="p-2 bg-muted rounded-md">{empleado.activo ? 'Activo' : 'No Activo'}</div>
          </div>
        </CardContent>
      </Card>
      {/* Modal para confirmar eliminacion de un empleado */}
      <Dialog open={modalEliminar} onOpenChange={setModalEliminar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás completamente seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El EMPLEADO será eliminado permanentemente
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