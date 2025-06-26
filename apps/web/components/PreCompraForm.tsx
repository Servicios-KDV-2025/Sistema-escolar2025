"use client"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@repo/ui/components/shadcn/form'
import { Input } from '@repo/ui/components/shadcn/input'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React from 'react'
import { Button } from '@repo/ui/components/shadcn/button'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/shadcn/card'

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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          nombre: "",
          nombreCorto: "",
          email: "",
        },
      })

      function onSubmit(values: z.infer<typeof formSchema>) {

        //aqui añadiremos nuestra logica para enviar los datos a la tabla de prospectos
        console.log(values)
        
        // Limpiar el formulario después del envío
        form.reset()
      }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Completa la información de tu escuela</CardTitle>
            </CardHeader>
            <CardContent>
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
                        <Button type="submit" className="w-full cursor-pointer">Enviar</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default PreCompraForm