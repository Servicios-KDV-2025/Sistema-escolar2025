"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEscuela } from "@/app/store/useEscuela";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect } from "react";

const periodoClaseSchema = z.object({
  catalogoClaseId: z.string().min(1, "Clase requerida"),
  periodoId: z.string().min(1, "Periodo requerido"),
  diaSemana: z.number().min(1).max(7),
  activo: z.boolean(),
});

type PeriodoClaseForm = z.infer<typeof periodoClaseSchema>;

export default function PeriodoPorClaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { escuela } = useEscuela();
  const escuelaId = escuela?._id;

  const id = params.id as string;

  const registro = useQuery(api.periodoporClase.obtenerPeriodoPorClasePorId, id ? { id } : "skip");
  const actualizarPeriodoPorClase = useMutation(api.periodoporClase.actualizarPeriodoPorClase);
  const eliminarPeriodoPorClase = useMutation(api.periodoporClase.eliminarPeriodoPorClase);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<PeriodoClaseForm>({
    resolver: zodResolver(periodoClaseSchema),
    defaultValues: { catalogoClaseId: "", periodoId: "", diaSemana: 1, activo: true },
  });

  useEffect(() => {
    if (registro) {
      setValue("catalogoClaseId", registro.catalogoClaseId);
      setValue("periodoId", registro.periodoId);
      setValue("diaSemana", registro.diaSemana);
      setValue("activo", registro.activo);
    }
  }, [registro, setValue]);

  const onSubmit = async (data: PeriodoClaseForm) => {
    try {
      if (!escuelaId) return;
      await actualizarPeriodoPorClase({
        id,
        escuelaId,
        catalogoClaseId: data.catalogoClaseId,
        periodoId: data.periodoId,
        diaSemana: data.diaSemana,
        activo: data.activo,
      });
      toast("Actualizado");
      router.refresh();
    } catch (e: any) {
      toast("Error", { description: e.message, variant: "destructive" });
    }
  };

  const onDelete = async () => {
    if (!escuelaId) return;
    if (!confirm("¿Eliminar este periodo por clase?")) return;
    try {
      await eliminarPeriodoPorClase({ id, escuelaId });
      toast("Eliminado");
      router.push("/periodos-clase");
    } catch (e: any) {
      toast("Error", { description: e.message, variant: "destructive" });
    }
  };

  if (!registro) return <div className="py-10 text-center">Cargando...</div>;

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Detalle de Periodo por Clase</h1>
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
        <div className="flex gap-2">
          <Button type="submit">Guardar cambios</Button>
          <Button type="button" variant="destructive" onClick={onDelete}>Eliminar</Button>
        </div>
      </form>
      <div className="mt-8">
        <h2 className="font-semibold">Datos crudos:</h2>
        <pre className="bg-gray-100 p-2 rounded text-xs">{JSON.stringify(registro, null, 2)}</pre>
      </div>
    </div>
  );
}