// components/Footer.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { useEscuela } from "@/app/store/useEscuelaStore";


export default function Footer() {
  const {escuela} = useEscuela();

  
  if (!escuela) {
    return (
      <footer className="bg-background border-t border-gray-200 py-8 px-6 text-sm text-muted-foreground text-center">
        <p>Cargando información del pie de página...</p>
      </footer>
    );
  }

  return (
    <footer className="bg-background  border-gray-200 py-8 px-6 text-sm text-muted-foreground">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-40">
        {/* Columna 1: Logo y Nombre de la Escuela */}
        <div className="flex flex-col items-start gap-4 col-span-1">
          {escuela.logoUrl && (
            <Image
              src={escuela.logoUrl}
              alt="Logo de la escuela"
              width={70}
              height={70}
              className="rounded-full"
            />
          )}
          <span className="font-bold text-lg text-foreground">
            {escuela.nombre}
          </span>
          <p className="text-xs">EDICAD/CIVAL</p>
        </div>

        {/* Columna 2: Enlaces de Contacto/Contacto rápido */}
        <div className="space-y-3 col-span-1">
          <h3 className="font-semibold text-foreground">Contacto Rápido</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>{escuela.telefono || "(618) 123-4567"}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>{escuela.email || "info@pato-cheman.edu.mx"}</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>
                {escuela.direccion || "Av Tecnologico S/NN, Durango, México"}
              </span>
            </li>
          </ul>
        </div>

        {/* Columna 3: Información Adicional */}
        <div className="space-y-3 col-span-1">
          <h3 className="font-semibold text-foreground">Información</h3>
          <ul className="space-y-2">
            <li><Link href="/condiciones" className="hover:text-primary transition-colors">Condiciones</Link></li>
            <li><Link href="/acuerdos" className="hover:text-primary transition-colors">Acuerdos y facetas</Link></li>
            <li><Link href="/operaciones" className="hover:text-primary transition-colors">Operaciones recientes</Link></li>
            <li><Link href="/denominaciones" className="hover:text-primary transition-colors">Denominaciones</Link></li>
          </ul>
        </div>

        {/* Columna 4: Redes Sociales */}
        <div className="space-y-3 col-span-1 sm:col-span-2 lg:col-span-1">
          <h3 className="font-semibold text-foreground">Síguenos</h3>
          <div className="flex gap-3">
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://facebook.com/tuescuela"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-5 w-5 text-blue-600" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://instagram.com/tuescuela"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5 text-pink-600" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://twitter.com/tuescuela"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5 text-blue-400" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="text-center text-xs py-8">
      <Separator className="my-1" />
        © {new Date().getFullYear()} {escuela.nombre}. Todos los derechos reservados.
      </div>
    </footer>
  );
}