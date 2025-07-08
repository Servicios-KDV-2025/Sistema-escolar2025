// /components/TablaMaterias.tsx
"use client";

import { useQuery, useMutation } from "convex/react";
import { SignIn, useUser } from "@clerk/nextjs";
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
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEscuela } from "@/app/store/useEscuelaStore";
import { toast } from "sonner";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/shadcn/form";
import { CrudDialog, useCrudDialog } from "@/components/ui/crud-dialog";
import { Input } from "@repo/ui/components/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/shadcn/select";
import { materiaSchema } from "@/app/shemas/materia";

export function TablaMaterias() {
  const { user } = useUser();

  const { escuela } = useEscuela();

  const crearMateria = useMutation(api.materias.crearMateriaConEscuela);
  const actualizarMateria = useMutation(
    api.materias.actualizarMateriaConEscuela
  );
  const eliminarMateria = useMutation(api.materias.eliminarMateriaConEscuela);
  const materias = useQuery(
    api.materias.obtenerMateriasPorEscuela,
    escuela ? { escuelaId: escuela._id as Id<"escuelas"> } : "skip"
  );

  const {
    isOpen,
    operation,
    data,
    openCreate,
    openEdit,
    openView,
    openDelete,
    close,
  } = useCrudDialog(materiaSchema, {
    nombre: undefined,
    descripcion: undefined,
    creditos: 5,
    activa: true,
  });

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!escuela?._id) {
      toast.error("Error", {
        description: "No se pudo identificar la escuela",
      });
      return;
    }

    console.log("handleSubmit - operation:", operation);
    console.log("handleSubmit - values:", values);
    console.log("handleSubmit - data:", data);

    try {
      if (operation === "create") {
        console.log("Creando materia...");
        await crearMateria({
          escuelaId: escuela._id as Id<"escuelas">,
          nombre: values.nombre as string,
          descripcion: values.descripcion as string | undefined,
          activa: values.activa as boolean,
          creditos: values.creditos as number | undefined,
        });
        console.log("Materia creada exitosamente");
      } else if (operation === "edit" && data?._id) {
        console.log("Editando materia con ID:", data._id);
        await actualizarMateria({
          id: data._id as Id<"materias">,
          escuelaId: escuela._id as Id<"escuelas">,
          nombre: values.nombre as string,
          descripcion: values.descripcion as string,
          activa: values.activa as boolean,
          creditos: values.creditos as number,
        });
        console.log("Grupo editado exitosamente");
      } else {
        console.error("Operación no válida o datos faltantes:", {
          operation,
          data,
        });
        throw new Error("Operación no válida o datos faltantes");
      }
    } catch (error) {
      console.error("Error en operación CRUD:", error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!escuela?._id) {
      toast.error("Error", {
        description: "No se pudo identificar la escuela",
      });
      return;
    }

    console.log("handleDelete - id:", id);
    console.log("handleDelete - escuelaId:", escuela._id);

    try {
      await eliminarMateria({
        id: id as Id<"materias">,
        escuelaId: escuela._id as Id<"escuelas">,
      });
      console.log("Grupo eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar materia:", error);
      throw error;
    }
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <SignIn />
      </div>
    );
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
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Materia
        </Button>
      </div>

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
              <TableRow key={materia.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{materia.nombre}</TableCell>
                <TableCell>{materia.descripcion || "N/A"}</TableCell>
                <TableCell>{materia.creditos || "N/A"}</TableCell>
                <TableCell>{materia.activa ? "Activa" : "Inactiva"}</TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openView({ ...materia, _id: materia.id })}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit({ ...materia, _id: materia.id })}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        openDelete({ ...materia, _id: materia.id })
                      }
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
      {/* CrudDialog para Materias */}
      <CrudDialog
        operation={operation}
        title={
          operation === "create"
            ? "Crear Nueva Materia"
            : operation === "edit"
              ? "Editar Materia"
              : "Ver Materia"
        }
        description={
          operation === "create"
            ? "Completa la información de la nueva materia"
            : operation === "edit"
              ? "Modifica la información de la materia"
              : "Información de la materia"
        }
        schema={materiaSchema}
        defaultValues={{
          nombre: "",
          descripcion: "",
          creditos: 5,
          activa: true,
        }}
        data={data}
        isOpen={isOpen}
        onOpenChange={close}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      >
        {(form, currentOperation) => (
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nombre de la materia"
                      value={field.value as string}
                      disabled={currentOperation === "view"}
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
                      type="number"
                      {...field}
                      placeholder="Número de créditos"
                      value={field.value as number}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value)
                        )
                      }
                      disabled={currentOperation === "view"}
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
                    <Input
                      {...field}
                      placeholder="Descripción de la materia (opcional)"
                      value={field.value as string}
                      disabled={currentOperation === "view"}
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
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      value={field.value ? "true" : "false"}
                      disabled={currentOperation === "view"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Activa</SelectItem>
                        <SelectItem value="false">Inactiva</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        )}
      </CrudDialog>
    </div>
  );
}
