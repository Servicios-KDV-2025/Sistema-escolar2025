"use client"

import * as React from "react"
import {
  // BookOpen,
  // Bot,
  Command,
  // Frame,
  LifeBuoy,
  // Map,
  // PieChart,
  Send,
  // Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useParams } from "next/navigation"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Ciclos Escolares",
      url: `/escuela/${slug}/ciclosEscolares`,
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Ciclos Escolares",
          url: `/escuela/${slug}/ciclosEscolares`,
        },
        {
          title: "Calendario Escolar",
          url: `/escuela/${slug}/calendario`,
        },
        {
          title: "Grupos",
          url: `/escuela/${slug}/grupos`,
        },
        {
          title: "Catalogo de Clases",
          url: `/escuela/${slug}/catalogoDeClases`,
        },
        {
          title: "Eventos Por Clase",
          url: `/escuela/${slug}/eventosPorClase`,
        },
        {
          title: "Eventos Escolares",
          url: `/escuela/${slug}/eventosEscolares`,
        },
      ],
    },
    {
      title: "Salones",
      url: `/escuela/${slug}/salones`,
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Materias",
      url: `/escuela/${slug}/materias`,
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Materias",
          url: `/escuela/${slug}/materias`,
        },
      ],
    },
    {
      title: "Departamentos",
      url: `/escuela/${slug}/departamentos`,
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Personal",
      url: `/escuela/${slug}/personal`,
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Periodos",
      url: `/escuela/${slug}/periodos`,
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Periodos por Clase",
      url: `/escuela/${slug}/periodosPorClase`,
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Alumnos",
      url: `/escuela/${slug}/alumnos`,
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Calificaciones",
      url: `/escuela/${slug}/calificaciones`,
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Calificaciones",
          url: `/escuela/${slug}/calificaciones`,
        },
        {
          title: "Crear Calificación",
          url: `/escuela/${slug}/calificaciones/create?escuelaId=${slug}`,
        },
      ],
    },
/* 
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    }, */
        {
      title: "Padres",
      url: `/escuela/${slug}/padres`,
      icon: SquareTerminal,
      isActive: true,
    },

  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
 /*  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ], */
}
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
