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

export function AlumnosCRUD() {
  const router = useRouter()
  const escuela = useEscuela((s) => s.escuela)
  const alumnos = useQuery(api.alumnos.obtenerAlumnos, {escuelaId: escuela?._id as Id<"escuelas">})
  const setItems = useBreadcrumbStore(state => state.setItems)
  const params = useParams()
  const slug = typeof params?.slug === "string" ? params.slug : ""

  useEffect(() => {
    if (escuela){
      setItems([
        { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
        { label: 'Grupos', isCurrentPage: true }
      ])
    }
  }, [escuela, setItems, slug])

  if (alumnos === undefined) {
    return <div>Cargando los Alumnos...</div>
  }

  const handleVerAlumno = (id: string) => {
    router.push(`/escuela/${slug}/alumnos/${id}`)
  }

  const handleCrear = () => {
    router.push(`/escuela/${slug}/alumnos/create`)
  }

  return( 
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Alumnos</h2>
        <Button onClick={handleCrear} className="flex items-center gap-2">
          <Plus />
          Nuevo Alumno
        </Button>
      </div>
      <Table>
        <TableCaption>Lista de Alumnos Registrados</TableCaption>
        <TableHead>
          <TableRow>
            <TableHead>Matricula</TableHead>
            <TableHead>ID Padre/Tutor</TableHead>
            <TableHead>ID Grupo</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellidos</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Fecha de nacimiento</TableHead>
            <TableHead>Telefono</TableHead>
            <TableHead>Direccion</TableHead>
            <TableHead>Activo</TableHead>
          </TableRow>
        </TableHead>
        <TableBody>
          {alumnos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No hay Alumnos registrados
              </TableCell>
            </TableRow>
          ) : (
            alumnos.map((alumno) => (
              <TableRow
                key={alumno.id._id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleVerAlumno(alumno.id._id)}
              >
                <TableCell className="font-medium">{alumno.id.matricula}</TableCell>
                <TableCell>{alumno.id.padreId}</TableCell>
                <TableCell>{alumno.id.grupoId}</TableCell>
                <TableCell>{alumno.id.nombre}</TableCell>
                <TableCell>{alumno.id.apellidos}</TableCell>
                <TableCell>{alumno.id.email}</TableCell>
                <TableCell>{alumno.id.fechaNacimiento}</TableCell>
                <TableCell>{alumno.id.telefono}</TableCell>
                <TableCell>{alumno.id.direccion}</TableCell>
                <TableCell>{alumno.id.activo}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  )
}