// types/escuela.ts
import { Id } from '../convex/_generated/dataModel';

export interface Escuela {
  _id: Id<'escuelas'>;
  nombre: string;
  nombreCorto: string;
  email?: string;
  telefono?: string;
  director?: string;
  descripcion?: string;
  direccion?: string;
  logoUrl?: string;
  activa: boolean;
}