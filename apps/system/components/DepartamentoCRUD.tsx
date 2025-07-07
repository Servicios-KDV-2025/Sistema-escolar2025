// file: apps/system/components/DepartamentoCRUD.tsx
import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useEscuela } from '@/app/store/useEscuela';
import { useBreadcrumbStore } from '@/app/store/breadcrumbStore';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/shadcn/table';
import { Button } from '@/components/ui/button';
import { CrudDialog, useCrudDialog } from '@/components/ui/crud-dialog';
import { departamentoSchema, DepartamentoFormValues } from '@/app/shemas/departamento';
import { DepartamentoForm } from '@/components/DepartamentoForm';
import { UseFormReturn } from 'react-hook-form';

export function DepartamentoCRUD() {
  const routerSchool = useEscuela((s) => s.escuela);
  const departamentos = useQuery(
    api.departamento.obtenerDepartamentos,
    routerSchool ? { escuelaId: routerSchool._id as Id<'escuelas'> } : 'skip'
  );
  const crearDepartamento = useMutation(api.departamento.crearDepartamento);
  const actualizarDepartamento = useMutation(api.departamento.actualizarDepartamento);
  const eliminarDepartamento = useMutation(api.departamento.eliminarDepartamento);
  const setItems = useBreadcrumbStore((s) => s.setItems);

  React.useEffect(() => {
    if (routerSchool) {
      setItems([
        { label: routerSchool.nombre, href: `/escuela/${encodeURIComponent(routerSchool.nombre)}` },
        { label: 'Departamentos', isCurrentPage: true },
      ]);
    }
  }, [routerSchool, setItems]);

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
        await crearDepartamento({ escuelaId: routerSchool._id as Id<'escuelas'>, ...validatedValues });
        toast.success('Departamento creado');
      } else if (operation === 'edit' && data?._id) {
        await actualizarDepartamento({ id: data._id as Id<'departamento'>, ...validatedValues });
        toast.success('Departamento actualizado');
      }
      close();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error en la operación';
      toast.error(msg);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarDepartamento({ id: id as Id<'departamento'> });
      toast.success('Departamento eliminado');
      close();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar';
      toast.error(msg);
    }
  };

  if (departamentos === undefined) {
    return <p>Cargando departamentos...</p>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Departamentos</h2>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nuevo Departamento
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
                No hay departamentos.
              </TableCell>
            </TableRow>
          )}
          {departamentos.map((d) => (
            <TableRow key={d._id} className="hover:bg-muted/50">
              <TableCell>{d.nombre}</TableCell>
              <TableCell>{d.descripcion || 'N/A'}</TableCell>
              <TableCell>{d.activo ? 'Activo' : 'Inactivo'}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="icon" variant="outline" onClick={() => openView(d)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" onClick={() => openEdit(d)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => openDelete(d)}>
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
            ? `Detalle: ${data?.nombre}`
            : 'Nuevo Departamento'
        }
        description={
          operation === 'view'
            ? `Información de ${data?.nombre}`
            : undefined
        }
        schema={departamentoSchema}
        data={data}
        onSubmit={handleSubmit}
        onDelete={operation === 'delete' ? handleDelete : undefined}
      >
        {(form) => <DepartamentoForm form={form as unknown as UseFormReturn<DepartamentoFormValues>} />}
      </CrudDialog>
    </>
  );
}