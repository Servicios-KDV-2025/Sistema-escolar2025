"use client";

import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Loader2, School, CheckCircle2, Lightbulb, Users, Phone, Mail, MapPin, Headphones, Quote, ArrowRight, UserCircle
} from "lucide-react";
import Footer from "@/components/public/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const testimonios = [
  {
    nombre: "María López",
    texto: "La plataforma ha transformado la experiencia educativa de mis hijos. ¡Muy recomendable!",
    rol: "Madre de familia"
  },
  {
    nombre: "Juan Pérez",
    texto: "Como alumno, me siento más motivado y apoyado. La tecnología hace la diferencia.",
    rol: "Alumno de secundaria"
  },
  {
    nombre: "Ana Torres",
    texto: "El soporte y la atención personalizada son excelentes. Siempre están para ayudarte.",
    rol: "Padre de familia"
  }
];

export default function LandingPage() {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const contactoRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [sending, setSending] = useState(false);

  // Detectar subdominio
  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
      const match = hostname.match(/^([^.]+)\.localhost/);
      if (match && match[1]) setSubdomain(match[1]);
    } else {
      const parts = hostname.split(".");
      if (parts.length > 2) setSubdomain(parts[0]);
    }
    setIsLoading(false);
  }, []);

  // Consultar escuela por subdominio
  const escuela = useQuery(
    api.escuelas.obtenerEscuelaPorNombreCorto,
    subdomain ? { nombreCorto: subdomain } : "skip"
  );

  // Estado de carga
  if (isLoading || (subdomain && escuela === undefined)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Cargando información...</p>
      </div>
    );
  }


  // Si no existe la escuela
  if (subdomain && escuela === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <School className="h-8 w-8 text-red-500" />
              Escuela no encontrada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              No se encontró una escuela asociada al subdominio <span className="font-bold">{subdomain}</span>.
            </p>
            <div className="flex justify-center">
              <Button onClick={() => window.location.href = "/"}>
                Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Validación y envío del formulario de contacto (simulado)
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError("");
    setFormSuccess("");
  };
  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.mensaje) {
      setFormError("Todos los campos son obligatorios.");
      return;
    }
    if (!validateEmail(form.email)) {
      setFormError("El correo electrónico no es válido.");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setFormSuccess("¡Mensaje enviado! Nos pondremos en contacto pronto.");
      setForm({ nombre: "", email: "", mensaje: "" });
      setSending(false);
    }, 1200);
  };

  // Scroll a contacto
  const scrollToContacto = () => {
    contactoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Si existe la escuela
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* HERO visual */}
      <div className="relative bg-gradient-to-br from-blue-100 via-blue-50 to-white pb-20 overflow-hidden">
        {/* SVG decorativo */}
        <svg className="absolute top-0 left-0 w-full h-40 md:h-64 opacity-30" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#60a5fa" fillOpacity="0.2" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z" />
        </svg>
        <div className="max-w-5xl mx-auto px-4 pt-24 flex flex-col md:flex-row items-center gap-10 z-10 relative">
          <div className="flex-shrink-0 flex flex-col items-center">
            {/* Logo animado */}
            {escuela?.logoUrl ? (
              <Image
                src={escuela.logoUrl}
                alt="Logo escuela"
                className="h-40 w-40 rounded-full shadow-2xl border-4 border-white bg-white object-cover animate-fade-in"
                style={{ animation: 'fadeIn 1.2s' }}
              />
            ) : (
              <div className="h-40 w-40 rounded-full bg-white flex items-center justify-center text-7xl font-extrabold text-blue-600 shadow-2xl border-4 border-white animate-fade-in">
                {escuela?.nombre?.[0] || "E"}
              </div>
            )}
            <span className="mt-3 text-lg font-semibold text-blue-900 tracking-widest uppercase animate-fade-in" style={{ animationDelay: '0.3s' }}>{escuela?.nombreCorto?.toUpperCase()}</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold text-blue-900 mb-4 drop-shadow-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {escuela?.nombre}
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-blue-700 mb-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent underline underline-offset-4 decoration-blue-300">{escuela?.descripcion || "Educación de calidad, innovación y tecnología para transformar el futuro."}</span>
            </p>
            <p className="text-base md:text-lg text-blue-800 mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              ¡Únete a una comunidad que impulsa el aprendizaje y la innovación cada día!
            </p>
            {/* Badges de confianza */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold shadow">
                <CheckCircle2 className="h-4 w-4" /> +100 familias satisfechas
              </span>
              <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold shadow">
                <Lightbulb className="h-4 w-4" /> Certificada SEP
              </span>
              <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold shadow">
                <Users className="h-4 w-4" /> Comunidad activa
              </span>
            </div>
            <Button
              size="lg"
              className="mt-2 px-10 py-4 text-lg font-bold shadow-xl transition-transform duration-200 hover:scale-105 hover:bg-blue-700 group animate-bounce-in"
              onClick={scrollToContacto}
              style={{ animationDelay: '1s' }}
            >
              Solicita información
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                <ArrowRight className="h-5 w-5 animate-pulse" />
              </span>
            </Button>
          </div>
        </div>
        {/* Animaciones CSS */}
        <style jsx global>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          .animate-fade-in { animation: fadeIn 1s both; }
          @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
          .animate-slide-up { animation: slideUp 1s both; }
          @keyframes bounceIn { 0% { transform: scale(0.8); opacity: 0; } 60% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); } }
          .animate-bounce-in { animation: bounceIn 0.8s both; }
        `}</style>
      </div>

      {/* Sección de ventajas tipo SaaS */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10 text-blue-900">¿Por qué elegirnos?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="bg-white shadow-md hover:scale-105 transition-transform">
            <CardContent className="flex flex-col items-center gap-2 py-8">
              <Lightbulb className="h-10 w-10 text-yellow-400" />
              <CardTitle>Innovación Educativa</CardTitle>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Métodos y tecnología de vanguardia para el aprendizaje del siglo XXI.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md hover:scale-105 transition-transform">
            <CardContent className="flex flex-col items-center gap-2 py-8">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
              <CardTitle>Calidad y Excelencia</CardTitle>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Compromiso con la formación integral y el desarrollo de valores.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md hover:scale-105 transition-transform">
            <CardContent className="flex flex-col items-center gap-2 py-8">
              <Users className="h-10 w-10 text-blue-500" />
              <CardTitle>Comunidad y Apoyo</CardTitle>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Un ambiente seguro, inclusivo y colaborativo para todos.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md hover:scale-105 transition-transform">
            <CardContent className="flex flex-col items-center gap-2 py-8">
              <Headphones className="h-10 w-10 text-purple-500" />
              <CardTitle>Soporte Personalizado</CardTitle>
              <p className="text-sm text-muted-foreground text-center mt-2">
                Atención cercana y rápida para resolver cualquier duda o necesidad.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sección de testimonios */}
      <section className="bg-blue-50 py-16">
        <h2 className="text-2xl font-bold text-center text-blue-900 mb-10">Lo que dicen de nosotros</h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {testimonios.map((t, i) => (
            <Card key={i} className="bg-white shadow-lg hover:scale-105 transition-transform">
              <CardContent className="flex flex-col items-center gap-4 py-8">
                <Quote className="h-8 w-8 text-blue-400 mb-2" />
                <p className="text-center italic text-blue-900">“{t.texto}”</p>
                <div className="flex items-center gap-2 mt-4">
                  <UserCircle className="h-6 w-6 text-blue-600" />
                  <span className="font-semibold text-blue-900">{t.nombre}</span>
                </div>
                <span className="text-xs text-muted-foreground">{t.rol}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Sección de pasos */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-blue-900 mb-10 text-center">¿Cómo funciona?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white shadow-md">
            <CardContent className="flex flex-col items-center gap-3 py-8">
              <span className="text-4xl font-bold text-blue-600">1</span>
              <CardTitle>Inscríbete</CardTitle>
              <p className="text-sm text-muted-foreground text-center mt-2">Completa tu registro en línea o solicita información personalizada.</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardContent className="flex flex-col items-center gap-3 py-8">
              <span className="text-4xl font-bold text-blue-600">2</span>
              <CardTitle>Accede a la plataforma</CardTitle>
              <p className="text-sm text-muted-foreground text-center mt-2">Recibe tus credenciales y explora todos los recursos educativos.</p>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardContent className="flex flex-col items-center gap-3 py-8">
              <span className="text-4xl font-bold text-blue-600">3</span>
              <CardTitle>Disfruta la experiencia</CardTitle>
              <p className="text-sm text-muted-foreground text-center mt-2">Aprende, colabora y crece en una comunidad innovadora.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sección de contacto rápido y formulario */}
      <section ref={contactoRef} className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-blue-900 mb-8 text-center">Contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Formulario */}
          <form onSubmit={handleFormSubmit} className="bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-2xl p-10 flex flex-col gap-5 border border-blue-100">
            <div className="flex flex-col gap-2">
              <label htmlFor="nombre" className="font-semibold text-blue-900 flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-blue-500" /> Nombre
              </label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleFormChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                placeholder="Tu nombre completo"
                disabled={sending}
                autoComplete="name"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-semibold text-blue-900 flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" /> Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleFormChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                placeholder="tucorreo@ejemplo.com"
                disabled={sending}
                autoComplete="email"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="mensaje" className="font-semibold text-blue-900 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-500" /> Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={form.mensaje}
                onChange={handleFormChange}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                placeholder="¿En qué podemos ayudarte?"
                rows={4}
                disabled={sending}
                required
              />
            </div>
            <div className="flex flex-col gap-2 mt-2">
              {formError && <span className="text-red-500 text-sm flex items-center gap-2"><School className="h-4 w-4" /> {formError}</span>}
              {formSuccess && <span className="text-green-600 text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> {formSuccess}</span>}
            </div>
            <Button type="submit" size="lg" className="mt-2 flex items-center justify-center gap-2 text-base font-semibold shadow-lg" disabled={sending}>
              {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />} {sending ? "Enviando..." : "Enviar mensaje"}
            </Button>
            <span className="text-xs text-muted-foreground text-center mt-2">Tus datos están seguros. Solo se usarán para responder tu consulta.</span>
          </form>
          {/* Datos de contacto directo */}
          <div className="flex flex-col gap-6 justify-center">
            <div className="flex items-center gap-3 bg-white rounded-lg shadow px-4 py-3">
              <Button asChild variant="ghost" size="icon" className="p-0">
                <a href={`tel:${escuela?.telefono || ''}`} title="Llamar">
                  <Phone className="h-5 w-5 text-primary" />
                </a>
              </Button>
              <span className="text-sm">{escuela?.telefono || "(000) 000-0000"}</span>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-lg shadow px-4 py-3">
              <Button asChild variant="ghost" size="icon" className="p-0">
                <a href={`mailto:${escuela?.email || ''}`} title="Enviar correo">
                  <Mail className="h-5 w-5 text-primary" />
                </a>
              </Button>
              <span className="text-sm">{escuela?.email || "info@escuela.edu.mx"}</span>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-lg shadow px-4 py-3">
              <Button asChild variant="ghost" size="icon" className="p-0">
                <a href={`https://maps.google.com/?q=${encodeURIComponent(escuela?.direccion || '')}`} target="_blank" rel="noopener noreferrer" title="Ver en mapa">
                  <MapPin className="h-5 w-5 text-primary" />
                </a>
              </Button>
              <span className="text-sm">{escuela?.direccion || "Dirección no disponible"}</span>
            </div>
            {/* Redes sociales de ejemplo */}
            <div className="flex gap-3 mt-2">
              <Button asChild variant="ghost" size="icon">
                <a href="https://facebook.com/tuescuela" target="_blank" rel="noopener noreferrer" title="Facebook">
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.406.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <a href="https://instagram.com/tuescuela" target="_blank" rel="noopener noreferrer" title="Instagram">
                  <svg className="h-5 w-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.782 2.225 7.148 2.163 8.414 2.105 8.794 2.094 12 2.094zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.128 4.633.4 3.658 1.374c-.974.974-1.246 2.241-1.308 3.608C2.175 8.414 2.163 8.794 2.163 12c0 3.206.012 3.586.07 4.85.062 1.366.334 2.633 1.308 3.608.974.974 2.241 1.246 3.608 1.308 1.266.058 1.646.069 4.85.069s3.584-.012 4.85-.07c1.366-.062 2.633-.334 3.608-1.308.974-.974 1.246-2.241 1.308-3.608.058-1.266.069-1.646.069-4.85s-.012-3.584-.07-4.85c-.062-1.366-.334-2.633-1.308-3.608-.974-.974-2.241-1.246-3.608-1.308C15.259.012 15.206 0 12 0z"/><circle cx="12" cy="12" r="3.5"/><circle cx="18.406" cy="5.594" r="1.44"/></svg>
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon">
                <a href="https://twitter.com/tuescuela" target="_blank" rel="noopener noreferrer" title="Twitter">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 0 0-8.384 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.117 2.823 5.254a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.058 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg>
                </a>
              </Button>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">Horario de atención: Lunes a Viernes 8:00-16:00</div>
          </div>
        </div>
      </section>

      {/* Footer mejorado */}
      <Footer />
    </div>
  );
}