"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api"; // Ajusta la ruta según tu estructura
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { Button } from "@repo/ui/components/shadcn/button";
import { Input } from "@repo/ui/components/shadcn/input";
import { Label }  from "@repo/ui/components/shadcn/label";
import { Checkbox } from "@repo/ui/components/shadcn/checkbox";
import { Alert, AlertDescription } from "@repo/ui/components/shadcn/alert";
import { Loader2, ArrowLeft, School } from "lucide-react";

// Schema de validación con Zod
const escuelaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  // AÑADIR: nombreCorto al esquema de Zod
  nombreCorto: z
    .string()
    .min(1, "El nombre corto es requerido")
    .min(2, "El nombre corto debe tener al menos 2 caracteres")
    .max(20, "El nombre corto no puede exceder 20 caracteres"),
  direccion: z
    .string()
    .min(1, "La dirección es requerida")
    .min(10, "La dirección debe ser más específica")
    .max(200, "La dirección no puede exceder 200 caracteres"),
  telefono: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\+\(\)]+$/.test(val),
      "Formato de teléfono inválido"
    ),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().email().safeParse(val).success,
      "Formato de email inválido"
    ),
  director: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 2,
      "El nombre del director debe tener al menos 2 caracteres"
    ),
  activa: z.boolean(),
});

type EscuelaFormData = z.infer<typeof escuelaSchema>;

interface CrearEscuelaProps {
  onVolver?: () => void; // Prop opcional para manejar el botón de volver
}

export default function CrearEscuela({ onVolver }: CrearEscuelaProps) {
  const router = useRouter();
  const crearEscuela = useMutation(api.escuelas.crearEscuela); // Ajusta según tu estructura de archivos
  
  const [formData, setFormData] = useState<EscuelaFormData>({
    nombre: "",
    nombreCorto: "", // AÑADIR: Inicializar nombreCorto en el estado
    direccion: "",
    telefono: "",
    email: "",
    director: "",
    activa: true,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof EscuelaFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field: keyof EscuelaFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    try {
      escuelaSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof EscuelaFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const field = err.path[0] as keyof EscuelaFormData;
            newErrors[field] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleVolver = () => {
    if (onVolver) {
      onVolver(); // Usar la función pasada como prop
    } else {
      router.back(); // Fallback al comportamiento original
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    
    try {
      // Preparar datos para enviar (filtrar campos vacíos opcionales)
      const dataToSubmit = {
        nombre: formData.nombre,
        nombreCorto: formData.nombreCorto, // AÑADIR: Incluir nombreCorto aquí
        direccion: formData.direccion,
        telefono: formData.telefono || undefined,
        email: formData.email || "", // CAMBIO: Asegurar que email siempre sea un string (vacío si es nulo/indefinido)
        director: formData.director || undefined,
        activa: formData.activa,
      };

      await crearEscuela(dataToSubmit);
      
      setSubmitSuccess(true);
      
      // Volver después de un breve delay para mostrar el mensaje de éxito
      setTimeout(() => {
        handleVolver();
      }, 1500);
      
    } catch (error) {
      console.error("Error al crear escuela:", error);
      setSubmitError("Error al crear la escuela. Por favor, intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <School className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                ¡Escuela creada exitosamente!
              </h2>
              <p className="text-gray-600">
                Regresando a la lista de escuelas...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleVolver}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Escuela</h1>
          <p className="text-gray-600 mt-2">
            Completa los datos para registrar una nueva escuela en el sistema.
          </p>
        </div>

        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              Información de la Escuela
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submitError && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {submitError}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-sm font-medium">
                  Nombre de la Escuela *
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  placeholder="Ej: Escuela Primaria Benito Juárez"
                  className={errors.nombre ? "border-red-500" : ""}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-600">{errors.nombre}</p>
                )}
              </div>

              {/* AÑADIR: Campo para Nombre Corto */}
              <div className="space-y-2">
                <Label htmlFor="nombreCorto" className="text-sm font-medium">
                  Nombre Corto *
                </Label>
                <Input
                  id="nombreCorto"
                  type="text"
                  value={formData.nombreCorto}
                  onChange={(e) => handleInputChange("nombreCorto", e.target.value)}
                  placeholder="Ej: EBJ"
                  className={errors.nombreCorto ? "border-red-500" : ""}
                />
                {errors.nombreCorto && (
                  <p className="text-sm text-red-600">{errors.nombreCorto}</p>
                )}
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <Label htmlFor="direccion" className="text-sm font-medium">
                  Dirección *
                </Label>
                <Input
                  id="direccion"
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange("direccion", e.target.value)}
                  placeholder="Ej: Av. Revolución #123, Col. Centro, Ciudad"
                  className={errors.direccion ? "border-red-500" : ""}
                />
                {errors.direccion && (
                  <p className="text-sm text-red-600">{errors.direccion}</p>
                )}
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-sm font-medium">
                  Teléfono
                </Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  placeholder="Ej: (618) 123-4567"
                  className={errors.telefono ? "border-red-500" : ""}
                />
                {errors.telefono && (
                  <p className="text-sm text-red-600">{errors.telefono}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Ej: contacto@escuela.edu.mx"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Director */}
              <div className="space-y-2">
                <Label htmlFor="director" className="text-sm font-medium">
                  Director(a)
                </Label>
                <Input
                  id="director"
                  type="text"
                  value={formData.director}
                  onChange={(e) => handleInputChange("director", e.target.value)}
                  placeholder="Ej: María González López"
                  className={errors.director ? "border-red-500" : ""}
                />
                {errors.director && (
                  <p className="text-sm text-red-600">{errors.director}</p>
                )}
              </div>

              {/* Activa */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="activa"
                  checked={formData.activa}
                  onCheckedChange={(checked) => 
                    handleInputChange("activa", checked === true)
                  }
                />
                <Label
                  htmlFor="activa"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Escuela activa
                </Label>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVolver}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear Escuela"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
