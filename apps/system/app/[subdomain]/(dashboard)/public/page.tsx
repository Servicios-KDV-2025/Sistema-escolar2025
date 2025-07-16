"use client";

import Image from "next/image";
import { useEscuela } from "@/app/store/useEscuelaStore";
import { useEffect, useState } from "react";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/shadcn/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Lightbulb,
  Award,
  CheckCircle2,
  Users,
  Newspaper,
  ArrowRight,
  Clock,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

import Header from "@/components/public/header";
import SchoolMap from "@/components/public/mapa";
import Footer from "@/components/public/footer";

export default function EscuelaHome() {
  const [currentSlide, setCurrentSlide] = useState(0); //estado ca
  const { escuela } = useEscuela();
  const setItems = useBreadcrumbStore((state) => state.setItems);

  useEffect(() => {
    if (escuela) {
      setItems([{ label: `${(escuela?.nombre).toLocaleUpperCase()}` }]);
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
  const featuredEvents = [
    {
      id: "event-1",
      title: "Gran Inauguración del Laboratorio de Robótica",
      description: "Explora nuestras nuevas instalaciones de vanguardia.",
      image: "/photo.jpeg",
      date: "25 de Julio, 2025",
      link: "/eventos/robotica-lab-inauguracion", // Enlace a la página del evento
    },
    {
      id: "event-14",
      title: "Gran Inauguración del Laboratorio de Robótica",
      description: "Explora nuestras nuevas instalaciones de vanguardia.",
      image: "/photo2.jpg",
      date: "25 de Julio, 2025",
      link: "/eventos/robotica-lab-inauguracion", // Enlace a la página del evento
    },
    {
      id: "event-13",
      title: "Gran Inauguración del Laboratorio de Robótica",
      description: "Explora nuestras nuevas instalaciones de vanguardia.",
      image: "/photo.jpeg",
      date: "25 de Julio, 2025",
      link: "/eventos/robotica-lab-inauguracion", // Enlace a la página del evento
    },
    {
      id: "event-12",
      title: "Gran Inauguración del Laboratorio de Robótica",
      description: "Explora nuestras nuevas instalaciones de vanguardia.",
      image: "/photo2.jpg",
      date: "25 de Julio, 2025",
      link: "/eventos/robotica-lab-inauguracion", // Enlace a la página del evento
    },
    {
      id: "event-2",
      title: "Feria de Ciencias Anual: Innovación y Descubrimiento",
      description: "Proyectos increíbles creados por nuestros estudiantes.",
      image: "/photo.jpeg",
      date: "10 de Agosto, 2025",
      link: "/eventos/feria-ciencias-anual",
    },
    {
      id: "event-3",
      title: "Jornada de Orientación Universitaria",
      description: "Prepárate para tu futuro académico y profesional.",
      image: "/photo2.jpg",
      date: "1 de Septiembre, 2025",
      link: "/eventos/orientacion-universitaria",
    },
    {
      id: "event-4",
      title: "Copa Deportiva Interescolar",
      description: "Competición amistosa entre las mejores escuelas.",
      image: "/photo.jpeg",
      date: "15 de Septiembre, 2025",
      link: "/eventos/copa-deportiva",
    },
    {
      id: "event-5",
      title: "Copa Deportiva Interescolar",
      description: "Competición amistosa entre las mejores escuelas.",
      image: "/photo2.jpg",
      date: "15 de Septiembre, 2025",
      link: "/eventos/copa-deportiva",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
  };
  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length
    );
  };
  return (
    <>
      <main className="flex  flex-col items-center justify-center">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <Header />
        </section>
        <div className="space-y-8 p-6 max-w-7xl mx-auto">
          {/* Sección de Noticias y Eventos */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                  <Newspaper className="h-6 w-6 text-primary" />
                  Noticias y Eventos
                </h2>
                <p className="text-muted-foreground">
                  Mantente informado sobre los últimos acontecimientos
                </p>
              </div>
              <Button variant="outline">Ver Todo</Button>
            </div>

            {/* Hero Carousel Section */}
            <section className="relative h-[500px] overflow-hidden">
              <div className="relative w-full h-full">
                {featuredEvents.map((slide, index) => (
                  <div
                    key={slide.id}
                    onClick={() => (window.location.href = slide.link)}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Image
                      src={slide.image || "/photo2.jpg"}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-black/10" />

                    {/* Content Overlay */}
                    <div className="absolute inset-2 flex items-center justify-center">
                      <div className="max-w-7xl mx-auto px-4 w-full">
                        <div className="flex justify-end">
                          <Card className="bg-white/80 text-black max-w-md ">
                            {" "}
                            {/* bg-background/23 */}
                            <CardContent className="p-4">
                              <h2 className="text-4xl font-bold mb-4 border-b-4 border-white pb-0 inline-block">
                                {slide.title}
                              </h2>
                              <p className="text-lg mb-6 leading-relaxed">
                                {slide.description}
                              </p>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {slide.date}
                                </span>
                                <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/8 hover:bg-white/30 text-black/40 p-2 rounded-full transition-colors"
                aria-label="Slide anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/8 hover:bg-white/30 text-black/40 p-2 rounded-full transition-colors"
                aria-label="Siguiente slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
                {featuredEvents.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`Ir al slide ${index + 1}`}
                  />
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6 text-center">
            <h2 className="text-2xl font-semibold tracking-tight flex items-center justify-center gap-2">
              <Lightbulb className="h-6 w-6 text-primary" />
              Nuestra Filosofía Educativa
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              En {escuela.nombre}, nos dedicamos a formar líderes con una visión
              integral, fomentando la curiosidad, el pensamiento crítico y el
              compromiso social.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <Card>
                <CardHeader className="flex flex-col items-center gap-2">
                  <Award className="h-8 w-8 text-secondary-foreground" />
                  <CardTitle>Excelencia Académica</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Programas innovadores y un cuerpo docente de primer nivel.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-col items-center gap-2">
                  <Users className="h-8 w-8 text-secondary-foreground" />
                  <CardTitle>Desarrollo Integral</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Fomentamos habilidades para la vida, más allá del aula.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="h-8 w-8 text-secondary-foreground" />
                  <CardTitle>Innovación Constante</CardTitle>
                </CardContent>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Tecnología y métodos de enseñanza a la vanguardia.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Sección de Ubicación del Campus */}
          <div className="space-y-6">
            <SchoolMap
              direccion={escuela.direccion}
              nombreEscuela={escuela.nombre}
            />
          </div>



          {/* Sección de Información de Contacto */}
          <section className="py-0 px-4 flex flex-col items-center bg-white">
            <h4 className="text-4xl font-semibold tracking-tight flex items-center gap-4">
              <Phone className="h-6 w-6 text-primary" />
              Contáctanos
            </h4>
            <p className="text-muted-foreground py-3">
              Estamos aquí para ayudarte
            </p>

            <div className="py-3 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up text-center p-6">
                <CardHeader className="flex flex-col items-center p-0 mb-4">
                  <Phone className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-2xl font-semibold">
                    Teléfono
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-lg text-muted-foreground font-semibold">
                    {escuela.telefono || "(618) 123-4567"}
                  </p>
                  <Button variant="link" asChild className="mt-2 text-primary">
                    <Link href={`tel:${escuela.telefono || "+526181234567"}`}>
                      Llamar ahora
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up text-center p-6">
                <CardHeader className="flex flex-col items-center p-0 mb-4">
                  <Mail className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-2xl font-semibold">
                    Correo Electrónico
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-lg text-muted-foreground font-semibold">
                    {escuela.email || "info@pato-cheman.edu.mx"}
                  </p>
                  <Button variant="link" asChild className="mt-2 text-primary">
                    <Link
                      href={`mailto:${escuela.email || "info@pato-cheman.edu.mx"}`}
                    >
                      Enviar email
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up text-center p-6">
                <CardHeader className="flex flex-col items-center p-0 mb-4">
                  <Clock className="h-10 w-10 text-primary mb-3" />
                  <CardTitle className="text-2xl font-semibold">
                    Horario de Atención
                  </CardTitle>
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
            <div className="flex gap-2 justify-end">
              <Button variant="outline" className=" justify-end" asChild>
                <Link href="/contacto">
                  Formulario de Contacto <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
