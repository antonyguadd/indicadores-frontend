"use client"

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Importa usePathname
import { LayoutDashboard, FileText, Settings, Menu, Bell, User, ChevronLeft, ChevronRight, Upload, FilePlus, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDarkMode } from "@/hooks/useDarkMode"; // Importa el hook

const navItems = [
  { icon: LayoutDashboard, label: "día,semana, mes, año", href: "/dashboard" },
  { icon: FileText, label: "Asignaciones y Cierre de Órdenes", href: "/assignment" },
  
  { icon: Settings, label: "Configuración", href: "#" },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [lineCount, setLineCount] = useState<number | null>(null);
  const [darkMode, toggleDarkMode] = useDarkMode(); // Usa el hook
  const pathname = usePathname(); // Usa usePathname

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      alert("Por favor, suba un archivo Excel válido.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Por favor, seleccione un archivo primero.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir el archivo');
      }

      const data = await response.json();
      
      setFilePath(data.file_path); // Guardar la ruta del archivo subido
      setLineCount(data.line_count); // Guardar el número de líneas
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      alert("Error al subir el archivo");
    }
  };

  const handleGenerate = async () => {
    if (!filePath) {
      alert("Por favor, suba un archivo primero.");
      return;
    }

    const formData = new FormData();
    formData.append('file_path', filePath);

    try {
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload_and_generate/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al generar el archivo');
      }

      const data = await response.json();
      
      window.location.href = data.download_url; // Redirigir a la URL de descarga
    } catch (error) {
      console.error("Error al generar el archivo:", error);
      alert("Error al generar el archivo");
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Barra lateral */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between h-16 border-b px-4 dark:border-gray-700">
          <span className={`text-2xl font-semibold ${sidebarOpen ? "block" : "hidden"} dark:text-white`}>Grupo LGB</span>
          <Button variant="ghost" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft className="w-6 h-6 dark:text-white" /> : <ChevronRight className="w-6 h-6 dark:text-white" />}
          </Button>
        </div>
        <nav className="mt-8">
          {navItems.map((item, index) => (
            <Link key={index} href={item.href} className={`flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${pathname === item.href ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
              <item.icon className="w-5 h-5 mr-3" />
              <span className={`${sidebarOpen ? "block" : "hidden"}`}>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Barra superior */}
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <Button variant="ghost" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-6 h-6 dark:text-white" />
          </Button>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="w-5 h-5 dark:text-white" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5 dark:text-white" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="ml-2">
                  <User className="w-5 h-5 mr-2 dark:text-white" />
                  <span className="dark:text-white"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Área de contenido principal */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <h3 className="mt-8 text-3xl font-medium text-gray-700 dark:text-gray-200">Indicadores por dia,semana,mes y año</h3>

            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
            
              <Card className="h-64 mt-20">
                <CardHeader>
                  <CardTitle>Subir Archivo Excel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <label className="w-full flex flex-col items-center px-4 py-6 bg-white dark:bg-gray-700 text-blue dark:text-white rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
                      <Upload className="w-8 h-8" />
                      <span className="mt-2 text-base leading-normal">Seleccionar Archivo</span>
                      <input type="file" accept=".xlsx" onChange={handleFileChange} className="hidden" />
                    </label>
                    {fileName && (
                      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{fileName}</p>
                    )}
                    <Button onClick={handleUpload} className="flex items-center mt-3">
                      <Upload className="mr-2" /> Subir Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-64 mt-20">
                <CardHeader>
                  <CardTitle>Contenido del Archivo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-full">
                    {fileName && lineCount !== null ? (
                      <p mt-50 className="mt-10 text-lg text-green-600 dark:text-green-400">Archivo: {fileName} - Líneas leídas: {lineCount}</p>
                    ) : (
                      <p className=" mt-10 text-lg text-red-700 dark:text-red-400">No se ha subido ningún archivo.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Acciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-around">
                    <Button onClick={handleGenerate} className="flex items-center bg-green-500 text-white hover:bg-green-700">
                      <FilePlus className="mr-2" /> Generar y Descargar Excel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}