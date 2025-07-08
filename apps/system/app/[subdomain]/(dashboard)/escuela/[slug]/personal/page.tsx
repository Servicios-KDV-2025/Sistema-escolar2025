'use client'

import { PersonalCRUD } from "../../../../../../components/PersonalCRUD"

export default function Page() {
  return(
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Personal</h1>
        <p className="text-muted-foreground mb-6">
          Haz clic en cualquier Empleado para ver sus detalles completos,
          editarlo o eliminarlo. Para crear una nuevo Empleado, usa el botón
          Nuevo Empleado.
        </p>
        <PersonalCRUD />
    </main>
  )
}