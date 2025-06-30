// app/escuela/[slug]/eventosEscolares/[eventoId]/edit/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useEscuela } from '@/app/store/useEscuela';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner"; 

import { ArrowLeft } from "lucide-react"; 
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore"; 

import { EventoEscolarFormValues, eventoEscolarSchema } from '@/app/shemas/eventoEscolar';

export default function EditarEventoEscolarPage() {
  const params = useParams(); 
  const router = useRouter();

  const slug = typeof params?.slug === "string" ? params.slug : "";
  const eventoId = typeof params?.eventoId === "string" ? params.eventoId as Id<'eventosEscolares'> : null;

  const { escuela } = useEscuela();

  const eventoEscolar = useQuery(
    api.eventosEscolares.obtenerEventoPorId,
    eventoId ? { id: eventoId } : "skip"
  );

  const actualizarEvento = useMutation(api.eventosEscolares.actualizarEventoEscolar);

  // Estado local para manejar el proceso de envío del formulario y deshabilitar botones.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hook para actualizar las "migas de pan" (breadcrumb) de la navegación.
  const setItems = useBreadcrumbStore(state => state.setItems);

  // **Configuración de react-hook-form con Zod:**
  // Esto integra la validación de esquema con el manejo del formulario.
  const form = useForm<EventoEscolarFormValues>({
    resolver: zodResolver(eventoEscolarSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      tipo: '',
      activo: true,
    },
  });

  // **Efecto para cargar datos en el formulario:**
  // Se ejecuta cuando 'eventoEscolar' o 'escuela' cambian.
  // Resetea el formulario con los datos obtenidos de la base de datos de Convex.
  useEffect(() => {
    if (eventoEscolar && escuela) {
      // ------------------------------------------------
      // Actualiza el breadcrumb con el nombre de la escuela y del evento.
      setItems([
        { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
        { label: 'Eventos Escolares', href: `/escuela/${slug}/eventosEscolares` },
        { label: `${eventoEscolar?.nombre}`, href: `/escuela/${slug}/eventosEscolares/${eventoEscolar?._id}` },
        { label: 'Editar', isCurrentPage: true },
      ]);

      // Restablece los valores del formulario con los datos actuales del evento.
      // Aseguramos que 'descripcion' sea un string, ya que el input HTML lo espera.
      form.reset({
        nombre: eventoEscolar.nombre || '',
        descripcion: eventoEscolar.descripcion || '',
        tipo: eventoEscolar.tipo || '',
        activo: eventoEscolar.activo ?? true,
      });
    }
  }, [eventoEscolar, escuela, setItems, slug, form]);

  // **Función de envío del formulario:**
  // Se llama cuando el formulario es válido y se intenta enviar.
  const onSubmit = async (values: EventoEscolarFormValues) => {
    // Validaciones cruciales: asegurarse de que tenemos IDs válidos antes de proceder.
    if (!eventoId) {
      toast.error("Error", { description: "ID del evento no disponible para actualizar." });
      return;
    }
    if (!escuela?._id) {
      toast.error("Error", { description: "No hay una escuela seleccionada para el evento." });
      return;
    }

    setIsSubmitting(true); // Indica que el envío está en curso
    try {
      await actualizarEvento({
        id: eventoId, // ID del evento a actualizar
        escuelaId: escuela._id as Id<'escuelas'>, // ID de la escuela para validación en la mutación de Convex
        nombre: values.nombre,
        descripcion: values.descripcion || undefined, // Envía 'undefined' si la descripción está vacía (para v.optional)
        tipo: values.tipo,
        activo: values.activo,
      });
      toast.success("Evento actualizado", { description: "El evento escolar se ha guardado correctamente." });
      // Redirige al usuario a la página de detalle del evento después de la actualización.
      router.push(`/escuela/${slug}/eventosEscolares/`);
    } catch (error: unknown) { // Cambia 'any' por 'unknown'
  let errorMessage = "Ocurrió un error desconocido al guardar el evento escolar.";

  // Verifica si el error es una instancia de Error (lo más común)
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  // Puedes añadir más verificaciones si sabes que pueden ocurrir otros tipos de errores
  // Por ejemplo, si tu API a veces devuelve un objeto con un campo 'data.message'
  else if (typeof error === 'object' && error !== null && 'message' in error) {
    // Esto es útil si el error es un objeto plano con una propiedad 'message'
    errorMessage = (error as { message: string }).message;
  }
  // O si el error es simplemente una cadena
  else if (typeof error === 'string') {
    errorMessage = error;
  }

  toast.error("Error al actualizar", {
    description: errorMessage
  });
  console.error("Error al actualizar evento:", error);
} finally {
  setIsSubmitting(false); // Restablece el estado de envío
}
  };

  // --- Renderizado Condicional para Estados de Carga y Errores ---

  // Si 'eventoId' no se extrajo correctamente de la URL.
  if (!eventoId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-red-600">Error: ID del evento no proporcionado en la URL.</h2>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    );
  }

  // Mientras se cargan los datos del evento o la escuela de Convex/Zustand.
  if (eventoEscolar === undefined || escuela === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando información del evento...</p>
        </div>
      </div>
    );
  }

  // Si el evento no fue encontrado en la base de datos o no hay una escuela seleccionada.
  if (eventoEscolar === null || escuela === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-red-600">Evento no encontrado o escuela no seleccionada.</h2>
          <p className="text-muted-foreground">Asegúrate de que el evento exista y de haber seleccionado una escuela.</p>
          <Button onClick={() => router.push('/escuelas')}>Ir a Escuelas</Button>
        </div>
      </div>
    );
  }

  // --- Formulario Principal de Edición ---
  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Editar Evento: <span className="text-primary">{eventoEscolar.nombre}</span>
          </h1>
        </div>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-semibold text-center">Información del Evento Escolar</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
            <CardContent className="grid grid-cols-1 gap-6">
              {/* Campo: Nombre del Evento */}
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Festival de Primavera" {...field} />
                    </FormControl>
                    <FormMessage /> {/* Muestra errores de validación de Zod */}
                  </FormItem>
                )}
              />

              {/* Campo: Descripción (opcional) */}
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción (opcional)</FormLabel>
                    <FormControl>
                      {/* Puedes cambiar a <Textarea> de Shadcn si las descripciones son largas */}
                      <Input placeholder="Detalles del evento..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo: Tipo de Evento (Requerido) */}
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Evento</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Opciones de tipo de evento */}
                          <SelectItem value="examen">Examen</SelectItem>
                          <SelectItem value="evento">Evento</SelectItem>
                          <SelectItem value="suspension">Suspensión</SelectItem>
                          <SelectItem value="reunion">Reunión</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo: Estado Activo (Checkbox/Select) */}
              <FormField
                control={form.control}
                name="activo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={value => field.onChange(value === "true")}
                        value={field.value ? "true" : "false"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Activo</SelectItem>
                          <SelectItem value="false">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Actualizando..." : "Guardar Cambios"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}