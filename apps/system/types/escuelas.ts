// types/escuela.ts
import { Id } from '../convex/_generated/dataModel';

export interface Escuela {
  _id: Id<'escuelas'>;
  _creationTime: number; 
  nombre: string;
  direccion: string;
  telefono?: string; 
  email?: string;
  director?: string;
  activa: boolean;
}