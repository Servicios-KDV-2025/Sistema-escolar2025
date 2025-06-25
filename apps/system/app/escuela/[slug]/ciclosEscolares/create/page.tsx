"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
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
import { CicloEscolarFormValues, cicloEscolarSchema } from "@/app/shemas/cicloEscolar";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";

export default function CrearCicloEscolarPage() {
    const router = useRouter();
    const escuela = useEscuela((s) => s.escuela);
    const crearCicloEscolar = useMutation(api.ciclosEscolares.crearCicloEscolar);
    const params = useParams();
    const slug = typeof params?.slug === "string" ? params.slug : "";

    const form = useForm<CicloEscolarFormValues>({
        resolver: zodResolver(cicloEscolarSchema),
        defaultValues: {
            nombre: "",
            fechaInicio: "",
            fechaFin: "",
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems)

    useEffect(() => {
        if (escuela) {
            setItems([
                { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
                { label: 'Ciclos Escolares', href: '/ciclosEscolares' },
                { label: 'Crear Ciclo Escolar', isCurrentPage: true },
            ])
        }
    }, [escuela, setItems, slug])

    const onSubmit = async (values: CicloEscolarFormValues) => {
        try {
            setIsSubmitting(true);
            await crearCicloEscolar({
                escuelaId: escuela?._id as Id<"escuelas">,
                nombre: values.nombre,
                fechaInicio: new Date(values.fechaInicio).getTime(),
                fechaFin: new Date(values.fechaFin).getTime()
            });
            toast.success("Ciclo Escolar creada", { description: "La ciclo escolar se ha creado correctamente" });
            router.push(`/${slug}/ciclosEscolares`);

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
                                    name="nombre"
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
                                    name="fechaInicio"
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
                                    name="fechaFin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha Final</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
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
