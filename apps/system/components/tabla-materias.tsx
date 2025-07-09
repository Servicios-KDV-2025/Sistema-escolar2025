// src/components/TablaMaterias.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/shadcn/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuelaStore";
import { useMateria } from "@/app/store/useMateriaStore";
import { CrudDialog, useCrudDialog } from "@/components/ui/crud-dialog";
import { materiaSchema } from "@/app/shemas/materia";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";
import { Input } from "@repo/ui/components/shadcn/input";
import { Textarea } from "@repo/ui/components/shadcn/textarea";
import { Switch } from "@repo/ui/components/shadcn/switch";
import { toast } from "sonner";

export function TablaMaterias() {
  const {escuela} = useEscuela();

  // Hook para obtener las materias usando el store
  const {
    materias,
    isCreating: isCreatingMateria,
    isUpdating: isUpdatingMateria,
    isDeleting: isDeletingMateria,
    createError: createMateriaError,
    updateError: updateMateriaError,
    deleteError: deleteMateriaError,
    crearMateria,
    actualizarMateria,
    eliminarMateria,
    clearErrors: clearMateriaErrors,
  } = useMateria(escuela?._id);

  const {
    isOpen,
    operation,
    data,
    openCreate,
    openEdit,
    openView,
    openDelete,
    close
  } = useCrudDialog(materiaSchema, {
    nombre: "",
    descripcion: "",
    creditos: "",
    activa: true
  });

  const setItems = useBreadcrumbStore((state) => state.setItems);
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  useEffect(() => {
    if (escuela) {
      setItems([
        { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
        { label: "Materias", isCurrentPage: true },
      ]);
    }
  }, [escuela, setItems, slug]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!escuela?._id) {
      toast.error('Error', { description: 'No se pudo identificar la escuela' });
      return;
    }

    try {
      if (operation === 'create') {
        await crearMateria({
          escuelaId: escuela._id,
          nombre: values.nombre as string,
          descripcion: values.descripcion as string,
          creditos: values.creditos ? Number(values.creditos) : undefined,
          activa: values.activa as boolean
        });
      } else if (operation === 'edit' && data?._id) {
        await actualizarMateria({
          id: data._id,
          escuelaId: escuela._id,
          nombre: values.nombre as string,
          descripcion: values.descripcion as string,
          creditos: values.creditos ? Number(values.creditos) : undefined,
          activa: values.activa as boolean
        });
      } else {
        throw new Error('Operación no válida o datos faltantes');
      }
    } catch (error) {
      toast.error('Error en operación CRUD', { description: (error as Error).message });
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarMateria(id);
    } catch (error) {
      toast.error('Error al eliminar materia', { description: (error as Error).message });
      throw error;
    }
  };

  if (materias === undefined) {
    return (
      <div className="text-center text-gray-600 py-8">
        Cargando las Materias...
      </div>
    );
  }

  if (!escuela) {
    return (
      <div className="text-center text-red-500 py-8">
        Por favor, selecciona una escuela para ver sus materias.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Materias</h2>
        <Button onClick={openCreate} disabled={isCreatingMateria} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Materia
        </Button>
      </div>

      {/* Mostrar errores del store de materias */}
      {(createMateriaError || updateMateriaError || deleteMateriaError) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="text-sm text-red-600">
            {createMateriaError && <div>Error al crear materia: {createMateriaError}</div>}
            {updateMateriaError && <div>Error al actualizar materia: {updateMateriaError}</div>}
            {deleteMateriaError && <div>Error al eliminar materia: {deleteMateriaError}</div>}
          </div>
          <button 
            onClick={clearMateriaErrors} 
            className="text-xs text-blue-500 underline mt-1"
          >
            Limpiar errores
          </button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Créditos</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materias.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                No hay materias registradas para esta escuela.
              </TableCell>
            </TableRow>
          ) : (
            materias.map((materia) => (
              <TableRow key={materia._id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{materia.nombre}</TableCell>
                <TableCell>{materia.descripcion || "N/A"}</TableCell>
                <TableCell>{materia.creditos || "N/A"}</TableCell>
                <TableCell>{materia.activa ? "Activa" : "Inactiva"}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        openView(materia);
                      }}
                      disabled={isUpdatingMateria || isDeletingMateria}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(materia);
                      }}
                      disabled={isUpdatingMateria || isDeletingMateria}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDelete(materia);
                      }}
                      disabled={isDeletingMateria}
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

      {/* CrudDialog */}
      <CrudDialog
        operation={operation}
        title={operation === 'create' ? 'Crear Nueva Materia' : 
              operation === 'edit' ? 'Editar Materia' : 'Ver Materia'}
        description={operation === 'create' ? 'Completa la información de la nueva materia' :
                    operation === 'edit' ? 'Modifica la información de la materia' : 'Información de la materia'}
        schema={materiaSchema}
        defaultValues={{
          nombre: "",
          descripcion: "",
          creditos: "",
          activa: true
        }}
        data={data}
        isOpen={isOpen}
        onOpenChange={close}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isSubmitting={isCreatingMateria || isUpdatingMateria}
        isDeleting={isDeletingMateria}
      >
        {(form, operation) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Nombre de la materia" 
                      value={field.value as string}
                      disabled={operation === 'view'}
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
                <FormItem className="md:col-span-2">
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Descripción de la materia" 
                      value={field.value as string}
                      disabled={operation === 'view'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="creditos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Créditos</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number"
                      placeholder="Número de créditos" 
                      value={field.value as string}
                      disabled={operation === 'view'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="activa"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Estado</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {field.value ? 'Materia activa' : 'Materia inactiva'}
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value as boolean}
                      onCheckedChange={field.onChange}
                      disabled={operation === 'view'}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}
      </CrudDialog>
    </div>
  );
}
