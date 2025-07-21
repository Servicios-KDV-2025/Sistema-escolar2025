"use client";

import { useEscuela } from "@/app/store/useEscuelaStore";
import { Id } from "@/convex/_generated/dataModel";
import { CrudDialog, useCrudDialog } from "@/components/dialog/crud-dialog";
import { grupoSchema } from "@/app/shemas/grupo";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Download, Eye, Pencil, Plus, Trash2, Users } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/shadcn/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/shadcn/select";
import { useGrupo } from "@/app/store/useGrupoStore";
//removemos TableHead
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@repo/ui/components/shadcn/table";
import { GruposAlumnosModal } from "@/components/dialog/gruposAlumnosModal";
import { useEffect, useState } from "react";
import { Switch } from "@repo/ui/components/shadcn/switch";
import { useCicloEscolar } from "@/app/store/useCicloEscolarStore";
import SortableHeader from "@/components/SortableHeader"; //componente para ordenar columnas

//botones para exportar en PDF y Excel
import PDFGenerator from "@/components/pdf-generator"; //import generar reorte PDF
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/shadcn/dropdown-menu";
import { exportToExcel } from "@/app/utils/exportToExcel";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";

export default function Page() {
  const { escuela } = useEscuela();

  const setItems = useBreadcrumbStore((state) => state.setItems);
  useEffect(() => {
      if (escuela) {
        setItems([
          {
            label: `${(escuela?.nombre).toUpperCase()}`,
            href: `/escuela/${escuela.nombre}`,
          },
          { label: "Grupos", isCurrentPage: true },
        ]);
      }
    }, [escuela, setItems, escuela?.nombre]);

  const { crearGrupo, actualizarGrupo, eliminarGrupo, grupos } = useGrupo(
    escuela?._id
  ); 

  const { ciclosEscolares } = useCicloEscolar(escuela?._id);

  const {
    isOpen,
    operation,
    data,
    openCreate,
    openEdit,
    openView,
    openDelete,
    close,
  } = useCrudDialog(grupoSchema, {
    grado: "1°",
    nombre: "",
    activo: true,
  });

  const columnHeaders = ["Nombre", "Descripción", "Créditos", "Activa"];
  const columnDataMap = {
    Nombre: (grupo: (typeof grupos)[number]) => grupo.nombre,
    Grado: (grupo: (typeof grupos)[number]) => grupo.grado,
    CicloEscolar: (grupo: (typeof grupos)[number]) => grupo.cicloEscolar,
    Activo: (grupo: (typeof grupos)[number]) => (grupo.activo ? "Sí" : "No"),
  };

  const [ordenColumna, setOrdenColumna] = useState<
    keyof typeof columnDataMap | null
  >(null);
  const [ordenAscendente, setOrdenAscendente] = useState(true);

  const [isAlumnosModalOpen, setAlumnosModalOpen] = useState(false);
  const [grupoSeleccionado, setGrupoSeleccionado] =
    useState<Id<"grupos"> | null>(null);

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!escuela?._id) {
      toast.error("Error", {
        description: "No se pudo identificar la escuela",
      });
      return;
    }

    const grupoExiste = grupos.some(
      (grupo) => grupo.nombre === values.nombre && grupo.grado === values.grado
    );

    if (operation === "create" && grupoExiste) {
      toast.warning("Grupo duplicado", {
        description: `Ya existe un grupo con el nombre "${values.nombre}" y grado "${values.grado}".`,
      });
      return;
    }

    try {
      if (operation === "create") {
        await crearGrupo({
          escuelaId: escuela._id as Id<"escuelas">,
          cicloEscolarId: values.cicloEscolarId as Id<"ciclosEscolares">,
          grado: values.grado as string,
          nombre: values.nombre as string,
          activo: values.activo as boolean,
        });
        toast.success("Creado correctamente");
      } else if (operation === "edit" && data?._id) {
        await actualizarGrupo({
          _id: data._id as Id<"grupos">,
          escuelaId: escuela._id as Id<"escuelas">,
          grado: values.grado as string,
          nombre: values.nombre as string,
          activo: values.activo as boolean,
        });
        toast.success("Actualizado correctamente");
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
    try {
      await eliminarGrupo(id, escuela?._id);
      toast.success("Eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar grupo:", error);
      throw error;
    }
  };
  const gruposOrdenados = [...grupos].sort((a, b) => {
    if (!ordenColumna) return 0;
    const aValue = columnDataMap[ordenColumna](a);
    const bValue = columnDataMap[ordenColumna](b);
    return ordenAscendente
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Grupo</h1>
      <p className="text-muted-foreground mb-6">
        Aquí puedes ver y gestionar todos los Grupos disponibles en la escuela.
        Haz clic en los botones para ver información más precisa, editar,
        eliminarlo o ver el listado de alumnos por cada grupo. Para crear un
        nuevo Grupo, usa el botón Nuevo Grupo.
      </p>

      <div className="flex flex-row items-center justify-between mt-6 mb-2">
        <h2 className="text-xl font-semibold">Gestión de Grupos</h2>
        <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Exportar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        className="justify-center "
                        onClick={() =>
                          exportToExcel(
                            gruposOrdenados,
                            `Grupos`,
                            `Grupos`
                          )
                        }
                      >
                        Generar Excel
                      </DropdownMenuItem>
                      <DropdownMenuItem className="justify-center">
                        <PDFGenerator
                          tableTitle={`Lista de Grupos`}
                          buttonVariant="ghost"
                          buttonText="Generar PDF"
                          tableColumns={columnHeaders}
                          tableData={gruposOrdenados}
                          columnDataMap={columnDataMap}
                          fileName={`grupos__${escuela?.nombre || "escuela"}.pdf`}
                        />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Grupo
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader
                columna="Grado"
                label="Grado"
                ordenColumna={ordenColumna}
                ordenAscendente={ordenAscendente}
                setOrdenColumna={setOrdenColumna}
                setOrdenAscendente={setOrdenAscendente}
              />
              <SortableHeader
                columna="Nombre"
                label="Nombre"
                ordenColumna={ordenColumna}
                ordenAscendente={ordenAscendente}
                setOrdenColumna={setOrdenColumna}
                setOrdenAscendente={setOrdenAscendente}
              />
              <SortableHeader
                columna="Activo"
                label="Activo"
                ordenColumna={ordenColumna}
                ordenAscendente={ordenAscendente}
                setOrdenColumna={setOrdenColumna}
                setOrdenAscendente={setOrdenAscendente}
              />
              <SortableHeader
                columna="CicloEscolar"
                label="Ciclo Escolar"
                ordenColumna={ordenColumna}
                ordenAscendente={ordenAscendente}
                setOrdenColumna={setOrdenColumna}
                setOrdenAscendente={setOrdenAscendente}
              />
            <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grupos.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No hay grupos registrados para esta escuela.
                </TableCell>
              </TableRow>
            ) : (
              gruposOrdenados.map((grupo) => (
                <TableRow
                  key={grupo._id}
                  //   onClick={() => {
                  //     setGrupoSeleccionado(grupo._id)
                  //     setAlumnosModalOpen(true)
                  //   }}
                >
                  <TableCell className="font-medium">{grupo.grado}</TableCell>
                  <TableCell className="font-medium">{grupo.nombre}</TableCell>
                  <TableCell>{grupo.activo ? "Activo" : "Inactivo"}</TableCell>
                  <TableCell className="font-medium">
                    {grupo.cicloEscolar}
                  </TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setGrupoSeleccionado(grupo._id);
                        setAlumnosModalOpen(true);
                      }}
                    >
                      <Users /> Alumnos
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openView({ ...grupo, _id: grupo._id })}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit({ ...grupo, _id: grupo._id })}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDelete({ ...grupo, _id: grupo._id })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* CrudDialog */}
      <CrudDialog
        operation={operation}
        title={
          operation === "create"
            ? "Crear Nuevo Grupo"
            : operation === "edit"
              ? "Editar Grupo"
              : "Ver Grupo"
        }
        description={
          operation === "create"
            ? "Completa la información del nuevo grupo"
            : operation === "edit"
              ? "Modifica la información del grupo"
              : "Información del grupo"
        }
        schema={grupoSchema}
        defaultValues={{
          grado: "1°",
          nombre: "",
          activo: true,
          cicloEscolarId: "",
        }}
        data={data}
        isOpen={isOpen}
        onOpenChange={close}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      >
        {(form, operation) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="grado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grado</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value as string}
                      disabled={operation === "view"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar grado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1°">1°</SelectItem>
                        <SelectItem value="2°">2°</SelectItem>
                        <SelectItem value="3°">3°</SelectItem>
                        <SelectItem value="4°">4°</SelectItem>
                        <SelectItem value="5°">5°</SelectItem>
                        <SelectItem value="6°">6°</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      {/* <Input
                                                {...field}
                                                placeholder="Nombre del grupo"
                                                value={field.value as string}
                                                disabled={operation === 'view'}
                                            /> */}
                      <Select
                        onValueChange={field.onChange}
                        value={field.value as string}
                        disabled={operation === "view"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar Nombre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="cicloEscolarId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciclo Escolar</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value as string}
                    disabled={operation === "view"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un Ciclo Escolar" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ciclosEscolares?.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        disabled={operation === "view"}
                      />
                      <span>{field.value ? "Activo" : "Inactivo"}</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </CrudDialog>
      <GruposAlumnosModal
        isOpen={isAlumnosModalOpen}
        onClose={() => setAlumnosModalOpen(false)}
        grupoId={grupoSeleccionado}
      />
    </main>
  );
}