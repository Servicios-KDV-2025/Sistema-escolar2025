import { CrudOperation } from "@/components/ui/crud-dialog"
import { Escuela } from "@/types/escuelas"
import { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select";
import { Input } from "@/components/ui/input";
import { useWatch } from "react-hook-form";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CatalogoDeClase } from "@/app/store/useCatalogoDeClasesStore";
import { EventoEscolar } from "@/app/store/useEventoEscolarStore";
import { Id } from "@/convex/_generated/dataModel";

type FormularioEventoPorClaseProps = {
    form: UseFormReturn<Record<string, unknown>>;
    operation: CrudOperation;
    escuelaId: Escuela['_id'];
    catalogosDeClases: CatalogoDeClase[];
    eventosEscolares: EventoEscolar[];
    ciclosEscolares: {
        _id: string & {
            __tableName: "ciclosEscolares";
        };
        activo: boolean;
        nombre: string;
        escuelaId: string & {
            __tableName: "escuelas";
        };
        fechaInicio: number;
        fechaFin: number;
    }[]
}

export default function FormularioEventoPorClase({
    form,
    operation,
    escuelaId,
    catalogosDeClases,
    eventosEscolares,
    ciclosEscolares
}: FormularioEventoPorClaseProps) {
    const cicloEscolarSeleccionado = useWatch({ control: form.control, name: "cicloEscolar" });

    const calendarioFiltrado = useQuery(
        api.calendario.obtenerCalendarioCicloEscolar,
        escuelaId && cicloEscolarSeleccionado
            ? {
                escuelaId: escuelaId,
                cicloEscolarId: cicloEscolarSeleccionado as Id<"ciclosEscolares">,
            }
            : "skip"
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="catalogoClases"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Clases</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value as string}
                            disabled={operation === 'view'}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una Clase" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {
                                    catalogosDeClases?.map(catClas => (
                                        <SelectItem key={catClas._id} value={catClas._id}>
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
                        <FormLabel>Calendario</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value as string}
                            disabled={operation === 'view'}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una fecha" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {
                                    calendarioFiltrado?.map(cal => {

                                        return (
                                            <SelectItem key={cal._id} value={cal._id}>
                                                {new Date(cal.fecha).toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" })}
                                            </SelectItem>
                                        )
                                    })
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
                            value={field.value as string}
                            disabled={operation === 'view'}
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
                name="eventosEscolares"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Evento Escolar (Opcional)</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value as string}
                            disabled={operation === 'view'}
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
                            <Input
                                {...field}
                                value={field.value as string || ''}
                                placeholder="Fecha del evento"
                                type="date"
                            />
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
                            <Input
                                {...field}
                                value={field.value as string || ''}
                                placeholder="Descripción del Evento"
                            />
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
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                            <Select
                                onValueChange={(value) => field.onChange(value === 'true')}
                                value={field.value ? 'true' : 'false'}
                                disabled={operation === 'view'}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Activo</SelectItem>
                                    <SelectItem value="false">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
