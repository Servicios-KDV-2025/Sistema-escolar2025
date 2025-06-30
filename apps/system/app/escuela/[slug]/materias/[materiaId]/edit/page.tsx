// src/app/escuela/[slug]/materias/[materiaId]/edit/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEscuela } from "@/app/store/useEscuela";

// Componentes de Shadcn UI y librerías de formulario
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@repo/ui/components/shadcn/textarea"; // Importar Textarea para descripciones más largas
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/shadcn/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/shadcn/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/shadcn/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ArrowLeft } from "lucide-react";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";

// Importa el esquema y el tipo para Materia
import { MateriaFormValues, materiaSchema } from "@/app/shemas/materia";

export default function EditarMateriaPage() {
  const params = useParams();
  const router = useRouter();

  const slug = typeof params?.slug === "string" ? params.slug : "";
  const materiaId =
    typeof params?.materiaId === "string"
      ? (params.materiaId as Id<"materias">)
      : null;

  const { escuela } = useEscuela();

  // Query Convex: Get existing materia data
  const materia = useQuery(
    api.materias.obtenerMateriaPorIdConEscuela,
    materiaId ? { id: materiaId } : "skip"
  );

  // Convex Mutation: Define the function to update the materia
  const actualizarMateria = useMutation(api.materias.actualizarMateriaConEscuela); // Assumes you have this mutation

  const [isSubmitting, setIsSubmitting] = useState(false);

  const setItems = useBreadcrumbStore((state) => state.setItems);

  // react-hook-form setup with Zod resolver
  const form = useForm<MateriaFormValues>({
    resolver: zodResolver(materiaSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      creditos: "", // Initialize as string for the input
      activa: true,
    },
  });

  // Effect to load data into the form when materia data is available
  useEffect(() => {
    if (materia && escuela) {
      setItems([
        { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
        { label: "Materias", href: `/escuela/${slug}/materias` },
        {
          label: `${materia?.nombre}`,
          href: `/escuela/${slug}/materias/${materia?._id}`,
        },
        { label: "Editar", isCurrentPage: true },
      ]);

      // Reset form values with current materia data
      form.reset({
        nombre: materia.nombre || "",
        descripcion: materia.descripcion || "",
        creditos:
          materia.creditos !== undefined && materia.creditos !== null
            ? String(materia.creditos)
            : "",
        activa: materia.activa ?? true,
      });
    }
  }, [materia, escuela, setItems, slug, form]);

  // Form submission function
  const onSubmit = async (values: MateriaFormValues) => {
    if (!materiaId) {
      toast.error("Error", {
        description: "ID de la materia no disponible para actualizar.",
      });
      return;
    }
    if (!escuela?._id) {
      toast.error("Error", {
        description: "No hay una escuela seleccionada para la materia.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert creditos to number, handle empty string as undefined
      const creditosValue =
        values.creditos === "" ? undefined : Number(values.creditos);

      await actualizarMateria({
        id: materiaId,
        escuelaId: escuela._id as Id<"escuelas">, // School ID for validation in Convex mutation
        nombre: values.nombre,
        descripcion: values.descripcion || undefined,
        creditos: creditosValue,
        activa: values.activa,
      });
      toast.success("Materia actualizada", {
        description: "La materia se ha guardado correctamente.",
      });
      router.push(`/escuela/${slug}/materias`); // Redirect to the materia list page
    } catch (error: unknown) { // Change 'any' to 'unknown' for type safety
  let errorMessage = "Ocurrió un error desconocido al guardar la materia.";

  // Check if the error is a standard JavaScript Error object
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  // If it's a plain object with a 'message' property (common in API responses)
  else if (typeof error === 'object' && error !== null && 'message' in error) {
    // We use a type assertion here to tell TypeScript it has a 'message' property
    errorMessage = (error as { message: string }).message;
  }
  // If the error is simply a string
  else if (typeof error === 'string') {
    errorMessage = error;
  }

  // Display the error message using toast
  toast.error("Error al actualizar", {
    description: errorMessage,
  });

  // Log the full error object for debugging purposes
  console.error("Error al actualizar materia:", error);
} finally {
  // Always reset the submission state, regardless of success or failure
  setIsSubmitting(false);
}
  };

  // Conditional Rendering for Loading and Error States

  if (!materiaId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-red-600">
            Error: ID de la materia no proporcionado en la URL.
          </h2>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    );
  }

  if (materia === undefined || escuela === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">
            Cargando información de la materia...
          </p>
        </div>
      </div>
    );
  }

  if (materia === null || escuela === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-red-600">
            Materia no encontrada o escuela no seleccionada.
          </h2>
          <p className="text-muted-foreground">
            Asegúrate de que la materia exista y de haber seleccionado una
            escuela.
          </p>
          <Button onClick={() => router.push("/escuelas")}>
            Ir a Escuelas
          </Button>
        </div>
      </div>
    );
  }

  // Main Edit Form
  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Editar Materia:{" "}
            <span className="text-primary">{materia.nombre}</span>
          </h1>
        </div>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-semibold text-center">
            Información de la Materia
          </CardTitle>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 p-6"
          >
            <CardContent className="grid grid-cols-1 gap-6">
              {/* Campo: Nombre de la Materia */}
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Álgebra Lineal" {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Textarea
                        placeholder="Detalles de la materia..."
                        {...field}
                      />
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
                    <FormLabel>Créditos</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ej: 5"
                        {...field}
                        onChange={(e) => {
                          // Ensure only numbers are accepted, allow empty string
                          const value = e.target.value;
                          if (value === "" || /^\d*\.?\d*$/.test(value)) {
                            field.onChange(value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo: Estado Activa (Checkbox/Select) */}
              <FormField
                control={form.control}
                name="activa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
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
