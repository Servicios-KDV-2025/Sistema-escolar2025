
'use client'

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useEscuela } from "@/app/store/useEscuelaStore";
import { usePadre } from "@/app/store/usePadreStore";
import { CrudDialog, useCrudDialog } from "@/components/dialog/crud-dialog";
import { padreSchema } from "@/app/shemas/padre";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";
import { Input } from "@repo/ui/components/shadcn/input";
import { Textarea } from "@repo/ui/components/shadcn/textarea";
import { Switch } from "@repo/ui/components/shadcn/switch";
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
import { toast } from "sonner";

export default function PadresPage() {
  const { escuela } = useEscuela();

  // Hook para obtener los padres usando el store
  const {
    padres,
    isCreating: isCreatingPadre,
    isUpdating: isUpdatingPadre,
    isDeleting: isDeletingPadre,
    createError: createPadreError,
    updateError: updatePadreError,
    deleteError: deletePadreError,
    crearPadre,
    actualizarPadre,
    eliminarPadre,
    clearErrors: clearPadreErrors,
  } = usePadre(escuela?._id);

  const {
    isOpen,
    operation,
    data,
    openCreate,
    openEdit,
    openView,
    openDelete,
    close
  } = useCrudDialog(padreSchema, {
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    activo: true
  });

  const setItems = useBreadcrumbStore((state) => state.setItems);
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  useEffect(() => {
    if (escuela) {
      setItems([
        { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
        { label: "Padres", isCurrentPage: true },
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
        await crearPadre({
          escuelaId: escuela._id,
          nombre: values.nombre as string,
          apellidos: values.apellidos as string,
          email: values.email as string || undefined,
          telefono: values.telefono as string || undefined,
          direccion: values.direccion as string || undefined,
          activo: values.activo as boolean
        });
        toast.success('Creado correctamente')
      } else if (operation === 'edit' && data?._id) {
        await actualizarPadre({
          id: data._id,
          escuelaId: escuela._id,
          nombre: values.nombre as string,
          apellidos: values.apellidos as string,
          email: values.email as string || undefined,
          telefono: values.telefono as string || undefined,
          direccion: values.direccion as string || undefined,
          activo: values.activo as boolean
        });
        toast.success('Actualizado correctamente')
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
      await eliminarPadre(id);
      toast.success('Eliminado correctamente')
    } catch (error) {
      toast.error('Error al eliminar padre', { description: (error as Error).message });
      throw error;
    }
  };

  if (padres === undefined) {
    return (
      <div className="text-center text-gray-600 py-8">
        Cargando los Padres...
      </div>
    );
  }

  if (!escuela) {
    return (
      <div className="text-center text-red-500 py-8">
        Por favor, selecciona una escuela para ver sus padres.
      </div>
    );
  }

  return (
    
    <div>
      <h1 className="text-3xl font-bold mb-6">Sistema de padres</h1>
      <p className="text-muted-foreground mb-6">
        Haz clic en cualquier padre para ver sus detalles completos,
        editarlo o eliminarlo. Para crear una nuevo padre, usa el botón
        Nuevo Padre.
      </p>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Padres</h2>
        <Button onClick={openCreate} disabled={isCreatingPadre} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Padre
        </Button>
      </div>

      {/* Mostrar errores del store de padres */}
      {(createPadreError || updatePadreError || deletePadreError) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="text-sm text-red-600">
            {createPadreError && <div>Error al crear padre: {createPadreError}</div>}
            {updatePadreError && <div>Error al actualizar padre: {updatePadreError}</div>}
            {deletePadreError && <div>Error al eliminar padre: {deletePadreError}</div>}
          </div>
          <button 
            onClick={clearPadreErrors} 
            className="text-xs text-blue-500 underline mt-1"
          >
            Limpiar errores
          </button>
        </div>
      )}

      <Table>
        <TableCaption>
          Lista de padres registrados para {escuela.nombre}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellidos</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {padres.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                No hay padres registrados para esta escuela.
              </TableCell>
            </TableRow>
          ) : (
            padres.map((padre) => (
              <TableRow key={padre._id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{padre.nombre}</TableCell>
                <TableCell>{padre.apellidos}</TableCell>
                <TableCell>{padre.email || "N/A"}</TableCell>
                <TableCell>{padre.telefono || "N/A"}</TableCell>
                <TableCell>{padre.activo ? "Activo" : "Inactivo"}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        openView(padre);
                      }}
                      disabled={isUpdatingPadre || isDeletingPadre}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(padre);
                      }}
                      disabled={isUpdatingPadre || isDeletingPadre}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDelete(padre);
                      }}
                      disabled={isDeletingPadre}
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
        title={operation === 'create' ? 'Crear Nuevo Padre' : 
              operation === 'edit' ? 'Editar Padre' : 'Ver Padre'}
        description={operation === 'create' ? 'Completa la información del nuevo padre' :
                    operation === 'edit' ? 'Modifica la información del padre' : 'Información del padre'}
        schema={padreSchema}
        defaultValues={{
          nombre: "",
          apellidos: "",
          email: "",
          telefono: "",
          direccion: "",
          activo: true
        }}
        data={data}
        isOpen={isOpen}
        onOpenChange={close}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isSubmitting={isCreatingPadre || isUpdatingPadre}
        isDeleting={isDeletingPadre}
      >
        {(form, operation) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Nombre del padre" 
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
              name="apellidos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellidos</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Apellidos del padre" 
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email"
                      placeholder="email@ejemplo.com" 
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
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="tel"
                      placeholder="1234567890" 
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
              name="direccion"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Dirección completa" 
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
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 md:col-span-2">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Estado</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {field.value ? 'Padre activo' : 'Padre inactivo'}
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