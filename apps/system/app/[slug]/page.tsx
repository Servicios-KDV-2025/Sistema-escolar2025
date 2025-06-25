// app/[slug]/page.tsx
"use client";

import Image from "next/image";
import { useEscuela } from "../store/useEscuela";
import { useEffect } from "react";
import { useBreadcrumbStore } from "../store/breadcrumbStore";

export default function EscuelaHome() {
  const escuela = useEscuela((s) => s.escuela);
  const setItems = useBreadcrumbStore(state => state.setItems)

  useEffect(() => {
          if (escuela) {
              setItems([
                  { label: `${escuela?.nombre}` }
              ]);
          }
      }, [escuela, setItems]);

  if (!escuela) {
    return <div className="p-4">Cargando información de la escuela...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center space-x-4">
        {escuela.logoUrl && (
          <Image
            src={escuela.logoUrl}
            alt={"Logo de la escuela"}
            width={80}
            height={80}
            className="rounded"
          />
        )}
        <h1 className="text-2xl font-bold">{escuela.nombre}</h1>
      </div>

      <div className="text-gray-600">
        <p><strong>Dirección:</strong> {escuela.direccion || "No especificada"}</p>
        <p><strong>ID:</strong> {escuela._id}</p>
      </div>

      <div className="mt-6">
        <p>
          Bienvenido a la plataforma educativa de <strong>{escuela.nombre}</strong>. Desde aquí podrás gestionar calificaciones, alumnos, horarios y más.
        </p>
      </div>
    </div>
  );
}
