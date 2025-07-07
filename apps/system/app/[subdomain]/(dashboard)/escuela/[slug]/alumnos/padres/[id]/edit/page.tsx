"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'; //originalmente tenía:  '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react';

export default function EditPadrePage() {
  const { padreId } = useParams() as { padreId: Id<'padres'> };
  const searchParams = useSearchParams();
  const escuelaId = searchParams.get('escuelaId') as Id<'escuelas'>;
  const router = useRouter();

  const padre = useQuery(api.padres.obtenerPadrePorId, padreId ? { id: padreId } : "skip");
  const actualizarPadre = useMutation(api.padres.actualizarPadreConEscuela);

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    activo: true,
  });

  useEffect(() => {
    if (padre) {
      setFormData({
        nombre: padre.nombre || '',
        apellidos: padre.apellidos || '',
        email: padre.email || '',
        telefono: padre.telefono || '',
        direccion: padre.direccion || '',
        activo: padre.activo ?? true,
      });
    }
  }, [padre]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!padreId || !escuelaId) {
      alert('Falta información de ID.');
      return;
    }
    try {
      await actualizarPadre({
        id: padreId,
        escuelaId,
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email || undefined,
        telefono: formData.telefono || undefined,
        direccion: formData.direccion || undefined,
        activo: formData.activo,
      });
      alert('Padre actualizado correctamente');
      router.push(`/padres?escuelaId=${escuelaId}`);
    } catch (error: any) {
      alert('Error al actualizar: ' + error.message);
    }
  };

  if (!padre) {
    return (
      <div className="text-center py-10">
        Cargando información del padre...
      </div>
    );
  }

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-10 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Editar Padre</h1>
        </div>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-semibold text-center">Modificar Información</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-6">
            {[
              { label: 'Nombre', name: 'nombre', required: true },
              { label: 'Apellidos', name: 'apellidos', required: true },
              { label: 'Email (opcional)', name: 'email', type: 'email' },
              { label: 'Teléfono (opcional)', name: 'telefono', type: 'tel' },
            ].map(({ label, name, required, type = 'text' }) => (
              <div key={name} className="grid gap-2">
                <Label htmlFor={name}>{label}</Label>
                <Input
                  id={name}
                  name={name}
                  type={type}
                  value={(formData as any)[name]}
                  onChange={handleChange}
                  required={required}
                />
              </div>
            ))}

            <div className="grid gap-2">
              <Label htmlFor="direccion">Dirección (opcional)</Label>
              <Input
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="activo"
                name="activo"
                type="checkbox"
                checked={formData.activo}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <Label htmlFor="activo" className="text-green-700 font-medium">
                Padre activo
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/padres?escuelaId=${escuelaId}`)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Guardar Cambios
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}