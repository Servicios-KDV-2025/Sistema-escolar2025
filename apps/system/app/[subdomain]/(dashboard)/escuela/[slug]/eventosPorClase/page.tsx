'use client';

import { TablaEventosPorClase } from "./tabla-eventosPorClases";

export default function Page() {

    return (
        <main className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Eventos por Clase</h1>
            <p className="text-muted-foreground mb-6">
                Haz clic en cualquier Evento para ver sus detalles completos,
                editarlo o eliminarlo. Para crear una nuevo Evento, usa el botón
                Nuevo Evento.
            </p>
            <TablaEventosPorClase />
        </main>
    );
}