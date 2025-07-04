'use client';

import { TablaCatalogoClases } from "./tabla-cat-clases";

export default function Page() {

    return (
        <main className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Catalogo de Clases</h1>
            <p className="text-muted-foreground mb-6">
                Haz clic en cualquier Clase para ver sus detalles completos,
                editarlo o eliminarlo. Para crear una nueva Clase, usa el botón
                Nueva Clase.
            </p>
            <TablaCatalogoClases />
        </main>
    );
}