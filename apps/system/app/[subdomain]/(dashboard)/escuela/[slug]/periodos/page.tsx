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

const periodoSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  horaFin: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  activo: z.boolean(),
});

type PeriodoForm = z.infer<typeof periodoSchema>;

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

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PeriodoForm>({
    resolver: zodResolver(periodoSchema),
    defaultValues: { nombre: "", horaInicio: "", horaFin: "", activo: true },
  });

  useEffect(() => {
    if (editPeriodo) {
      setValue("nombre", editPeriodo.nombre);
      setValue("horaInicio", editPeriodo.horaInicio);
      setValue("horaFin", editPeriodo.horaFin);
      setValue("activo", editPeriodo.activo);
    } else {
      reset({ nombre: "", horaInicio: "", horaFin: "", activo: true });
    }
  }, [editPeriodo, setValue, reset]);

  const onSubmit = async (data: PeriodoForm) => {
    if (!escuelaId) {
      toast("Error: Escuela no seleccionada");
      return;
    }
    try {
      if (editPeriodo) {
        await actualizarPeriodo({ id: editPeriodo._id as import("@/convex/_generated/dataModel").Id<"periodos">, escuelaId, ...data });
        toast("Periodo actualizado");
      } else {
        await crearPeriodo({ escuelaId, ...data });
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
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Periodos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditPeriodo(null); setOpen(true); }}>Nuevo periodo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editPeriodo ? "Editar periodo" : "Nuevo periodo"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input placeholder="Nombre" {...register("nombre")} />
              {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre.message}</p>}
              <Input placeholder="Hora inicio (HH:MM)" {...register("horaInicio")} />
              {errors.horaInicio && <p className="text-red-500 text-xs">{errors.horaInicio.message}</p>}
              <Input placeholder="Hora fin (HH:MM)" {...register("horaFin")} />
              {errors.horaFin && <p className="text-red-500 text-xs">{errors.horaFin.message}</p>}
              <div className="flex items-center gap-2">
                <Switch checked={!!(editPeriodo ? editPeriodo.activo : true)} {...register("activo")} onCheckedChange={v => setValue("activo", v)} />
                <span>Activo</span>
              </div>
              <DialogFooter>
                <Button type="submit">{editPeriodo ? "Actualizar" : "Crear"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-2">
        {periodos?.length === 0 && <p className="text-muted-foreground">No hay periodos registrados.</p>}
        {periodos?.map((p: Periodo) => (
          <div key={p._id} className="border rounded p-4 flex justify-between items-center">
            <div>
              <div className="font-semibold">{p.nombre}</div>
              <div className="text-sm text-muted-foreground">{p.horaInicio} - {p.horaFin}</div>
              <div className="text-xs">{p.activo ? "Activo" : "Inactivo"}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setEditPeriodo(p); setOpen(true); }}>Editar</Button>
              <Button variant="destructive" onClick={() => onDelete(p._id)}>Eliminar</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}