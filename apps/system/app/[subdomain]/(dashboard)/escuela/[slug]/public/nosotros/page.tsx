"use client";

import { useEscuela } from "@/app/store/useEscuela";
import { useEffect } from "react";
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
  BookText,
  ArrowRight,
  Target,
  Phone,
  Handshake,
  ImageIcon,
  Mail,
  Clock,
  Eye,
  Heart,
  Users,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import Header from "@/components/header";
import SchoolMap from "@/components/mapa";
import Footer from "@/components/footer";

export default function EscuelaHome() {
  const escuelaZ = useEscuela((s) => s.escuela);
  const escuela = useQuery(
    api.escuelas.obtenerEscuelaPorId,
    escuelaZ ? { id: escuelaZ._id as Id<"escuelas"> } : "skip"
  );
  const setItems = useBreadcrumbStore((state) => state.setItems);

  const alliancesAndCertifications = [
    "Universidad Tecnológica Nacional",
    "Certificación ISO 9001",
    "Certificación ISO 9002",
    "Partnership con Tech Innovations Inc.",
  ];
  const values = [
    "Honestidad",
    "Responsabilidad",
    "Respeto",
    "Justicia",
    "Amistad",
    "Solidaridad",
  ];
  useEffect(() => {
    if (escuela) {
      setItems([{ label: `${escuela?.nombre}` }]);
    }
  }, [escuela, setItems]);

  //Mientras carga la información
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
      <main className="flex min-h-[calc(7vh-5rem)] flex-col items-center justify-center">
        <div className="">
          {/* Sección Hero */}
          <section
            id="hero"
            className="relative flex items-center justify-center min-h-[60vh] px-4 py-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-white-500/10 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_80%)]" />
            <Card className="w-full max-w-3xl bg-white/80 backdrop-blur-sm shadow-xl border-white-100 animate-fade-in-up">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {/* Placeholder para el logo principal */}
                  <div className="h-32 w-32 bg-white-600 rounded-full flex items-center justify-center text-black text-5xl font-extrabold shadow-lg border-4 border-white-300 transform transition-transform duration-500 hover:scale-105">
                    LP
                  </div>{" "}
                  {/* Una "I" grande como inicial */}
                </div>
                <CardTitle className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
                  {escuela.nombre.toUpperCase()}
                </CardTitle>
                <CardDescription className="text-xl text-muted-foreground mt-2">
                  {escuela.direccion}
                </CardDescription>
              </CardHeader>
            </Card>
          </section>

          {/* Sección Sobre Nosotros - Historia/Mensaje */}
          <section id="about" className="py-16 px-4 flex flex-col items-center">
            <Card className="w-full max-w-5xl shadow-lg border-white-200 bg-white/80 backdrop-blur-sm animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl font-bold text-white-700">
                  <BookText className="h-7 w-7 text-white-600" />
                  Nuestra Historia
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  Nos enorgullece ser el lugar donde la curiosidad se convierte
                  en conocimiento y el potencial en realidad. En $
                  {escuela.nombre}, seguimos comprometidos con una educación que
                  no solo forma mentes brillantes, sino también corazones
                  compasivos y ciudadanos preparados para un mundo en constante
                  cambio.
                </CardDescription>
              </CardHeader>
            </Card>
          </section>

          {/* Sección Misión y Visión */}
          <section className="py-16 px-4 flex flex-col items-center bg-white-20">
            <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
              <Card className="shadow-lg border-white-200 bg-white/80 backdrop-blur-sm animate-fade-in-left">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold text-white-700">
                    <Target className="h-6 w-6 text-white-600" />
                    Misión
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Nuestra misión es fomentar un ambiente de aprendizaje
                    inclusivo y estimulante donde cada estudiante pueda
                    desarrollar al máximo su potencial académico, social y
                    emocional. Nos dedicamos a cultivar el pensamiento crítico,
                    la creatividad y una pasión por el aprendizaje continuo,
                    preparando a nuestros alumnos para ser ciudadanos
                    responsables y contribuyentes en un mundo en constante
                    cambio.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-white-200 bg-white/80 backdrop-blur-sm animate-fade-in-right">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl font-bold text-white-700">
                    <Eye className="h-6 w-6 text-white-600" />
                    Visión
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Ser una institución educativa reconocida por su excelencia
                    académica y su compromiso con la formación integral de sus
                    estudiantes. Aspiramos a ser un modelo de innovación
                    pedagógica, donde se promueva el respeto, la diversidad y la
                    colaboración, inspirando a futuras generaciones a alcanzar
                    sus sueños y a tener un impacto positivo en su comunidad
                    global.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Sección Valores */}
          <section className="py-16 px-4 flex flex-col items-center">
            <Card className="w-full max-w-5xl shadow-lg border-white-200 bg-white/80 backdrop-blur-sm animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl font-bold text-white-700">
                  <Heart className="h-7 w-7 text-white-500" />
                  Nuestros Valores
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  Principios que guían nuestro camino y la formación de nuestros
                  estudiantes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {values.map((value, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white-50 rounded-lg border border-white-100 hover:bg-white-100 transition-colors duration-200"
                    >
                      <div className="w-3 h-3 bg-white-600 rounded-full flex-shrink-0"></div>
                      <span className="text-lg font-medium text-foreground">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Galería de Imágenes (ahora con placeholders) */}
          <section
            id="gallery"
            className="py-16 px-4 flex flex-col items-center bg-white-50"
          >
            <Card className="w-full max-w-5xl shadow-lg border-white-200 bg-white/80 backdrop-blur-sm animate-fade-in-up">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-3 text-3xl font-bold text-white-700">
                  Nuestras Instalaciones
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  Un vistazo a los espacios donde construimos el futuro.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {/* Usamos un array fijo o generamos placeholders si no hay imágenes */}
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="aspect-video w-full overflow-hidden rounded-lg shadow-md border border-white-100 group relative bg-gray-200 flex items-center justify-center"
                    >
                      <ImageIcon className="h-16 w-16 text-gray-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <p className="text-white text-sm font-semibold">
                          Espacio {index + 1}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Alianzas y Certificaciones */}
          <section className="py-16 px-4 flex flex-col items-center">
            <Card className="w-full max-w-5xl shadow-lg border-white-200 bg-white/80 backdrop-blur-sm animate-fade-in-up">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-3 text-3xl font-bold text-white-700">
                  <Handshake className="h-7 w-7 text-white-600" />
                  Alianzas y Certificaciones
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  Trabajamos con las mejores instituciones para garantizar la
                  calidad educativa.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                  {alliancesAndCertifications.map((value, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white-50 rounded-lg border border-white-100 hover:bg-white-100 transition-colors duration-200"
                    >
                      <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-lg font-medium text-foreground">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* whitees Sociales */}
          <section
            id="contact"
            className="py-16 px-4 flex flex-col items-center bg-white-50"
          >
            <Card className="w-full max-w-4xl shadow-lg border-white-200 bg-white/80 backdrop-blur-sm animate-fade-in-up">
              <CardHeader className="text-center ">
                <CardTitle className="flex items-center justify-center gap-3 text-3xl font-bold text-white-700">
                  <Users className="h-7 w-7 text-white-600" />
                  Síguenos y Contacta{" "}
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-2">
                  <div className="flex items-center gap-3 text-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <span>Teléfono:</span>{" "}
                    <span className="font-semibold">
                      {escuela.telefono || " (618) 123-4567"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <Mail className="h-5 w-5 text-primary" />
                    <span>Email:</span>{" "}
                    <span className="font-semibold">
                      {escuela.email || " info@pato-cheman.edu.mx"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Horario:</span>{" "}
                    <span className="font-semibold">
                      Lunes a Viernes, 8:00 AM - 5:00 PM
                    </span>
                  </div>
                </CardDescription>
                <div>
                  <Button variant="outline" className="gap-2" asChild>
                    <Link href="/contacto">
                      Formulario de Contacto <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </section>
          
          <div className="">
            <SchoolMap
              direccion={escuela.direccion}
              nombreEscuela={escuela.nombre}
            />
          </div>
          <Footer />
        </div>
      </main>
    </>
  );
}
