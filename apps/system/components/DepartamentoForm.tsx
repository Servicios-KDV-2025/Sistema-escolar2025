// file: apps/system/components/DepartamentoForm.tsx
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { DepartamentoFormValues } from '@/app/shemas/departamento'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/shadcn/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@repo/ui/components/shadcn/textarea'
import { Switch } from '@repo/ui/components/shadcn/switch'

interface DepartamentoFormProps {
  form: UseFormReturn<DepartamentoFormValues>
}

export function DepartamentoForm({ form }: DepartamentoFormProps) {
  return (
    <div className="space-y-6">
      {/* Nombre */}
      <FormField
        control={form.control}
        name="nombre"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre del Departamento</FormLabel>
            <FormControl>
              <Input
                placeholder="Ingresa el nombre del departamento"
                {...field}
                // <-- nunca undefined
                value={field.value ?? ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Descripción */}
      <FormField
        control={form.control}
        name="descripcion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descripción</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe el departamento (opcional)"
                className="resize-none"
                {...field}
                // <-- nunca undefined
                value={field.value ?? ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Activo */}
      <FormField
        control={form.control}
        name="activo"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Estado Activo</FormLabel>
              <div className="text-sm text-muted-foreground">
                Determina si el departamento está activo o inactivo
              </div>
            </div>
            <FormControl>
              <Switch
                // <-- nunca undefined
                checked={field.value ?? false}
                onCheckedChange={(val) => field.onChange(val)}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}