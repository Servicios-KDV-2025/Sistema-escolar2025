"use client";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useEscuela } from "@/app/store/useEscuela";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@repo/ui/components/shadcn/badge";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";


const DIAS_SEMANA = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 7, label: "Domingo" },
];

const periodoClaseSchema = z.object({
  catalogoClaseId: z.string().min(1, "Clase requerida"),
  periodoId: z.string().min(1, "Periodo requerido"),
  diaSemana: z.number().min(1).max(7),
  activo: z.boolean(),
});

type PeriodoClaseForm = z.infer<typeof periodoClaseSchema>;

export default function PeriodosClasePage() {
  const { escuela } = useEscuela();
  const escuelaId = escuela?._id;

  // Queries para selects
  const catalogosClases = useQuery(api.catalogosDeClases.verTodosLosCatalogosDeClases, escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip");
  const periodos = useQuery(api.periodos.obtenerPeriodosPorEscuela, escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip");

  // Para filtrar por catálogo de clase
  const [catalogoClaseId, setCatalogoClaseId] = useState<string>("");

  // Queries para mostrar periodos por clase
  const periodosPorEscuela = useQuery(
    api.periodoporClase.obtenerPeriodosPorClasePorEscuela,
    escuelaId ? { escuelaId: escuelaId as Id<"escuelas"> } : "skip"
  );
  const periodosPorCatalogo = useQuery(
    api.periodoporClase.obtenerPeriodosPorClasePorCatalogo,
    catalogoClaseId ? { catalogoClaseId: catalogoClaseId as Id<"catalogosDeClases"> } : "skip"
  );

  // Mutations
  const crearperiodoporClase = useMutation(api.periodoporClase.crearPeriodoPorClase);
  const actualizarperiodoporClase = useMutation(api.periodoporClase.actualizarPeriodoPorClase);
  const eliminarperiodoporClase = useMutation(api.periodoporClase.eliminarPeriodoPorClase);

  // Formulario
  const [open, setOpen] = useState(false);
  type PeriodoPorClaseItem = {
    _id: string;
    catalogoClaseId: string;
    periodoId: string;
    diaSemana: number;
    activo: boolean;
  };
  
    const [editItem, setEditItem] = useState<PeriodoPorClaseItem | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PeriodoClaseForm>({
    resolver: zodResolver(periodoClaseSchema),
    defaultValues: { catalogoClaseId: "", periodoId: "", diaSemana: 1, activo: true },
  });

  useEffect(() => {
    if (editItem) {
      setValue("catalogoClaseId", editItem.catalogoClaseId);
      setValue("periodoId", editItem.periodoId);
      setValue("diaSemana", editItem.diaSemana);
      setValue("activo", editItem.activo);
    } else {
      reset({ catalogoClaseId: "", periodoId: "", diaSemana: 1, activo: true });
    }
  }, [editItem, setValue, reset]);

  const onSubmit = async (data: PeriodoClaseForm) => {
    try {
      if (!escuelaId) return;
      if (editItem) {
        await actualizarperiodoporClase({
          id: editItem._id as Id<"periodoPorClase">,
          escuelaId: escuelaId as Id<"escuelas">,
          catalogoClaseId: data.catalogoClaseId as Id<"catalogosDeClases">,
          periodoId: data.periodoId as Id<"periodos">,
          diaSemana: data.diaSemana,
          activo: data.activo,
        });
        toast("Periodo por clase actualizado");
      } else {
        await crearperiodoporClase({
          escuelaId: escuelaId as Id<"escuelas">,
          catalogoClaseId: data.catalogoClaseId as Id<"catalogosDeClases">,
          periodoId: data.periodoId as Id<"periodos">,
          diaSemana: data.diaSemana,
          activo: data.activo,
        });
        toast("Periodo por clase creado");
      }
      setOpen(false);
      setEditItem(null);
      reset();
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast("Error", { description: e.message });
      } else {
        toast("Error", { description: "Error desconocido" });
      }
    }
  };

  const onDelete = async (item: PeriodoPorClaseItem) => {
    if (!confirm("¿Eliminar este periodo por clase?")) return;
    if (!escuelaId) {
      toast("Error", { description: "Escuela no definida" });
      return;
    }
    try {
      await eliminarperiodoporClase({ id: item._id as Id<"periodoPorClase">, escuelaId: escuelaId as Id<"escuelas"> });
      toast("Eliminado");
    } catch (e) {
      if (e instanceof Error) {
        toast("Error", { description: e.message });
      } else {
        toast("Error", { description: "Error desconocido" });
      }
    }
  };

  // Helpers para mostrar nombres en vez de IDs
  type CatalogoClase = { id: string; nombre: string };
  const getClaseNombre = (id: string) =>
    catalogosClases?.find((c: CatalogoClase) => c.id === id)?.nombre || id;
  type Periodo = { _id: string; nombre: string; horaInicio?: string; horaFin?: string };
  const getPeriodoNombreYHorario = (id: string) => {
    const periodo = periodos?.find((p: Periodo) => p._id === id);
    if (!periodo) return id;
    return `${periodo.nombre} (${formatoHora12(periodo.horaInicio || "")} - ${formatoHora12(periodo.horaFin || "")})`;
  };
  const getDiaNombre = (num: number) =>
    DIAS_SEMANA.find((d) => d.value === num)?.label || num;

  // Función para convertir "HH:MM" a formato 12 horas
  function formatoHora12(hora24: string) {
    if (!hora24) return "";
    const [h, m] = hora24.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hora12 = ((h + 11) % 12 + 1);
    return `${hora12}:${m.toString().padStart(2, "0")} ${ampm}`;
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Horarios</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditItem(null); setOpen(true); }}>Nuevo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editItem ? "Editar" : "Nuevo"} Periodo por Clase</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Clase</label>
                <select
                  {...register("catalogoClaseId")}
                  className="w-full border rounded px-2 py-1"
                  disabled={!catalogosClases}
                >
                  <option value="">Selecciona una clase</option>
                  {catalogosClases?.map((c: { id: string; nombre: string }) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
                {errors.catalogoClaseId && <p className="text-red-500 text-xs">{errors.catalogoClaseId.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Periodo</label>
                <select
                  {...register("periodoId")}
                  className="w-full border rounded px-2 py-1"
                  disabled={!periodos}
                >
                  <option value="">Selecciona un periodo</option>
                  {periodos?.map((p: { _id: string; nombre: string }) => (
                    <option key={p._id} value={p._id}>{p.nombre}</option>
                  ))}
                </select>
                {errors.periodoId && <p className="text-red-500 text-xs">{errors.periodoId.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Día de la semana</label>
                <select
                  {...register("diaSemana", { valueAsNumber: true })}
                  className="w-full border rounded px-2 py-1"
                >
                  {DIAS_SEMANA.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
                {errors.diaSemana && <p className="text-red-500 text-xs">{errors.diaSemana.message}</p>}
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  {...register("activo")}
                  checked={watch("activo")}
                  onCheckedChange={v => setValue("activo", v)}
                />
                <span>{watch("activo") ? "Activo" : "Inactivo"}</span>
              </div>
              <DialogFooter>
                <Button type="submit">{editItem ? "Actualizar" : "Crear"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtro de Horarios por Clase SIEMPRE ARRIBA */}
      <div className="mb-8">
        <h2 className="font-semibold mb-2">Filtrar horarios por clase</h2>
        <select
          value={catalogoClaseId}
          onChange={e => setCatalogoClaseId(e.target.value)}
          className="mb-2 border rounded px-2 py-1"
        >
          <option value="">Selecciona una clase</option>
          {catalogosClases?.map((c: CatalogoClase) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
        <p className="text-sm text-muted-foreground">
          Selecciona una materia para ver solo sus horarios. Si no seleccionas ninguna, se mostrarán todos los horarios de la escuela.
        </p>
      </div>

      {/* Si hay clase seleccionada, solo muestra los horarios de esa clase */}
      {catalogoClaseId ? (
        <div>
          <h2 className="font-semibold mb-2">Horarios de la clase seleccionada</h2>
          {periodosPorCatalogo?.length === 0 && <p>No hay registros.</p>}
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {periodosPorCatalogo?.map((item: PeriodoPorClaseItem) => (
              <li key={item._id} className="border rounded p-3 flex flex-col justify-between items-start bg-white shadow">
                <div>
                  <Link href={`/periodos-clase/${item._id}`} className="font-semibold hover:underline">
                    {getClaseNombre(item.catalogoClaseId)} - {getPeriodoNombreYHorario(item.periodoId)} ({getDiaNombre(item.diaSemana)})
                  </Link>
                  <div className="mt-1">
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
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" onClick={() => { setEditItem(item); setOpen(true); }}>Editar</Button>
                  <Button variant="destructive" onClick={() => onDelete(item)}>Eliminar</Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        // Si NO hay clase seleccionada, muestra todos los horarios por escuela
        <div>
          <h2 className="font-semibold mb-2">Por Escuela</h2>
          {periodosPorEscuela?.length === 0 && <p>No hay registros.</p>}
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {periodosPorEscuela?.map((item: PeriodoPorClaseItem) => (
              <li key={item._id} className="border rounded p-3 flex flex-col justify-between items-start bg-white shadow">
                <div>
                  <Link href={`/escuela/${escuela?.nombre}/horarios/${item._id}`} className="font-semibold hover:underline">
                    {getClaseNombre(item.catalogoClaseId)} - {getPeriodoNombreYHorario(item.periodoId)} ({getDiaNombre(item.diaSemana)})
                  </Link>
                  <div className="mt-1">
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
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" onClick={() => { setEditItem(item); setOpen(true); }}>Editar</Button>
                  <Button variant="destructive" onClick={() => onDelete(item)}>Eliminar</Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}