import { Button } from "@repo/ui/components/shadcn/button";
import Link from "next/link";


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button asChild >
        <Link href="/precompra">Iniciar Compra</Link>
      </Button>
    </div>
  );
}
