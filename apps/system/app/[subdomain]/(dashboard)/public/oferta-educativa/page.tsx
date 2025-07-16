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
  CardDescription,
} from "@repo/ui/components/shadcn/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookOpen, // Icono sugerido para oferta educativa
  GraduationCap, // Icono para niveles educativos
  Brain, // Icono para enfoque pedagógico
  ArrowRight,
  Check,
} from "lucide-react";


import Header from "@/components/public/header";
import Footer from "@/components/public/footer";

export default function OfertaEducativaPage() {
  const {escuela} = useEscuela();
  const setItems = useBreadcrumbStore((state) => state.setItems);

  useEffect(() => {
    if (escuela) {
      setItems([
        { label: `${escuela?.nombre}` },
        { label: "Oferta Educativa" },
      ]);
    }
  }, [escuela, setItems]);

  // Datos de ejemplo para la oferta educativa
  // Puedes reemplazar esto con datos dinámicos de tu base de datos si es necesario
  const primariaOffer = {
    title: "Educación Primaria",
    description:
      "Nuestra educación primaria se enfoca en sentar bases sólidas para el aprendizaje futuro, fomentando la curiosidad, el pensamiento crítico y el desarrollo integral de cada niño. Un ambiente seguro y estimulante donde los pequeños exploran, descubren y crecen.",
    image: "/images/primaria-banner.jpg", // Asegúrate de tener esta imagen en tu carpeta public/images/
    keyFeatures: [
      "Currículo integral y actualizado",
      "Desarrollo de habilidades de lectoescritura y matemáticas",
      "Clases de idiomas (inglés/francés)",
      "Actividades extracurriculares variadas",
      "Enfoque en valores y educación socioemocional",
      "Grupos reducidos para atención personalizada",
    ],
    link: "#detalles-primaria", // Puedes enlazar a una sección de la misma página o a una subpágina más detallada
  };

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
          {/* Hero Section - Oferta Educativa */}
          <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden bg-gradient-to-r from-black/75 to-blue-400 flex items-center justify-center text-center px-4">
            <Image
              src={"/photo.jpeg"} // Asegúrate de tener esta imagen
              alt="Banner de Oferta Educativa"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="relative z-10 text-white space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Explora Nuestra Oferta Educativa
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto">
                Programas diseñados para impulsar el potencial de cada
                estudiante.
              </p>
              <Button asChild className="mt-6 px-6 py-3 text-lg">
                <Link href="#niveles">
                  Ver Programas <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </section>

          {/* Introducción */}
          <section className="py-16 px-4 flex flex-col items-center bg-white-50">
            <Card className="w-full max-w-5xl shadow-lg border-white-200 bg-white/80 backdrop-blur-sm animate-fade-in-up text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3 text-3xl font-bold text-white-700">
                  <BookOpen className="h-7 w-7 text-white-600" />
                  Educación que Inspira y Transforma
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-4">
                  En {escuela.nombre}, ofrecemos un currículo innovador y
                  completo, diseñado para satisfacer las necesidades de cada
                  etapa educativa. Nuestro enfoque se centra en el desarrollo
                  integral, fomentando la excelencia académica, la creatividad,
                  el pensamiento crítico y los valores humanos.
                </CardDescription>
              </CardHeader>
            </Card>
          </section>

          {/* Sección de Primaria (detallada) */}
          <section
            id="primaria"
            className="py-16 px-4 flex flex-col items-center bg-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-primary" />
              {primariaOffer.title}
            </h2>
            <Card className="w-full max-w-6xl shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Columna de Imagen */}
                <div className="relative w-full h-64 md:h-96 lg:h-auto overflow-hidden lg:min-h-[500px]">
                  <Image
                    src={primariaOffer.image || "/placeholder.svg"}
                    alt={primariaOffer.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
                {/* Columna de Contenido */}
                <CardContent className="p-6 md:p-8 space-y-6 flex flex-col justify-center">
                  <CardDescription className="text-lg text-muted-foreground leading-relaxed">
                    {primariaOffer.description}
                  </CardDescription>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-white-700 mb-2">
                      Características Destacadas:
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-foreground">
                      {primariaOffer.keyFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href={primariaOffer.link} passHref>
                    <Button className="mt-4 px-6 py-3 text-lg">
                      Solicitar Información de Primaria{" "}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </div>
            </Card>
          </section>

          {/* Sección Enfoque Pedagógico */}
          <section className="py-16 px-4 flex flex-col items-center bg-white-50">
            <Card className="w-full max-w-5xl shadow-lg border-white-200 bg-white/80 backdrop-blur-sm animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl font-bold text-white-700 justify-center text-center">
                  <Brain className="h-7 w-7 text-white-600" />
                  Nuestro Enfoque Pedagógico
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2 text-center">
                  Nos distinguimos por una metodología activa y participativa,
                  centrada en el estudiante.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Aprendizaje Basado en Proyectos
                    </h3>
                    <p className="text-muted-foreground">
                      Fomentamos la investigación, la colaboración y la
                      resolución de problemas reales, preparando a los
                      estudiantes para los desafíos del siglo XXI.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Desarrollo de Habilidades Blandas
                    </h3>
                    <p className="text-muted-foreground">
                      Cultivamos la comunicación efectiva, el trabajo en equipo,
                      la creatividad y la inteligencia emocional, esenciales
                      para el éxito personal y profesional.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Tecnología e Innovación
                    </h3>
                    <p className="text-muted-foreground">
                      Integramos herramientas digitales y metodologías de
                      vanguardia para enriquecer la experiencia de aprendizaje y
                      preparar a los alumnos para el futuro.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Atención Personalizada
                    </h3>
                    <p className="text-muted-foreground">
                      Cada estudiante es único. Ofrecemos seguimiento
                      individualizado para apoyar sus necesidades y potenciar
                      sus fortalezas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          
        </div>
      </main>
      <Footer />
    </>
  );
}
