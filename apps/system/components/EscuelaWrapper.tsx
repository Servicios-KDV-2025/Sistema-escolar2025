"use client";

import { PropsWithChildren, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEscuela } from "@/app/store/useEscuela";

type Props = PropsWithChildren<{ slug: string }>;

export default function EscuelaWrapper({ slug, children }: Props) {
  const escuela = useQuery(api.escuelas.obtenerEscuelaPorNombre, {
    nombre: slug,
  });

  const setEscuela = useEscuela((s) => s.setEscuela);

  useEffect(() => {
    if (escuela ) {
      setEscuela(escuela);
    }
  }, [escuela, setEscuela]);

  if (!escuela) return <div>Cargando escuela...</div>;

  return <>{children}</>;
}
