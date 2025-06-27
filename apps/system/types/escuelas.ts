// types/escuela.ts
import { Id } from '../convex/_generated/dataModel';

export interface Escuela {
  _id: Id<'escuelas'>;
  nombre: string;
  activa: boolean;
}