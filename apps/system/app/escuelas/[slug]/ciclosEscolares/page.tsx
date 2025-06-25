import { TablaCiclosEscolares } from "@/components/tabla-ciclosEscolares";

export default function CiclosEscolaresPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Sistema de Ciclos Escolares</h1>
      <p className="text-muted-foreground mb-6">
        Haz clic en cualquier ciclo escolar para ver sus detalles completos,
        editarlo o eliminarlo. Para crear una nueva ciclo escolar, usa el botón
        Nueva Ciclo Escolar.
      </p>
      <TablaCiclosEscolares />
    </main>
  );
}