"use client";

import { ImageDisplay } from "@/components/visor/image-display"
import { CommentsPanel } from "@/components/visor/comments-panel"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

export default function VisorPage() {
  const [showComments, setShowComments] = useState(true)

  return (
    <div className="w-full h-screen p-0 m-0 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 bg-card border-b">
        <h1 className="text-2xl font-bold">Visor de Imágenes</h1>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowComments(!showComments)}
          title={showComments ? "Ocultar comentarios" : "Mostrar comentarios"}
        >
          {showComments ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Área de la imagen */}
        <div className={`${showComments ? 'w-3/4' : 'w-full'} h-full transition-all duration-300`}>
          <ImageDisplay />
        </div>

        {/* Panel de comentarios */}
        {showComments && (
          <div className="w-1/4 h-full border-l border-border bg-background">
            <CommentsPanel />
          </div>
        )}
      </div>
    </div>
  )
}
