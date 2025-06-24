import Image from "next/image";

// import Button from "@repo/ui/src/components/shadcn/button";

// import Button from "@repo/ui/src/components/shadcn/button";

export default function Home() {
  const secciones = [
    {
      title: "Sección 1",
      description: "Descripción de la sección 1",
      image: "/images/section1.png",
    },
    {
      title: "Sección 2",
      description: "Descripción de la sección 2",
      image: "/images/section2.png",
    },
    {
      title: "Sección 3",
      description: "Descripción de la sección 3",
      image: "/images/section3.png",
    },
  ];
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
       
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
