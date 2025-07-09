// components/header.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import { useEscuela } from "@/app/store/useEscuelaStore";


export default function Header() {
  const {escuela} = useEscuela();
  

  if (!escuela) {
    return (
      <footer className="bg-background border-t border-gray-200 py-8 px-6 text-sm text-muted-foreground text-center">
        <p>Cargando información del pie de página...</p>
      </footer>
    );
  }

  return (
    <>
      <div className=" mx-auto grid grid-cols-1 sm:grid-cols-4 md:grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex justify-center mb-4">
          {/* Placeholder para el logo principal */}
          <div className="h-32 w-32 bg-white-600 rounded-full flex items-center justify-center text-black text-5xl font-extrabold shadow-lg border-4 border-white-300 transform transition-transform duration-500 hover:scale-105">
            LP
          </div>{" "}
          {/* Una "I" grande como inicial */}
        </div>
        <div className="">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {escuela.nombre.toUpperCase()}
          </h1>
          <h2 className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Innovación que educa, tecnología que transforma.
          </h2>
        </div>
      </div>
      <div>
        <header className="flex justify-between items-center py-4 px-6 border-b border-gray-200">
          <div className="flex items-center gap-4"></div>
          <div>
            <nav className="hidden md:flex gap-6">
              <Link
                href={`/escuela/${escuela.nombre}/public/`}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                INICIO
              </Link>
              <Link
                href={`/escuela/${escuela.nombre}/public/nosotros`}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                NOSOTROS
              </Link>
              <Link
              href={`/escuela/${escuela.nombre}/public/oferta-educativa`}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                OFERTA EDUCATIVA
              </Link>
              <Link
              href={`/escuela/${escuela.nombre}/public/contacto`}
                
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                CONTACTO
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button size="sm">Sistema PAE</Button>
          </div>
        </header>
      </div>
    </>
  );
}
