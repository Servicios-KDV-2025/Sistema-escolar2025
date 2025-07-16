"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/shadcn/card";
import { ExternalLink, Globe, Calendar } from "lucide-react";
import { protocol, rootDomain } from "@/lib/utils";

interface Subdomain {
  subdomain: string;
  createdAt: number;
}

export default function ListaSubdominios() {
  const subdomains = useQuery(api.subdomains.getAllSubdomains);

  if (subdomains === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (subdomains.length === 0) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardDescription>
            No hay subdominios registrados en el sistema
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subdomains.map((subdomain: Subdomain) => (
          <Card key={subdomain.subdomain} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-4 w-4" />
                {subdomain.subdomain}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 text-sm">
                <Calendar className="h-3 w-3" />
                Creado: {new Date(subdomain.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-2 w-full">
                <Button 
                  asChild 
                  className="w-1/2"
                >
                  <a 
                    href={`${protocol}://${subdomain.subdomain}.${rootDomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 justify-center"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visitar
                  </a>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="w-1/2"
                >
                  <a
                    href={`${protocol}://${subdomain.subdomain}.${rootDomain}/inicio`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 justify-center"
                  >
                    <Globe className="h-4 w-4" />
                    Panel Administrativo
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 mt-8">
        Total: {subdomains.length} subdominio{subdomains.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
} 