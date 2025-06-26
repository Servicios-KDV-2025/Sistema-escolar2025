// src/pages/materias/[materiaId]/edit/page.tsx
"use client"; // Esencial para componentes de cliente en Next.js

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // <<-- IMPORTANTE: Para Pages Router
import { useSearchParams } from 'next/navigation'; // Para acceder a query params como escuelaId
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api'; // <<-- AJUSTA ESTA RUTA SI ES NECESARIO
import { Id } from '@/convex/_generated/dataModel'; // <<-- AJUSTA ESTA RUTA SI ES NECESARIO
import { useEscuela } from '@/app/store/useEscuela';

export default function EditMateriaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Obtener el materiaId de la URL usando useRouter().query
  // Si la página aún no está lista (ej. en la primera renderización del lado del servidor),
  // router.query puede estar vacío. useRouter().isReady ayuda a manejar esto.
  const { materiaId } = router.query as { materiaId: Id<'materias'> };

  // Obtener el escuelaId de los parámetros de búsqueda de la URL
  const urlEscuelaId = searchParams.get('escuelaId') as Id<'escuelas'> | null;

  // 1. Obtener la materia actual para editar desde Convex
  const materiaToEdit = useQuery(
    api.filtroes.materias.obtenerMateriaPorIdConEscuela
  );

  // 2. Obtener la escuela (para mostrar el nombre en el encabezado)
  const { escuela: zustandEscuela } = useEscuela(); // Intentar obtener de Zustand primero
  const fetchedEscuela = useQuery(
    api.escuelas.obtenerEscuelaPorId,
    // Si no está en Zustand Y tenemos un ID de escuela en la URL, la obtenemos de Convex
    (router.isReady && zustandEscuela === null && urlEscuelaId !== null) ? { id: urlEscuelaId } : "skip"
  );
  // La escuela que usaremos: Zustand > fetched de Convex > null
  const escuelaEnUso = zustandEscuela || fetchedEscuela;

  // 3. Mutación para actualizar la materia en Convex
  const actualizarMateria = useMutation(api.materias.actualizarMateriaConEscuela);

  // Estado local para los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    creditos: 0,
    activa: true,
  });

  // 4. Efecto para prellenar el formulario cuando los datos de la materia se cargan
  useEffect(() => {
    if (materiaToEdit) {
      setFormData({
        nombre: materiaToEdit.nombre,
        descripcion: materiaToEdit.descripcion || '', // Asegura un string vacío si es undefined
        creditos: materiaToEdit.creditos || 0,        // Asegura 0 si es undefined
        activa: materiaToEdit.activa,
      });
    }
  }, [materiaToEdit]); // Se ejecuta cada vez que materiaToEdit cambia

  // Manejador de cambios en los inputs del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value),
    }));
  };

  // Manejador del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recarga de página)

    if (!materiaId) {
      alert('Error: ID de materia no encontrado para actualizar.');
      return;
    }
    if (!escuelaEnUso?._id) {
        alert('Error: No se puede actualizar sin una escuela asociada válida.');
        return;
    }

    try {
      await actualizarMateria({
        id: materiaId,
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined, // Envía undefined si está vacío para campos opcionales
        creditos: formData.creditos || undefined,       // Envía undefined si es 0 o vacío
        activa: formData.activa,
      });
      alert('Materia actualizada con éxito!');
      // Redirige de vuelta a la lista de materias de la misma escuela
      router.push(`/materias?escuelaId=${escuelaEnUso._id}`);
    } catch (error) {
      alert('Error al actualizar materia: ' + error);
    }
  };

  // --- Manejo de estados de carga y errores ---
  // router.isReady asegura que router.query ya esté poblado con los parámetros de la URL
  if (!router.isReady || !materiaId || !urlEscuelaId || escuelaEnUso === undefined || materiaToEdit === undefined) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.2em', color: '#555' }}>
        Cargando datos de la materia o de la escuela...
      </div>
    );
  }

  // Si la materia no fue encontrada
  if (materiaToEdit === null) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545', fontSize: '1.2em' }}>
        Materia no encontrada. El ID proporcionado no corresponde a ninguna materia.
        <br/>
        <button onClick={() => router.push(`/materias?escuelaId=${urlEscuelaId}`)} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}>
            Volver a Materias
        </button>
      </div>
    );
  }

  // Si la escuela asociada no fue encontrada
  if (escuelaEnUso === null) {
      return (
          <div style={{ padding: '20px', textAlign: 'center', color: '#dc3545', fontSize: '1.2em' }}>
              La escuela asociada a esta materia no fue encontrada.
              <br/>
              <button onClick={() => router.push('/escuelas')} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1em' }}>
                  Ir a Escuelas
              </button>
          </div>
      );
  }

  // Si todo está cargado y es válido, muestra el formulario
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        Editar Materia: {materiaToEdit.nombre} para {escuelaEnUso.nombre}
      </h1>

      <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '25px', borderRadius: '8px', backgroundColor: '#f9f9f9', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="nombre" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre de la Materia:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="descripcion" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descripción (opcional):</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={4}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box', resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="creditos" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Créditos (opcional):</label>
          <input
            type="number"
            id="creditos"
            name="creditos"
            value={formData.creditos}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
            <input
              type="checkbox"
              id="activa"
              name="activa"
              checked={formData.activa}
              onChange={handleChange}
              style={{ marginRight: '10px', transform: 'scale(1.2)' }}
            />
            Materia Activa
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => router.push(`/materias?escuelaId=${escuelaEnUso._id}`)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1em',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5a6268')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6c757d')}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1em',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#218838')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#28a745')}
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}