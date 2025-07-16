"use client";
import React from "react";
// import MostrarEscuelas from "@/components/mostrar-escuelas";
import ListaSubdominios from "@/components/lista-subdominios";
import CustomSignIn from "@/components/CustomSignIn";
import Navbar from "@/components/Navbar";
import { useSession } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";

export default function Home() {
  const { session, isLoaded } = useSession();

  // Mostrar loading mientras se carga la sesión
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {session ? (
        <>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-8">
              {/* Header de la página */}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Panel de Administración
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Gestiona tus escuelas de una manera sencilla y eficiente
                </p>
              </div>

              {/* Sección de Subdominios */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Gestión de Subdominios
                  </CardTitle>
                  <CardDescription>
                    Administra los subdominios disponibles para las escuelas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ListaSubdominios />
                </CardContent>
              </Card>

              {/* Sección de Escuelas */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Escuelas Registradas
                  </CardTitle>
                  <CardDescription>
                    Visualiza y gestiona todas las escuelas en el sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MostrarEscuelas />
                </CardContent>
              </Card> */}
            </div>
          </main>
        </>
      ) : (
        <CustomSignIn />
        // <div className="flex items-center justify-center min-h-screen">
        //   <SignIn />
        // </div>
      )}
    </div>
  );
}
