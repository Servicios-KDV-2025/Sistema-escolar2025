"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@repo/ui/components/shadcn/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/components/shadcn/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import { useEscuela } from "@/app/store/useEscuela";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { GradoFormValues, gradoSchema } from "@/app/shemas/grado";

export default function CrearCalendarioPage() {
    const router = useRouter();
    const escuela = useEscuela((s) => s.escuela);
    const creargrupo = useMutation(api.grupos.crearGrupo);

    const form = useForm<GradoFormValues>({
        resolver: zodResolver(gradoSchema),
        defaultValues: {
            grado: undefined,
            nombre: "",
            activo: true,
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems)

    useEffect(() => {
        setItems([
            { label: 'Escuela Limón', href: '/' },
            { label: 'Grupos', href: '/grupos' },
            { label: 'Crear Grupo', isCurrentPage: true },
        ])
    }, [setItems])

    const onSubmit = async (values: GradoFormValues) => {
        try {
            setIsSubmitting(true);
            await creargrupo({
                escuelaId: escuela?._id as Id<"escuelas">,
                grado: values.grado,
                nombre: values.nombre,
                activo: values.activo,
            });
            toast.success("Grado creado", { description: "El grado se ha creado correctamente" });
            router.push("/grados");

        } catch (error) {
            toast.error("Error", {
                description: "Ocurrió un error al guardar el grado"
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
                        Crear Nuevo Grupo
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
                                    name="grado"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Grado</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
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
                                {isSubmitting ? "Creando..." : "Crear Grupo"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>

    );
}
