// src/app/escuela/[slug]/departamentos/create/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useEscuela } from '@/app/store/useEscuela';
import { toast } from 'sonner';
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@repo/ui/components/shadcn/textarea"; 
import { CardContent, CardFooter } from "@repo/ui/components/shadcn/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Schema corregido - activo debe ser requerido, no opcional
const departamentoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre del departamento es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim(),
  descripcion: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .optional(),
  activo: z.boolean(), // Removido .default(true) y .optional()
});

type DepartamentoFormValues = z.infer<typeof departamentoSchema>;

export default function CreateDepartamentoPage() {
  const router = useRouter();
  const { escuela: escuelaEnUso } = useEscuela();

  const crearDepartamento = useMutation(api.departamento.crearDepartamento);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para almacenar el slug de la escuela para las redirecciones
  const [escuelaSlug, setEscuelaSlug] = useState('');
  useEffect(() => {
    if (escuelaEnUso?.nombre) {
      setEscuelaSlug(encodeURIComponent(escuelaEnUso.nombre));
    }
  }, [escuelaEnUso]);

  // Configuración de react-hook-form con Zod - valores por defecto corregidos
  const form = useForm<DepartamentoFormValues>({
    resolver: zodResolver(departamentoSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      activo: true, // Valor por defecto establecido aquí
    },
  });

  // Función de envío del formulario
  const onSubmit = async (values: DepartamentoFormValues) => {
    if (!escuelaEnUso?._id) {
      toast.error('Error', {
        description: 'No hay una escuela seleccionada para crear el departamento.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await crearDepartamento({
        escuelaId: escuelaEnUso._id as Id<'escuelas'>,
        nombre: values.nombre,
        descripcion: values.descripcion || undefined, // Envía undefined si está vacío
        activo: values.activo,
      });
      toast.success('Departamento creado', {
        description: `"${values.nombre}" ha sido creado con éxito.`,
      });
      router.push(`/escuela/${escuelaSlug}/departamentos`);
    } catch (error: unknown) {
      let errorMessage = 'Ocurrió un error desconocido al crear el departamento.';

      // Check if the error is a standard JavaScript Error object
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      // If the error is a plain object with a 'message' property (common from APIs)
      else if (typeof error === 'object' && error !== null && 'message' in error) {
        // Use a type assertion here to tell TypeScript that 'error' has a 'message' property
        errorMessage = (error as { message: string }).message;
      }
      // If the error is simply a string (less common, but good to cover)
      else if (typeof error === 'string') {
        errorMessage = error;
      }

      // Display the error message using 'sonner' toast
      toast.error('Error al crear departamento', {
        description: errorMessage,
      });

      // Log the full error to the console for debugging
      console.error('Error al crear departamento:', error);
    } finally {
      // Always reset the submission state, regardless of whether the operation succeeded or failed
      setIsSubmitting(false);
    }
  };

  // Manejo de estados de carga y errores
  if (escuelaEnUso === null) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-red-500">
        <p className="mb-4 text-center">
          No se ha seleccionado una escuela para crear un departamento. Por favor, vuelve a la página de escuelas.
        </p>
        <Button onClick={() => router.push('/escuelas')} className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-300">
            Ir a Escuelas
        </Button>
      </div>
    );
  }

  if (escuelaEnUso === undefined) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-gray-600">
        Cargando información de la escuela...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-center mb-8 text-2xl sm:text-3xl font-extrabold text-gray-800">
          Agregar Departamento a <span className="text-blue-600">{escuelaEnUso.nombre}</span>
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="grid grid-cols-1 gap-6 p-0"> {/* Eliminar padding adicional aquí */}
              {/* Campo: Nombre del Departamento */}
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Departamento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Ciencias de la Computación" {...field} />
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
                      <Textarea placeholder="Descripción del departamento..." rows={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo: Estado Activo (Select en lugar de Checkbox para consistencia) */}
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
                onClick={() => router.push(`/escuela/${escuelaSlug}/departamentos`)}
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
                {isSubmitting ? "Creando..." : "Guardar Departamento"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </div>
    </div>
  );
}