"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons"

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, introduce un correo electrónico válido.",
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
})

export default function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setErrorMessage(null); // Reset error message
    console.log(values)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.email, // Asegúrate de que el campo 'username' esté presente
          email: values.email,
          password: values.password,
        }),
      })

      if (!response.ok) {
        throw new Error('Error de registro')
      }

      const data = await response.json()
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)

      router.push("/dashboard")
    } catch (error) {
      let errorMessage = "Ocurrió un error inesperado"
      if (error instanceof Error) {
        errorMessage = error.message
      }
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold text-center text-white mb-4">GRUPO LGB</h1>
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Regístrate</h2>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-white mb-2">Correo Electrónico</label>
            <div className="relative">
              <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-gray-400" />
              <input id="email" placeholder="tu@ejemplo.com" {...form.register("email")} className="w-full pl-10 pr-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-white mb-2">Contraseña</label>
            <div className="relative">
              <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-gray-400" />
              <input id="password" type="password" placeholder="••••••••" {...form.register("password")} className="w-full pl-10 pr-4 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          <button type="submit" className="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-200" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Regístrate"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-gray-400">
            ¿Ya tienes una cuenta? <Link href="/login" className="text-blue-500 hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}