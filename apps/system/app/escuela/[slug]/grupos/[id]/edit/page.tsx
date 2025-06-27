"use client";

import { use, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { ArrowLeft } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import { GrupoFormValues, grupoSchema } from "@/app/shemas/grupo";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select";

export default function EditarGrupo({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const idGrupo = id as Id<"grupos">;
    const router = useRouter();
    const actualizarGrupo = useMutation(api.grupos.actualizarGrupo);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems);
    const escuela = useEscuela((s) => s.escuela);
    const grupo = useQuery(api.grupos.grupoPorId, { id: idGrupo, escuelaId: escuela?._id as Id<"escuelas"> });
    const allParams = useParams();
    const slug = typeof allParams?.slug === "string" ? allParams.slug : "";

    const form = useForm<GrupoFormValues>({
        resolver: zodResolver(grupoSchema),
        defaultValues: {
            grado: undefined,
            nombre: "",
            activo: true,
        }
    });

    useEffect(() => {
        if (grupo) {
            form.reset({
                grado: grupo.grado as GrupoFormValues["grado"],
                nombre: grupo.nombre,
                activo: grupo.activo,
            });
        }
    }, [grupo, form]);

    useEffect(() => {
        if (grupo) {
            setItems([
                { label: `${escuela?.nombre}`, href: '/' },
                { label: 'Grupos', href: '/grupos' },
                { label: `${grupo?.nombre}`, href: `/grupos/${grupo._id}` },
                { label: 'Editar', isCurrentPage: true },
            ]);
        }
    }, [setItems, escuela, grupo]);

    const onSubmit = async (values: GrupoFormValues) => {
        try {
            setIsSubmitting(true);
            await actualizarGrupo({
                id: idGrupo,
                escuelaId: escuela?._id as Id<"escuelas">,
                grado: values.grado,
                nombre: values.nombre,
                activo: values.activo,
            });
            toast.success("Grado actualizado", { description: "El grado se ha actualizado correctamente" });
            router.push(`/escuela/${slug}/grupos`);
        } catch (error) {
            toast.error("Error", {
                description: "Ocurrió un error al guardar grupo"
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
                        Editar Grupo
                    </h1>
                </div>
            </div>

            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-semibold text-center">Información del Grupo</CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <CardContent className="grid grid-cols-1 gap-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <FormField
                                    control={form.control}
                                    name="grado"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Grado</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona un grado" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1°">1°</SelectItem>
                                                    <SelectItem value="2°">2°</SelectItem>
                                                    <SelectItem value="3°">3°</SelectItem>
                                                    <SelectItem value="4°">4°</SelectItem>
                                                    <SelectItem value="5°">5°</SelectItem>
                                                    <SelectItem value="6°">6°</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="nombre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input type="text" {...field} placeholder="Ej: A, B, C..." />
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
                                            <FormLabel>Activo</FormLabel>
                                            <Select
                                                onValueChange={(value) => field.onChange(value === "true")}
                                                value={field.value ? "true" : "false"}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Cambia su estado" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="true">Activo</SelectItem>
                                                    <SelectItem value="false">No activo</SelectItem>
                                                </SelectContent>
                                            </Select>
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