import { MessageSquare } from "lucide-react";
import { Point } from "@/hooks/use-image-annotations";

interface SidePanelProps {
  points: Point[];
  onPointSelect: (point: Point) => void;
}

export function SidePanel({ points, onPointSelect }: SidePanelProps) {
  const pointsWithSpecs = points.filter(p => p.specification);

  return (
    <div className="w-80 bg-background border-l border-border">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Especificaciones ({pointsWithSpecs.length})
        </h3>
      </div>

      <div className="h-full overflow-y-auto">
        {pointsWithSpecs.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hay especificaciones aún</p>
            <p className="text-xs mt-1">Haz doble clic en la imagen para añadir</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {pointsWithSpecs.map((point, index) => (
              <div 
                key={point.id} 
                className="p-3 rounded-lg bg-muted/30 relative cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onPointSelect(point)}
              >
                <div className="absolute -top-2 -left-2 w-6 h-6 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {index + 1}
                </div>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <span className="font-medium text-primary">
                    Punto {index + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date().toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="text-sm text-foreground whitespace-pre-wrap break-words">
                  {point.specification}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
