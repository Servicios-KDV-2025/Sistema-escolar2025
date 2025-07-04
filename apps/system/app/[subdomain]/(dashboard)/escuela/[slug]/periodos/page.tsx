"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useEscuela } from "@/app/store/useEscuela";
import { Badge } from "@repo/ui/components/shadcn/badge"; 

const periodoSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  horaFin: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  activo: z.boolean(),
});

type PeriodoForm = z.infer<typeof periodoSchema>;

// Helpers para opciones de hora y minutos
const horas12 = Array.from({ length: 12 }, (_, i) => i + 1);
const minutos = ["00", "15", "30", "45"];
const ampmOptions = ["AM", "PM"];

// Helper para convertir a 24h
function to24h(hora: string, minuto: string, ampm: string) {
  let h = parseInt(hora, 10);
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return `${h.toString().padStart(2, "0")}:${minuto}`;
}

// Helper para convertir de 24h a 12h
function from24h(hora24: string) {
  if (!hora24) return { hora: "7", minuto: "00", ampm: "AM" };
  const [h, m] = hora24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  let hora = h % 12;
  if (hora === 0) hora = 12;
  return { hora: hora.toString(), minuto: m.toString().padStart(2, "0"), ampm };
}

// Formato 12 horas para mostrar
function formatoHora12(hora24: string) {
  if (!hora24) return "";
  const [h, m] = hora24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hora12 = ((h + 11) % 12 + 1);
  return `${hora12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export default function PeriodosPage() {
  const { escuela } = useEscuela();

  const escuelaId = escuela?._id as import("@/convex/_generated/dataModel").Id<"escuelas"> | undefined;

  const periodos = useQuery(api.periodos.obtenerPeriodosPorEscuela, escuelaId ? { escuelaId } : "skip");
  const crearPeriodo = useMutation(api.periodos.crearPeriodo);
  const actualizarPeriodo = useMutation(api.periodos.actualizarPeriodo);
  const eliminarPeriodo = useMutation(api.periodos.eliminarPeriodo);

  const [open, setOpen] = useState(false);
  type Periodo = PeriodoForm & { _id: string };
  const [editPeriodo, setEditPeriodo] = useState<Periodo | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PeriodoForm>({
    resolver: zodResolver(periodoSchema),
    defaultValues: { nombre: "", horaInicio: "", horaFin: "", activo: true },
  });

  const [inicio, setInicio] = useState({ hora: "7", minuto: "00", ampm: "AM" });
  const [fin, setFin] = useState({ hora: "8", minuto: "00", ampm: "AM" });

  useEffect(() => {
    if (editPeriodo) {
      setInicio(from24h(editPeriodo.horaInicio));
      setFin(from24h(editPeriodo.horaFin));
      reset({
        nombre: editPeriodo.nombre,
        horaInicio: editPeriodo.horaInicio,
        horaFin: editPeriodo.horaFin,
        activo: editPeriodo.activo,
      });
    } else {
      setInicio({ hora: "7", minuto: "00", ampm: "AM" });
      setFin({ hora: "8", minuto: "00", ampm: "AM" });
      reset({ nombre: "", horaInicio: "", horaFin: "", activo: true });
    }
  }, [editPeriodo, reset]);

  const onSubmit = async (data: PeriodoForm) => {
    if (!escuelaId) {
      toast("Error: Escuela no seleccionada");
      return;
    }
    // Convierte a 24h antes de guardar
    const horaInicio = to24h(inicio.hora, inicio.minuto, inicio.ampm);
    const horaFin = to24h(fin.hora, fin.minuto, fin.ampm);

    try {
      if (editPeriodo) {
        await actualizarPeriodo({ 
          id: editPeriodo._id as import("@/convex/_generated/dataModel").Id<"periodos">, 
          escuelaId, 
          ...data, 
          horaInicio, 
          horaFin 
        });
        toast("Periodo actualizado");
      } else {
        await crearPeriodo({ escuelaId, ...data, horaInicio, horaFin });
        toast("Periodo creado");
      }
      setOpen(false);
      setEditPeriodo(null);
      reset();
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      toast(`Error: ${errorMessage}`);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("¿Eliminar este periodo?")) return;
    if (!escuelaId) {
      toast("Error: Escuela no seleccionada");
      return;
    }
    try {
      await eliminarPeriodo({
        id: id as import("@/convex/_generated/dataModel").Id<"periodos">,
        escuelaId: escuelaId as import("@/convex/_generated/dataModel").Id<"escuelas">
      });
      toast("Periodo eliminado");
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      toast(`Error: ${errorMessage}`);
    }
  };

  if (!escuela) {
    return <div className="text-center py-10">Cargando escuela...</div>;
  }

  return (
    <div className="w-full px-4 md:px-12 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Periodos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" onClick={() => { setEditPeriodo(null); setOpen(true); }}>Nuevo periodo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editPeriodo ? "Editar periodo" : "Nuevo periodo"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input placeholder="Nombre" {...register("nombre")} />
              {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre.message}</p>}

              <div>
                <label className="block text-sm font-medium mb-1">Hora inicio</label>
                <div className="flex gap-2">
                  <select value={inicio.hora} onChange={e => setInicio(i => ({ ...i, hora: e.target.value }))} className="border rounded px-2 py-1">
                    {horas12.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span>:</span>
                  <select value={inicio.minuto} onChange={e => setInicio(i => ({ ...i, minuto: e.target.value }))} className="border rounded px-2 py-1">
                    {minutos.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select value={inicio.ampm} onChange={e => setInicio(i => ({ ...i, ampm: e.target.value }))} className="border rounded px-2 py-1">
                    {ampmOptions.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hora fin</label>
                <div className="flex gap-2">
                  <select value={fin.hora} onChange={e => setFin(f => ({ ...f, hora: e.target.value }))} className="border rounded px-2 py-1">
                    {horas12.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span>:</span>
                  <select value={fin.minuto} onChange={e => setFin(f => ({ ...f, minuto: e.target.value }))} className="border rounded px-2 py-1">
                    {minutos.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select value={fin.ampm} onChange={e => setFin(f => ({ ...f, ampm: e.target.value }))} className="border rounded px-2 py-1">
                    {ampmOptions.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
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
                <Button type="submit">{editPeriodo ? "Actualizar" : "Crear"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl ">
        {periodos?.length === 0 && <p className="text-muted-foreground col-span-full">No hay periodos registrados.</p>}
        {periodos?.map((p: Periodo) => (
          <div key={p._id} className="border rounded-lg p-6 flex flex-col justify-between shadow bg-white">
            <div>
              <div className="font-semibold text-lg">{p.nombre}</div>
              <div className="text-base text-muted-foreground">
                {formatoHora12(p.horaInicio)} - {formatoHora12(p.horaFin)}
              </div>
              <div className="mt-2">
                <Badge
                  variant="secondary"
                  className={
                    p.activo
                      ? "bg-green-800 text-white"
                      : "bg-red-500 text-white"
                  }
                >
                  {p.activo ? "Activo" : "Inactivo"}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => { setEditPeriodo(p); setOpen(true); }}>Editar</Button>
              <Button variant="destructive" onClick={() => onDelete(p._id)}>Eliminar</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}