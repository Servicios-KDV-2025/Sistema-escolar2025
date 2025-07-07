'use client'

import { DepartamentoCRUD } from '@/components/DepartamentoCRUD';

export default function DepartamentosPage() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Gestión de Departamentos</h1>
      <DepartamentoCRUD />
    </main>
  );
}
