import { PersonalFormValues } from "@/app/shemas/personal" 
import { UseFormReturn } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@repo/ui/components/shadcn/form'
import { Input } from "@repo/ui/components/shadcn/input"
import { Select } from "@repo/ui/components/shadcn/select"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useEscuela } from "@/app/store/useEscuela"
import { Id } from "@/convex/_generated/dataModel"
import { Switch } from "@repo/ui/components/shadcn/switch"

interface PersonalFormProps {
  form: UseFormReturn<PersonalFormValues>
}

export function PersonalForm ({form}: PersonalFormProps) {
  const escuela = useEscuela((s) => s.escuela)
  const departamentos = useQuery(api.departamento.obtenerDepartamentos, escuela ? {escuelaId: escuela._id as Id<'escuelas'>} : 'skip')

  return(
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="departamentoId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Padres/Tutor</FormLabel>
            <FormControl>
              <Select
                {...field}
              >
                <option value="">Seleccionar Padres o Tutor</option>
                {departamentos?.map((departamento) => (
                  <option key={departamento._id} value={departamento._id}>
                    {departamento.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="nombre"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre</FormLabel>
            <FormControl>
              <Input type="text" {...field} placeholder="Nombre" />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="apellidos"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Apellidos</FormLabel>
            <FormControl>
              <Input type="text" {...field} placeholder="Apellidos" />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Correo electrónico</FormLabel>
            <FormControl>
              <Input type="email" {...field} placeholder="Correo electrónico" />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="telefono"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numero de telefono</FormLabel>
            <FormControl>
              <Input type='number' {...field} placeholder="Telefono" />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="maestro"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <input
                type="checkbox"
                checked={field.value}
                onChange={field.onChange}
                className="mt-1 h-4 w-4"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-medium">
                ¿Es maestro?
              </FormLabel>
              <p className="text-sm text-muted-foreground">
                Marca si este empleado será maestro.
              </p>
            </div>
          </FormItem>
        )}
      /> 
      <FormField
        control={form.control}
        name="fechaIngreso"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha de ingreso</FormLabel>
            <FormControl>
              <Input type='date' {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="activo"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Estado Activo</FormLabel>
              <div className="text-sm text-muted-foreground">
                Determina si el empleado está activo o inactivo
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value as boolean}
                onCheckedChange={(val) => field.onChange(val)}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}