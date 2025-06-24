// types/escuela.ts
import { Id } from '../convex/_generated/dataModel'; // Importa Id si necesitas referenciar IDs de Convex

export interface Escuela {
  _id: Id<'escuelas'>; // ID generado por Convex, tipado para la tabla 'escuelas'
  _creationTime: number; // Tiempo de creación generado por Convex
  nombre: string;
  direccion: string;
  telefono?: string; // Los campos opcionales en Convex deben ser opcionales aquí también
  email?: string;
  director?: string;
  activa: boolean;
}