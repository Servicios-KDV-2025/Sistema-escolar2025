"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import autoTable from "jspdf-autotable";
import type { HookData } from "jspdf-autotable";

import { useEscuela } from "@/app/store/useEscuelaStore";
import jsPDF from "jspdf";

// Mapeo de columna a función de extracción
export type ColumnDataMap<T> = {
  [columnHeader: string]: (data: T) => string | number | boolean | undefined;
};

// Props del generador genérico
export interface PDFGeneratorProps<T> {
  tableTitle: string;
  tableColumns: string[];
  tableData: T[];
  columnDataMap: ColumnDataMap<T>;
  fileName?: string;
  buttonText?: string;
  buttonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  primaryColor?: [number, number, number];
  secondaryColor?: [number, number, number];
}

// -------- COMPONENTE --------

export default function PDFGenerator<T>({
  tableTitle,
  tableColumns,
  tableData,
  columnDataMap,
  fileName,
  buttonText = "Generar PDF",
  buttonVariant = "secondary",
  primaryColor = [41, 128, 185], // azul
  secondaryColor = [52, 73, 94], // gris oscuro
}: PDFGeneratorProps<T>) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { escuela } = useEscuela();

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF();

      // --- ENCABEZADO DE LA ESCUELA ---
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text(escuela?.logoUrl || "E", 15, 20);
      doc.setFontSize(18);
      doc.text(escuela?.nombre || "Escuela sin nombre", 30, 20);

      doc.setFontSize(10);
      doc.text(escuela?.direccion || "Dirección no disponible", 15, 28);
      doc.text(
        `Tel: ${escuela?.telefono || "N/A"} | Email: ${escuela?.email || "N/A"}`,
        15,
        35
      );

      const fechaActual = new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.text(`Fecha del reporte: ${fechaActual}`, 140, 28);

      // --- TÍTULO DE LA TABLA ---
      doc.setTextColor(...secondaryColor);
      doc.setFontSize(16);
      doc.text(tableTitle.toUpperCase(), 15, 55);

      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(0.5);
      doc.line(15, 60, 195, 60);

      // --- DATOS DE LA TABLA ---
      const tableRows = tableData.map((row) =>
        tableColumns.map((columnHeader) => {
          const extractor = columnDataMap[columnHeader];
          if (!extractor) {
            console.warn(`No se definió extractor para: "${columnHeader}"`);
            return "N/A";
          }
          const value = extractor(row);
          return String(value ?? "N/A");
        })
      );

      // --- TABLA ---
      autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: 70,
        theme: "striped",
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 9,
          textColor: secondaryColor,
        },
        alternateRowStyles: {
          fillColor: [248, 249, 250],
        },
        margin: { left: 15, right: 15 },
        didDrawPage: (data: HookData) => {
          doc.setFontSize(8);
          doc.setTextColor(128, 128, 128);
          doc.text(
            `Página ${data.pageNumber} de ${data.pageCount}`,
            doc.internal.pageSize.width - 30,
            doc.internal.pageSize.height - 10
          );
          doc.text(
            `Generado por ${escuela?.nombre || "Sistema"}`,
            15,
            doc.internal.pageSize.height - 10
          );
        },
      });

      // --- GUARDAR PDF ---
      const defaultFileName = `${tableTitle.replace(/\s+/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      doc.save(fileName || defaultFileName);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Error al generar el PDF", {
        description:
          "Hubo un problema al crear el reporte. Intenta nuevamente.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={generatePDF}
      disabled={isGenerating}
      variant={buttonVariant}
    >
      {buttonText}
    </Button>
  );
}
