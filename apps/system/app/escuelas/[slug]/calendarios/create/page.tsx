"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
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

export default function CrearCalendarioPage() {
    const router = useRouter();
    const escuela = useEscuela((s) => s.escuela);
    const crearCalendario = useMutation(api.calendario.crearEventoCalendario);

    const form = useForm<CalendarioFormValues>({
        resolver: zodResolver(calendarioSchema),
        defaultValues: {
            fecha: 0,
            tipo: "",
            descripcion: "",
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems)

    useEffect(() => {
        setItems([
            { label: 'Escuela Limón', href: '/' },
            { label: 'Ciclos Escolares', href: '/calendarios' },
            { label: 'Crear Ciclo Escolar', isCurrentPage: true },
        ])
    }, [setItems])

    const onSubmit = async (values: CalendarioFormValues) => {
        try {
            setIsSubmitting(true);
            await crearCalendario({
                escuelaId: escuela?._id as Id<"escuelas">,
                cicloEscolarId: "2123" as Id<"ciclosEscolares">,
                fecha: values.fecha,
                tipo: values.tipo,
                descripcion: values.descripcion
            });
            toast.success("Ciclo Escolar creada", { description: "La ciclo escolar se ha creado correctamente" });
            router.push("/calendarios");

        } catch (error) {
            toast.error("Error", {
                description: "Ocurrió un error al guardar la ciclo escolar"
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
                        Crear Nueva Ciclo Escolar
                    </h1>
                </div>
            </div>

            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-semibold text-center">Información la Ciclo Escolar</CardTitle>
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
                                {isSubmitting ? "Creando..." : "Crear Ciclo Escolar"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>

    );
}
