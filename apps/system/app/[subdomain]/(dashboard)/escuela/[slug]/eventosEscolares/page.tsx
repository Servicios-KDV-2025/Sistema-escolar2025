// app/escuela/[slug]/eventosEscolares/page.tsx
"use client";

import { TablaEventosEscolares } from "@/components/tabla-eventosEscolares";
export default function EventosEscolaresPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Gestión de Eventos Escolares</h1>
      <p className="text-muted-foreground mb-6">
        Aquí puedes ver y gestionar todos los eventos relacionados con la escuela.
        Haz clic en cualquier evento para ver sus detalles o crear uno nuevo.
      </p>
      <TablaEventosEscolares />
    </main>
  );
}