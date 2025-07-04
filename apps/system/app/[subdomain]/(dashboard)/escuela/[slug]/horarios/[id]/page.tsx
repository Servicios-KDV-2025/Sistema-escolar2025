"use client";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEscuela } from "@/app/store/useEscuela";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const periodoClaseSchema = z.object({
  catalogoClaseId: z.string().min(1, "Clase requerida"),
  periodoId: z.string().min(1, "Periodo requerido"),
  diaSemana: z.number().min(1).max(7),
  activo: z.boolean(),
});

type PeriodoClaseForm = z.infer<typeof periodoClaseSchema>;

const DIAS_SEMANA = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 7, label: "Domingo" },
];

export default function PeriodoPorClaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { escuela } = useEscuela();
  const escuelaId = escuela?._id;

  const id = params.id as string;
  const isValidId = id && id !== "create";
  const registro = useQuery(
    api.periodoporClase.obtenerPeriodoPorClasePorId,
    isValidId ? { id } : "skip"
  );

  // Queries para obtener información relacionada
  const catalogosClases = useQuery(api.catalogosDeClases.verTodosLosCatalogosDeClases, escuelaId ? { escuelaId } : "skip");
  const periodos = useQuery(api.periodos.obtenerPeriodosPorEscuela, escuelaId ? { escuelaId } : "skip");
  const materias = useQuery(api.materias.obtenerMateriasPorEscuela, escuelaId ? { escuelaId } : "skip");
  // const salones = useQuery(api.salones.obtenerSalonPorId, escuelaId ? { escuelaId } : "skip");
  // const maestros = useQuery(api.maestros.obtenerMaestrosPorEscuela, escuelaId ? { escuelaId } : "skip");
  // const grupos = useQuery(api.grupos.obtenerGruposPorEscuela, escuelaId ? { escuelaId } : "skip");
  // const ciclos = useQuery(api.ciclosEscolares.obtenerCiclosPorEscuela, escuelaId ? { escuelaId } : "skip");


  const actualizarPeriodoPorClase = useMutation(api.periodoporClase.actualizarPeriodoPorClase);
  const eliminarPeriodoPorClase = useMutation(api.periodoporClase.eliminarPeriodoPorClase);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PeriodoClaseForm>({
    resolver: zodResolver(periodoClaseSchema),
    defaultValues: { catalogoClaseId: "", periodoId: "", diaSemana: 1, activo: true },
  });

  const [editOpen, setEditOpen] = useState(false);

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
      setEditOpen(false);
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

  // Helpers para mostrar nombres
  const clase = catalogosClases?.find((c: any) => c.id === registro.catalogoClaseId);
  const periodo = periodos?.find((p: any) => p._id === registro.periodoId);
  const materia = materias?.find((m: any) => m.id === clase?.materiaId);
    // const salon = salones?.find((s: any) => s.id === clase?.salonId);
  // const maestro = maestros?.find((m: any) => m.id === clase?.maestroId);
  // const grupo = grupos?.find((g: any) => g.id === clase?.grupoId);
  // const ciclo = ciclos?.find((c: any) => c.id === clase?.cicloEscolarId);


  const getDiaNombre = (n: number) =>
    DIAS_SEMANA.find((d) => d.value === n)?.label || n;

  return (
    <div className="w-full h-full min-h-screen flex flex-col gap-8 bg-gray-50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 pt-8">
        <h1 className="text-3xl font-bold">Detalle de Periodo por Clase</h1>
        <div className="flex gap-2">
          <Button onClick={() => setEditOpen(true)}>Editar</Button>
          <Button variant="destructive" onClick={onDelete}>Eliminar</Button>
        </div>
      </div>
      <section className="flex-1 bg-white rounded-xl shadow p-8 mx-4 md:mx-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 w-auto">
        <div>
          <span className="text-gray-500 text-xs">ID registro</span>
          <div className="font-mono break-all">{registro._id}</div>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Materia</span>
          <div>{materia?.nombre || "-"} <span className="text-gray-400 text-xs">({clase?.materiaId})</span></div>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Clase</span>
          <div>{clase?.nombre || "-"} <span className="text-gray-400 text-xs">({registro.catalogoClaseId})</span></div>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Periodo</span>
          <div>{periodo?.nombre || "-"} <span className="text-gray-400 text-xs">({registro.periodoId})</span></div>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Horario del periodo</span>
          <div>{periodo ? `${periodo.horaInicio} - ${periodo.horaFin}` : "-"}</div>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Día de la semana</span>
          <div>{getDiaNombre(registro.diaSemana)} <span className="text-gray-400 text-xs">({registro.diaSemana})</span></div>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Activo</span>
          <div>{registro.activo ? "Sí" : "No"}</div>
        </div>
        <div>
          <span className="text-gray-500 text-xs">ID escuela</span>
          <div className="font-mono break-all">{escuelaId}</div>
        </div>
         {/* <div>
          <span className="text-gray-500 text-xs">Maestro</span>
          <div>{maestro?.nombre || "-"} <span className="text-gray-400 text-xs">({clase?.maestroId})</span></div>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Grupo</span>
          <div>{grupo?.nombre || "-"} <span className="text-gray-400 text-xs">({clase?.grupoId})</span></div>
        </div>
        <div>
          <span className="text-gray-500 text-xs">Ciclo escolar</span>
          <div>{ciclo?.nombre || "-"} <span className="text-gray-400 text-xs">({clase?.cicloEscolarId})</span></div>
        </div> */}
         {/* <div>
          <span className="text-gray-500 text-xs">Salón</span>
          <div>{salon?.nombre || "-"} <span className="text-gray-400 text-xs">({clase?.salonId})</span></div>
        </div> */}
      </section>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>Editar Periodo por Clase</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Clase</label>
              <select {...register("catalogoClaseId")} className="w-full border rounded px-2 py-1">
                <option value="">Selecciona una clase</option>
                {catalogosClases?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              {errors.catalogoClaseId && <p className="text-red-500 text-xs">{errors.catalogoClaseId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Periodo</label>
              <select {...register("periodoId")} className="w-full border rounded px-2 py-1">
                <option value="">Selecciona un periodo</option>
                {periodos?.map((p: any) => (
                  <option key={p._id} value={p._id}>{p.nombre}</option>
                ))}
              </select>
              {errors.periodoId && <p className="text-red-500 text-xs">{errors.periodoId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Día de la semana</label>
              <select {...register("diaSemana", { valueAsNumber: true })} className="w-full border rounded px-2 py-1">
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
              <Button type="submit" className="w-full">Guardar cambios</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="mt-8 px-4">
        <h2 className="font-semibold">Datos crudos:</h2>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(registro, null, 2)}</pre>
      </div>
    </div>
  );
}