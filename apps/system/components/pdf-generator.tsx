"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

// @ts-ignore
import autoTable from "jspdf-autotable";
// @ts-ignore
import type { HookData } from "jspdf-autotable";


import jsPDF from "jspdf";

// Tipos
export interface SchoolInfo {
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  logo?: string;
}

export interface MateriaTableData {
  _id: string;
  nombre: string;
  descripcion?: string;
  creditos?: number;
  activa: boolean;
}

export type ColumnDataMap = {
  [columnHeader: string]: (
    data: MateriaTableData
  ) => string | number | boolean | undefined;
};

interface PDFGeneratorProps {
  schoolInfo: SchoolInfo;
  tableTitle: string;
  tableColumns: string[];
  tableData: MateriaTableData[];
  columnDataMap: ColumnDataMap;
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

export default function PDFGenerator({
  schoolInfo,
  tableTitle,
  tableColumns,
  tableData,
  columnDataMap,
  fileName,
  buttonText = "Generar PDF",
  buttonVariant = "default",
  primaryColor = [41, 128, 185],
  secondaryColor = [52, 73, 94],
}: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF();

      // --- ENCABEZADO DE LA ESCUELA ---
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text(schoolInfo.logo || "🎓", 15, 20);
      doc.setFontSize(18);
      doc.text(schoolInfo.nombre, 30, 20);

      doc.setFontSize(10);
      doc.text(schoolInfo.direccion || "Dirección no disponible", 15, 28);
      doc.text(
        `Tel: ${schoolInfo.telefono || "N/A"} | Email: ${schoolInfo.email || "N/A"}`,
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
            console.warn(
              `No se definió un extractor para la columna: "${columnHeader}".`
            );
            return "N/A";
          }
          const value = extractor(row);
          return String(value ?? "N/A");
        })
      );

      // --- GENERAR TABLA USANDO autoTable(doc, options) ---
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
            `Generado por ${schoolInfo.nombre || "Sistema"}`,
            15,
            doc.internal.pageSize.height - 10
          );
        },
      });

      // --- DESCARGA DEL PDF ---
      const defaultFileName = `${tableTitle.replace(/\s+/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName || defaultFileName);
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toast.error("Error al generar el PDF.", {
        description:
          "Hubo un problema inesperado al crear el reporte. Por favor, intenta de nuevo.",
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
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {isGenerating ? "Generando PDF..." : buttonText}
    </Button>
  );
}
