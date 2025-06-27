"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/components/shadcn/form'
import { Input } from '@repo/ui/components/shadcn/input'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React, { useState } from 'react'
import { Button } from '@repo/ui/components/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'
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
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Completa la información de tu escuela</CardTitle>
            </CardHeader>
            <CardContent>
                {message && (
                    <Alert className={`mb-4 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                        <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                            {message.text}
                            {message.type === 'success' && countdown > 0 && (
                                <span className="block text-sm mt-1">
                                    Redirigiendo en {countdown} segundo{countdown !== 1 ? 's' : ''}...
                                </span>
                            )}
                        </AlertDescription>
                    </Alert>
                )}
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre de la Escuela</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ingresa el nombre completo de la escuela" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Nombre oficial de la institución educativa.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nombreCorto"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre Corto</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Abreviatura o nombre corto" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Nombre abreviado o siglas de la escuela.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo Electrónico</FormLabel>
                                    <FormControl>
                                        <Input placeholder="escuela@ejemplo.com" type="email" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Email de contacto de la institución.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button 
                            type="submit" 
                            className="w-full cursor-pointer" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default PreCompraForm