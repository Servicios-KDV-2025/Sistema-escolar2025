"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
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
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";
import { EventoPorClaseFormValues, eventoPorClaseSchema } from "@/app/shemas/eventoPorClase";

export default function CrearCicloEscolarPage() {
    const router = useRouter();
    const escuela = useEscuela((s) => s.escuela);
    const crearEventoXClase = useMutation(api.eventoPorClase.crearEventoXClase);
    const params = useParams();
    const slug = typeof params?.slug === "string" ? params.slug : "";
    const catalogoClases = useQuery(api.catalogosDeClases.verTodosLosCatalogosDeClases, { escuelaId: escuela?._id as Id<"escuelas"> });
    const calendario = useQuery(api.calendario.obtenerEventosCalendario, { escuelaId: escuela?._id as Id<"escuelas"> });
    const cicloEscolar = useQuery(api.ciclosEscolares.obtenerCiclosEscolares, { escuelaId: escuela?._id as Id<"escuelas"> });
    const eventosEscolares = useQuery(api.eventosEscolares.obtenerTodosLosEventosEscolares, /* { escuelaId: escuela?._id as Id<"escuelas"> } */);

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

    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems)

    useEffect(() => {
        if (escuela) {
            setItems([
                { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
                { label: 'Eventos', href: `/escuela/${slug}/eventos` },
                { label: 'Crear Evento por Clase', isCurrentPage: true },
            ])
        }
    }, [escuela, setItems, slug])

    const onSubmit = async (values: EventoPorClaseFormValues) => {
        try {
            setIsSubmitting(true);
            await crearEventoXClase({
                escuelaId: escuela?._id as Id<"escuelas">,
                catalogoClaseId: values.catalogoClases as Id<"catalogosDeClases">,
                calendarioId: values.calendario as Id<"calendario">,
                cicloEscolarId: values.cicloEscolar as Id<"ciclosEscolares"> ,
                eventoEscolarId: values.eventosEscolares as Id<"eventosEscolares">,
                fecha: new Date(values.fecha).getTime(),
                descripcion: values.descripcion,
                activo: values.activo,
            });
            toast.success("Evento creado", { description: "El evento se ha creado correctamente" });
            router.back();

        } catch (error) {
            toast.error("Error", {
                description: "Ocurrió un error al guardar el evento"
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
                        Crear Nuevo Evento
                    </h1>
                </div>
            </div>

            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-semibold text-center">Información Evento Escolar</CardTitle>
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
