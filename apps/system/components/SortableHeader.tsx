import { TableHead } from "@repo/ui/components/shadcn/table";
import { cn } from "@/lib/utils";

type Props<T extends string> = {
  columna: T;
  label: string;
  ordenColumna: T | null;
  ordenAscendente: boolean;
  setOrdenColumna: (col: T) => void;
  setOrdenAscendente: (asc: boolean) => void;
  className?: string;
};

export default function SortableHeader<T extends string>({
  columna,
  label,
  ordenColumna,
  ordenAscendente,
  setOrdenColumna,
  setOrdenAscendente,
  className,
}: Props<T>) {
  const isActive = ordenColumna === columna;

  const toggleOrden = () => {
    if (isActive) {
      setOrdenAscendente(!ordenAscendente);
    } else {
      setOrdenColumna(columna);
      setOrdenAscendente(true);
    }
  };

  return (
    <TableHead
      onClick={toggleOrden}
      className={cn("cursor-pointer select-none", className)}
      aria-sort={
        isActive ? (ordenAscendente ? "ascending" : "descending") : "none"
      }
    >
      {label} {isActive && <span>{ordenAscendente ? "↑" : "↓"}</span>}
    </TableHead>
  );
}
