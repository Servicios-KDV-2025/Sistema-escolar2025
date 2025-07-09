"use client";

import { useEscuela } from "@/app/store/useEscuelaStore";
import { useEffect } from "react";
import Image from "next/image";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  
  CardFooter,
} from "@repo/ui/components/shadcn/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Asumiendo que usas shadcn/ui Input

import { Label } from "@radix-ui/react-label"; // Para el Label del formulario
import Link from "next/link";
import {
  Phone,
  Mail,
  Clock,
  MapPin, // Nuevo icono para dirección/ubicación
  Send, // Icono para el botón de enviar formulario
  
} from "lucide-react";

import Header from "@/components/public/header";
import SchoolMap from "@/components/public/mapa";
import Footer from "@/components/public/footer";

export default function ContactoPage() {
  const {escuela} = useEscuela();
  const setItems = useBreadcrumbStore((state) => state.setItems);

  useEffect(() => {
    if (escuela) {
      setItems([
        { label: `${escuela?.nombre}` },
        { label: "Contacto" },
      ]);
    }
  }, [escuela, setItems]);

  if (!escuela) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            Cargando información de la escuela...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center">
        <div className="w-full">
          {/* Hero Section - Contacto */}
          <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center text-center px-4">
            <Image
              src={"/images/contacto-banner.jpg"} // Asegúrate de tener esta imagen en public/images/
              alt="Banner de Contacto"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="relative z-10 text-white space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Contáctanos
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto">
                Estamos aquí para responder tus preguntas y ayudarte.
              </p>
            </div>
          </section>

          {/* Sección de Información de Contacto */}
          <section className="py-16 px-4 flex flex-col items-center bg-white">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 flex items-center gap-3">
              Información de Contacto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up text-center p-6">
                <CardHeader className="flex flex-col items-center p-0 mb-4">
                  <Phone className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-2xl font-semibold">Teléfono</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-lg text-muted-foreground font-semibold">
                    {escuela.telefono || "(618) 123-4567"}
                  </p>
                  <Button variant="link" asChild className="mt-2 text-primary">
                    <Link href={`tel:${escuela.telefono || "+526181234567"}`}>Llamar ahora</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up text-center p-6">
                <CardHeader className="flex flex-col items-center p-0 mb-4">
                  <Mail className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-2xl font-semibold">Correo Electrónico</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-lg text-muted-foreground font-semibold">
                    {escuela.email || "info@pato-cheman.edu.mx"}
                  </p>
                  <Button variant="link" asChild className="mt-2 text-primary">
                    <Link href={`mailto:${escuela.email || "info@pato-cheman.edu.mx"}`}>Enviar email</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up text-center p-6">
                <CardHeader className="flex flex-col items-center p-0 mb-4">
                  <Clock className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-2xl font-semibold">Horario de Atención</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-lg text-muted-foreground font-semibold">
                    Lunes a Viernes
                  </p>
                  <p className="text-lg text-muted-foreground font-semibold">
                    8:00 AM - 5:00 PM
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Sección de Formulario de Contacto */}
          <section className="py-16 px-4 flex flex-col items-center bg-white-50">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 flex items-center gap-3">
              Envíanos un Mensaje
            </h2>
            <Card className="w-full max-w-3xl shadow-lg border-white-200 bg-white/80 backdrop-blur-sm animate-fade-in-up p-6 md:p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input id="name" type="text" placeholder="Tu nombre" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Input id="email" type="email" placeholder="tu@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Asunto</Label>
                  <Input id="subject" type="text" placeholder="Sobre qué es tu consulta" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Tu Mensaje</Label>
                  <Input id="message" placeholder="Escribe aquí tu mensaje..." />
                </div>
                <Button type="submit" className="w-full py-3 text-lg flex items-center gap-2">
                  Enviar Mensaje <Send className="h-5 w-5" />
                </Button>
              </form>
            </Card>
          </section>

          {/* Sección de Ubicación y Mapa */}
          <section className="py-16 px-4 flex flex-col items-center bg-white">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 flex items-center gap-3">
              <MapPin className="h-8 w-8 text-primary" />
              Encuéntranos
            </h2>
            <Card className="w-full max-w-7xl shadow-lg border-white-200 bg-white/80 backdrop-blur-sm animate-fade-in-up">
              <CardContent className="p-0"> {/* Removido el padding de CardContent */}
                <SchoolMap
                  direccion={escuela.direccion}
                  nombreEscuela={escuela.nombre}
                />
              </CardContent>
              <CardFooter className="p-6 text-center text-muted-foreground flex justify-center">
                <p>{escuela.direccion || "Dirección de la Escuela, Ciudad, País"}</p>
              </CardFooter>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}