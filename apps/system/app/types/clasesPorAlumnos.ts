import { GenericId } from "convex/values";
import { Alumno } from "../store/useAlumnoStore";
import { CatalogoDeClase } from "../store/useCatalogoDeClasesStore";
import { CicloEscolar } from "./cicloEscolar";

export interface ClasesPorAlumnos {
    _id: GenericId<"clasesPorAlumno">;
    escuelaId: GenericId<"escuelas">
    alumno: Alumno;
    catalogoClase: CatalogoDeClase
    cicloEscolar: CicloEscolar;
    fechaInscripcion: number;
    activo: boolean;
}

export interface EstadisticasInscripciones {
    totalInscripciones: number
    inscripcionesActivas: number
    totalAlumnos: number
    totalClases: number
    promedioClasesPorAlumno: string
  }