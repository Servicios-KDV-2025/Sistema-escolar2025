"use client"; 

import { use, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@repo/ui/components/shadcn/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@repo/ui/components/shadcn/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import {
  salonSchema,
  SalonFormValues
} from "@/app/shemas/salon";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore"; 
import { useEscuela } from "@/app/store/useEscuela";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select";

export default function EditarSalonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const idSalon = id as Id<"salones">;
  const router = useRouter();
  const actualizarSalon = useMutation(api.salones.actualizarSalon);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setItems = useBreadcrumbStore(state => state.setItems);
  const escuela = useEscuela((s) => s.escuela);
  const salon = useQuery(api.salones.obtenerSalonPorId, 
    escuela?._id && idSalon
      ? { escuelaId: escuela?._id as Id<"escuelas">, salonId: idSalon } 
      : "skip"); 
  const paramSlug = useParams();
  const slug = typeof paramSlug?.slug === "string" ? paramSlug.slug : "";

  const form = useForm<SalonFormValues>({
    resolver: zodResolver(salonSchema),
    defaultValues: {
      nombre: "",
      capacidad: 0,
      ubicacion: undefined,
    }
  });

  useEffect(() => {
    if (salon) {
      form.reset({
        nombre: salon.nombre || "",
        capacidad: salon.capacidad || 0,
        ubicacion: (["Planta baja", "Primer piso", "Segundo piso", "Tercer piso"].includes(salon.ubicacion ?? "")
          ? salon.ubicacion
          : undefined) as "Planta baja" | "Primer piso" | "Segundo piso" | "Tercer piso" | undefined
      });

      setItems([
        { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
        { label: "Salones", href: `/escuela/${slug}/salones` },
        { label: `${salon?.nombre}`, href: `/escuela/${slug}/salones/${salon._id}` },
        { label: "Editar", isCurrentPage: true }
      ]);
    }
  }, [escuela, salon, setItems, slug, form]);

  const onSubmit = async (values: SalonFormValues) => {
    try {
      setIsSubmitting(true);
      await actualizarSalon({
        salonId: idSalon,
        escuelaId: escuela?._id as Id<"escuelas">,
        nombre: values.nombre,
        capacidad: values.capacidad,
        ubicacion: values.ubicacion
      });
      toast.success("Salón actualizado correctamente");
      router.push(`/escuela/${slug}/salones/${salon?._id}`);
    } catch (error) {
      toast.error("Error al actualizar el salón");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold">Editar Salón</h1>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center font-semibold">Información del Salón</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardContent className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una letra" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map((letra) => (
                          <SelectItem key={letra} value={letra}>
                            Salón {letra}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidad</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        {...field}
                        placeholder="Ej: 30"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ubicacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una ubicación" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["Planta baja", "Primer piso", "Segundo piso", "Tercer piso"].map(
                          (opcion) => (
                            <SelectItem key={opcion} value={opcion}>
                              {opcion}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex justify-between gap-4 mt-4 flex-col sm:flex-row">
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

