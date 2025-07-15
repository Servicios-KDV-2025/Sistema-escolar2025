// types/jspdf-autotable.d.ts

declare module "jspdf-autotable" {
  import { jsPDF } from "jspdf";

  // Define tipos más estrictos para estilos de celda
  export interface Styles {
    font?: string;
    fontStyle?: string;
    overflow?: "linebreak" | "ellipsize" | "visible" | "hidden";
    fillColor?: number[] | false;
    textColor?: number[] | false;
    cellPadding?: number | { top?: number; right?: number; bottom?: number; left?: number };
    lineColor?: number[] | false;
    lineWidth?: number | { top?: number; right?: number; bottom?: number; left?: number };
    fontSize?: number;
    halign?: "left" | "center" | "right";
    valign?: "top" | "middle" | "bottom";
    rowHeight?: number;
    columnWidth?: "auto" | "wrap" | number;
  }

  // Tipos opcionales para los objetos internos de HookData
  export interface AutoTableCursor {
    x: number;
    y: number;
  }

  export interface AutoTableHookTable {
    columns: unknown[]; // puedes reemplazar con un tipo más específico si sabes cómo es
    rows: unknown[]; // igual que arriba
    // agrega más propiedades si las necesitas
  }

  export interface AutoTableSettings {
    margin?: { top: number; bottom: number; left: number; right: number };
    // agrega más si usas más props de settings
  }

  // HookData que se pasa a didDrawPage
  export interface HookData {
    pageNumber: number;
    pageCount: number;
    cursor: AutoTableCursor;
    table: AutoTableHookTable;
    settings: AutoTableSettings;
    doc: jsPDF;
  }

  // Configuración completa para autoTable
  export interface UserOptions {
    head?: string[][];
    body?: string[][];
    foot?: string[][];
    startY?: number;
    margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
    theme?: "striped" | "grid" | "plain";
    styles?: Styles;
    headStyles?: Styles;
    bodyStyles?: Styles;
    footStyles?: Styles;
    alternateRowStyles?: Styles;
    columnStyles?: { [key: number]: Styles };
    tableLineColor?: number[] | false;
    tableLineWidth?: number;
    showHead?: "everyPage" | "firstPage" | "never";
    showFoot?: "everyPage" | "lastPage" | "never";
    didDrawPage?: (data: HookData) => void;
    willDrawCell?: (data: unknown) => void;
    didDrawCell?: (data: unknown) => void;
    [key: string]: unknown; // para propiedades adicionales
  }

  // Plugin de entrada
  export default function autoTable(doc: jsPDF, options: UserOptions): void;
}
