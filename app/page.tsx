// app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // Redirigir automáticamente al Dashboard
  redirect("/dashboard");

  return null; // No hay contenido que renderizar aquí
}
