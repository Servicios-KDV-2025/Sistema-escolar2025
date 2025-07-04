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
import { useForm, useWatch } from "react-hook-form";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select";
import { CatalogoDeClaseFormValues, catalogoDeClaseSchema } from "@/app/shemas/catalogoDeClases";

export default function EditarClase({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const idCatalogoDeClase = id as Id<"catalogosDeClases">;
    const router = useRouter();
    const allParams = useParams();
    const slug = typeof allParams?.slug === "string" ? allParams.slug : "";
    const actualizarClase = useMutation(api.catalogosDeClases.actualizarCatalogoDeClase);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const setItems = useBreadcrumbStore(state => state.setItems);
    const escuela = useEscuela((s) => s.escuela);
    const CatalogoDeClases = useQuery(api.catalogosDeClases.verUnCatalogoDeClase, { id: idCatalogoDeClase, escuelaId: escuela?._id as Id<"escuelas"> });
    const ciclosEscolares = useQuery(api.ciclosEscolares.obtenerCiclosEscolares, { escuelaId: escuela?._id as Id<"escuelas"> });
    const materias = useQuery(api.materias.obtenerMateriasPorEscuela, { escuelaId: escuela?._id as Id<"escuelas"> });
    const salones = useQuery(api.salones.obtenerSalones, { escuelaId: escuela?._id as Id<"escuelas"> });
    const maestros = useQuery(api.personal.verMaestrosDelPersonal, { escuelaId: escuela?._id as Id<"escuelas"> });
    const grupos = useQuery(api.grupos.verTodosLosGrupos, { escuelaId: escuela?._id as Id<"escuelas"> });

    const [isNombreModificadoManualmente, setIsNombreModificadoManualmente] = useState(false);

    const form = useForm<CatalogoDeClaseFormValues>({
        resolver: zodResolver(catalogoDeClaseSchema),
        defaultValues: {
            cicloEscolarId: '',
            materiaId: '',
            salonId: '',
            maestroId: '',
            grupoId: '',
            nombre: '',
            activa: true,
        }
    });

    useEffect(() => {
        if (CatalogoDeClases) {
            form.reset({
                cicloEscolarId: CatalogoDeClases?.cicloEscolarId,
                materiaId: CatalogoDeClases?.materiaId,
                salonId: CatalogoDeClases?.salonId,
                maestroId: CatalogoDeClases?.maestroId,
                grupoId: CatalogoDeClases?.grupoId,
                nombre: CatalogoDeClases?.nombre,
                activa: CatalogoDeClases?.activa,
            });
        }
    }, [CatalogoDeClases, form]);

    const materiaId = useWatch({ control: form.control, name: "materiaId" });
    const grupoId = useWatch({ control: form.control, name: "grupoId" });

    useEffect(() => {
        const materiaSeleccionada = materias?.find((m) => m._id === materiaId)?.nombre;
        const grupoSeleccionado = grupos?.find((g) => g.id === grupoId)?.nombre;

        if (!isNombreModificadoManualmente) {
            if (materiaSeleccionada && grupoSeleccionado) {
                form.setValue("nombre", `${materiaSeleccionada} - Grupo ${grupoSeleccionado}`);
            } else {
                form.setValue("nombre", "");
            }
        }
    }, [materiaId, grupoId, materias, grupos, isNombreModificadoManualmente, form]);

    useEffect(() => {
        if (CatalogoDeClases) {
            setItems([
                { label: `${escuela?.nombre}`, href: '/' },
                { label: 'Catalogo de Clases', href: '/catalogoDeClases' },
                { label: `${CatalogoDeClases?.nombre}`, href: `/catalogoDeClases/${CatalogoDeClases._id}` },
                { label: 'Editar', isCurrentPage: true },
            ]);
        }
    }, [setItems, escuela, CatalogoDeClases]);

    const onSubmit = async (values: CatalogoDeClaseFormValues) => {
        try {
            setIsSubmitting(true);
            await actualizarClase({
                id: idCatalogoDeClase,
                escuelaId: escuela?._id as Id<"escuelas">,
                cicloEscolarId: values?.cicloEscolarId as Id<'ciclosEscolares'>,
                materiaId: values?.materiaId as Id<'materias'>,
                salonId: values?.salonId as Id<'salones'>,
                maestroId: values?.maestroId as Id<'personal'>,
                grupoId: values?.grupoId as Id<'grupos'>,
                nombre: values?.nombre,
                activa: values?.activa,
            });
            toast.success("Clase actualizada", { description: "La clase se ha actualizado correctamente" });
            setIsNombreModificadoManualmente(false);
            router.push(`/escuela/${slug}/catalogoDeClases`);
        } catch (error) {
            toast.error("Error", {
                description: "Ocurrió un error al guardar la clase"
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
                        Editar Clase
                    </h1>
                </div>
            </div>

            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="font-semibold text-center">Información de la Clase</CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <CardContent className="grid grid-cols-1 gap-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <FormField
                                    control={form.control}
                                    name="cicloEscolarId"
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
                                                        ciclosEscolares?.map(ciclEsc => (
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
                                    name="materiaId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Materias</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona una Materia" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        materias?.map(mat => (
                                                            <SelectItem key={mat._id} value={mat._id}>
                                                                {mat.nombre}
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
                                    name="salonId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Salones</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona un Salón" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        salones?.map(salon => (
                                                            <SelectItem key={salon._id} value={salon._id}>
                                                                {salon.nombre}
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
                                    name="maestroId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Maestros</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona un Maestro" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        maestros?.map(maestro => (
                                                            <SelectItem key={maestro._id} value={maestro._id}>
                                                                {maestro.nombre}
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
                                    name="grupoId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Grupos</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona un Grupo" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        grupos?.map(grupo => (
                                                            <SelectItem key={grupo.id} value={grupo.id}>
                                                                {grupo.nombre}
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
                                    name="nombre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e); // Mantiene el comportamiento del hook
                                                        setIsNombreModificadoManualmente(true); // Marca que el usuario lo modificó
                                                    }}
                                                    placeholder="Ej: Matemáticas - Grupo A"
                                                />
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
                                {isSubmitting ? "Creando..." : "Crear Catálogo"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}