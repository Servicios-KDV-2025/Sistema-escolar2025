"use client";
import React, { useState, useCallback } from "react";
import { z } from "zod";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useEscuela } from "@/app/store/useEscuelaStore";
import { usePeriodoPorClase } from "@/app/store/usePeriodoPorClaseStore";
import { usePeriodo } from "@/app/store/usePeriodoStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@repo/ui/components/shadcn/badge";
import { CrudDialog, useCrudDialog } from "@/components/ui/crud-dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@repo/ui/components/shadcn/form";
import { Checkbox } from "@repo/ui/components/shadcn/checkbox";
import { Switch } from "@repo/ui/components/shadcn/switch";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/shadcn/table";

// Constants
const DIAS_SEMANA = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 7, label: "Domingo" },
] as const;

// Types
type CatalogoClase = { _id: string; nombre: string; materiaId: string };
type Periodo = { _id: string; nombre: string; horaInicio?: string; horaFin?: string };
type PeriodoPorClaseItem = {
  _id: string;
  catalogoClaseId: string;
  periodoId: string;
  diaSemana: number;
  activo: boolean;
};

// Schema para el CrudDialog
const periodoClaseSchema = z.object({
  catalogoClaseId: z.string().min(1, "Clase requerida"),
  periodoIds: z.array(z.string()).min(1, "Selecciona al menos un periodo"),
  diasSemana: z.array(z.number()).min(1, "Selecciona al menos un día"),
  activo: z.boolean(),
});

// Utility functions
const formatoHora12 = (hora24: string): string => {
  if (!hora24) return "";
  const [h, m] = hora24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hora12 = ((h + 11) % 12 + 1);
  return `${hora12}:${m.toString().padStart(2, "0")} ${ampm}`;
};

// Custom hooks
const useDataQueries = (escuelaId: string | undefined) => {
  const catalogosClases = useQuery(
    api.catalogosDeClases.verTodosLosCatalogosDeClases, 
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );

  const materias = useQuery(
    api.materias.obtenerMateriasPorEscuela,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );

  const maestros = useQuery(
    api.personal.verMaestrosDelPersonal,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );

  return { catalogosClases, materias, maestros };
};

// Components
const LoadingSpinner = () => (
  <div className="text-center py-10">Cargando escuela...</div>
);

const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="text-center py-10 text-red-500">
    Error: {error}
    <br />
    <button
      onClick={onRetry}
      className="text-xs text-blue-500 underline mt-2"
    >
      Reintentar
    </button>
  </div>
);

const NotFoundDisplay = () => (
  <div className="text-center py-10">No se encontró la escuela.</div>
);

const ClassFilter = ({ 
  catalogoClaseId, 
  setCatalogoClaseId, 
  catalogosClases 
}: {
  catalogoClaseId: string;
  setCatalogoClaseId: (id: string) => void;
  catalogosClases: CatalogoClase[] | undefined;
}) => (
  <div className="mb-8">
    <h2 className="font-semibold mb-2">Filtrar horarios por clase</h2>
    <select
      value={catalogoClaseId}
      onChange={e => setCatalogoClaseId(e.target.value)}
      className="mb-2 border rounded px-2 py-1"
    >
      <option value="">Selecciona una clase</option>
      {catalogosClases?.map((c) => (
        <option key={c._id} value={c._id}>{c.nombre}</option>
      ))}
    </select>
    <p className="text-sm text-muted-foreground">
      Selecciona una materia para ver solo sus horarios. Si no seleccionas ninguna, se mostrarán todos los horarios de la escuela.
    </p>
  </div>
);

const PeriodosTable = ({ 
  items, 
  title, 
  onView,
  onEdit, 
  onDelete, 
  getClaseNombre, 
  getPeriodoNombreYHorario, 
  getDiaNombre,
  isUpdating,
  isDeleting
}: {
  items: PeriodoPorClaseItem[] | undefined;
  title: string;
  onView: (item: PeriodoPorClaseItem) => void;
  onEdit: (item: PeriodoPorClaseItem) => void;
  onDelete: (item: PeriodoPorClaseItem) => void;
  getClaseNombre: (id: string) => string;
  getPeriodoNombreYHorario: (id: string) => string;
  getDiaNombre: (num: number) => string;
  isUpdating?: boolean;
  isDeleting?: boolean;
}) => (
  <div>
    <h2 className="font-semibold mb-4">{title}</h2>
    {items?.length === 0 && <p className="text-center text-muted-foreground py-8">No hay registros.</p>}
    
    {items && items.length > 0 && (
      <Table>
        <TableCaption>Lista de horarios registrados</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Clase</TableHead>
            <TableHead>Periodo</TableHead>
            <TableHead>Día</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell className="font-medium">
                {getClaseNombre(item.catalogoClaseId)}
              </TableCell>
              <TableCell>
                {getPeriodoNombreYHorario(item.periodoId)}
              </TableCell>
              <TableCell>
                {getDiaNombre(item.diaSemana)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    item.activo
                      ? "bg-green-800 text-white"
                      : "bg-red-500 text-white"
                  }
                >
                  {item.activo ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onView(item)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEdit(item)} disabled={isUpdating}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(item)} disabled={isDeleting}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )}
  </div>
);

// Main component
export default function PeriodosClasePage() {
  const { escuela, isLoading, error, clearErrors } = useEscuela();
  const escuelaId = escuela?._id;
  
  const { catalogosClases, materias, maestros } = useDataQueries(escuelaId);
  
  // Obtener periodos globales desde el store de periodos (solo para mostrar en selects)
  const { periodos } = usePeriodo(escuelaId);
  
  const [catalogoClaseId, setCatalogoClaseId] = useState("");
  
  // Store de periodos por clase
  const {
    periodosPorClase,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError,
    crearPeriodoPorClase,
    actualizarPeriodoPorClase,
    eliminarPeriodoPorClase,
    clearErrors: clearStoreErrors,
    periodosPorClasePorCatalogo,
  } = usePeriodoPorClase(escuelaId);
  
  const {
    isOpen,
    operation,
    data,
    openCreate,
    openEdit,
    openView,
    openDelete,
    close
  } = useCrudDialog(periodoClaseSchema, {
    catalogoClaseId: "",
    periodoIds: [],
    diasSemana: [],
    activo: true
  });

  // Memoized helper functions
  const getClaseNombre = useCallback((id: string) =>
    catalogosClases?.find((c: CatalogoClase) => c._id === id)?.nombre || id,
    [catalogosClases]
  );

  const getPeriodoNombreYHorario = useCallback((id: string) => {
    const periodo = periodos?.find((p: Periodo) => p._id === id);
    if (!periodo) return id;
    return `${periodo.nombre} (${formatoHora12(periodo.horaInicio || "")} - ${formatoHora12(periodo.horaFin || "")})`;
  }, [periodos]);

  const getDiaNombre = useCallback((num: number) =>
    DIAS_SEMANA.find((d) => d.value === num)?.label || num.toString(),
    []
  );

  // Event handlers para el CrudDialog
  const handleSubmit = useCallback(async (values: Record<string, unknown>) => {
    if (!escuelaId) {
      toast.error("Error: Escuela no seleccionada");
      return;
    }

    try {
      if (operation === 'create') {
        // Para crear, generamos todas las combinaciones
        const periodoIds = values.periodoIds as string[];
        const diasSemana = values.diasSemana as number[];
        
        const combinaciones = diasSemana.flatMap(dia =>
          periodoIds.map(periodoId => ({
            escuelaId: escuelaId as Id<"escuelas">,
            catalogoClaseId: values.catalogoClaseId as Id<"catalogosDeClases">,
            periodoId: periodoId as Id<"periodos">,
            diaSemana: dia,
            activo: values.activo as boolean,
          }))
        );

        await Promise.all(
          combinaciones.map(combo => crearPeriodoPorClase(combo))
        );
        
        toast.success(`${combinaciones.length} horarios creados exitosamente`);
      } else if (operation === 'edit' && data?._id) {
        // Para editar, solo actualizamos el registro actual
        await actualizarPeriodoPorClase({
          id: data._id as Id<"periodoPorClase">,
          escuelaId: escuelaId as Id<"escuelas">,
          catalogoClaseId: values.catalogoClaseId as Id<"catalogosDeClases">,
          periodoId: (values.periodoIds as string[])[0] as Id<"periodos">,
          diaSemana: (values.diasSemana as number[])[0],
          activo: values.activo as boolean,
        });
        toast.success("Horario actualizado exitosamente");
      }
    } catch (error) {
      console.error('Error en operación CRUD:', error);
      throw error;
    }
  }, [operation, data, escuelaId, crearPeriodoPorClase, actualizarPeriodoPorClase]);

  const handleDelete = useCallback(async (id: string) => {
    if (!escuelaId) {
      toast.error("Error: Escuela no seleccionada");
      return;
    }
    
    try {
      await eliminarPeriodoPorClase(id, escuelaId);
    } catch (error) {
      console.error('Error al eliminar:', error);
      throw error;
    }
  }, [escuelaId, eliminarPeriodoPorClase]);

  // Event handlers para los botones
  const handleView = useCallback((item: PeriodoPorClaseItem) => {
    const adaptedData = {
      ...item,
      periodoIds: [item.periodoId],
      diasSemana: [item.diaSemana],
      _id: item._id
    };
    openView(adaptedData);
  }, [openView]);

  const handleEdit = useCallback((item: PeriodoPorClaseItem) => {
    const adaptedData = {
      ...item,
      periodoIds: [item.periodoId],
      diasSemana: [item.diaSemana],
      _id: item._id
    };
    openEdit(adaptedData);
  }, [openEdit]);

  const handleDeleteClick = useCallback((item: PeriodoPorClaseItem) => {
    openDelete({ ...item, _id: item._id });
  }, [openDelete]);

  const handleRetry = useCallback(() => {
    if (clearErrors) clearErrors();
    clearStoreErrors();
  }, [clearErrors, clearStoreErrors]);

  // Render conditions
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} onRetry={handleRetry} />;
  if (!escuela) return <NotFoundDisplay />;

  return (
    <div className="w-full px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Horarios </h1>
  
      </div>

      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          Haz clic en los iconos de acciones en cada horario para ver sus detalles completos, editarlo o eliminarlo. Para crear un nuevo horario, usa el botón Nuevo Horario.
        </p>
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Horarios</h2>
        <Button onClick={openCreate} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Horario
        </Button>
      </div>

      <ClassFilter 
        catalogoClaseId={catalogoClaseId}
        setCatalogoClaseId={setCatalogoClaseId}
        catalogosClases={catalogosClases}
      />

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

      {catalogoClaseId ? (
        <PeriodosTable
          items={periodosPorClasePorCatalogo(catalogoClaseId)}
          title="Horarios de la clase seleccionada"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          getClaseNombre={getClaseNombre}
          getPeriodoNombreYHorario={getPeriodoNombreYHorario}
          getDiaNombre={getDiaNombre}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      ) : (
        <PeriodosTable
          items={periodosPorClase}
          title="Todos los horarios"
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          getClaseNombre={getClaseNombre}
          getPeriodoNombreYHorario={getPeriodoNombreYHorario}
          getDiaNombre={getDiaNombre}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
        />
      )}

      {/* CrudDialog para manejo de horarios */}
      <CrudDialog
        operation={operation}
        title={operation === 'create' ? 'Crear Nuevo Horario' : 
              operation === 'edit' ? 'Editar Horario' : 'Detalle del Horario'}
        description={operation === 'create' ? 'Completa la información del nuevo horario' :
                    operation === 'edit' ? 'Modifica la información del horario' : 'Información completa del horario'}
        schema={periodoClaseSchema}
        defaultValues={{
          catalogoClaseId: "",
          periodoIds: [],
          diasSemana: [],
          activo: true
        }}
        data={data}
        isOpen={isOpen}
        onOpenChange={close}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      >
        {(form, currentOperation) => {
          const watchedValues = form.watch();
          const totalCombinaciones = (watchedValues.periodoIds as string[])?.length * (watchedValues.diasSemana as number[])?.length || 0;
          
          // Si es modo "view", mostrar información detallada
          if (currentOperation === 'view' && data) {
            const clase = catalogosClases?.find((c: CatalogoClase) => c._id === data.catalogoClaseId);
            const periodo = periodos?.find((p: Periodo) => p._id === data.periodoId);
            const materia = materias?.find((m: { _id: Id<"materias">; nombre: string }) => m._id === clase?.materiaId);
            const maestro = maestros?.find((m: { id: string }) => m.id === clase?.maestroId);
            
            return (
              <div className="space-y-6">
                {/* Información Principal */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Información del Horario</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-blue-600 text-sm font-medium">Clase</span>
                      <div className="font-medium">{clase?.nombre || "-"}</div>
                    </div>
                    <div>
                      <span className="text-blue-600 text-sm font-medium">Materia</span>
                      <div className="font-medium">{materia?.nombre || "-"}</div>
                    </div>
                    <div>
                      <span className="text-blue-600 text-sm font-medium">Maestro</span>
                      <div className="font-medium">{maestro ? `${maestro.nombre} ${maestro.apellidos}` : "-"}</div>
                    </div>
                    <div>
                      <span className="text-blue-600 text-sm font-medium">Periodo</span>
                      <div className="font-medium">{periodo?.nombre || "-"}</div>
                    </div>
                    <div>
                      <span className="text-blue-600 text-sm font-medium">Horario</span>
                      <div className="font-medium">
                        {periodo ? `${formatoHora12(periodo.horaInicio || "")} - ${formatoHora12(periodo.horaFin || "")}` : "-"}
                      </div>
                    </div>
                    <div>
                      <span className="text-blue-600 text-sm font-medium">Día de la semana</span>
                      <div className="font-medium">{getDiaNombre(data.diaSemana as number)}</div>
                    </div>
                    <div>
                      <span className="text-blue-600 text-sm font-medium">Estado</span>
                      <div className="font-medium">
                        <Badge
                          variant="secondary"
                          className={
                            data.activo
                              ? "bg-green-800 text-white"
                              : "bg-red-500 text-white"
                          }
                        >
                          {data.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

              

               
                {/* Botones de Acción */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      close();
                      setTimeout(() => {
                        const adaptedData = {
                          ...data,
                          periodoIds: [data.periodoId],
                          diasSemana: [data.diaSemana],
                          _id: data._id
                        };
                        openEdit(adaptedData);
                      }, 100);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      close();
                      setTimeout(() => {
                        openDelete({ ...data, _id: data._id });
                      }, 100);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            );
          }
          
          // Si es modo "create" o "edit", mostrar el formulario normal
          return (
            <div className="space-y-4">
              {/* Clase Selection */}
              <FormField
                control={form.control}
                name="catalogoClaseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clase</FormLabel>
                    <FormControl>
                      <select
                        value={field.value as string}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        className="w-full border rounded px-2 py-1"
                        disabled={currentOperation === 'view' || !catalogosClases}
                      >
                        <option value="">Selecciona una clase</option>
                        {catalogosClases?.map((c) => (
                          <option key={c._id} value={c._id}>{c.nombre}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Periodos Selection */}
              <FormField
                control={form.control}
                name="periodoIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Periodos</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                        {periodos?.map((periodo) => (
                          <div key={periodo._id} className="flex items-center space-x-2">
                            <Checkbox
                              checked={(field.value as string[])?.includes(periodo._id) || false}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value as string[] || [];
                                if (checked) {
                                  field.onChange([...currentValue, periodo._id]);
                                } else {
                                  field.onChange(currentValue.filter(id => id !== periodo._id));
                                }
                              }}
                              disabled={currentOperation === 'view'}
                            />
                            <label className="text-sm">
                              {periodo.nombre} ({formatoHora12(periodo.horaInicio || "")} - {formatoHora12(periodo.horaFin || "")})
                            </label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Días Selection */}
              <FormField
                control={form.control}
                name="diasSemana"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Días de la semana</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {DIAS_SEMANA.map((dia) => (
                          <div key={dia.value} className="flex items-center space-x-2">
                            <Checkbox
                              checked={(field.value as number[])?.includes(dia.value) || false}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value as number[] || [];
                                if (checked) {
                                  field.onChange([...currentValue, dia.value]);
                                } else {
                                  field.onChange(currentValue.filter(d => d !== dia.value));
                                }
                              }}
                              disabled={currentOperation === 'view'}
                            />
                            <label className="text-sm">{dia.label}</label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Active Switch */}
              <FormField
                control={form.control}
                name="activo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                          disabled={currentOperation === 'view'}
                        />
                        <span>{field.value ? "Activo" : "Inactivo"}</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preview */}
              {currentOperation === 'create' && totalCombinaciones > 0 && (
                <div className="bg-blue-50 p-3 rounded border">
                  <p className="text-sm font-medium text-blue-800">
                    Se crearán {totalCombinaciones} horarios:
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {(watchedValues.periodoIds as string[])?.length || 0} periodo(s) × {(watchedValues.diasSemana as number[])?.length || 0} día(s)
                  </p>
                </div>
              )}
            </div>
          );
        }}
      </CrudDialog>
    </div>
  );
}