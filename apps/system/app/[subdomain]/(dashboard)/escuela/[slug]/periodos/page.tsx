"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { useEscuela } from "@/app/store/useEscuelaStore";
import { Badge } from "@repo/ui/components/shadcn/badge"; 

const periodoSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  horaFin: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:MM"),
  activo: z.boolean(),
});

type PeriodoForm = z.infer<typeof periodoSchema>;

const ampmOptions = ["AM", "PM"];

// Helper para convertir a 24h
function to24h(hora: string, ampm: string) {
  // Validar formato HH:MM
  if (!/^\d{1,2}:\d{2}$/.test(hora)) {
    return hora; // Si no es válido, devolver como está
  }
  
  const [h, m] = hora.split(":").map(Number);
  
  // Validar rangos
  if (h < 1 || h > 12 || m < 0 || m > 59) {
    return hora; // Si no es válido, devolver como está
  }
  
  let h24 = h;
  if (ampm === "PM" && h !== 12) h24 += 12;
  if (ampm === "AM" && h === 12) h24 = 0;
  return `${h24.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

// Helper para convertir de 24h a 12h
function from24h(hora24: string) {
  if (!hora24) return { hora: "7:00", ampm: "AM" };
  const [h, m] = hora24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  let hora = h % 12;
  if (hora === 0) hora = 12;
  return { hora: `${hora}:${m.toString().padStart(2, "0")}`, ampm };
}

// Formato 12 horas para mostrar
function formatoHora12(hora24: string) {
  if (!hora24) return "";
  const [h, m] = hora24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hora12 = ((h + 11) % 12 + 1);
  return `${hora12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

// Función para validar formato de hora 12h
function validarHora12(hora: string) {
  if (!/^\d{1,2}:\d{2}$/.test(hora)) {
    return "Formato inválido. Use H:MM o HH:MM";
  }
  
  const [h, m] = hora.split(":").map(Number);
  
  if (h < 1 || h > 12) {
    return "La hora debe estar entre 1 y 12";
  }
  
  if (m < 0 || m > 59) {
    return "Los minutos deben estar entre 00 y 59";
  }
  
  return null;
}

export default function PeriodosPage() {
  // Usa el hook del store
  const { 
    escuela, 
    isLoading, 
    error, 
    detectSubdomain, 
    setEmail, 
    clearError 
  } = useEscuela();

  // Detectar escuela al montar (igual que en tu login)
  const hasLoaded = useRef(false);
  useEffect(() => {
    if (!hasLoaded.current) {
      detectSubdomain();
      hasLoaded.current = true;
    }
  }, [detectSubdomain, setEmail]);

  // HOOKS SIEMPRE AL INICIO
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
    defaultValues: { nombre: "", horaInicio: "07:00", horaFin: "08:00", activo: true },
  });

  const [inicio, setInicio] = useState({ hora: "7:00", ampm: "AM" });
  const [fin, setFin] = useState({ hora: "8:00", ampm: "AM" });
  const [errorInicio, setErrorInicio] = useState<string | null>(null);
  const [errorFin, setErrorFin] = useState<string | null>(null);

  // Sincronizar selectores con formulario
  useEffect(() => {
    const errorIni = validarHora12(inicio.hora);
    const errorFinVal = validarHora12(fin.hora);
    
    setErrorInicio(errorIni);
    setErrorFin(errorFinVal);
    
    if (!errorIni && !errorFinVal) {
      const horaInicio = to24h(inicio.hora, inicio.ampm);
      const horaFin = to24h(fin.hora, fin.ampm);
      setValue("horaInicio", horaInicio);
      setValue("horaFin", horaFin);
    }
  }, [inicio, fin, setValue]);

  useEffect(() => {
    if (editPeriodo) {
      const inicioData = from24h(editPeriodo.horaInicio);
      const finData = from24h(editPeriodo.horaFin);
      setInicio(inicioData);
      setFin(finData);
      reset({
        nombre: editPeriodo.nombre,
        horaInicio: editPeriodo.horaInicio,
        horaFin: editPeriodo.horaFin,
        activo: editPeriodo.activo,
      });
    } else {
      const defaultInicio = { hora: "7:00", ampm: "AM" };
      const defaultFin = { hora: "8:00", ampm: "AM" };
      setInicio(defaultInicio);
      setFin(defaultFin);
      reset({ 
        nombre: "", 
        horaInicio: to24h(defaultInicio.hora, defaultInicio.ampm), 
        horaFin: to24h(defaultFin.hora, defaultFin.ampm), 
        activo: true 
      });
    }
  }, [editPeriodo, reset]);

  const onSubmit = async (data: PeriodoForm) => {
    if (isLoading) return;
    if (!escuelaId) {
      toast("Error: Escuela no seleccionada");
      return;
    }

    // Validar horas antes de enviar
    if (errorInicio || errorFin) {
      toast("Error: Corrija los errores en las horas");
      return;
    }

    try {
      if (editPeriodo) {
        await actualizarPeriodo({ 
          id: editPeriodo._id as import("@/convex/_generated/dataModel").Id<"periodos">, 
          escuelaId, 
          ...data
        });
        toast("Periodo actualizado");
      } else {
        await crearPeriodo({ 
          escuelaId, 
          ...data
        });
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
    if (isLoading) return;
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

  // RETURNS CONDICIONALES DESPUÉS DE LOS HOOKS
  if (isLoading) {
    return <div className="text-center py-10">Cargando escuela...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error}
        <br />
        <button
          onClick={() => {
            clearError();
            detectSubdomain();
          }}
          className="text-xs text-blue-500 underline mt-2"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!escuela) {
    return <div className="text-center py-10">No se encontró la escuela.</div>;
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
                <div className="flex gap-2 items-center">
                  <Input
                    type="text"
                    placeholder="H:MM"
                    value={inicio.hora}
                    onChange={e => setInicio(i => ({ ...i, hora: e.target.value }))}
                    className={`w-20 ${errorInicio ? 'border-red-500' : ''}`}
                  />
                  <select 
                    value={inicio.ampm} 
                    onChange={e => setInicio(i => ({ ...i, ampm: e.target.value }))} 
                    className="border rounded px-2 py-1"
                  >
                    {ampmOptions.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                {errorInicio && <p className="text-red-500 text-xs mt-1">{errorInicio}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Hora fin</label>
                <div className="flex gap-2 items-center">
                  <Input
                    type="text"
                    placeholder="H:MM"
                    value={fin.hora}
                    onChange={e => setFin(f => ({ ...f, hora: e.target.value }))}
                    className={`w-20 ${errorFin ? 'border-red-500' : ''}`}
                  />
                  <select 
                    value={fin.ampm} 
                    onChange={e => setFin(f => ({ ...f, ampm: e.target.value }))} 
                    className="border rounded px-2 py-1"
                  >
                    {ampmOptions.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                {errorFin && <p className="text-red-500 text-xs mt-1">{errorFin}</p>}
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
                <Button 
                  type="submit" 
                  disabled={!!(errorInicio || errorFin)}
                >
                  {editPeriodo ? "Actualizar" : "Crear"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl ">
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