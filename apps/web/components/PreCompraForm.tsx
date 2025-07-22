"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/components/shadcn/form'
import { Input } from '@repo/ui/components/shadcn/input'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React, { useState } from 'react'
import { Button } from '@repo/ui/components/shadcn/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
import { Alert, AlertDescription } from '@repo/ui/components/shadcn/alert'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
    nombre: z.string().min(2, {
        message: "El nombre debe tener al menos 2 caracteres.",
    }),
    nombreCorto: z.string().min(2, {
        message: "El nombre corto debe tener al menos 2 caracteres.",
    }),
    email: z.string().email({
        message: "Por favor ingresa un email válido.",
    }),
})

const PreCompraForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [countdown, setCountdown] = useState(2);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          nombre: "",
          nombreCorto: "",
          email: "",
        },
      })

      async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        setMessage(null);
        
        try {
          const response = await fetch('/api/prospectos', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          });

          const data = await response.json();

          if (response.ok) {
            console.log('Prospecto creado exitosamente:', data);
            setMessage({
              type: 'success',
              text: '¡Gracias! seras redirigido a la pagina de pago.'
            });
            form.reset();
            
            // Guardar el ID del prospecto en sessionStorage para usarlo en el pago
            if (data.prospecto) {
              sessionStorage.setItem('prospectoId', data.prospecto);
            }
            
            // Contador de redirección
            let count = 2;
            const countdownInterval = setInterval(() => {
              count--;
              setCountdown(count);
              if (count <= 0) {
                clearInterval(countdownInterval);
                router.push('/pago');
              }
            }, 1000);
          } else {
            console.error('Error al crear prospecto:', data.error);
            setMessage({
              type: 'error',
              text: data.error || 'Error al enviar la información. Por favor, intenta de nuevo.'
            });
          }
        } catch (error) {
          console.error('Error de red:', error);
          setMessage({
            type: 'error',
            text: 'Error de conexión. Por favor, verifica tu conexión a internet.'
          });
        } finally {
          setIsSubmitting(false);
        }
      }

    return (
        <div className="w-full ">
            {message && (
                <Alert className={`mb-6 border-2 ${
                    message.type === 'success' 
                        ? 'border-green-200 bg-green-50/80 backdrop-blur-sm' 
                        : 'border-red-200 bg-red-50/80 backdrop-blur-sm'
                }`}>
                    <AlertDescription className={`font-medium ${
                        message.type === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                        {message.text}
                        {message.type === 'success' && countdown > 0 && (
                            <span className="block text-sm mt-2 font-normal">
                                Redirigiendo en {countdown} segundo{countdown !== 1 ? 's' : ''}...
                            </span>
                        )}
                    </AlertDescription>
                </Alert>
            )}
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                            <FormItem className="group">
                                <FormLabel className="text-base font-semibold text-gray-700 mb-3 block">
                                    <span className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        Nombre de la Escuela
                                    </span>
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Ingresa el nombre completo de la escuela" 
                                        {...field} 
                                        className="h-12 px-4 text-base border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-lg bg-white/50 backdrop-blur-sm"
                                    />
                                </FormControl>
                                <FormDescription className="text-sm text-gray-500 mt-2">
                                    Nombre oficial de la institución educativa.
                                </FormDescription>
                                <FormMessage className="text-red-600 font-medium" />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="nombreCorto"
                        render={({ field }) => (
                            <FormItem className="group">
                                <FormLabel className="text-base font-semibold text-gray-700 mb-3 block">
                                    <span className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        Nombre Corto
                                    </span>
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Abreviatura o nombre corto" 
                                        {...field} 
                                        className="h-12 px-4 text-base border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 rounded-lg bg-white/50 backdrop-blur-sm"
                                    />
                                </FormControl>
                                <FormDescription className="text-sm text-gray-500 mt-2">
                                    Nombre abreviado o siglas de la escuela.
                                </FormDescription>
                                <FormMessage className="text-red-600 font-medium" />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="group">
                                <FormLabel className="text-base font-semibold text-gray-700 mb-3 block">
                                    <span className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        Correo Electrónico
                                    </span>
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="escuela@ejemplo.com" 
                                        type="email" 
                                        {...field} 
                                        className="h-12 px-4 text-base border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 rounded-lg bg-white/50 backdrop-blur-sm"
                                    />
                                </FormControl>
                                <FormDescription className="text-sm text-gray-500 mt-2">
                                    Email de contacto de la institución.
                                </FormDescription>
                                <FormMessage className="text-red-600 font-medium" />
                            </FormItem>
                        )}
                    />
                    
                    <div className="pt-4">
                        <Button 
                            type="submit" 
                            className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Enviando...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <span>🚀</span>
                                    Comenzar Configuración
                                </span>
                            )}
                        </Button>
                        
                        <p className="text-xs text-gray-500 text-center mt-4">
                            Al continuar, aceptas nuestros términos de servicio y política de privacidad.
                        </p>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default PreCompraForm