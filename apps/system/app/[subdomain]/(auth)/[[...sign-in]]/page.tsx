'use client'

import { SignIn, SignOutButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/components/shadcn/card'
//import { useEscuelaLalo } from '../../../../app/store/useEscuelaLalo'
import { useEscuelaLalo } from '@/app/store/useEscuelaStore'
import { useEffect, useRef } from 'react'
import { CrudDialog, useCrudDialog } from '../../../../components/ui/crud-dialog'
import { grupoSchema } from '../../../../app/shemas/grupo'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { toast } from 'sonner'
import { Button } from '@repo/ui/components/shadcn/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/components/shadcn/form'
import { Input } from '@repo/ui/components/shadcn/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/components/shadcn/select'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'

//import { useEscuela } from '@/app/store/useEscuela' --- este es lo que tiene emilio

export default function Home() {
  const { user } = useUser()
  
  const { 
    escuela, 
    subdomain,
    userEmail,
    isLoading,
    error,
    detectSubdomain, 
    setEmail,
    clearError 
  } = useEscuelaLalo()

  //const { escuela } = useEscuela() este lo agregué con Alex

  // Ejemplo de CRUD para grupos
  const crearGrupo = useMutation(api.grupos.crearGrupo)
  const actualizarGrupo = useMutation(api.grupos.actualizarGrupo)
  const eliminarGrupo = useMutation(api.grupos.eliminarGrupo)
  //const grupos = useQuery(api.grupos.verTodosLosGrupos, { escuelaId: escuela?._id as Id<"escuelas"> })

  const grupos = useQuery(api.grupos.verTodosLosGrupos, escuela?._id ? { escuelaId: escuela._id as Id<"escuelas"> } : "skip")

  const {
    isOpen,
    operation,
    data,
    openCreate,
    openEdit,
    openView,
    openDelete,
    close
  } = useCrudDialog(grupoSchema, {
    grado: "1°",
    nombre: "",
    activo: true
  })

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!escuela?._id) {
      toast.error('Error', { description: 'No se pudo identificar la escuela' })
      return
    }

    console.log('handleSubmit - operation:', operation)
    console.log('handleSubmit - values:', values)
    console.log('handleSubmit - data:', data)

    try {
      if (operation === 'create') {
        console.log('Creando grupo...')
        await crearGrupo({
          escuelaId: escuela._id as Id<"escuelas">,
          grado: values.grado as string,
          nombre: values.nombre as string,
          activo: values.activo as boolean
        })
        console.log('Grupo creado exitosamente')
      } else if (operation === 'edit' && data?._id) {
        console.log('Editando grupo con ID:', data._id)
        await actualizarGrupo({
          id: data._id as Id<"grupos">,
          escuelaId: escuela._id as Id<"escuelas">,
          grado: values.grado as string,
          nombre: values.nombre as string,
          activo: values.activo as boolean
        })
        console.log('Grupo editado exitosamente')
      } else {
        console.error('Operación no válida o datos faltantes:', { operation, data })
        throw new Error('Operación no válida o datos faltantes')
      }
    } catch (error) {
      console.error('Error en operación CRUD:', error)
      throw error // Re-lanzar para que el CrudDialog maneje el toast
    }
  }

  const handleDelete = async (id: string) => {
    if (!escuela?._id) {
      toast.error('Error', { description: 'No se pudo identificar la escuela' })
      return
    }
    
    console.log('handleDelete - id:', id)
    console.log('handleDelete - escuelaId:', escuela._id)
    
    try {
      await eliminarGrupo({ 
        id: id as Id<"grupos">,
        escuelaId: escuela._id as Id<"escuelas">
      })
      console.log('Grupo eliminado exitosamente')
    } catch (error) {
      console.error('Error al eliminar grupo:', error)
      throw error // Re-lanzar para que el CrudDialog maneje el toast
    }
  }

  // Usar useRef para evitar múltiples llamadas
  const hasLoaded = useRef(false);

  useEffect(() => {
    // Solo cargar una vez al montar el componente
    if (!hasLoaded.current) {
      if (user?.emailAddresses?.[0]?.emailAddress) {
        // Si hay usuario autenticado, cargar por email
        setEmail(user.emailAddresses[0].emailAddress);
      } else {
        // Si no hay usuario, cargar por subdomain
        detectSubdomain();
      }
      hasLoaded.current = true;
    }
  }, [user, detectSubdomain, setEmail])

  // Cargar escuela cuando el usuario se autentique
  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress && !escuela) {
      setEmail(user.emailAddresses[0].emailAddress);
    }
  }, [user, escuela, setEmail])

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignIn />
    </div>
  )

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Card principal */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Bienvenido, {user.firstName}!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-3 items-center">
              <SignOutButton />
              <h1 className="text-xl font-semibold mt-2">Hello Page</h1>
            </div>
            <div className="flex flex-col gap-3 items-center">
              <p>ir a escuela</p>
              <Link className='text-blue-500 underline' href="/escuela">Escuela</Link>
            </div>
            {/* Mostrar información de la escuela si está disponible */}
            {escuela && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Escuela: {escuela.nombre}
                </p>
                {subdomain && (
                  <p className="text-xs text-muted-foreground">
                    Subdominio: {subdomain}
                  </p>
                )}
                {userEmail && (
                  <p className="text-xs text-muted-foreground">
                    Email del usuario: {userEmail}
                  </p>
                )}
                {escuela.email && (
                  <p className="text-xs text-muted-foreground">
                    Email de la escuela: {escuela.email}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {escuela.nombreCorto}
                </p>
                <p className="text-xs text-muted-foreground">
                  {escuela.telefono}
                </p>
                <p className="text-xs text-muted-foreground">
                  {escuela.direccion}
                </p>
                <p className="text-xs text-muted-foreground">
                  {escuela.descripcion}
                </p>
              </div>
            )}
            {/* Mostrar estado de carga */}
            {isLoading && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Cargando información de la escuela...
                </p>
              </div>
            )}
            {/* Mostrar error si existe */}
            {error && (
              <div className="pt-4 border-t">
                <p className="text-sm text-red-500">
                  Error: {error}
                </p>
                <button 
                  onClick={() => {
                    clearError();
                    if (user?.emailAddresses?.[0]?.emailAddress) {
                      setEmail(user.emailAddresses[0].emailAddress);
                    } else {
                      detectSubdomain();
                    }
                  }}
                  className="text-xs text-blue-500 underline"
                >
                  Reintentar
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ejemplo de CRUD para grupos */}
        {escuela && (
          <Card className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Gestión de Grupos (Ejemplo CRUD)</CardTitle>
                <Button onClick={openCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Grupo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {grupos?.map((grupo) => (
                  <div key={grupo.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{grupo.nombre} - {grupo.grado}</p>
                      <p className="text-sm text-muted-foreground">
                        Estado: {grupo.activo ? 'Activo' : 'Inactivo'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openView({ ...grupo, _id: grupo.id })}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEdit({ ...grupo, _id: grupo.id })}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => openDelete({ ...grupo, _id: grupo.id })}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {grupos?.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No hay grupos creados. Crea el primer grupo usando el botón &quot;Nuevo Grupo&quot;.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CrudDialog */}
        <CrudDialog
          operation={operation}
          title={operation === 'create' ? 'Crear Nuevo Grupo' : 
                operation === 'edit' ? 'Editar Grupo' : 'Ver Grupo'}
          description={operation === 'create' ? 'Completa la información del nuevo grupo' :
                      operation === 'edit' ? 'Modifica la información del grupo' : 'Información del grupo'}
          schema={grupoSchema}
          defaultValues={{
            grado: "1°",
            nombre: "",
            activo: true
          }}
          data={data}
          isOpen={isOpen}
          onOpenChange={close}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        >
          {(form, operation) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="grado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grado</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value as string}
                        disabled={operation === 'view'}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar grado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1°">1°</SelectItem>
                          <SelectItem value="2°">2°</SelectItem>
                          <SelectItem value="3°">3°</SelectItem>
                          <SelectItem value="4°">4°</SelectItem>
                          <SelectItem value="5°">5°</SelectItem>
                          <SelectItem value="6°">6°</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => {
                  console.log('Campo nombre - field.value:', field.value)
                  console.log('Campo nombre - operation:', operation)
                  return (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Nombre del grupo" 
                          value={field.value as string}
                          disabled={operation === 'view'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />

              <FormField
                control={form.control}
                name="activo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={(value) => field.onChange(value === 'true')} 
                        value={field.value ? 'true' : 'false'}
                        disabled={operation === 'view'}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Activo</SelectItem>
                          <SelectItem value="false">Inactivo</SelectItem>
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
    </div>
  )
}