import { ImageDisplay } from "@/components/visor/image-display"

export default function VisorPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Visor de Imágenes</h1>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <ImageDisplay />
        </div>
      </div>
    </div>
  )
}
