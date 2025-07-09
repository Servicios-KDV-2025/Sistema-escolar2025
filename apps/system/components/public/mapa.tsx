// components/SchoolMap.tsx
"use client";

import Link from "next/link";
import { MapPin, LocateFixed, Map} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent,CardDescription, CardHeader,CardTitle} from "@repo/ui/components/shadcn/card"; // Asegúrate de que esta ruta sea correcta

interface SchoolMapProps {
  direccion?: string; // Puede ser opcional si no siempre hay una dirección
  nombreEscuela: string;
}
const campus = [
    {
      title: "Centro",
      description: "Clasico",
      icon: Map,
      href: "/estudiantes",
      color: "bg-green-500",
    },
    {
      title: "Norte",
      description: "Una ubicación mas para ti",
      icon: Map,
      href: "/calificaciones",
      color: "bg-blue-500",
    },
    {
      title: "Sur",
      description: "Dirección",
      icon: Map,
      href: "/horarios",
      color: "bg-purple-500",
    },
  ];

export default function SchoolMap({ direccion, nombreEscuela }: SchoolMapProps) {
const googleMapsEmbedUrl = `https://maps.google.com/maps?q=$${encodeURIComponent(direccion || "Durango, Dgo., Mexico")}&z=15&output=embed`;


  return (
    <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                  <LocateFixed className="h-6 w-6 text-primary" />
                  Ubicación del Campus
                </h2>
                <p className="text-muted-foreground">
                  Encuéntranos fácilmente en el mapa
                </p>
              </div>
              {direccion && (
                <Button variant="outline" asChild>
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    Abrir en Google Maps
                  </Link>
                </Button>
              )}
            </div>

            <Card className="">
              <CardContent className="p-4-1">
                <div className="relative" style={{ height: "400px" }}>
                  <iframe
                    src={googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación del Campus"
                  ></iframe>
                  <div className="absolute top-4 right-4 bg-background/3 backdrop-blur-sm p-3 rounded-lg shadow-md">
                    <h3 className="font-semibold text-lg">{nombreEscuela}</h3>
                    {direccion && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {direccion}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

    <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {campus.map((action, index) => (
                  <Card
                    key={index}
                    className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-4"
                  >
                    <CardHeader className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className={`p-3 rounded-xl ${action.color} text-white group-hover:scale-110 transition-transform duration-300`}
                        >
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
          </div>
  );
}