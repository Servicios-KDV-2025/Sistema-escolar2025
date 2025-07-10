// apps/system/components/DepartamentoCRUD.tsx
import React from 'react';
import { useEscuela } from '@/app/store/useEscuela';
import { useBreadcrumbStore } from '@/app/store/breadcrumbStore';
import { useDepartamento } from '@/app/store/useDepartamentoStore';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Eye, Pencil } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/shadcn/table';
import { Button } from '@/components/ui/button';
import { CrudDialog, useCrudDialog } from '@/components/ui/crud-dialog';
import { departamentoSchema, DepartamentoFormValues } from '@/app/shemas/departamento';
import { DepartamentoForm } from '@/components/DepartamentoForm';
import { UseFormReturn } from 'react-hook-form';
import { Badge } from '@repo/ui/components/shadcn/badge';

// Definir tipo extendido para departamento con ID
type DepartamentoConId = DepartamentoFormValues & {
  _id: string;
};

export function DepartamentoCRUD() {
  const routerSchool = useEscuela((s) => s.escuela);
  const setItems = useBreadcrumbStore((s) => s.setItems);
  
  // Usar el store de departamentos (sin modificar el store existente)
  const {
    departamentos,
    departamentoSeleccionado,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    crearDepartamento,
    actualizarDepartamento,
    eliminarDepartamento,
    setDepartamentoSeleccionado,
    clearErrors,
  } = useDepartamento(routerSchool?._id);

  // Configurar breadcrumbs
  React.useEffect(() => {
    if (routerSchool) {
      setItems([
        { label: routerSchool.nombre, href: `/escuela/${encodeURIComponent(routerSchool.nombre)}` },
        { label: 'Departamentos', isCurrentPage: true },
      ]);
    }
  }, [routerSchool, setItems]);

  // Limpiar errores al montar el componente
  React.useEffect(() => {
    clearErrors();
  }, [clearErrors]);

  // Mostrar errores con toast
  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (createError) {
      toast.error(createError);
    }
    if (updateError) {
      toast.error(updateError);
    }
    if (deleteError) {
      toast.error(deleteError);
    }
  }, [error, createError, updateError, deleteError]);

  const { isOpen, operation, data, openCreate, openEdit, openView, openDelete, close } =
    useCrudDialog(departamentoSchema, { nombre: '', descripcion: '', activo: true });

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!routerSchool?._id) {
      toast.error('Selecciona una escuela antes de continuar.');
      return;
    }
    
    // Validar que los datos tienen la estructura esperada
    const validatedValues = values as DepartamentoFormValues;
    
    try {
      if (operation === 'create') {
        await crearDepartamento({
          escuelaId: routerSchool._id,
          ...validatedValues
        });
        toast.success('Departamento creado exitosamente');
      } else if (operation === 'edit' && data?._id) {
        await actualizarDepartamento({
          id: data._id as string,
          ...validatedValues
        });
        toast.success('Departamento actualizado exitosamente');
      }
      close();
    } catch (err: unknown) {
      // Los errores se manejan en los useEffect de arriba
      console.error('Error en la operación:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarDepartamento(id);
      toast.success('Departamento eliminado exitosamente');
      close();
    } catch (err: unknown) {
      // Los errores se manejan en los useEffect de arriba
      console.error('Error al eliminar:', err);
    }
  };

  // Estados de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Cargando departamentos...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Departamentos</h2>
        <Button 
          onClick={openCreate} 
          className="flex items-center gap-2"
          disabled={isCreating}
        >
          <Plus className="h-4 w-4" /> 
          {isCreating ? 'Creando...' : 'Nuevo Departamento'}
        </Button>
      </div>

      <Table>
        <TableCaption>Departamentos de {routerSchool?.nombre}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departamentos.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No hay departamentos registrados.
              </TableCell>
            </TableRow>
          )}
          {departamentos.map((d) => (
            <TableRow 
              key={d._id} 
              className={`hover:bg-muted/50 ${
                departamentoSeleccionado?._id === d._id ? 'bg-blue-50' : ''
              }`}
              onClick={() => setDepartamentoSeleccionado(d)}
            >
              <TableCell className="font-medium">{d.nombre}</TableCell>
              <TableCell>{d.descripcion || 'N/A'}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={
                    d.activo
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {d.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    size="icon" 
                    variant="outline" 
                    onClick={(e) => {
                      e.stopPropagation();
                      openView(d);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(d);
                    }}
                    disabled={isUpdating}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    onClick={(e) => {
                      e.stopPropagation();
                      openDelete(d);
                    }}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CrudDialog
        isOpen={isOpen}
        onOpenChange={close}
        operation={operation}
        title={
          operation === 'edit'
            ? `Editar Departamento: ${data?.nombre}`
            : operation === 'view'
            ? `Detalle: ${(data as DepartamentoConId)?.nombre}`
            : 'Nuevo Departamento'
        }
        description={
          operation === 'view'
            ? `Información de ${(data as DepartamentoConId)?.nombre}`
            : undefined
        }
        schema={departamentoSchema}
        data={data}
        onSubmit={handleSubmit}
        onDelete={operation === 'delete' ? handleDelete : undefined}
      >
        {(form) => (
          <>
            {operation === 'view' && data ? (
              <div className="space-y-6">
                {/* Información Principal */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Información del Departamento</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <span className="text-blue-600 text-sm font-medium">Nombre</span>
                      <div className="font-medium">{(data as DepartamentoConId).nombre}</div>
                    </div>
                    <div>
                      <span className="text-blue-600 text-sm font-medium">Descripción</span>
                      <div className="font-medium">{(data as DepartamentoConId).descripcion || 'N/A'}</div>
                    </div>
                    <div>
                      <span className="text-blue-600 text-sm font-medium">Estado</span>
                      <div className="font-medium">
                        <Badge
                          variant="secondary"
                          className={
                            (data as DepartamentoConId).activo
                              ? "bg-green-800 text-white"
                              : "bg-red-500 text-white"
                          }
                        >
                          {(data as DepartamentoConId).activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información adicional si el departamento está seleccionado */}
                {departamentoSeleccionado && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Departamento Seleccionado
                    </h4>
                    <p className="text-sm text-blue-700">
                      {departamentoSeleccionado.nombre} está actualmente seleccionado
                    </p>
                  </div>
                )}

                {/* Botones de Acción */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      close();
                      setTimeout(() => {
                        openEdit(data as DepartamentoConId);
                      }, 100);
                    }}
                    disabled={isUpdating}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    {isUpdating ? 'Actualizando...' : 'Editar'}
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      close();
                      setTimeout(() => {
                        openDelete(data as DepartamentoConId);
                      }, 100);
                    }}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? 'Eliminando...' : 'Eliminar'}
                  </Button>
                </div>
              </div>
            ) : (
              <DepartamentoForm 
                form={form as unknown as UseFormReturn<DepartamentoFormValues>} 
              />
            )}
          </>
        )}
      </CrudDialog>
    </>
  );
}