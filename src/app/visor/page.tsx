"use client";

import { ImageDisplay } from "@/components/visor/image-display"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

export default function VisorPage() {
  const [showSpecifications, setShowSpecifications] = useState(true)

  return (
    <div className="w-full h-screen p-0 m-0 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 bg-card border-b">
        <h1 className="text-2xl font-bold">Visor de Imágenes</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSpecifications(!showSpecifications)}
          title={showSpecifications ? "Ocultar especificaciones" : "Mostrar especificaciones"}
        >
          {showSpecifications ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-full h-full transition-all duration-300">
          <ImageDisplay showSpecificationsPanel={showSpecifications} />
        </div>
      </div>
    </div>
  )
}
