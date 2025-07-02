"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEscuela } from "@/app/store/useEscuela";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";

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

  // Puedes obtener el catalogoClaseId de un select o de la URL, aquí es solo ejemplo:
  const [catalogoClaseId, setCatalogoClaseId] = useState<string>("");

  // Queries
  const periodosPorEscuela = useQuery(
    api.periodoporClase.obtenerPeriodosPorClasePorEscuela,
    escuelaId ? { escuelaId } : "skip"
  );
  const periodosPorCatalogo = useQuery(
    api.periodoporClase.obtenerPeriodosPorClasePorCatalogo,
    catalogoClaseId ? { catalogoClaseId } : "skip"
  );

  // Mutations
  const crearperiodoporClase = useMutation(api.periodoporClase.crearPeriodoPorClase);
  const actualizarperiodoporClase = useMutation(api.periodoporClase.actualizarPeriodoPorClase);
  const eliminarperiodoporClase = useMutation(api.periodoporClase.eliminarPeriodoPorClase);

  // Formulario
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PeriodoClaseForm>({
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
          id: editItem._id,
          escuelaId,
          catalogoClaseId: data.catalogoClaseId,
          periodoId: data.periodoId,
          diaSemana: data.diaSemana,
          activo: data.activo,
        });
        toast("Periodo por clase actualizado");
      } else {
        await crearperiodoporClase({
          escuelaId,
          catalogoClaseId: data.catalogoClaseId,
          periodoId: data.periodoId,
          diaSemana: data.diaSemana,
          activo: data.activo,
        });
        toast("Periodo por clase creado");
      }
      setOpen(false);
      setEditItem(null);
      reset();
    } catch (e: any) {
      toast("Error", { description: e.message, variant: "destructive" });
    }
  };

  const onDelete = async (item: any) => {
    if (!confirm("¿Eliminar este periodo por clase?")) return;
    try {
      await eliminarperiodoporClase({ id: item._id, escuelaId });
      toast("Eliminado");
    } catch (e: any) {
      toast("Error", { description: e.message, variant: "destructive" });
    }
  };

  // Puedes mostrar ambos o solo uno según tu lógica
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Periodos por Clase</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditItem(null); setOpen(true); }}>Nuevo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editItem ? "Editar" : "Nuevo"} Periodo por Clase</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input placeholder="ID Catálogo Clase" {...register("catalogoClaseId")} />
              {errors.catalogoClaseId && <p className="text-red-500 text-xs">{errors.catalogoClaseId.message}</p>}
              <Input placeholder="ID Periodo" {...register("periodoId")} />
              {errors.periodoId && <p className="text-red-500 text-xs">{errors.periodoId.message}</p>}
              <Input type="number" min={1} max={7} placeholder="Día de la semana (1-7)" {...register("diaSemana", { valueAsNumber: true })} />
              {errors.diaSemana && <p className="text-red-500 text-xs">{errors.diaSemana.message}</p>}
              <label>
                <input type="checkbox" {...register("activo")} />
                Activo
              </label>
              <DialogFooter>
                <Button type="submit">{editItem ? "Actualizar" : "Crear"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-8">
        <h2 className="font-semibold mb-2">Por Escuela</h2>
        {periodosPorEscuela?.length === 0 && <p>No hay registros.</p>}
        <ul className="space-y-2">
          {periodosPorEscuela?.map((item: any) => (
            <li key={item._id} className="border rounded p-3 flex justify-between items-center">
              <div>
                <Link href={`/periodos-clase/${item._id}`} className="font-semibold hover:underline">
                  {item.catalogoClaseId} - {item.periodoId} (Día {item.diaSemana}) {item.activo ? "✅" : "❌"}
                </Link>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setEditItem(item); setOpen(true); }}>Editar</Button>
                <Button variant="destructive" onClick={() => onDelete(item)}>Eliminar</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Por Catálogo de Clase</h2>
        <Input
          placeholder="ID Catálogo Clase"
          value={catalogoClaseId}
          onChange={e => setCatalogoClaseId(e.target.value)}
          className="mb-2"
        />
        {periodosPorCatalogo?.length === 0 && <p>No hay registros.</p>}
        <ul className="space-y-2">
          {periodosPorCatalogo?.map((item: any) => (
            <li key={item._id} className="border rounded p-3 flex justify-between items-center">
              <div>
                <Link href={`/periodos-clase/${item._id}`} className="font-semibold hover:underline">
                  {item.catalogoClaseId} - {item.periodoId} (Día {item.diaSemana}) {item.activo ? "✅" : "❌"}
                </Link>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setEditItem(item); setOpen(true); }}>Editar</Button>
                <Button variant="destructive" onClick={() => onDelete(item)}>Eliminar</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}