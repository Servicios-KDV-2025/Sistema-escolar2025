// /app/escuela/[slug]/materias/page.tsx
"use client";

import { TablaMaterias } from "@/components/tabla-materias";

export default function MateriasPage() {
  return (
    <main className="container mx-auto py-5">
      <h1 className="text-3xl font-bold mb-6">Gestión de Materias</h1>
      <p className="text-muted-foreground mb-6">
        Aquí puedes ver y gestionar todas las materias impartidas en la escuela.
        Haz clic en cualquier materia para ver sus detalles o crear una nueva.
      </p>
      <div >
        <TablaMaterias />
      </div>
    </main>
  );
}
