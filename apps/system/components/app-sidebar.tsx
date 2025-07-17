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
import { useEscuela } from "@/app/store/useEscuelaStore"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { escuela } = useEscuela();

  const data = {
  user: {
    name: escuela?.nombre ?? "",
    email: escuela?.email ?? "",
    avatar: escuela?.logoUrl ?? "",
  },
  navMain: [
    {
      title: "Ciclos Escolares",
      url: `/ciclosEscolares`,
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Ciclos Escolares",
          url: `/ciclosEscolares`,
        },
        {
          title: "Calendario Escolar",
          url: `/calendario`,
        },
        {
          title: "Clases por Alumno",
          url: `/clasesPorAlumnos`,
        },
        {
          title: "Grupos",
          url: `/grupos`,
        },
        {
          title: "Catalogo de Clases",
          url: `/catalogoDeClases`,
        },
        {
          title: "Eventos Por Clase",
          url: `/eventosPorClase`,
        },
        {
          title: "Eventos Escolares",
          url: `/eventosEscolares`,
        },
      ],
    },
    {
      title: "Salones",
      url: `/salones`,
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Materias",
      url: `/materias`,
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
      url: `/departamentos`,
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Personal",
      url: `/personal`,
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Periodos",
      url: `/periodos`,
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Periodos por Clase",
      url: `/periodosPorClase`,
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Alumnos",
      url: `/alumnos`,
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Calificaciones",
      url: `/calificaciones`,
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Calificaciones",
          url: `/calificaciones`,
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
      url: `/padres`,
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
