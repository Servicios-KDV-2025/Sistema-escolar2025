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
import type * as ciclosEscolares from "../ciclosEscolares.js";
import type * as escuelas from "../escuelas.js";
import type * as eventoPorClase from "../eventoPorClase.js";
import type * as grupos from "../grupos.js";

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
  ciclosEscolares: typeof ciclosEscolares;
  escuelas: typeof escuelas;
  eventoPorClase: typeof eventoPorClase;
  grupos: typeof grupos;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
