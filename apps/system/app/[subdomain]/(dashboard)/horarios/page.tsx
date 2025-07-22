"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEscuela } from "@/app/store/useEscuelaStore";
import { useHorario } from "@/app/store/useHorarioStore";
import { Badge } from "@repo/ui/components/shadcn/badge";
import { CrudDialog, useCrudDialog } from "@/components/dialog/crud-dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";
import { Input } from "@repo/ui/components/shadcn/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select";
import { Switch } from "@repo/ui/components/shadcn/switch";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

// Schema de validación para horarios
const horarioSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  horaFin: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  activo: z.boolean(),
});

// Opciones para AM/PM
const ampmOptions = ["AM", "PM"];

// Helper para convertir a 24h
function to24h(hora: string, ampm: string) {
  if (!/^\d{1,2}:\d{2}$/.test(hora)) {
    return hora;
  }

  const [h, m] = hora.split(":").map(Number);

  if (h < 1 || h > 12 || m < 0 || m > 59) {
    return hora;
  }

  let h24 = h;
  if (ampm === "PM" && h !== 12) h24 += 12;
  if (ampm === "AM" && h === 12) h24 = 0;
  return `${h24.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

// Helper para convertir de 24h a 12h
function from24h(hora24: string) {
  if (!hora24 || !/^[0-9]{1,2}:[0-9]{2}$/.test(hora24)) return { hora: "7:00", ampm: "AM" };
  const [h, m] = hora24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  let hora = h % 12;
  if (hora === 0) hora = 12;
  return { hora: `${hora}:${m.toString().padStart(2, "0")}`, ampm };
}

// Formato 12 horas para mostrar
function formatoHora12(hora24: string) {
  if (!hora24) return "";
  const [h, m] = hora24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hora12 = ((h + 11) % 12 + 1);
  return `${hora12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

// Función para validar formato de hora 12h
function validarHora12(hora: string) {
  if (!/^\d{1,2}:\d{2}$/.test(hora)) {
    return "Formato inválido. Use H:MM o HH:MM";
  }

  const [h, m] = hora.split(":").map(Number);

  if (h < 1 || h > 12) {
    return "La hora debe estar entre 1 y 12";
  }

  if (m < 0 || m > 59) {
    return "Los minutos deben estar entre 00 y 59";
  }

  return null;
}

export default function HorariosPage() {
  const {
    escuela,
    isLoading,
    error,
    clearErrors
  } = useEscuela();

  // Usar el store de horarios
  const {
    horarios,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError,
    crearHorario,
    actualizarHorario,
    eliminarHorario,
    clearErrors: clearStoreErrors,
  } = useHorario(escuela?._id);

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
  } = useCrudDialog(horarioSchema, {
    nombre: "",
    horaInicio: "07:00",
    horaFin: "08:00",
    activo: true
  });

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!escuela?._id) {
      toast.error('Error: Escuela no seleccionada');
      return;
    }

    try {
      if (operation === 'create') {
        await crearHorario({
          escuelaId: escuela._id,
          nombre: values.nombre as string,
          horaInicio: values.horaInicio as string,
          horaFin: values.horaFin as string,
          activo: values.activo as boolean
        });
        toast.success('Creado correctamente')
      } else if (operation === 'edit' && data?._id) {
        await actualizarHorario({
          id: data._id,
          escuelaId: escuela._id,
          nombre: values.nombre as string,
          horaInicio: values.horaInicio as string,
          horaFin: values.horaFin as string,
          activo: values.activo as boolean
        });
        toast.success('Actualizado correctamente')
      }
    } catch (error) {
      console.error('Error en operación CRUD:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!escuela?._id) {
      toast.error('Error: Escuela no seleccionada');
      return;
    }

    try {
      await eliminarHorario(id, escuela._id);
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
        <h1 className="text-3xl font-bold">Horarios</h1>
      </div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
        Haz clic en los iconos de acciones en cada horario para ver sus detalles completos, editarlo o eliminarlo. Para crear un nuevo horario, usa el botón Nuevo Horario.
        </p>
      </div>
      <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Lista de Horarios</h2>
        <Button size="lg" onClick={openCreate} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo horario
        </Button>
     </div>

      {/* Mostrar errores del store */}
      {(createError || updateError || deleteError) && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-800">
            {createError && <div>Error al crear horario: {createError}</div>}
            {updateError && <div>Error al actualizar horario: {updateError}</div>}
            {deleteError && <div>Error al eliminar horario: {deleteError}</div>}
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
        {horarios?.length === 0 && (
          <p className="text-muted-foreground col-span-full">No hay horarios registrados.</p>
        )}
        {horarios?.map((horario) => (
          <div key={horario._id} className="border rounded-lg p-6 flex flex-col justify-between shadow bg-white">
            <div>
              <div className="font-semibold text-lg">{horario.nombre}</div>
              <div className="text-base text-muted-foreground">
                {formatoHora12(horario.horaInicio)} - {formatoHora12(horario.horaFin)}
              </div>
              <div className="mt-2">
                <Badge
                  variant="secondary"
                  className={
                    horario.activo
                      ? "bg-green-800 text-white"
                      : "bg-red-500 text-white"
                  }
                >
                  {horario.activo ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => openView({ ...horario, _id: horario._id })}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => openEdit({ ...horario, _id: horario._id })} disabled={isUpdating}>
                <Pencil className="h-4 w-4" />
              </Button>
                <Button variant="destructive" size="sm" onClick={() => openDelete({ ...horario, _id: horario._id })} disabled={isDeleting}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* CrudDialog */}
      <CrudDialog
        operation={operation}
        title={operation === 'create' ? 'Crear Nuevo Horario' :
          operation === 'edit' ? 'Editar Horario' : 'Ver Horario'}
        description={operation === 'create' ? 'Completa la información del nuevo horario' :
          operation === 'edit' ? 'Modifica la información del horario' : 'Información del horario'}
        schema={horarioSchema}
        defaultValues={{
          nombre: "",
          horaInicio: "07:00",
          horaFin: "08:00",
          activo: true
        }}
        data={data}
        isOpen={isOpen}
        onOpenChange={close}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        deleteConfirmationTitle="¿Eliminar horario?"
        deleteConfirmationDescription="Esta acción no se puede deshacer. El horario será eliminado permanentemente."
      >
        {(form, operation) => <HorarioForm key={data?._id || 'new'} form={form} operation={operation} />}
      </CrudDialog>
    </div>
  );
}

// Componente separado para el formulario
    function HorarioForm({ form, operation }: { form: UseFormReturn<Record<string, unknown>>; operation: string }) {
  const horaInicioValue = form.watch('horaInicio') as string;
  const horaFinValue = form.watch('horaFin') as string;
  const inicio = React.useMemo(() => from24h(horaInicioValue), [horaInicioValue]);
  const fin = React.useMemo(() => from24h(horaFinValue), [horaFinValue]);
  const [errorInicio, setErrorInicio] = React.useState<string | null>(null);
  const [errorFin, setErrorFin] = React.useState<string | null>(null);

  // Validar y actualizar los valores del formulario cuando cambian los inputs
  React.useEffect(() => {
    const errorIni = validarHora12(inicio.hora);
    const errorFinVal = validarHora12(fin.hora);
    setErrorInicio(errorIni);
    setErrorFin(errorFinVal);
    if (!errorIni && !errorFinVal) {
      const horaInicio = to24h(inicio.hora, inicio.ampm);
      const horaFin = to24h(fin.hora, fin.ampm);
      if (horaInicio !== horaInicioValue) form.setValue("horaInicio", horaInicio);
      if (horaFin !== horaFinValue) form.setValue("horaFin", horaFin);
    }
  }, [inicio, fin, form, horaInicioValue, horaFinValue]);

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
                placeholder="Nombre del horario"
                disabled={operation === 'view'}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FormLabel>Hora inicio</FormLabel>
          <div className="flex gap-2 items-center mt-1">
            <Input
              type="text"
              placeholder="H:MM"
              value={inicio.hora}
              onChange={e => form.setValue("horaInicio", to24h(e.target.value, inicio.ampm))}
              className={`w-20 ${errorInicio ? 'border-red-500' : ''}`}
              disabled={operation === 'view'}
            />
            <Select
              value={inicio.ampm === "AM" || inicio.ampm === "PM" ? inicio.ampm : "AM"}
              onValueChange={ampm => form.setValue("horaInicio", to24h(inicio.hora, ampm))}
              disabled={operation === 'view'}
            >
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ampmOptions.map(a => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errorInicio && <p className="text-red-500 text-xs mt-1">{errorInicio}</p>}
        </div>

        <div>
          <FormLabel>Hora fin</FormLabel>
          <div className="flex gap-2 items-center mt-1">
            <Input
              type="text"
              placeholder="H:MM"
              value={fin.hora}
              onChange={e => form.setValue("horaFin", to24h(e.target.value, fin.ampm))}
              className={`w-20 ${errorFin ? 'border-red-500' : ''}`}
              disabled={operation === 'view'}
            />
            <Select
              value={fin.ampm === "AM" || fin.ampm === "PM" ? fin.ampm : "AM"}
              onValueChange={ampm => form.setValue("horaFin", to24h(fin.hora, ampm))}
              disabled={operation === 'view'}
            >
              <SelectTrigger className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ampmOptions.map(a => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {errorFin && <p className="text-red-500 text-xs mt-1">{errorFin}</p>}
        </div>
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