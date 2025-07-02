"use client"

import { useEffect, useState } from "react"
// import Image from "next/image" // Ya no necesitamos importar Image si no la usamos
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui/components/shadcn/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@repo/ui/components/shadcn/badge"
import {
  School,
  Target,
  Eye,
  Heart,
  Facebook,
  Instagram,
  Phone,
  Twitter,
  Menu,
  Users,
  BookOpen,
  GraduationCap,
  MapPin,
  Award,
  BookText,
  Images,
  Handshake,
  Image as ImageIcon // Renombramos el ícono para evitar conflicto con el componente Image de Next.js si lo vuelves a usar
} from "lucide-react"

// Define un tipo para los datos de tu instituto para una mejor seguridad y organización del código
interface InstituteData {
  name: string
  slogan: string
  logoUrl?: string // Logo opcional (aunque no lo usaremos directamente, lo mantenemos por si quieres un color)
  address?: string
  history: string[]
  mission: string
  vision: string
  values: string[]
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
    phone?: string
  }
  // galleryImages: string[] // Ya no necesitamos URLs de imágenes aquí
  alliancesAndCertifications: string[]
  quickLinks: { label: string; href: string; icon: React.ElementType }[]
}

// Datos de ejemplo (reemplaza esto con la obtención de datos real más tarde)
const mockInstituteData: InstituteData = {
  name: "INSTITUTO",
  slogan: "Innovación que educa, tecnología que transforma.",
  // logoUrl: "/path/to/your/logo.png", // Comentamos o quitamos si no hay imagen
  address: "123 Calle de la Educación, Ciudad Universitaria, Durango, México", // Agregado Durango, México
  history: [
    "Nuestro instituto nace de la visión de transformar la educación a través de la innovación y la tecnología. Desde nuestros inicios, hemos estado comprometidos con brindar una educación de calidad que prepare a nuestros estudiantes para los desafíos del futuro.",
    "Con más de una década de experiencia, hemos formado a miles de profesionales que hoy contribuyen al desarrollo de nuestra sociedad. Nuestro enfoque pedagógico combina la excelencia académica con la formación integral, promoviendo valores que fortalecen el carácter y la responsabilidad social.",
  ],
  mission:
    "Formar profesionales íntegros y competentes, comprometidos con la excelencia académica y el desarrollo sostenible de la sociedad, a través de programas educativos innovadores y de alta calidad.",
  vision:
    "Ser reconocidos como una institución educativa líder en innovación y calidad, que contribuye significativamente al desarrollo del conocimiento y la formación de ciudadanos comprometidos con su entorno.",
  values: ["Honestidad", "Responsabilidad", "Compromiso", "Amistad", "Justicia", "Respeto", "Solidaridad"],
  socialMedia: {
    facebook: "https://facebook.com/instituto",
    instagram: "https://instagram.com/instituto",
    twitter: "https://twitter.com/instituto",
    phone: "tel:+123456789",
  },
  // galleryImages: [], // Vacío ya que no usaremos rutas de imágenes
  alliancesAndCertifications: [
    "Universidad Tecnológica Nacional",
    "Certificación ISO 9001",
    "Partnership con Tech Innovations Inc.",
  ],
  quickLinks: [
    { label: "INICIO", href: "#hero", icon: School },
    { label: "NOSOTROS", href: "#about", icon: BookText },
    { label: "OFERTA EDUCATIVA", href: "#oferta", icon: GraduationCap },
    { label: "INSCRIPCIONES", href: "#inscripciones", icon: Users },
    { label: "CONTACTO", href: "#contact", icon: Phone },
  ],
}

export default function InstitutoPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [instituteData, setInstituteData] = useState<InstituteData | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Simular la obtención de datos
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simula un retardo de llamada a la API
      setInstituteData(mockInstituteData)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
        <Card className="w-full max-w-md shadow-lg animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl text-blue-600">
              <School className="h-8 w-8 animate-pulse" />
              Cargando Instituto...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-lg text-muted-foreground">Preparando la experiencia educativa...</p>
            <div className="mt-4 h-2 bg-blue-200 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-blue-500 rounded-full animate-progress-bar"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!instituteData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-50 to-red-100 p-4 text-red-700">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Error de Carga</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">No se pudo cargar la información del instituto. Intente de nuevo más tarde.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 antialiased">
      {/* Navegación del Encabezado */}
      <header className="w-full p-4 sticky top-0 z-50 bg-gradient-to-b from-blue-50 to-blue-100">
        <nav className="bg-white rounded-full px-4 py-2 mx-auto max-w-5xl shadow-md border border-blue-200 backdrop-blur-sm bg-opacity-80">
          <div className="flex items-center justify-between">
            <a href="#hero" className="flex items-center space-x-2 shrink-0">
              {/* Aquí usamos un ícono o un placeholder de color para el logo */}
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                I
              </div> {/* Inicial del nombre del instituto */}
              <span className="font-extrabold text-xl text-foreground hidden sm:inline">{instituteData.name}</span>
            </a>
            <div className="hidden md:flex items-center space-x-2 text-sm">
              {instituteData.quickLinks.map((link) => (
                <Button key={link.href} variant="ghost" size="lg" className="text-base text-muted-foreground hover:text-primary-foreground hover:bg-primary/20 transition-colors duration-200" asChild>
                  <a href={link.href} className="flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </a>
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Abrir/Cerrar menú móvil"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </nav>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white rounded-lg shadow-lg mt-2 mx-auto max-w-xs p-4 border border-blue-200">
            <div className="flex flex-col space-y-2">
              {instituteData.quickLinks.map((link) => (
                <Button key={link.href} variant="ghost" className="w-full justify-start text-base" asChild>
                  <a href={link.href} onClick={toggleMobileMenu} className="flex items-center gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </a>
                </Button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Sección Hero */}
      <section id="hero" className="relative flex items-center justify-center min-h-[60vh] px-4 py-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/10 opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_80%)]" />
        <Card className="w-full max-w-3xl bg-white/80 backdrop-blur-sm shadow-xl border-blue-200 animate-fade-in-up">
          <CardHeader>
            <div className="flex justify-center mb-4">
              {/* Placeholder para el logo principal */}
              <div className="h-32 w-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-5xl font-extrabold shadow-lg border-4 border-blue-300 transform transition-transform duration-500 hover:scale-105">
                I
              </div> {/* Una "I" grande como inicial */}
            </div>
            <CardTitle className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
              {instituteData.name}
            </CardTitle>
            <CardDescription className="text-xl text-muted-foreground mt-2">
              {instituteData.slogan}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {instituteData.address && (
              <Badge variant="outline" className="mt-4 px-4 py-2 text-sm text-blue-700 bg-blue-50 border-blue-300">
                <MapPin className="h-4 w-4 mr-2" />
                {instituteData.address}
              </Badge>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Sección Sobre Nosotros - Historia/Mensaje */}
      <section id="about" className="py-16 px-4 flex flex-col items-center">
        <Card className="w-full max-w-5xl shadow-lg border-blue-200 bg-white/80 backdrop-blur-sm animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-3xl font-bold text-blue-700">
              <BookText className="h-7 w-7 text-blue-600" />
              Nuestra Historia
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Conoce el camino que nos ha traído hasta aquí.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            {instituteData.history.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Sección Misión y Visión */}
      <section className="py-16 px-4 flex flex-col items-center bg-blue-50">
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
          <Card className="shadow-lg border-green-200 bg-white/80 backdrop-blur-sm animate-fade-in-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-green-700">
                <Target className="h-6 w-6 text-green-600" />
                Misión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">{instituteData.mission}</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-purple-200 bg-white/80 backdrop-blur-sm animate-fade-in-right">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-purple-700">
                <Eye className="h-6 w-6 text-purple-600" />
                Visión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">{instituteData.vision}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sección Valores */}
      <section className="py-16 px-4 flex flex-col items-center">
        <Card className="w-full max-w-5xl shadow-lg border-red-200 bg-white/80 backdrop-blur-sm animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-3xl font-bold text-red-700">
              <Heart className="h-7 w-7 text-red-500" />
              Nuestros Valores
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Principios que guían nuestro camino y la formación de nuestros estudiantes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {instituteData.values.map((value, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors duration-200">
                  <div className="w-3 h-3 bg-blue-600 rounded-full flex-shrink-0"></div>
                  <span className="text-lg font-medium text-foreground">{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Galería de Imágenes (ahora con placeholders) */}
      <section id="gallery" className="py-16 px-4 flex flex-col items-center bg-blue-50">
        <Card className="w-full max-w-5xl shadow-lg border-blue-200 bg-white/80 backdrop-blur-sm animate-fade-in-up">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-3xl font-bold text-blue-700">
              <Images className="h-7 w-7 text-blue-600" />
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
                  className="aspect-video w-full overflow-hidden rounded-lg shadow-md border border-blue-100 group relative bg-gray-200 flex items-center justify-center"
                >
                  <ImageIcon className="h-16 w-16 text-gray-500 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm font-semibold">Espacio {index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Alianzas y Certificaciones */}
      <section className="py-16 px-4 flex flex-col items-center">
        <Card className="w-full max-w-5xl shadow-lg border-blue-200 bg-white/80 backdrop-blur-sm animate-fade-in-up">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-3xl font-bold text-blue-700">
              <Handshake className="h-7 w-7 text-blue-600" />
              Alianzas y Certificaciones
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Trabajamos con las mejores instituciones para garantizar la calidad educativa.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              {instituteData.alliancesAndCertifications.map((item, index) => (
                <Badge key={index} variant="secondary" className="px-6 py-3 text-base justify-center flex items-center gap-2 bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200 transition-colors duration-200">
                  <Award className="h-5 w-5 text-blue-600" />
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Redes Sociales */}
      <section id="contact" className="py-16 px-4 flex flex-col items-center bg-blue-50">
        <Card className="w-full max-w-2xl shadow-lg border-blue-200 bg-white/80 backdrop-blur-sm animate-fade-in-up">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-3xl font-bold text-blue-700">
              <Users className="h-7 w-7 text-blue-600" />
              Síguenos y Contacta
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground mt-2">
              Mantente al día con nuestras novedades y comunícate con nosotros.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center space-x-6">
              {instituteData.socialMedia.facebook && (
                <Button variant="outline" size="icon" asChild className="h-12 w-12 rounded-full text-blue-700 border-blue-300 hover:bg-blue-100 hover:text-blue-900 transition-all duration-200">
                  <a href={instituteData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <Facebook className="h-6 w-6" />
                  </a>
                </Button>
              )}
              {instituteData.socialMedia.instagram && (
                <Button variant="outline" size="icon" asChild className="h-12 w-12 rounded-full text-pink-600 border-pink-300 hover:bg-pink-100 hover:text-pink-800 transition-all duration-200">
                  <a href={instituteData.socialMedia.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram className="h-6 w-6" />
                  </a>
                </Button>
              )}
              {instituteData.socialMedia.twitter && (
                <Button variant="outline" size="icon" asChild className="h-12 w-12 rounded-full text-sky-500 border-sky-300 hover:bg-sky-100 hover:text-sky-700 transition-all duration-200">
                  <a href={instituteData.socialMedia.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <Twitter className="h-6 w-6" />
                  </a>
                </Button>
              )}
              {instituteData.socialMedia.phone && (
                <Button variant="outline" size="icon" asChild className="h-12 w-12 rounded-full text-green-600 border-green-300 hover:bg-green-100 hover:text-green-800 transition-all duration-200">
                  <a href={instituteData.socialMedia.phone} aria-label="Teléfono">
                    <Phone className="h-6 w-6" />
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Pie de página */}
      <footer className="w-full bg-blue-800 text-white py-8 px-4 text-center">
        <div className="max-w-5xl mx-auto space-y-4">
          <p className="text-lg font-semibold">&copy; {new Date().getFullYear()} {instituteData.name}. Todos los derechos reservados.</p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:underline">Política de Privacidad</a>
            <a href="#" className="hover:underline">Términos de Servicio</a>
            <a href="#" className="hover:underline">Mapa del Sitio</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes progress-bar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-fade-in-left { animation: fade-in-left 0.8s ease-out forwards; }
        .animate-fade-in-right { animation: fade-in-right 0.8s ease-out forwards; }
        .animate-progress-bar { animation: progress-bar 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  )
}