"use client";

import Image from "next/image";
import { useEscuela } from "../../store/useEscuela";
import { useEffect } from "react";
import { useBreadcrumbStore } from "../../store/breadcrumbStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { Badge } from "@repo/ui/components/shadcn/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Calendar, BarChart3,  Settings, GraduationCap, MapPin, Shield, Clock, Award } from "lucide-react";

export default function EscuelaHome() {
  const escuela = useEscuela((s) => s.escuela);
  const setItems = useBreadcrumbStore(state => state.setItems);

  useEffect(() => {
    if (escuela) {
      setItems([
        { label: `${escuela?.nombre}` }
      ]);
    }
  }, [escuela, setItems]);

  if (!escuela) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando información de la escuela...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Gestión de Alumnos",
      description: "Administrar estudiantes y expedientes",
      icon: Users,
      href: "/estudiantes",
      color: "bg-blue-500"
    },
    {
      title: "Calificaciones",
      description: "Revisar y actualizar calificaciones",
      icon: BarChart3,
      href: "/calificaciones",
      color: "bg-green-500"
    },
    {
      title: "Horarios",
      description: "Programar clases y eventos",
      icon: Calendar,
      href: "/horarios",
      color: "bg-purple-500"
    },
    {
      title: "Materias",
      description: "Administrar cursos y materias",
      icon: BookOpen,
      href: "/materias",
      color: "bg-orange-500"
    }
  ];

  const stats = [
    {
      title: "Estudiantes Activos",
      value: "1,247",
      icon: GraduationCap,
      trend: "+12% este mes"
    },
    {
      title: "Profesores",
      value: "86",
      icon: Users,
      trend: "Personal completo"
    },
    {
      title: "Materias",
      value: "42",
      icon: BookOpen,
      trend: "Todos los niveles"
    },
    {
      title: "Promedio General",
      value: "8.7",
      icon: Award,
      trend: "+0.3 vs mes anterior"
    }
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-6">
              {escuela.logoUrl && (
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
                  <Image
                    src={escuela.logoUrl}
                    alt="Logo de la escuela"
                    width={100}
                    height={100}
                    className="relative rounded-2xl shadow-lg ring-1 ring-white/20"
                  />
                </div>
              )}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold tracking-tight">{escuela.nombre}</h1>
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="w-3 h-3 mr-1" />
                    Activa
                  </Badge>
                </div>
                {escuela.direccion && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{escuela.direccion}</span>
                  </div>
                )}
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Plataforma integral de gestión educativa para administrar estudiantes, 
                  calificaciones, horarios y recursos académicos de manera eficiente.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="gap-2">
                <Settings className="w-4 h-4" />
                Configuración
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Clock className="w-4 h-4" />
                Actividad Reciente
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Acciones Rápidas</h2>
            <p className="text-muted-foreground">Accede a las funciones principales del sistema</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${action.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {action.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {action.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <GraduationCap className="h-5 w-5 text-primary" />
            Bienvenido a {escuela.nombre}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Esta plataforma te permitirá gestionar de manera integral todos los aspectos 
            administrativos y académicos de la institución. Desde el seguimiento de estudiantes 
            hasta la generación de reportes académicos, todo en un solo lugar.
          </p>
          <Separator />
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>ID de la Institución: <code className="bg-muted px-2 py-1 rounded text-xs">{escuela._id}</code></span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}