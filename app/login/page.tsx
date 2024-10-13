"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, introduce un correo electrónico válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
})

export default function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    console.log(values)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push("/dashboard")
      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de vuelta!",
      })
    } catch (error) {
      let errorMessage = "Ocurrió un error inesperado"
      if (error instanceof Error) {
        errorMessage = error.message
      }
      toast({
        title: "Error de inicio de sesión",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-8 bg-modern-background p-6 rounded-lg shadow-lg">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-modern-primary">Iniciar Sesión</h1>
        <p className="text-modern-textSecondary">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-modern-textPrimary">Correo Electrónico</FormLabel>
                <FormControl>
                  <Input placeholder="tu@ejemplo.com" {...field} className="border-modern-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-modern-textPrimary">Contraseña</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} className="border-modern-primary" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-modern-primary text-white hover:bg-modern-secondary" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
      </Form>
    </div>
  )
}