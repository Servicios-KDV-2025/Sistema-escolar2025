"use client";

import { use, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";
import { CalendarioFormValues, calendarioSchema } from "@/app/shemas/calendario";

export default function EditarCicloEscolarPage({ params }: { params: Promise<{ id: string, idCalendario: string }> }) {
    const { id, idCalendario } = use(params);
    const idCalendarioCiclo = idCalendario as Id<"calendario">;
    const idCicloEscolar = id as Id<"ciclosEscolares">;
    const router = useRouter();
    const actualizarEventoCalendario = useMutation(api.calendario.actualizarEventoCalendario);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setItems = useBreadcrumbStore(state => state.setItems);
    const escuela = useEscuela((s) => s.escuela);
    const calendario = useQuery(api.calendario.obtenerEventoCalendarioPorId,
        escuela?._id && idCalendarioCiclo
            ? { escuelaId: escuela?._id as Id<"escuelas">, eventoId: idCalendarioCiclo }
            : "skip"); const paramSlug = useParams();
    const slug = typeof paramSlug?.slug === "string" ? paramSlug.slug : "";
    const cicloEscolar = useQuery(api.ciclosEscolares.obtenerCicloEscolarPorId,
        escuela?._id && idCicloEscolar
            ? { escuelaId: escuela?._id as Id<"escuelas">, cicloId: idCicloEscolar }
            : "skip");
    const form = useForm<CalendarioFormValues>({
        resolver: zodResolver(calendarioSchema),
        defaultValues: {
            fecha: "",
            tipo: "",
            descripcion: "",
            activo: true
        }
    });

    useEffect(() => {
        if (calendario) {
            setItems([
                { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
                { label: 'Ciclos Escolares', href: `/escuela/${slug}/ciclosEscolares` },
                { label: `${cicloEscolar?.nombre}`, href: `/escuela/${slug}/ciclosEscolares/${idCicloEscolar}` },
                { label: 'Calendario', href: `/escuela/${slug}/ciclosEscolares/${idCicloEscolar}` },
                { label: `${new Date(calendario.fecha).toISOString().split("T")[0]}`, href: `/escuela/${slug}/ciclosEscolares/${idCicloEscolar}/calendario/${idCalendarioCiclo}` },
                { label: "Editar", isCurrentPage: true },
            ]);
        }
        form.reset({
            fecha: calendario?.fecha
                ? new Date(calendario.fecha).toISOString().split("T")[0]
                : "",
            tipo: calendario?.tipo,
            descripcion: calendario?.descripcion,
            activo: calendario?.activo
        });
    }, [calendario, setItems, escuela, slug, cicloEscolar, idCicloEscolar, idCalendarioCiclo, form]);

    const onSubmit = async (values: CalendarioFormValues) => {
        try {
            setIsSubmitting(true);
            await actualizarEventoCalendario({
                eventoId: idCalendarioCiclo,
                escuelaId: escuela?._id as Id<"escuelas">,
                fecha: new Date(values.fecha).getTime(),
                tipo: values.tipo,
                descripcion: values.descripcion,
                activo: values.activo
            });
            toast.success("Fecha actualizada", { description: "La fecha se ha actualizado correctamente" });
            router.push(`/escuela/${slug}/ciclosEscolares/${idCicloEscolar}`);
        } catch (error) {
            toast.error("Error", { description: "Ocurrió un error al guardar la fecha" });
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Editar Fecha
                    </h1>
                </div>
            </div>

            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-semibold text-center">Información de la fecha</CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <CardContent className="grid grid-cols-1 gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="fecha"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha de Inicio</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tipo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: 2024-2025" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="descripcion"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descripción</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: 2024-2025" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                            </div>
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