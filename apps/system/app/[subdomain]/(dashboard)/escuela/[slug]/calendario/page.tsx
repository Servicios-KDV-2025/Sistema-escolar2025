"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Calendar } from "@repo/ui/components/shadcn/calendar";
import { format} from "date-fns";
import { es } from "date-fns/locale";
import { useEscuela } from "@/app/store/useEscuela";
import { Id } from "@/convex/_generated/dataModel";
import { Calendar as CalendarIcon, BookOpen, AlertTriangle, GraduationCap, Filter, Search, Bell, TrendingUp, School, CalendarDays } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { Badge } from "@repo/ui/components/shadcn/badge";
import { Button } from "@repo/ui/components/shadcn/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/components/shadcn/select";
import { Input } from "@repo/ui/components/shadcn/input";
import { Separator } from "@repo/ui/components/shadcn/separator";
import { useState, useMemo, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useBreadcrumbStore } from "@/app/store/breadcrumbStore";
import { useParams } from "next/navigation";

const tiposEvento = {
  clase: {
    label: "Clases",
    color: "bg-blue-600 text-white border-blue-600",
    colorHover: "hover:bg-blue-700",
    bgLight: "bg-blue-50 hover:bg-blue-100",
    borderColor: "border-l-blue-500",
    dotColor: "bg-blue-500",
    icon: BookOpen,
    description: "Días de clases regulares",
    gradient: "from-blue-500 to-blue-600"
  },
  feriado: {
    label: "Feriados",
    color: "bg-red-600 text-white border-red-600",
    colorHover: "hover:bg-red-700",
    bgLight: "bg-red-50 hover:bg-red-100",
    borderColor: "border-l-red-500",
    dotColor: "bg-red-500",
    icon: CalendarIcon,
    description: "Días festivos y vacaciones",
    gradient: "from-red-500 to-red-600"
  },
  examen: {
    label: "Exámenes",
    color: "bg-amber-600 text-white border-amber-600",
    colorHover: "hover:bg-amber-700",
    bgLight: "bg-amber-50 hover:bg-amber-100",
    borderColor: "border-l-amber-500",
    dotColor: "bg-amber-500",
    icon: GraduationCap,
    description: "Días de evaluaciones",
    gradient: "from-amber-500 to-amber-600"
  },
};

export default function CalendarioEscolar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState("");
  const escuela = useEscuela((s) => s.escuela);
  const ciclosEscolares = useQuery(
    api.ciclosEscolares.obtenerCiclosEscolares,
    escuela ? { escuelaId: escuela._id as Id<"escuelas"> } : "skip"
  );
  const [filtroCicloEscolarId, setFiltroCicloEscolarId] = useState<string>();
  const setItems = useBreadcrumbStore(state => state.setItems)
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  useEffect(() => {
    setFiltroCicloEscolarId(ciclosEscolares?.[ciclosEscolares.length - 1]?._id || "")
    if (escuela) {
        setItems([
          { label: `${escuela?.nombre}`, href: `/escuela/${slug}` },
          { label: 'Calendario Escolar', isCurrentPage: true },
        ])
      }
  }, [ciclosEscolares, escuela, setItems, slug])
  const eventos = useQuery(api.calendario.obtenerCalendarioCicloEscolar,
    escuela?._id && filtroCicloEscolarId
      ? {
        escuelaId: escuela?._id as Id<"escuelas">,
        cicloEscolarId: filtroCicloEscolarId as Id<"ciclosEscolares">
      } : "skip");

  const datosCalendario = useMemo(() => {
    if (!eventos) return { fechasConEventos: new Map(), contadorEventos: { clase: 0, feriado: 0, examen: 0 }, eventosDelDia: [], eventosFiltrados: [] };

    const fechasConEventos = new Map<string, string>();
    const contadorEventos = { clase: 0, feriado: 0, examen: 0 };
    const eventosDelDia: typeof eventos = [];

    const eventosFiltrados = eventos.filter(evento => {
      const coincideBusqueda = !busqueda ||
        evento.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
        evento.tipo.toLowerCase().includes(busqueda.toLowerCase());

      const coincideTipo = filtroTipo === "todos" || evento.tipo.toLowerCase().trim() === filtroTipo;

      return coincideBusqueda && coincideTipo;
    });

    eventosFiltrados.forEach((evento) => {
      const fecha = format(new Date(evento.fecha), "yyyy-MM-dd");
      const tipo = evento.tipo.toLowerCase().trim();
      fechasConEventos.set(fecha, tipo);

      if (tipo in contadorEventos) {
        contadorEventos[tipo as keyof typeof contadorEventos]++;
      }

      if (selectedDate && format(selectedDate, "yyyy-MM-dd") === fecha) {
        eventosDelDia.push(evento);
      }
    });

    return { fechasConEventos, contadorEventos, eventosDelDia, eventosFiltrados };
  }, [eventos, selectedDate, busqueda, filtroTipo]);

  const getTipoEvento = useCallback((date: Date) => {
    const fechaStr = format(date, "yyyy-MM-dd");
    return datosCalendario.fechasConEventos.get(fechaStr);
  }, [datosCalendario.fechasConEventos]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  }, []);

  return (
    <div>
      <div className="container mx-auto px-6 py-6">
        <div className="text-center space-y-4">
          <div className="flex mt-2 justify-end">
            <Select value={filtroCicloEscolarId} onValueChange={setFiltroCicloEscolarId}>
              <SelectTrigger className=" bg-slate-50 border-slate-200 focus:bg-white">
                <School className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por ciclo escolar" />
              </SelectTrigger>
              <SelectContent>
                {ciclosEscolares?.map((ciclo) => (
                  <SelectItem key={ciclo._id} value={ciclo._id}>
                    {ciclo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-center items-center gap-3 mb-5">
            <div className="p-3 rounded-full backdrop-blur-sm">
              <School className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Sistema Escolar</h1>
          </div>
          <p className="text-xl max-w-2xl mx-auto">
            Gestiona eventos, exámenes y actividades escolares de manera eficiente y organizada
          </p>
        </div>
      </div>
      <div className="flex flex-col xl:flex-row gap-6 p-4 md:p-6 min-h-screen">
        <div className="flex-1 space-y-6">
          <Card className="lg:col-span-1 shadow-xl bg-white/90 backdrop-blur-md ">
            <CardContent className="p-4">
              <CardHeader className="flex flex-row justify-between pb-4">
                <div className="flex items-center gap-3 ">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-md">
                    <Filter className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-800">
                      Filtros
                    </CardTitle>
                    <p className="text-slate-600 text-sm">
                      Personaliza tu vista del calendario
                    </p>
                  </div>
                </div>
              </CardHeader>
              <Separator className="bg-black/10" />
              <div className="flex xl:flex-col flex-row  w-full py-4 gap-4">
                <div className="relative flex flex-8 py-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar eventos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
                  />
                </div>
                <div className="relative flex flex- py-1">
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="w-full bg-slate-50 border-slate-200 focus:bg-white">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {Object.entries(tiposEvento).map(([tipo, config]) => (
                        <SelectItem key={tipo} value={tipo}>
                          <div className="flex items-center gap-2">
                            <config.icon className="h-4 w-4" />
                            {config.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 text-lg font-bold text-slate-800 pb-3">
                  <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-md">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  Tipos de Eventos
                </div>
                {Object.entries(tiposEvento).map(([tipo, config]) => {
                  const IconComponent = config.icon;
                  const count = datosCalendario.contadorEventos[tipo as keyof typeof datosCalendario.contadorEventos];
                  return (
                    <div
                      key={tipo}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer",
                        "hover:shadow-md hover:scale-[1.02] group",
                        config.bgLight,
                        config.borderColor.replace('border-l-', 'border-')
                      )}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyDown(e, () => setFiltroTipo(tipo))}
                      onClick={() => setFiltroTipo(tipo)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={cn(
                          "p-2 rounded-lg shadow-sm transition-all duration-200",
                          config.color,
                          "group-hover:shadow-md"
                        )}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-800">{config.label}</h3>
                          <Badge
                            variant="secondary"
                            className="text-xs bg-slate-100 text-slate-600"
                          >
                            {count} evento{count !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                        <TrendingUp className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      </div>
                      <p className="text-sm text-slate-600 ml-11 leading-relaxed">
                        {config.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex pt-6">
                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-700 hover:bg-blue-50"
                  onClick={() => {
                    setFiltroTipo("todos");
                    setBusqueda("");
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-6">
          <Card className="shadow-lg bg-white/90 backdrop-blur-md">
            <CardContent className="p-6">
              <CardHeader className="flex flex-col pb-4 gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md">
                      <CalendarIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-800">
                        Calendario Escolar
                      </CardTitle>
                      <p className="text-slate-600 text-sm">
                        Gestiona y visualiza el año académico
                      </p>
                    </div>
                  </div>
                </div>

              </CardHeader>
              <Separator className="bg-black/10" />

              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                captionLayout="dropdown"
                locale={es}
                className="rounded-xl shadow-sm border bg-white mx-auto mt-5"
                classNames={{
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-slate-600 rounded-md w-14 font-semibold text-sm uppercase tracking-wider text-center py-2",
                  row: "flex w-full mt-2",
                  cell: cn(
                    "h-8 w-8 sm:h-11 sm:w-11 md:w-14 md:h-14",
                    "text-center text-sm p-0 relative",
                    "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                    "focus-within:relative focus-within:z-20"
                  ),
                  day: cn(
                    "h-8 w-8 sm:h-11 sm:w-11 md:w-14 md:h-14 text-sm relative",
                    "p-0 font-medium aria-selected:opacity-70 rounded-xl transition-all duration-100",
                    "hover:bg-slate-100 hover:scale-105 hover:shadow-md",
                    "focus:bg-blue-50 focus:text-blue-700 focus:ring-2 focus:ring-blue-300"
                  ),
                  day_button:
                    'data-[selected-single=true]:bg-transparent data-[selected-single=true]:text-black',
                  selected: 'bg-transparent border-1 sm:border-2 p-0 border-blue-300 text-black font-semibold',
                  today: 'bg-slate-100',
                  day_selected: "ring-2 ring-slate-400 bg-slate-100 text-slate-900 font-bold",
                  day_today: "ring-2 ring-slate-400 bg-slate-100 text-slate-900 font-bold",
                  day_outside: "text-slate-300 opacity-40",
                  day_disabled: "text-slate-300 opacity-30 cursor-not-allowed",
                  day_range_middle: "aria-selected:bg-blue-50 aria-selected:text-blue-700",
                  day_hidden: "invisible",
                }}
                modifiers={{
                  clase: (date) => getTipoEvento(date) === "clase",
                  feriado: (date) => getTipoEvento(date) === "feriado",
                  examen: (date) => getTipoEvento(date) === "examen",
                }}
                modifiersClassNames={{
                  clase: "hover:scale-110 hover:ring-1 hover:ring-blue-300/50 sm:p-1 after:content-[''] after:absolute after:top-1.5 after:right-1.5 after:w-1 sm:after:w-1.5 md:after:w-2.5 after:h-1 sm:after:h-1.5 md:after:h-2.5 after:bg-blue-500 after:rounded-full after:shadow-sm after:border after:border-blue-600",
                  feriado: "hover:scale-110 hover:ring-1 hover:ring-red-300/50 sm:p-1 after:content-[''] after:absolute after:top-1.5 after:right-1.5 after:w-1 sm:after:w-1.5 md:after:w-2.5 after:h-1 sm:after:h-1.5 md:after:h-2.5 after:bg-red-500 after:rounded-full after:shadow-sm after:border after:border-red-600",
                  examen: "hover:scale-110 hover:ring-1 hover:ring-amber-300/50 sm:p-1 after:content-[''] after:absolute after:top-1.5 after:right-1.5 after:w-1 sm:after:w-1.5 md:after:w-2.5 after:h-1 sm:after:h-1.5 md:after:h-2.5 after:bg-amber-500 after:rounded-full after:shadow-sm after:border after:border-amber-600",
                }}
              />



            </CardContent>
          </Card>
        </div>

        <div className="flex-1 space-y-6">
          {selectedDate && (
            <Card className="shadow-lg bg-white/90 backdrop-blur-md">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-lg font-bold text-slate-800">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md">
                    <CalendarIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-bold">
                      {format(selectedDate, "d 'de' MMMM", { locale: es })}
                    </div>
                    <div className="text-sm text-slate-600 font-normal">
                      {format(selectedDate, "yyyy")}
                    </div>
                  </div>
                  {datosCalendario.eventosDelDia.length > 0 && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {datosCalendario.eventosDelDia.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {datosCalendario.eventosDelDia.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {datosCalendario.eventosDelDia.map((evento, index) => {
                      const tipo = evento.tipo.toLowerCase().trim();
                      const config = tiposEvento[tipo as keyof typeof tiposEvento];
                      const IconComponent = config?.icon || CalendarIcon;

                      return (
                        <div
                          key={index}
                          className={cn(
                            "p-4 rounded-xl border-l-4 ",
                            "mx-2",
                            config?.bgLight,
                            config?.borderColor
                          )}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => handleKeyDown(e, () => { })}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className={cn("p-2 rounded-lg shadow-sm", config?.color)}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <span className="font-semibold text-slate-800 capitalize">
                                {evento.tipo}
                              </span>
                              <div className="text-xs text-slate-500">
                                {format(new Date(evento.fecha), "d 'de' MMMM", { locale: es })}
                              </div>
                            </div>
                          </div>
                          {evento.descripcion && (
                            <p className="text-sm text-slate-700 ml-11 leading-relaxed">
                              {evento.descripcion}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">
                      No hay eventos programados
                    </p>
                    <p className="text-slate-400 text-sm mt-1">
                      para este día
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

          )}

          <Card className="shadow-lg bg-white/90 backdrop-blur-md">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg font-bold text-slate-800">
                <div className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg shadow-md">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                Próximos eventos
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm mt-1">
                Los eventos más cercanos en el calendario escolar
              </CardDescription>
            </CardHeader>
            <CardContent>
              {datosCalendario.eventosFiltrados.length > 0 ? (
                <div className="space-y-3 max-h-84 overflow-y-auto">
                  {datosCalendario.eventosFiltrados
                    .filter(evento => new Date(evento.fecha) >= new Date())
                    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
                    .slice(0, 5)
                    .map((evento, index) => {
                      const tipo = evento.tipo.toLowerCase().trim();
                      const config = tiposEvento[tipo as keyof typeof tiposEvento];
                      const IconComponent = config?.icon || CalendarIcon;
                      return (
                        <div
                          key={index}
                          className={cn(
                            "p-4 rounded-xl border-l-4 ",
                            " mx-2 group",
                            config?.bgLight,
                            config?.borderColor
                          )}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className={cn("p-2 rounded-lg shadow-sm", config?.color)}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <span className="font-semibold text-slate-800 capitalize">
                                {evento.tipo}
                              </span>

                            </div>

                          </div>
                          <div className="ml-11 flex flex-row ">
                            <div className="text-xs text-slate-500">
                              {format(new Date(evento.fecha), "d 'de' MMMM", { locale: es })}
                            </div>
                            <Badge
                              variant="secondary"
                              className={cn(
                                "text-xs m-1",
                                tipo === "clase" && "bg-blue-100 text-blue-700",
                                tipo === "feriado" && "bg-red-100 text-red-700",
                                tipo === "examen" && "bg-amber-100 text-amber-700"
                              )}
                            >
                              Próximo
                            </Badge>
                          </div>
                          {evento.descripcion && (
                            <p className="text-sm text-slate-700 ml-11 leading-relaxed">
                              {evento.descripcion}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  {datosCalendario.eventosFiltrados.filter(evento => new Date(evento.fecha) >= new Date()).length === 0 && (
                    <div className="text-center py-8">
                      <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">
                        No hay próximos eventos programados
                      </p>
                      <p className="text-slate-400 text-sm mt-1">
                        Revisa el calendario para más información
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">
                    No hay próximos eventos programados
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    Revisa el calendario para más información
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

  );
}