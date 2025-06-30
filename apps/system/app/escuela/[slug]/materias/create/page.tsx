// src/app/escuela/[slug]/materias/create/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useEscuela } from '@/app/store/useEscuela';
import { toast } from 'sonner';

// Importar los componentes de Shadcn UI para el formulario
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@repo/ui/components/shadcn/textarea"; // Usar Textarea para la descripción
import { CardContent, CardFooter } from "@repo/ui/components/shadcn/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";

// Importar los hooks y el resolver de react-hook-form y zod
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Importa el esquema y el tipo para Materia
import { MateriaFormValues, materiaSchema } from '@/app/shemas/materia';

export default function CreateMateriaPage() {
  const router = useRouter();
  const { escuela: escuelaEnUso } = useEscuela();

  // Mutación para crear una nueva materia en Convex
  const crearMateria = useMutation(api.materias.crearMateriaConEscuela);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [escuelaSlug, setEscuelaSlug] = useState('');
  useEffect(() => {
    if (escuelaEnUso?.nombre) {
      setEscuelaSlug(encodeURIComponent(escuelaEnUso.nombre));
    }
  }, [escuelaEnUso]);

  // Configuración de react-hook-form con Zod para la validación
  const form = useForm<MateriaFormValues>({
    resolver: zodResolver(materiaSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      creditos: '', // Inicializar como string vacío para el input de tipo number
      activa: true,
    },
  });

  // Función de envío del formulario
  const onSubmit = async (values: MateriaFormValues) => {
    // Validar que haya una escuela seleccionada
    if (!escuelaEnUso?._id) {
      toast.error('Error', {
        description: 'No hay una escuela seleccionada para crear la materia.',
      });
      return;
    }

    setIsSubmitting(true); // Indicar que el formulario se está enviando
    try {
      // Convertir 'creditos' a número. Si es una cadena vacía, se envía 'undefined'.
      const creditosValue = values.creditos === '' ? undefined : Number(values.creditos);

      // SOLUCIÓN CLAVE: Asegurar que 'activa' sea explícitamente un booleano.
      // Si 'values.activa' es 'undefined' (por ejemplo, si no se tocó el campo
      // y 'z.input' lo permite como 'boolean | undefined'), se usará 'true' por defecto.
      const activaValue: boolean = values.activa ?? true;

      // Llamar a la mutación de Convex para crear la materia
      await crearMateria({
        escuelaId: escuelaEnUso._id as Id<'escuelas'>,
        nombre: values.nombre,
        descripcion: values.descripcion || undefined, // Enviar undefined si la descripción está vacía
        creditos: creditosValue,
        activa: activaValue, // Pasar el valor 'activa' ya garantizado como booleano
      });

      // Mostrar notificación de éxito y redirigir
      toast.success('Materia creada', {
        description: `"${values.nombre}" ha sido creada con éxito.`,
      });
      router.push(`/escuela/${escuelaSlug}/materias`);
    } catch (error: unknown) {
  let errorMessage = 'Ocurrió un error desconocido al crear la materia.';

  // Check if the error is an instance of Error (most common)
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  // If the error is a plain object with a 'message' property (common in some APIs)
  else if (typeof error === 'object' && error !== null && 'message' in error) {
    errorMessage = (error as { message: string }).message;
  }
  // If the error is simply a string
  else if (typeof error === 'string') {
    errorMessage = error;
  }

  // Display the error notification with the determined message
  toast.error('Error al crear materia', {
    description: errorMessage,
  });

  // Log the full error to the console for debugging
  console.error('Error al crear materia:', error);
} finally {
  setIsSubmitting(false); // Reset submission state
}
  };

  // --- Renderizado Condicional para Estados de Carga y Errores ---

  // Si no se ha seleccionado una escuela
  if (escuelaEnUso === null) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-red-500">
        <p className="mb-4 text-center">
          No se ha seleccionado una escuela para crear una materia. Por favor, vuelve a la página de escuelas.
        </p>
        <Button onClick={() => router.push('/escuelas')} className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-300">
            Ir a Escuelas
        </Button>
      </div>
    );
  }

  // Mientras se carga la información de la escuela
  if (escuelaEnUso === undefined) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-gray-600">
        Cargando información de la escuela...
      </div>
    );
  }

  // --- Formulario Principal de Creación de Materia ---
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-center mb-8 text-2xl sm:text-3xl font-extrabold text-gray-800">
          Agregar Materia a <span className="text-blue-600">{escuelaEnUso.nombre}</span>
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="grid grid-cols-1 gap-6 p-0">
              {/* Campo: Nombre de la Materia */}
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la Materia</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Matemáticas I" {...field} />
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
                      <Textarea placeholder="Describe brevemente el contenido de la materia." rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo: Créditos (opcional) */}
              <FormField
                control={form.control}
                name="creditos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Créditos (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ej: 5"
                        {...field}
                        onChange={(e) => {
                          // Permitir cadena vacía o números válidos
                          const value = e.target.value;
                          if (value === '' || /^\d*\.?\d*$/.test(value)) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo: Estado Activa (Select de Shadcn UI) */}
              <FormField
                control={form.control}
                name="activa"
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
                          <SelectItem value="true">Activa</SelectItem>
                          <SelectItem value="false">Inactiva</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            {/* Botones de acción del formulario */}
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/escuela/${escuelaSlug}/materias`)}
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
                {isSubmitting ? "Creando..." : "Guardar Materia"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </div>
    </div>
  );
}