"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { ArrowLeft } from "lucide-react";
import { useEscuelaEmilio } from "@/app/store/useEscuela";


export default function CreatePadrePage() {
  const searchParams = useSearchParams();
  const urlEscuelaId = searchParams.get("escuelaId") as Id<"escuelas"> | null;
  const router = useRouter();

  const { escuela: zustandEscuela } = useEscuelaEmilio();

  const fetchedEscuela = useQuery(
    api.escuelas.obtenerEscuelaPorId,
    zustandEscuela === null && urlEscuelaId !== null ? { id: urlEscuelaId } : "skip"
  );

  const escuelaEnUso = zustandEscuela || fetchedEscuela;

  const crearPadre = useMutation(api.padres.crearPadreConEscuela);

  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    activo: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!escuelaEnUso?._id) {
      alert("Error: No hay una escuela seleccionada para crear el padre.");
      return;
    }

    try {
      await crearPadre({
        escuelaId: escuelaEnUso._id as Id<"escuelas"> ,
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email || undefined,
        telefono: formData.telefono || undefined,
        direccion: formData.direccion || undefined,
        activo: formData.activo,
      });
      alert("Padre creado con éxito!");
      router.push(`/padres?escuelaId=${escuelaEnUso._id}`);
    } catch (error: any) {
      alert("Error al crear padre: " + error.message);
    }
  };

  if (urlEscuelaId === null && escuelaEnUso === null) {
    return (
      <div className="text-center py-10 text-red-600">
        No se ha seleccionado una escuela.{" "}
        <Button className="mt-4" onClick={() => router.push("/escuelas")}>
          Ir a Escuelas
        </Button>
      </div>
    );
  }

  if (escuelaEnUso === undefined) {
    return <div className="text-center py-10">Cargando información de la escuela...</div>;
  }

  if (escuelaEnUso === null) {
    return (
      <div className="text-center py-10 text-red-600">
        La escuela seleccionada no fue encontrada.
        <Button className="mt-4" onClick={() => router.push("/escuelas")}>
          Ir a Escuelas
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Agregar Padre a{" "}
            <span className="text-blue-600">{escuelaEnUso.nombre}</span>
          </h1>
        </div>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-semibold text-center">Información del Padre</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-6">
            {[
              { label: "Nombre", name: "nombre", required: true },
              { label: "Apellidos", name: "apellidos", required: true },
              { label: "Email (opcional)", name: "email", type: "email" },
              { label: "Teléfono (opcional)", name: "telefono", type: "tel" },
            ].map(({ label, name, required, type = "text" }) => (
              <div key={name} className="grid gap-2">
                <Label htmlFor={name}>{label}</Label>
                <Input
                  id={name}
                  name={name}
                  type={type}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  required={required}
                />
              </div>
            ))}

            <div className="grid gap-2">
              <Label htmlFor="direccion">Dirección (opcional)</Label>
              <Input
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="activo"
                name="activo"
                type="checkbox"
                checked={formData.activo}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <Label htmlFor="activo" className="text-green-700 font-medium">
                Padre activo
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/padres?escuelaId=${escuelaEnUso._id}`)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Guardar Padre
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
