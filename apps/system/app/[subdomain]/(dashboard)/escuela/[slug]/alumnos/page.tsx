'use client';

import { TablaAlumnos } from "../../../../../../components/tabla-alumnos";

export default function Page() {

    return (
        <main className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Alumnos</h1>
            <p className="text-muted-foreground mb-6">
                Haz clic en cualquier Alumnos para ver sus detalles completos,
                editarlo o eliminarlo. Para crear una nuevo Alumnos, usa el botón
                Nuevo Alumnos.
            </p>
            <TablaAlumnos />
        </main>
    );
}