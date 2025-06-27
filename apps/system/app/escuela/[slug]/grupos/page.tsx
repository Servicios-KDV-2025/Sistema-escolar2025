'use client';

import { TablaGrupos } from "./tabla-grupos";

export default function Page() {

    return (
        <main className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Grupo</h1>
            <p className="text-muted-foreground mb-6">
                Haz clic en cualquier Grupo para ver sus detalles completos,
                editarlo o eliminarlo. Para crear una nuevo Grupo, usa el botón
                Nuevo Grupo.
            </p>
            <TablaGrupos />
        </main>
    );
}