"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card';
import { Button } from '@repo/ui/components/shadcn/button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PagoExitoPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="border-green-200 bg-white">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg 
                className="w-8 h-8 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <CardTitle className="text-2xl text-green-800">
              ¡Pago Exitoso!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-gray-600 text-lg">
                Tu pago ha sido procesado correctamente y tu cuenta ha sido activada.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">
                  Próximos pasos:
                </h3>
                <ul className="text-sm text-green-700 space-y-1 text-left">
                  <li>• Tu escuela ha sido creada exitosamente en el sistema</li>
                  <li>• Recibirás un email de confirmación en los próximos minutos con tus credenciales de acceso</li>
                  <li>• Puedes acceder al sistema usando el botón "Ir a iniciar Sesión"</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Información importante:
                </h3>
                <p className="text-sm text-blue-700">
                  Tu cuenta está ahora activa y lista para usar. Si tienes alguna pregunta o necesitas ayuda, 
                  no dudes en contactarnos a través de nuestro soporte técnico disponible 24/7.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => router.push('/')}
                variant="outline"
                className="w-full sm:w-auto cursor-pointer"
              >
                Volver al inicio
              </Button>
              <Button 
                asChild
                >
                    <Link href="/login">Ir a iniciar Sesion</Link>
                </Button>
            </div>

            <div className="text-xs text-gray-500 pt-4 border-t">
              <p>
                Número de transacción: TXN-{Date.now().toString().slice(-8)}
              </p>
              <p>
                Fecha: {new Date().toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PagoExitoPage; 