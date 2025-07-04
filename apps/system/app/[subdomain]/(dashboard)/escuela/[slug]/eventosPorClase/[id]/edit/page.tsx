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
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select";
import { EventoPorClaseFormValues, eventoPorClaseSchema } from "@/app/shemas/eventoPorClase";

export default function EditarEventosPorClase({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const idEventoXClase = id as Id<"eventoPorClases">;
    const router = useRouter();
    const allParams = useParams();
    const slug = typeof allParams?.slug === "string" ? allParams.slug : "";

    const actualizarEventoPorClase = useMutation(api.eventoPorClase.actualizarEventoXClase);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems);
    const escuela = useEscuela((s) => s.escuela);
    const eventoXClase = useQuery(api.eventoPorClase.verUnEventoXClase, { id: idEventoXClase, escuelaId: escuela?._id as Id<"escuelas"> });

    const catalogoClases = useQuery(api.catalogosDeClases.verTodosLosCatalogosDeClases, { escuelaId: escuela?._id as Id<"escuelas"> });
    const calendario = useQuery(api.calendario.obtenerEventosCalendario, { escuelaId: escuela?._id as Id<"escuelas"> });
    const cicloEscolar = useQuery(api.ciclosEscolares.obtenerCiclosEscolares, { escuelaId: escuela?._id as Id<"escuelas"> });
    const eventosEscolares = useQuery(api.eventosEscolares.obtenerTodosLosEventosEscolares);

    const form = useForm<EventoPorClaseFormValues>({
        resolver: zodResolver(eventoPorClaseSchema),
        defaultValues: {
            catalogoClases: '',
            calendario: '',
            cicloEscolar: '',
            eventosEscolares: '',
            fecha: "",
            descripcion: "",
            activo: true
        }
    });

    useEffect(() => {
        if (eventoXClase) {
            form.reset({
                catalogoClases: eventoXClase.catalogoClaseId,
                calendario: eventoXClase.calendarioId,
                cicloEscolar: eventoXClase.cicloEscolarId,
                eventosEscolares: eventoXClase.eventoEscolarId,
                fecha: new Date(eventoXClase.fecha).toISOString().slice(0, 10),
                descripcion: eventoXClase.descripcion,
                activo: eventoXClase.activo
            });
        }
    }, [eventoXClase, form]);

    useEffect(() => {
        if (eventoXClase) {
            setItems([
                { label: `${escuela?.nombre}`, href: '/' },
                { label: 'Eventos por Clase', href: '/eventosPorClase' },
                { label: `${eventoXClase?._id}`, href: `/eventosPorClase/${eventoXClase._id}` },
                { label: 'Editar', isCurrentPage: true },
            ]);
        }
    }, [setItems, escuela, eventoXClase]);

    const onSubmit = async (values: EventoPorClaseFormValues) => {
        try {
            setIsSubmitting(true);
            await actualizarEventoPorClase({
                id: idEventoXClase,
                escuelaId: escuela?._id as Id<"escuelas">,
                catalogoClaseId: values.catalogoClases as Id<"catalogosDeClases">,
                calendarioId: values.calendario as Id<"calendario">,
                cicloEscolarId: values.cicloEscolar as Id<"ciclosEscolares"> ,
                eventoEscolarId: values.eventosEscolares as Id<"eventosEscolares">,
                fecha: new Date(values.fecha).getTime(),
                descripcion: values.descripcion,
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
                        Editar Evento por Clase
                    </h1>
                </div>
            </div>

            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-semibold text-center">Información del Evento por Clase</CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <CardContent className="grid grid-cols-1 gap-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="catalogoClases"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Clases</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona una Clase" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        catalogoClases?.map(catClas => (
                                                            <SelectItem key={catClas.id} value={catClas.id}>
                                                                {catClas.nombre}
                                                            </SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="calendario"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona una fecha" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        calendario?.map(cal => (
                                                            <SelectItem key={cal._id} value={cal._id}>
                                                                {cal.fecha}
                                                            </SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="cicloEscolar"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ciclo Escolar</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona un Ciclo Escolar" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        cicloEscolar?.map(ciclEsc => (
                                                            <SelectItem key={ciclEsc._id} value={ciclEsc._id}>
                                                                {ciclEsc.nombre}
                                                            </SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="eventosEscolares"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Evento Escolar (Opcional)</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona un Evento Escolar (Opcionl)" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        eventosEscolares?.map(eventEsc => (
                                                            <SelectItem key={eventEsc._id} value={eventEsc._id}>
                                                                {eventEsc.nombre}
                                                            </SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    control={form.control}
                                    name="fecha"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fecha</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
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
                                                <Input {...field} />
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