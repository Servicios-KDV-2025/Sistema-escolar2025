import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import EscuelaWrapper from "@/components/EscuelaWrapper";

export const dynamic = "force-dynamic";

export default async function EscuelaLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string };
}) {
  const awaitedParams = await params;

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <EscuelaWrapper slug={awaitedParams?.slug ?? ""}>{children}</EscuelaWrapper>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
