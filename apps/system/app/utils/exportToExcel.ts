import * as XLSX from "xlsx";

export function exportToExcel<T extends object>(
  data: T[],
  fileName = "reporte",
  sheetName = "Datos"
) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, (fileName+".xlsx"));
}
