"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEscuela } from "@/app/store/useEscuelaStore";
import { usePeriodo } from "@/app/store/usePeriodoStore";
import { useCicloEscolar } from "@/app/store/useCicloEscolarStore";
import { Badge } from "@repo/ui/components/shadcn/badge";
import { CrudDialog, useCrudDialog } from "@/components/dialog/crud-dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";
import { Input } from "@repo/ui/components/shadcn/input";
import { Switch } from "@repo/ui/components/shadcn/switch";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { useEffect } from "react";

// Nuevo schema de validación para periodos
const periodoSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  clave: z.string().min(1, "Clave requerida"),
  cicloEscolarId: z.string().min(1, "Ciclo escolar requerido"),
  fechaInicio: z.string().min(1, "Fecha de inicio requerida"), // como string para input type="date"
  fechaFin: z.string().min(1, "Fecha de fin requerida"),
  activo: z.boolean(),
});

// Utilidad para convertir timestamp a string 'YYYY-MM-DD' para input type="date"
function toDateInputString(timestamp?: number | string) {
  if (!timestamp) return "";
  const date = typeof timestamp === "string" ? new Date(Number(timestamp)) : new Date(timestamp);
  // Ajuste local, no UTC
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Utilidad para convertir 'YYYY-MM-DD' a timestamp local
function dateStringToLocalTimestamp(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day).getTime();
}

export default function PeriodosPage() {
  const {
    escuela,
    isLoading,
    error,
    clearErrors
  } = useEscuela();

  // Usar el store de periodos
  const {
    periodos,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError,
    crearPeriodo,
    actualizarPeriodo,
    eliminarPeriodo,
    clearErrors: clearStoreErrors,
  } = usePeriodo(escuela?._id);

  const { ciclosEscolares } = useCicloEscolar(escuela?._id);

  // TODO: Obtener lista de ciclos escolares de la escuela
  // const ciclosEscolares: Array<{ _id: string; nombre: string }> = ...
  // const ciclosEscolares: Array<{ _id: string; nombre: string }> = [];

  // Hook del CrudDialog
  const {
    isOpen,
    operation,
    data,
    openCreate,
    openEdit,
    openView,
    openDelete,
    close
  } = useCrudDialog(periodoSchema, {
    nombre: "",
    clave: "",
    cicloEscolarId: "",
    fechaInicio: "",
    fechaFin: "",
    activo: true
  });

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!escuela?._id) {
      toast.error('Error: Escuela no seleccionada');
      return;
    }
    // Validar cicloEscolarId
    if (!values.cicloEscolarId) {
      toast.error('Selecciona un ciclo escolar');
      return;
    }
    try {
      if (operation === 'create') {
        await crearPeriodo({
          escuelaId: escuela._id,
          cicloEscolarId: values.cicloEscolarId as string,
          nombre: values.nombre as string,
          clave: values.clave as string,
          fechaInicio: dateStringToLocalTimestamp(values.fechaInicio as string),
          fechaFin: dateStringToLocalTimestamp(values.fechaFin as string),
          activo: values.activo as boolean
        });
        toast.success('Creado correctamente')
      } else if (operation === 'edit' && data?._id) {
        await actualizarPeriodo({
          id: data._id,
          escuelaId: escuela._id,
          cicloEscolarId: values.cicloEscolarId as string,
          nombre: values.nombre as string,
          clave: values.clave as string,
          fechaInicio: dateStringToLocalTimestamp(values.fechaInicio as string),
          fechaFin: dateStringToLocalTimestamp(values.fechaFin as string),
          activo: values.activo as boolean
        });
        toast.success('Actualizado correctamente')
      }
    } catch (error) {
      console.error('Error en operación CRUD:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string, cicloEscolarId: string) => {
    if (!escuela?._id) {
      toast.error('Error: Escuela no seleccionada');
      return;
    }
    if (!cicloEscolarId) {
      toast.error('Error: Ciclo escolar no seleccionado');
      return;
    }
    try {
      await eliminarPeriodo(id, escuela._id, cicloEscolarId);
      toast.success('Eliminado correctamente')
    } catch (error) {
      console.error('Error al eliminar periodo:', error);
      throw error;
    }
  };

  const handleRetry = () => {
    if (clearErrors) clearErrors();
    clearStoreErrors();
  };

  // Estados de carga y error
  if (isLoading) {
    return <div className="text-center py-10">Cargando escuela...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error}
        <br />
        <button
          onClick={handleRetry}
          className="text-xs text-blue-500 underline mt-2"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!escuela) {
    return <div className="text-center py-10">No se encontró la escuela.</div>;
  }

  return (
    <div className="w-full px-4 md:px-12 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Periodos</h1>
      </div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
        Haz clic en los iconos de acciones en cada periodo para ver sus detalles completos, editarlo o eliminarlo. Para crear un nuevo periodo, usa el botón Nuevo Periodo.
        </p>
      </div>
      <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Lista de Periodos</h2>
        <Button size="lg" onClick={openCreate} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo periodo
        </Button>
     </div>

      {/* Mostrar errores del store */}
      {(createError || updateError || deleteError) && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-800">
            {createError && <div>Error al crear periodo: {createError}</div>}
            {updateError && <div>Error al actualizar periodo: {updateError}</div>}
            {deleteError && <div>Error al eliminar periodo: {deleteError}</div>}
            <button 
              onClick={clearStoreErrors} 
              className="text-xs text-blue-500 underline mt-2"
            >
              Limpiar errores
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
        {periodos?.length === 0 && (
          <p className="text-muted-foreground col-span-full">No hay periodos registrados.</p>
        )}
        {periodos?.map((periodo) => (
          <div key={periodo._id} className="border rounded-lg p-6 flex flex-col justify-between shadow bg-white">
            <div>
              <div className="font-semibold text-lg">{periodo.nombre}</div>
              <div className="text-base text-muted-foreground">
                Clave: {periodo.clave}
              </div>
              <div className="text-base text-muted-foreground">
                Ciclo Escolar: {ciclosEscolares.find(c => c._id === periodo.cicloEscolarId)?.nombre || periodo.cicloEscolarId}
              </div>
              <div className="text-base text-muted-foreground">
                Inicio: {new Date(periodo.fechaInicio).toLocaleDateString()}<br/>
                Fin: {new Date(periodo.fechaFin).toLocaleDateString()}
              </div>
              <div className="mt-2">
                <Badge
                  variant="secondary"
                  className={
                    periodo.activo
                      ? "bg-green-800 text-white"
                      : "bg-red-500 text-white"
                  }
                >
                  {periodo.activo ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => openView({ ...periodo, _id: periodo._id })}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => openEdit({ ...periodo, _id: periodo._id })} disabled={isUpdating}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={() => openDelete({ ...periodo, _id: periodo._id })} disabled={isDeleting}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* CrudDialog */}
      <CrudDialog
        operation={operation}
        title={operation === 'create' ? 'Crear Nuevo Periodo' :
          operation === 'edit' ? 'Editar Periodo' : 'Ver Periodo'}
        description={operation === 'create' ? 'Completa la información del nuevo periodo' :
          operation === 'edit' ? 'Modifica la información del periodo' : 'Información del periodo'}
        schema={periodoSchema}
        defaultValues={{
          nombre: "",
          clave: "",
          cicloEscolarId: "",
          fechaInicio: "",
          fechaFin: "",
          activo: true
        }}
        data={
          data
            ? {
                ...data,
                fechaInicio: toDateInputString(data.fechaInicio as number | string | undefined),
                fechaFin: toDateInputString(data.fechaFin as number | string | undefined),
              }
            : undefined
        }
        isOpen={isOpen}
        onOpenChange={close}
        onSubmit={handleSubmit}
        onDelete={(id) => handleDelete(id as string, (data?.cicloEscolarId as string) || "")}
        deleteConfirmationTitle="¿Eliminar periodo?"
        deleteConfirmationDescription="Esta acción no se puede deshacer. El periodo será eliminado permanentemente."
      >
        {(form, operation) => <PeriodoForm form={form} operation={operation} ciclosEscolares={ciclosEscolares} data={data} />}
      </CrudDialog>
    </div>
  );
}

// Componente separado para el formulario
function PeriodoForm({ form, operation, ciclosEscolares, data }: { form: UseFormReturn<Record<string, unknown>>; operation: string, ciclosEscolares: Array<{ _id: string; nombre: string }>, data?: Record<string, unknown> }) {
  useEffect(() => {
    if (data && operation === "edit") {
      form.reset({
        ...data,
        fechaInicio: toDateInputString(data.fechaInicio as number | string | undefined),
        fechaFin: toDateInputString(data.fechaFin as number | string | undefined),
      });
    }
  }, [data, operation, form]);
  return (
    <div className="grid grid-cols-1 gap-4">
      <FormField
        control={form.control}
        name="nombre"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value as string}
                placeholder="Nombre del periodo"
                disabled={operation === 'view'}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="clave"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Clave</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value as string}
                placeholder="Clave del periodo"
                disabled={operation === 'view'}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Select de ciclo escolar (debes poblar ciclosEscolares) */}
      <FormField
        control={form.control}
        name="cicloEscolarId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ciclo Escolar</FormLabel>
            <FormControl>
              <select
                {...field}
                disabled={operation === 'view'}
                className="w-full border rounded px-2 py-1"
                value={String(field.value)}
              >
                <option value="">Selecciona un ciclo escolar</option>
                {ciclosEscolares.map((ciclo) => (
                  <option key={ciclo._id} value={ciclo._id}>{ciclo.nombre}</option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="fechaInicio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de inicio</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
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
          name="fechaFin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de fin</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  value={field.value as string}
                  disabled={operation === 'view'}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="activo"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between">
            <FormLabel>Estado</FormLabel>
            <FormControl>
              <div className="flex items-center gap-2">
                <Switch
                  checked={field.value as boolean}
                  onCheckedChange={field.onChange}
                  disabled={operation === 'view'}
                />
                <span className="text-sm">
                  {field.value ? "Activo" : "Inactivo"}
                </span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}