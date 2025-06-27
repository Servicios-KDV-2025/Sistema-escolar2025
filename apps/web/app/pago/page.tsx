// file: apps/web/app/pago/page.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card';
import { Button } from '@repo/ui/components/shadcn/button';
import { Input } from '@repo/ui/components/shadcn/input';
import { Label } from '@repo/ui/components/shadcn/label';
import { Alert, AlertDescription } from '@repo/ui/components/shadcn/alert';
import { useRouter, useSearchParams } from 'next/navigation';

const PagoPage = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [prospectoEmail, setProspectoEmail] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Obtener el email del prospecto desde los parámetros de URL o localStorage
    const emailFromUrl = searchParams.get('email');
    const emailFromStorage = localStorage.getItem('prospectoEmail');
    
    if (emailFromUrl) {
      setProspectoEmail(emailFromUrl);
    } else if (emailFromStorage) {
      setProspectoEmail(emailFromStorage);
    }
  }, [searchParams]);

  const handleInputChange = (field: string, value: string) => {
    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const activarEscuela = async (email: string) => {
    try {
      const response = await fetch('/api/prospectos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Limpiar el email del localStorage
        localStorage.removeItem('prospectoEmail');
        return data.escuela;
      } else {
        throw new Error(data.error || 'Error al activar la escuela');
      }
    } catch (error) {
      console.error('Error al activar escuela:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentStatus('idle');

    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Si el pago es exitoso y tenemos el email del prospecto, activar la escuela
      if (prospectoEmail) {
        await activarEscuela(prospectoEmail);
      }
      
      setIsProcessing(false);
      setPaymentStatus('success');
      
      // Redirigir a página de éxito después de 3 segundos
      setTimeout(() => {
        router.push('/pago/exito');
      }, 3000);
    } catch (error) {
      console.error('Error en el proceso de pago:', error);
      setIsProcessing(false);
      setPaymentStatus('error');
    }
  };

  const planDetails = {
    name: "Plan Básico - Sistema Escolar",
    price: "$99.99",
    period: "por mes",
    features: [
      "Gestión completa de estudiantes",
      "Calificaciones y reportes",
      "Comunicación con padres",
      "Soporte técnico incluido",
      "Actualizaciones automáticas"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Completar Pago
          </h1>
          <p className="text-gray-600">
            Estás a un paso de activar tu sistema escolar
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Resumen del Plan */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-xl">Resumen del Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">{planDetails.name}</span>
                <span className="text-2xl font-bold text-blue-600">
                  {planDetails.price}
                </span>
              </div>
              <p className="text-sm text-gray-500">{planDetails.period}</p>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Incluye:</h4>
                <ul className="space-y-2">
                  {planDetails.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center font-bold">
                  <span>Total a pagar:</span>
                  <span className="text-2xl text-blue-600">{planDetails.price}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulario de Pago */}
          <Card>
            <CardHeader>
              <CardTitle>Información de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentStatus === 'success' && (
                <Alert className="mb-4 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    ¡Pago procesado exitosamente! Tu escuela ha sido activada. Redirigiendo...
                  </AlertDescription>
                </Alert>
              )}

              {paymentStatus === 'error' && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    Error al procesar el pago. Por favor, intenta nuevamente.
                  </AlertDescription>
                </Alert>
              )}

              {!prospectoEmail && (
                <Alert className="mb-4 border-yellow-200 bg-yellow-50">
                  <AlertDescription className="text-yellow-800">
                    No se encontró información del prospecto. Asegúrate de haber completado el registro previo.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre en la tarjeta</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={cardData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number">Número de tarjeta</Label>
                  <Input
                    id="number"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardData.number}
                    onChange={(e) => handleInputChange('number', formatCardNumber(e.target.value))}
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Fecha de vencimiento</Label>
                    <Input
                      id="expiry"
                      type="text"
                      placeholder="MM/AA"
                      value={cardData.expiry}
                      onChange={(e) => handleInputChange('expiry', formatExpiry(e.target.value))}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      type="text"
                      placeholder="123"
                      value={cardData.cvc}
                      onChange={(e) => handleInputChange('cvc', e.target.value.replace(/\D/g, ''))}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isProcessing || !prospectoEmail}
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Procesando pago...
                      </div>
                    ) : (
                      `Pagar ${planDetails.price}`
                    )}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  🔒 Tu información de pago está protegida con encriptación SSL
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PagoPage;
