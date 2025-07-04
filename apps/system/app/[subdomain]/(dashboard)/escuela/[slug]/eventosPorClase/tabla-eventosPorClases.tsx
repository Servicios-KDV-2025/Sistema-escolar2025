'use client';

import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@repo/ui/components/shadcn/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/shadcn/table";
import { useQuery } from "convex/react";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export function TablaEventosPorClase() {
    const router = useRouter();
    const escuela = useEscuela(s => s.escuela);
    const eventosPorClase = useQuery(api.eventoPorClase.verTodosLosEventosXClases, { escuelaId: escuela?._id as Id<'escuelas'> });
    const setItems = useBreadcrumbStore(state => state.setItems);
    const params = useParams();
    const slug = typeof params?.slug === 'string' ? params.slug : '';

    useEffect(() => {
        if (escuela) {
            setItems([
                { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
                { label: 'Eventos por Clase', isCurrentPage: true },
            ]);
        }
    }, [escuela, slug, setItems]);

    if (eventosPorClase === undefined) {
        return <div>Cargando los Grupos...</div>;
    }

    const handleVerEventosPorClase = (id: string) => {
        router.push(`escuela/${slug}/eventos/eventosPorClase/${id}`);
    }

    const handleCrear = () => {
        router.push(`/escuela/${slug}/eventos/eventosPorClase/create`);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Lista de Eventos por Clases</h2>
                <Button onClick={handleCrear} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Evento
                </Button>
            </div>

            <Table>
                <TableCaption>Lista de Eventos por Clase</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Fecha</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Activo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {eventosPorClase.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">
                                No hay Eventos por Clases registrados
                            </TableCell>
                        </TableRow>
                    ) : (
                        eventosPorClase.map((evento) => (
                            <TableRow
                                key={evento.id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => handleVerEventosPorClase(evento.id)}
                            >
                                <TableCell className="font-medium">
                                    {evento.fecha}
                                </TableCell>
                                <TableCell>{evento.descripcion}</TableCell>
                                <TableCell>{evento.activo ? 'Activo' : 'No activo'}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
