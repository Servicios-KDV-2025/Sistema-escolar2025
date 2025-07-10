"use client";

import { SignIn, SignOutButton, useUser } from "@clerk/nextjs";
import { useOrganization } from "@clerk/nextjs";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@repo/ui/components/shadcn/card";
import { useEscuela } from "../../../store/useEscuelaStore";
import {
  CrudDialog,
  useCrudDialog,
} from "../../../../components/ui/crud-dialog";
import { grupoSchema } from "../../../../app/shemas/grupo";
import { toast } from "sonner";
import { Button } from "@repo/ui/components/shadcn/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/shadcn/form";
import { Input } from "@repo/ui/components/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/shadcn/select";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useGrupo } from "../../../store/useGrupoStore";

export default function Home() {
  const { user } = useUser();
  const { organization } = useOrganization();

  const { escuela, userEmail, isLoading, error, clearErrors } = useEscuela();

  // Ejemplo de CRUD para grupos
  const {
    grupos,
    isCreating: isCreatingGrupo,
    isUpdating: isUpdatingGrupo,
    isDeleting: isDeletingGrupo,
    createError: createGrupoError,
    updateError: updateGrupoError,
    deleteError: deleteGrupoError,
    crearGrupo,
    actualizarGrupo,
    eliminarGrupo,
    clearErrors: clearGrupoErrors,
  } = useGrupo(escuela?._id);

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

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (!escuela?._id) {
      toast.error("Error", {
        description: "No se pudo identificar la escuela",
      });
      return;
    }

    try {
      if (operation === "create") {
        await crearGrupo({
          escuelaId: escuela._id,
          grado: values.grado as string,
          nombre: values.nombre as string,
          activo: values.activo as boolean,
        });
      } else if (operation === "edit" && data?._id) {
        await actualizarGrupo({
          id: data._id,
          escuelaId: escuela._id,
          grado: values.grado as string,
          nombre: values.nombre as string,
          activo: values.activo as boolean,
        });
      } else {
        throw new Error("Operación no válida o datos faltantes");
      }
    } catch (error) {
      // El error ya es manejado por el store, pero puedes mostrar un toast si quieres
      toast.error("Error en operación CRUD", {
        description: (error as Error).message,
      });
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
      await eliminarGrupo(id, escuela._id);
    } catch (error) {
      toast.error("Error al eliminar grupo", {
        description: (error as Error).message,
      });
      throw error;
    }
  };

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <SignIn />
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Card principal */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Bienvenido, {user.firstName}!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-3 items-center">
              <SignOutButton />
              <h1 className="text-xl font-semibold mt-2">Hello Page</h1>
            </div>
            <div className="flex flex-col gap-3 items-center">
              <p>ir a escuela</p>
              <Link className="text-blue-500 underline" href="/escuela">
                Escuela
              </Link>
            </div>
            {/* Mostrar información de la escuela si está disponible */}
            {escuela && (
              <div className="pt-4 border-t">
                <div>
                  <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">
                      Organization Details
                    </h1>

                    <div className="flex items-center mb-6">
                      {organization?.imageUrl && (
                        <img
                          src={organization.imageUrl}
                          alt="Organization logo"
                          className="w-20 h-20 rounded-full mr-4 object-cover"
                        />
                      )}
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {organization?.name}
                        </h2>
                        <p className="text-gray-600">ID: {organization?.id}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailCard
                        title="Created At"
                        value={
                          organization?.createdAt?.toLocaleDateString() || ""
                        }
                      />
                      <DetailCard
                        title="Members Count"
                        value={organization?.membersCount?.toString() || ""}
                      />
                      <DetailCard
                        title="Admin Delete Enabled"
                        value={organization?.adminDeleteEnabled ? "Yes" : "No"}
                      />
                      <DetailCard
                        title="Public Metadata"
                        value={JSON.stringify(
                          organization?.publicMetadata || {},
                          null,
                          2
                        )}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Escuela: {escuela.nombre}
                </p>
                {userEmail && (
                  <p className="text-xs text-muted-foreground">
                    Email del usuario: {userEmail}
                  </p>
                )}
                {escuela.email && (
                  <p className="text-xs text-muted-foreground">
                    Email de la escuela: {escuela.email}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {escuela.nombreCorto}
                </p>
                <p className="text-xs text-muted-foreground">
                  {escuela.telefono}
                </p>
                <p className="text-xs text-muted-foreground">
                  {escuela.direccion}
                </p>
                <p className="text-xs text-muted-foreground">
                  {escuela.descripcion}
                </p>
              </div>
            )}
            {/* Mostrar estado de carga */}
            {isLoading && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Cargando información de la escuela...
                </p>
              </div>
            )}
            {/* Mostrar error si existe */}
            {error && (
              <div className="pt-4 border-t">
                <p className="text-sm text-red-500">Error: {error}</p>
                <button
                  onClick={() => {
                    clearErrors();
                  }}
                  className="text-xs text-blue-500 underline"
                >
                  Reintentar
                </button>
              </div>
            )}
            {!escuela && (
              <div className="pt-4 border-t">
                <p className="text-sm text-red-500">
                  No tienes una escuela asociada a tu cuenta. Por favor,
                  contacta al administrador.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ejemplo de CRUD para grupos */}
        {escuela && (
          <Card className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Gestión de Grupos (Ejemplo CRUD)</CardTitle>
                <Button onClick={openCreate} disabled={isCreatingGrupo}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Grupo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mostrar errores del store de grupos */}
              {(createGrupoError || updateGrupoError || deleteGrupoError) && (
                <div className="mb-2 text-sm text-red-500">
                  {createGrupoError && (
                    <div>Error al crear grupo: {createGrupoError}</div>
                  )}
                  {updateGrupoError && (
                    <div>Error al actualizar grupo: {updateGrupoError}</div>
                  )}
                  {deleteGrupoError && (
                    <div>Error al eliminar grupo: {deleteGrupoError}</div>
                  )}
                  <button
                    onClick={clearGrupoErrors}
                    className="text-xs text-blue-500 underline"
                  >
                    Limpiar errores
                  </button>
                </div>
              )}
              <div className="grid gap-4">
                {grupos?.map((grupo) => (
                  <div
                    key={grupo._id}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">
                        {grupo.nombre} - {grupo.grado}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Estado: {grupo.activo ? "Activo" : "Inactivo"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openView(grupo)}
                        disabled={isUpdatingGrupo}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(grupo)}
                        disabled={isUpdatingGrupo}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDelete(grupo)}
                        disabled={isDeletingGrupo}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {grupos?.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No hay grupos creados. Crea el primer grupo usando el botón
                    &quot;Nuevo Grupo&quot;.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

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
                  console.log("Campo nombre - field.value:", field.value);
                  console.log("Campo nombre - operation:", operation);
                  return (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Nombre del grupo"
                          value={field.value as string}
                          disabled={operation === "view"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="activo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        value={field.value ? "true" : "false"}
                        disabled={operation === "view"}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Activo</SelectItem>
                          <SelectItem value="false">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </CrudDialog>
      </div>
    </div>
  );
}

const DetailCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="font-medium text-gray-700">{title}</h3>
    <p className="mt-1 text-gray-900 break-words">{value}</p>
  </div>
);
