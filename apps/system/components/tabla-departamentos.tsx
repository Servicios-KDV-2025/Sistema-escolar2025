"use client";

import { useQuery, useMutation } from "convex/react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui/components/shadcn/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuela";
import { toast } from "sonner";


export function TablaDepartamentos() {
    const router = useRouter();
    const escuela = useEscuela((s) => s.escuela);

    // Hook para obtener los departamentos de la escuela actual
    const departamentos = useQuery(
        api.departamento.obtenerDepartamentos,
        escuela ? { escuelaId: escuela._id as Id<"escuelas"> } : "skip"
    );

    // Hook para la mutación de eliminar departamento
    const eliminarDepartamento = useMutation(
        api.departamento.eliminarDepartamento
    );

    const setItems = useBreadcrumbStore((state) => state.setItems);
    const params = useParams();
    const slug = typeof params?.slug === "string" ? params.slug : "";

    useEffect(() => {
        if (escuela) {
            setItems([
                { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
                { label: "Departamentos", isCurrentPage: true },
            ]);
        }
    }, [escuela, setItems, slug]);

    const handleEditarDepartamento = (id: Id<"departamento">) => {
        router.push(`/escuela/${slug}/departamentos/${id}/edit`);
    };

    const handleVerDetallesDepartamento = (id: Id<"departamento">) => {
       
        router.push(`/escuela/${slug}/departamentos/${id}`);
    };

    const handleCrear = () => {
        if (escuela?._id) {
            router.push(`/escuela/${slug}/departamentos/create?escuelaId=${escuela._id}`);
        } else {
            toast.error("Error", {
                description:
                    "Por favor, selecciona una escuela antes de crear un departamento.",
            });
        }
    };

    const handleDeleteDepartamento = async (
        departamentoId: Id<"departamento">,
        nombreDepartamento: string
    ) => {
        if (!escuela?._id) {
            toast.error("Error", {
                description:
                    "No hay una escuela seleccionada para eliminar el departamento.",
            });
            return;
        }

        const confirmed = confirm(
            `¿Estás seguro de que quieres eliminar el departamento "${nombreDepartamento}"? Esta acción no se puede deshacer.`
        );

        if (confirmed) {
            try {
                await eliminarDepartamento({
                    id: departamentoId
                });
                toast.success("Departamento eliminado", {
                    description: `"${nombreDepartamento}" ha sido eliminado correctamente.`,
                });
            } catch (error: unknown) {
                let errorMessage = "Ocurrió un error desconocido al eliminar el departamento.";

                // Verifica si el error es una instancia de Error (lo más común)
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                // Puedes añadir más verificaciones si sabes que pueden ocurrir otros tipos de errores.
                // Por ejemplo, si tu Convex API a veces devuelve un objeto con un campo 'data.message'
                else if (typeof error === 'object' && error !== null && 'message' in error) {
                    errorMessage = (error as { message: string }).message;
                }
                // O si el error es simplemente una cadena
                else if (typeof error === 'string') {
                    errorMessage = error;
                }

                toast.error("Error al eliminar", {
                    description: errorMessage,
                });
                console.error("Error al eliminar departamento:", error);
            }
        }
    };

    if (departamentos === undefined) {
        return (
            <div className="text-center text-gray-600 py-8">
                Cargando los Departamentos...
            </div>
        );
    }

    if (!escuela) {
        return (
            <div className="text-center text-red-500 py-8">
                Por favor, selecciona una escuela para ver sus departamentos.
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Lista de Departamentos</h2>
                <Button onClick={handleCrear} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Departamento
                </Button>
            </div>

            <Table>
                <TableCaption>
                    Lista de departamentos registrados para {escuela.nombre}
                </TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {departamentos.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                                No hay departamentos registrados para esta escuela.
                            </TableCell>
                        </TableRow>
                    ) : (
                        departamentos.map((departamento) => (
                            <TableRow key={departamento._id} className="hover:bg-muted/50">
                                <TableCell className="font-medium">{departamento.nombre}</TableCell>
                                <TableCell>{departamento.descripcion || "N/A"}</TableCell>
                                <TableCell>{departamento.activo ? "Activo" : "Inactivo"}</TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleVerDetallesDepartamento(departamento._id);
                                            }}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditarDepartamento(departamento._id);
                                            }}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteDepartamento(departamento._id, departamento.nombre);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}