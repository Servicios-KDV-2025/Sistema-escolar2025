import { useEffect, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import {
    FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@repo/ui/components/shadcn/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select";
import { Input } from "@repo/ui/components/shadcn/input";
import { Ciclosescolares, Grupos, Materias, Personal, Salones } from "@/types/convex-zod-types";

interface FormularioCatalogoDeClasesProps {
    form: UseFormReturn<Record<string, unknown>>;
    operation: "create" | "edit" | "view" | "delete";
    materias: Materias[] | undefined;
    grupos: Grupos[] | undefined;
    ciclosEscolares: Ciclosescolares[] | undefined;
    salones: Salones[] | undefined;
    maestros: Personal[] | undefined;
}

export function FormularioCatalogoDeClases({
    form,
    operation,
    materias,
    grupos,
    ciclosEscolares,
    salones,
    maestros
}: FormularioCatalogoDeClasesProps) {
    const [isNombreModificadoManualmente, setIsNombreModificadoManualmente] = useState(false);

    const materiaId = useWatch({ control: form.control, name: "materiaId" });
    const grupoId = useWatch({ control: form.control, name: "grupoId" });

    useEffect(() => {
        if (operation === 'view') return;
        const materia = materias?.find((m) => m._id === materiaId)?.nombre;
        const grupo = grupos?.find((g) => g._id === grupoId)?.nombre;
        const grado = grupos?.find((g) => g._id === grupoId)?.grado;

        if (!isNombreModificadoManualmente && materia && grupo) {
            form.setValue("nombre", `${materia} - ${grado} ${grupo}`);
        }
    }, [materiaId, grupoId, form, grupos, isNombreModificadoManualmente, materias, operation]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="cicloEscolarId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ciclo Escolar</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value as string}
                            disabled={operation === "view"}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un Ciclo Escolar" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {ciclosEscolares?.map((c) => (
                                    <SelectItem key={c._id} value={c._id}>
                                        {c.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* materiaId */}
            <FormField
                control={form.control}
                name="materiaId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Materia</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value as string}
                            disabled={operation === "view"}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una Materia" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {materias?.map((m) => (
                                    <SelectItem key={m._id} value={m._id}>
                                        {m.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* salonId */}
            <FormField
                control={form.control}
                name="salonId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Salón</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value as string}
                            disabled={operation === "view"}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un Salón" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {salones?.map((s) => (
                                    <SelectItem key={s._id} value={s._id}>
                                        {s.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* maestroId */}
            <FormField
                control={form.control}
                name="maestroId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Maestro</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value as string}
                            disabled={operation === "view"}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un Maestro" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {maestros?.map((m) => (
                                    <SelectItem key={m._id} value={m._id}>
                                        {m.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* grupoId */}
            <FormField
                control={form.control}
                name="grupoId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Grupo</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value as string}
                            disabled={operation === "view"}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un Grupo" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {grupos?.map((g) => (
                                    <SelectItem key={g._id} value={g._id}>
                                        {g.grado} {g.nombre}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* nombre */}
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
                                value={field.value as string || ""}
                                onChange={(e) => {
                                    field.onChange(e);
                                    setIsNombreModificadoManualmente(true);
                                }}
                                placeholder="Ej: Matemáticas - Grupo A"
                                disabled={operation === "view"}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
