"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@repo/ui/components/shadcn/badge"
import {
  School,
  Loader2,
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  ChevronRight,
  Menu,
} from "lucide-react"

// Tipos de datos
interface OfertaEducativa {
  id: string
  titulo: string
  descripcion: string
  duracion: string
  modalidad: string
  nivel: string
  icono: string
  precio?: string
  disponible: boolean
}

interface Campus {
  id: string
  nombre: string
  direccion: string
  telefono: string
  email: string
  horario: string
}

interface FAQ {
  id: string
  pregunta: string
  respuesta: string
  categoria: string
}

export default function OfertaEducativaPage() {
  const [ofertas, setOfertas] = useState<OfertaEducativa[]>([])
  const [campus, setCampus] = useState<Campus[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simular carga de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Simular delay de API
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Datos mock
        const mockOfertas: OfertaEducativa[] = [
          {
            id: "1",
            titulo: "Ingeniería en Sistemas",
            descripcion:
              "Programa integral que forma profesionales capaces de diseñar, desarrollar e implementar soluciones tecnológicas innovadoras.",
            duracion: "4 años",
            modalidad: "Presencial",
            nivel: "Licenciatura",
            icono: "laptop",
            disponible: true,
          },
          {
            id: "2",
            titulo: "Administración de Empresas",
            descripcion:
              "Carrera enfocada en formar líderes empresariales con visión estratégica y habilidades gerenciales.",
            duracion: "4 años",
            modalidad: "Presencial/Virtual",
            nivel: "Licenciatura",
            icono: "briefcase",
            disponible: true,
          },
          {
            id: "3",
            titulo: "Diseño Gráfico Digital",
            descripcion: "Programa creativo que combina arte, tecnología y comunicación visual para el mundo digital.",
            duracion: "3 años",
            modalidad: "Presencial",
            nivel: "Licenciatura",
            icono: "palette",
            disponible: true,
          },
          {
            id: "4",
            titulo: "Marketing Digital",
            descripcion: "Especialización en estrategias de marketing online, redes sociales y comercio electrónico.",
            duracion: "2 años",
            modalidad: "Virtual",
            nivel: "Técnico Superior",
            icono: "trending-up",
            disponible: true,
          },
          {
            id: "5",
            titulo: "Psicología Clínica",
            descripcion: "Formación integral en psicología con enfoque en la práctica clínica y terapéutica.",
            duracion: "5 años",
            modalidad: "Presencial",
            nivel: "Licenciatura",
            icono: "brain",
            disponible: false,
          },
          {
            id: "6",
            titulo: "Contabilidad y Finanzas",
            descripcion: "Programa especializado en gestión financiera, contabilidad y análisis económico empresarial.",
            duracion: "4 años",
            modalidad: "Presencial/Virtual",
            nivel: "Licenciatura",
            icono: "calculator",
            disponible: true,
          },
        ]

        const mockCampus: Campus[] = [
          {
            id: "1",
            nombre: "Campus Central",
            direccion: "Av. Principal 123, Ciudad",
            telefono: "+1 234 567 8900",
            email: "central@instituto.edu",
            horario: "Lunes a Viernes: 7:00 AM - 10:00 PM",
          },
          {
            id: "2",
            nombre: "Campus Norte",
            direccion: "Calle Norte 456, Zona Norte",
            telefono: "+1 234 567 8901",
            email: "norte@instituto.edu",
            horario: "Lunes a Sábado: 8:00 AM - 9:00 PM",
          },
          {
            id: "3",
            nombre: "Campus Virtual",
            direccion: "Plataforma Online",
            telefono: "+1 234 567 8902",
            email: "virtual@instituto.edu",
            horario: "24/7 - Soporte: 8:00 AM - 6:00 PM",
          },
        ]

        const mockFAQs: FAQ[] = [
          {
            id: "1",
            pregunta: "¿Cuáles son los requisitos de admisión?",
            respuesta:
              "Los requisitos varían según el programa, pero generalmente incluyen certificado de bachillerato, examen de admisión y entrevista personal.",
            categoria: "Admisiones",
          },
          {
            id: "2",
            pregunta: "¿Ofrecen becas o ayuda financiera?",
            respuesta:
              "Sí, contamos con diversos programas de becas académicas, deportivas y socioeconómicas. También ofrecemos planes de financiamiento.",
            categoria: "Financiamiento",
          },
          {
            id: "3",
            pregunta: "¿Los títulos están acreditados?",
            respuesta:
              "Todos nuestros programas están debidamente acreditados por el Ministerio de Educación y organismos internacionales.",
            categoria: "Acreditación",
          },
          {
            id: "4",
            pregunta: "¿Cuándo inician las clases?",
            respuesta:
              "Tenemos tres períodos de inicio al año: enero, mayo y septiembre. Las fechas exactas se publican en nuestro calendario académico.",
            categoria: "Calendario",
          },
          {
            id: "5",
            pregunta: "¿Qué modalidades de estudio ofrecen?",
            respuesta:
              "Ofrecemos modalidades presencial, virtual y semipresencial, adaptándonos a las necesidades de cada estudiante.",
            categoria: "Modalidades",
          },
          {
            id: "6",
            pregunta: "¿Tienen convenios internacionales?",
            respuesta:
              "Sí, mantenemos alianzas con universidades de Estados Unidos, Europa y América Latina para intercambios estudiantiles.",
            categoria: "Internacional",
          },
        ]

        setOfertas(mockOfertas)
        setCampus(mockCampus)
        setFaqs(mockFAQs)
        setError(null)
      } catch (err) {
        setError("Error al cargar la información. Por favor, intenta nuevamente.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      laptop: BookOpen,
      briefcase: Users,
      palette: Award,
      "trending-up": GraduationCap,
      brain: School,
      calculator: Clock,
    }
    const IconComponent = iconMap[iconName] || BookOpen
    return <IconComponent className="h-6 w-6" />
  }

  const handleOfertaClick = (ofertaId: string) => {
    // Navegar a los detalles de la oferta
    console.log(`Navegando a oferta: ${ofertaId}`)
  }

  // Estado de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        {/* Header */}
        <header className="w-full p-4">
          <nav className="bg-white rounded-full px-6 py-3 mx-auto max-w-4xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <School className="h-6 w-6 text-blue-600" />
                <span className="font-semibold text-foreground">INSTITUTO</span>
              </div>
              <div className="hidden md:flex items-center space-x-6 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm">
                  INICIO
                </Button>
                <Button variant="ghost" size="sm">
                  NOSOTROS
                </Button>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  OFERTA EDUCATIVA
                </Button>
                <Button variant="ghost" size="sm">
                  INSCRIPCIONES
                </Button>
                <Button variant="ghost" size="sm">
                  CONTACTO
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </nav>
        </header>

        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                Cargando Oferta Educativa...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Preparando la información de nuestros programas académicos...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <AlertCircle className="h-6 w-6 text-red-500" />
                Error al cargar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">{error}</p>
              <div className="flex justify-center">
                <Button onClick={() => window.location.reload()}>Reintentar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header Navigation */}
      <header className="w-full p-4">
        <nav className="bg-white rounded-full px-6 py-3 mx-auto max-w-6xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <School className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-foreground">INSTITUTO</span>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-muted-foreground">
              <Button variant="ghost" size="sm">
                INICIO
              </Button>
              <Button variant="ghost" size="sm">
                NOSOTROS
              </Button>
              <Button variant="ghost" size="sm" className="text-blue-600 bg-blue-50">
                OFERTA EDUCATIVA
              </Button>
              <Button variant="ghost" size="sm">
                INSCRIPCIONES
              </Button>
              <Button variant="ghost" size="sm">
                CONTACTO
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-[30vh] px-4">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-8 border-2 border-gray-700 rounded-full bg-blue-200/50"></div>
              <div className="w-14 h-7 border-2 border-gray-700 rounded-full bg-blue-200/50 absolute top-4 left-1"></div>
              <div className="w-12 h-6 border-2 border-gray-700 rounded-full bg-blue-200/50 absolute top-6 left-2"></div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">OFERTA EDUCATIVA</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center space-y-8 px-4 pb-16">
        {/* Ofertas Educativas */}
        <Card className="w-full max-w-6xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              Descripción Nivel Educativo
            </CardTitle>
            <p className="text-muted-foreground">
              Explora nuestros programas académicos diseñados para tu crecimiento profesional
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ofertas.map((oferta) => (
                <Card
                  key={oferta.id}
                  className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                    !oferta.disponible ? "opacity-60" : ""
                  }`}
                  onClick={() => oferta.disponible && handleOfertaClick(oferta.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          {getIconComponent(oferta.icono)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{oferta.titulo}</CardTitle>
                          <Badge variant={oferta.disponible ? "default" : "secondary"} className="mt-1">
                            {oferta.nivel}
                          </Badge>
                        </div>
                      </div>
                      {oferta.disponible && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm mb-4">{oferta.descripcion}</p>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>Duración: {oferta.duracion}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>Modalidad: {oferta.modalidad}</span>
                      </div>
                    </div>
                    {!oferta.disponible && (
                      <Badge variant="outline" className="mt-3 text-orange-600 border-orange-600">
                        Próximamente
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campus Information */}
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl">
          {campus.map((camp) => (
            <Card key={camp.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  {camp.nombre}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{camp.direccion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>{camp.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span>{camp.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{camp.horario}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Ubicación Section */}
        <Card className="w-full max-w-6xl">
          <CardContent className="py-16 text-center">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Ubicación</h3>
            <p className="text-muted-foreground mb-6">Encuentra nuestras instalaciones y planifica tu visita</p>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="text-left space-y-3">
                <h4 className="font-semibold text-foreground">Dirección Principal</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Av. Educación 123, Zona Universitaria
                      <br />
                      Ciudad, País 12345
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span>+1 (234) 567-8900</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span>info@instituto.edu</span>
                  </div>
                </div>
              </div>
              <div className="text-left space-y-3">
                <h4 className="font-semibold text-foreground">Transporte Público</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Metro: Línea Azul, Estación Universidad</p>
                  <p>• Autobús: Rutas 15, 23, 45</p>
                  <p>• Estacionamiento disponible para estudiantes</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline" className="gap-2 bg-transparent">
                <MapPin className="h-4 w-4" />
                Ver en Google Maps
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="w-full max-w-6xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">FAQ</h2>
            <p className="text-muted-foreground">Preguntas frecuentes sobre nuestros programas</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {faqs.map((faq) => (
              <Card key={faq.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">"{faq.pregunta}"</CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {faq.categoria}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{faq.respuesta}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
