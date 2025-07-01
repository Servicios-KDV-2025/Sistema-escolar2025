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
import type * as calendario from "../calendario.js";
import type * as catalogosDeClases from "../catalogosDeClases.js";
import type * as ciclosEscolares from "../ciclosEscolares.js";
import type * as departamento from "../departamento.js";
import type * as escuelas from "../escuelas.js";
import type * as eventoPorClase from "../eventoPorClase.js";
import type * as eventosEscolares from "../eventosEscolares.js";
import type * as grupos from "../grupos.js";
import type * as materias from "../materias.js";
import type * as periodoporClase from "../periodoporClase.js";
import type * as periodos from "../periodos.js";
import type * as prospectos from "../prospectos.js";
import type * as salones from "../salones.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  calendario: typeof calendario;
  catalogosDeClases: typeof catalogosDeClases;
  ciclosEscolares: typeof ciclosEscolares;
  departamento: typeof departamento;
  escuelas: typeof escuelas;
  eventoPorClase: typeof eventoPorClase;
  eventosEscolares: typeof eventosEscolares;
  grupos: typeof grupos;
  materias: typeof materias;
  periodoporClase: typeof periodoporClase;
  periodos: typeof periodos;
  prospectos: typeof prospectos;
  salones: typeof salones;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
