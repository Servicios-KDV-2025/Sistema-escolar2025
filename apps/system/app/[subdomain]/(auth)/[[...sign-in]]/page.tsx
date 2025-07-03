'use client'

import { SignIn, SignOutButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/components/shadcn/card'
import { useEscuela } from '../../../store/useEscuelaStore'
import { useEffect, useRef } from 'react'

export default function Home() {
  const { user } = useUser()
  
  const { 
    escuela, 
    subdomain,
    userEmail,
    loadingState, 
    autoLoadEscuela, 
    loadEscuelaByEmail,
    clearError 
  } = useEscuela() 

  // Usar useRef para evitar múltiples llamadas
  const hasLoaded = useRef(false);

  useEffect(() => {
    // Solo cargar una vez al montar el componente
    if (!hasLoaded.current) {
      if (user?.emailAddresses?.[0]?.emailAddress) {
        // Si hay usuario autenticado, cargar por email
        loadEscuelaByEmail(user.emailAddresses[0].emailAddress);
      } else {
        // Si no hay usuario, cargar por subdomain
        autoLoadEscuela();
      }
      hasLoaded.current = true;
    }
  }, [user, autoLoadEscuela, loadEscuelaByEmail])

  // Cargar escuela cuando el usuario se autentique
  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress && !escuela) {
      loadEscuelaByEmail(user.emailAddresses[0].emailAddress);
    }
  }, [user, escuela, loadEscuelaByEmail])

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignIn />
    </div>
  )

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
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
          {loadingState.isLoading && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Cargando información de la escuela...
              </p>
            </div>
          )}
          {/* Mostrar error si existe */}
          {loadingState.error && (
            <div className="pt-4 border-t">
              <p className="text-sm text-red-500">
                Error: {loadingState.error}
              </p>
              <button 
                onClick={() => {
                  clearError();
                  if (user?.emailAddresses?.[0]?.emailAddress) {
                    loadEscuelaByEmail(user.emailAddresses[0].emailAddress);
                  } else {
                    autoLoadEscuela();
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
    </div>
  )
}