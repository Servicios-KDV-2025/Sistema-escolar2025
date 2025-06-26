// src/pages/materias.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEscuela } from "@/app/store/useEscuela";
import { useRouter } from "next/navigation";

// Define la interfaz de una Materia
interface Materia {
  _id: Id<"materias">;
  escuelaId: Id<"escuelas">;
  nombre: string;
  descripcion?: string;
  creditos?: number;
  activa: boolean;
  _creationTime: number;
}


export default function MateriasPage() {
  const searchParams = useSearchParams();
  const urlEscuelaId = searchParams.get("escuelaId") as Id<"escuelas"> | null;
  const router = useRouter();

  const handleEditClick = (materiaId: Id<'materias'>, escuelaId: Id<'escuelas'>) => {
  router.push(`/materias/${materiaId}/edit?escuelaId=${escuelaId}`);
};
const handleDeleteMateria = async (id: Id<'materias'>) => {
  if (window.confirm('¿Estás seguro de que quieres eliminar esta materia?')) {
    try {
      // NOTA: Si tu api es api.materias.materias, cambia a api.materias.materias.eliminarMateriaSinEscuela
      await eliminarMateria({ id });
      alert('Materia eliminada con éxito!');
    } catch (error) {
      alert('Error al eliminar materia: ' + error);
    }
  }
};

  const { escuela: escuelaEnUso } = useEscuela();

  const materias = useQuery(
    api.materias.obtenerMateriasPorEscuela,
    escuelaEnUso?._id ? { escuelaId: escuelaEnUso._id } : "skip"
  );
  const eliminarMateria = useMutation(api.materias.eliminarMateriaConEscuela);

  const handleAddMateriaClick = () => {
    if (escuelaEnUso?._id) {
      // Navega a la página de creación, pasando el ID de la escuela
      router.push(`/materias/create?escuelaId=${escuelaEnUso._id}`);
    } else {
      alert("Error: No hay una escuela seleccionada para agregar una materia.");
    }
  };

  // Manejo de carga y errores
  if (urlEscuelaId === null && escuelaEnUso === null) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#dc3545" }}>
        No se ha seleccionado una escuela. Por favor, selecciona una desde la
        página de Escuelas.
      </div>
    );
  }

  if (escuelaEnUso === undefined || materias === undefined) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Cargando materias para{" "}
        {escuelaEnUso?.nombre || "la escuela seleccionada"}...
      </div>
    );
  }

  if (escuelaEnUso === null) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#dc3545" }}>
        La escuela seleccionada no fue encontrada.
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "900px",
        margin: "auto",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
        Materias de la Escuela: {escuelaEnUso.nombre}
      </h1>

      {/* Botón para Agregar Materia */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={handleAddMateriaClick}
          style={{
            padding: "12px 25px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1.1em",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            transition: "background-color 0.3s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#0056b3")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#007bff")
          }
        >
          Agregar Materia
        </button>
      </div>

      {materias.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>
          No hay materias registradas para esta escuela.
        </p>
      ) : (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {materias.map((materia: Materia) => (
            <div
              key={materia._id}
              style={{
                borderBottom: "1px solid #eee",
                padding: "10px 0",
                marginBottom: "10px",
                backgroundColor: materia.activa ? "#ffffff" : "#f0f0f0",
                opacity: materia.activa ? 1 : 0.7,
              }}
            >
              <h3
                style={{
                  fontSize: "1.2em",
                  margin: "0 0 5px 0",
                  color: "#0056b3",
                }}
              >
                {materia.nombre}
              </h3>
              {materia.descripcion && (
                <p
                  style={{
                    fontSize: "0.9em",
                    color: "#555",
                    margin: "0 0 5px 0",
                  }}
                >
                  **Descripción:** {materia.descripcion}
                </p>
              )}
              {materia.creditos && (
                <p
                  style={{
                    fontSize: "0.9em",
                    color: "#555",
                    margin: "0 0 5px 0",
                  }}
                >
                  **Créditos:** {materia.creditos}
                </p>
              )}
              <p
                style={{
                  fontSize: "0.9em",
                  color: materia.activa ? "#28a745" : "#dc3545",
                  fontWeight: "bold",
                  margin: "0",
                }}
              >
                Estado: {materia.activa ? "Activa" : "Inactiva"}
              </p>
               <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button
                  onClick={() => handleEditClick(materia._id,escuelaEnUso._id)}
                  style={{
                    flex: 1,
                    padding: "10px 15px",
                    backgroundColor: "#ffc107",
                    color: "black",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteMateria(materia._id)}
                  style={{
                    flex: 1,
                    padding: "10px 15px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
            
          ))}
        </div>
      )}
    </div>
  );
}
