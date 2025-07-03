'use client'
 
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore"
import { useEscuela } from "@/app/store/useEscuela"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { Button } from "@repo/ui/components/shadcn/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableRow } from "@repo/ui/components/shadcn/table"
import { useQuery } from "convex/react"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
 
export function TablaPersonal() {
  const router = useRouter()
  const escuela = useEscuela((s) => s.escuela)
  const personal = useQuery(api.personal.obtenerPersonal, {escuelaId: escuela?._id as Id<"escuelas">})
  const setItems = useBreadcrumbStore(state => state.setItems)
  const params = useParams()
  const slug = typeof params?.slug === "string" ? params.slug : ""
 
  useEffect(() => {
    if (escuela){
      setItems([
        { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
        { label: 'Personal', isCurrentPage: true }
      ])
    }
  }, [escuela, setItems, slug])
 
  if (personal === undefined) {
    return <div>Cargando el Personal...</div>
  }
 
  const handleVerEmpleado = (id: string) => {
    router.push(`/escuela/${slug}/personal/${id}`)
  }
 
  const handleCrear = () => {
    router.push(`/escuela/${slug}/personal/create`)
  }
 
  return(
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Personal</h2>
        <Button onClick={handleCrear} className="flex items-center gap-2">
          <Plus />
          Nuevo Empleado
        </Button>
      </div>
      <Table>
        <TableCaption>Lista de Personal Registrado</TableCaption>
        <TableHead>
          <TableRow>
            <TableHead>ID Departamento</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellidos</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefono</TableHead>
            <TableHead>Maestro</TableHead>
            <TableHead>Fecha de Ingreso</TableHead>
            <TableHead>Activo</TableHead>
          </TableRow>
        </TableHead>
        <TableBody>
          {personal.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No hay Personal registrados
              </TableCell>
            </TableRow>
          ) : (
            personal.map((empleado) => (
              <TableRow
                key={empleado.id._id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleVerEmpleado(empleado.id._id)}
              >
                <TableCell className="font-medium">{empleado.id.departamentoId}</TableCell>
                <TableCell>{empleado.id.nombre}</TableCell>
                <TableCell>{empleado.id.apellidos}</TableCell>
                <TableCell>{empleado.id.email}</TableCell>
                <TableCell>{empleado.id.telefono}</TableCell>
                <TableCell>{empleado.id.maestro ? 'Si': 'No'}</TableCell>
                <TableCell>{empleado.id.fechaIngreso}</TableCell>
                <TableCell>{empleado.id.activo}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  )
}