"use client";
import { TablaDepartamentos } from "@/components/tabla-departamentos";

export default function DepartamentosPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Gestión de Departamentos</h1>
      <p className="text-muted-foreground mb-6">
        Aquí puedes ver y gestionar todos los departamentos de la escuela.
        Haz clic en cualquier departamento para ver sus detalles o crear uno nuevo.
      </p>
      <TablaDepartamentos />
    </main>
  );
}