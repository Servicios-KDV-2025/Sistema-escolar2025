import PreCompraForm from "@/components/PreCompraForm";
import { Badge } from "@repo/ui/components/shadcn/badge";
import { Button } from "@repo/ui/components/shadcn/button";
import Link from "next/link";

export default function PreCompraPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="container mx-auto px-4 py-12 relative">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm">
              🚀 Comienza tu transformación digital
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Configura tu
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Institución</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Completa la información de tu escuela y comienza a disfrutar de todas las ventajas 
              del Sistema Escolar 2025 en cuestión de minutos.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Form Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Información de tu Institución
              </h2>
              <p className="text-gray-600">
                Cuéntanos sobre tu escuela para personalizar tu experiencia
              </p>
            </div>
            <div>

            <PreCompraForm />
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              ¿Tienes preguntas sobre el proceso?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Nuestro equipo está listo para ayudarte a configurar tu institución 
              y responder cualquier duda que tengas sobre el sistema.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3">
                Contactar Soporte
              </Button>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3">
                <Link href="/">Volver al Inicio</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}