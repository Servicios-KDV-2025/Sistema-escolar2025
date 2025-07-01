"use client";

import { use, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@repo/ui/components/shadcn/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import { CalendarioFormValues, calendarioSchema } from "@/app/shemas/calendario";
import { useEscuela } from "@/app/store/useEscuela";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";

export default function CrearCalendarioPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const idCicloEscolar = id as Id<"ciclosEscolares">;
    const paramSlug = useParams();
    const slug = typeof paramSlug?.slug === "string" ? paramSlug.slug : "";
    const router = useRouter();
    const escuela = useEscuela((s) => s.escuela);
    const cicloEscolar = useQuery(api.ciclosEscolares.obtenerCicloEscolarPorId,
        escuela?._id && idCicloEscolar
            ? { escuelaId: escuela?._id as Id<"escuelas">, cicloId: idCicloEscolar }
            : "skip");
    const crearCalendario = useMutation(api.calendario.crearEventoCalendario);

    const form = useForm<CalendarioFormValues>({
        resolver: zodResolver(calendarioSchema),
        defaultValues: {
            fecha: "",
            tipo: "",
            descripcion: "",
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems)

    useEffect(() => {
        if (cicloEscolar && escuela) {
            setItems([
                { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
                { label: 'Ciclos Escolares', href: `/escuela/${slug}/ciclosEscolares` },
                { label: `${cicloEscolar?.nombre}`, href: `/escuela/${slug}/ciclosEscolares/${idCicloEscolar}` },
                { label: `Crear`, isCurrentPage: true },
            ]);
        }
    }, [escuela, cicloEscolar, setItems, slug, idCicloEscolar]);

    const onSubmit = async (values: CalendarioFormValues) => {
        try {
            setIsSubmitting(true);
            await crearCalendario({
                escuelaId: escuela?._id as Id<"escuelas">,
                cicloEscolarId: idCicloEscolar,
                fecha: new Date(values.fecha).getTime(),
                tipo: values.tipo,
                descripcion: values.descripcion
            });
            toast.success("Fecha creada", { description: "La fecha se ha creada correctamente" });
            router.push(`/escuela/${slug}/ciclosEscolares/${idCicloEscolar}`);

        } catch (error) {
            toast.error("Error", {
                description: "Ocurrió un error al guardar el calendario"
            });
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Crear Nueva Fecha
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
                                            <FormLabel>Tipo</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Feriado, Examen" {...field} />
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
                                            <FormLabel>Descripcion</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Feriado, Examen" {...field} />
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
                                {isSubmitting ? "Creando..." : "Crear Calendario"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>

    );
}
