"use client";

import { use, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/shadcn/button";
import { Input } from "@repo/ui/components/shadcn/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { ArrowLeft } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import { CicloEscolarFormValues, cicloEscolarSchema } from "@/app/shemas/cicloEscolar";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";

export default function EditarCicloEscolarPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const idCicloEscolar = id as Id<"ciclosEscolares">;
    const router = useRouter();
    const actualizarCicloEscolar = useMutation(api.ciclosEscolares.actualizarCicloEscolar);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems);
    const escuela = useEscuela((s) => s.escuela);
    const cicloEscolar = useQuery(api.ciclosEscolares.obtenerCicloEscolarPorId, { cicloId: idCicloEscolar, escuelaId: escuela?._id as Id<"escuelas">  });
    const paramSlug = useParams();
    const slug = typeof paramSlug?.slug === "string" ? paramSlug.slug : "";

    const form = useForm<CicloEscolarFormValues>({
        resolver: zodResolver(cicloEscolarSchema),
        defaultValues: {
            nombre: "",
            fechaInicio: "",
            fechaFin: "",
        }
    });

    useEffect(() => {
        if (cicloEscolar && escuela) {
            setItems([
                { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
                { label: 'Ciclos Escolares', href: '/ciclosEscolares' },
                { label: `${cicloEscolar?.nombre}`, href: `/ciclosEscolares/${cicloEscolar._id}` },
                { label: 'Editar', isCurrentPage: true },
            ]);
        }
    }, [escuela, cicloEscolar, setItems, slug]);

    const onSubmit = async (values: CicloEscolarFormValues) => {
        try {
            setIsSubmitting(true);
            await actualizarCicloEscolar({
                cicloId: idCicloEscolar,
                escuelaId: escuela?._id as Id<"escuelas">,
                nombre: values.nombre,
                fechaInicio: Number(values.fechaInicio),
                fechaFin: Number(values.fechaFin)
            });
            toast.success("Ciclo Escolar actualizada", { description: "La ciclo escolar se ha actualizado correctamente" });
            router.push("/ciclosEscolares");
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
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Editar Ciclo Escolar
                    </h1>
                </div>
            </div>

            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-semibold text-center">Información de la ciclo escolar</CardTitle>
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
                                {isSubmitting ? "Actualizando..." : "Guardar Cambios"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}