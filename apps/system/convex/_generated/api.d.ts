/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as alumnos from "../alumnos.js";
import type * as asistencias from "../asistencias.js";
import type * as calendario from "../calendario.js";
import type * as calificaciones from "../calificaciones.js";
import type * as catalogosDeClases from "../catalogosDeClases.js";
import type * as ciclosEscolares from "../ciclosEscolares.js";
import type * as clasesPorAlumno from "../clasesPorAlumno.js";
import type * as departamento from "../departamento.js";
import type * as escuelas from "../escuelas.js";
import type * as eventoPorClase from "../eventoPorClase.js";
import type * as eventosEscolares from "../eventosEscolares.js";
import type * as grupos from "../grupos.js";
import type * as horarioPorClase from "../horarioPorClase.js";
import type * as horarios from "../horarios.js";
import type * as materias from "../materias.js";
import type * as padres from "../padres.js";
import type * as periodos from "../periodos.js";
import type * as personal from "../personal.js";
import type * as prospectos from "../prospectos.js";
import type * as salones from "../salones.js";
import type * as subdomains from "../subdomains.js";
import type * as tiposDeEventos from "../tiposDeEventos.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  alumnos: typeof alumnos;
  asistencias: typeof asistencias;
  calendario: typeof calendario;
  calificaciones: typeof calificaciones;
  catalogosDeClases: typeof catalogosDeClases;
  ciclosEscolares: typeof ciclosEscolares;
  clasesPorAlumno: typeof clasesPorAlumno;
  departamento: typeof departamento;
  escuelas: typeof escuelas;
  eventoPorClase: typeof eventoPorClase;
  eventosEscolares: typeof eventosEscolares;
  grupos: typeof grupos;
  horarioPorClase: typeof horarioPorClase;
  horarios: typeof horarios;
  materias: typeof materias;
  padres: typeof padres;
  periodos: typeof periodos;
  personal: typeof personal;
  prospectos: typeof prospectos;
  salones: typeof salones;
  subdomains: typeof subdomains;
  tiposDeEventos: typeof tiposDeEventos;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
