import { Point } from "@/hooks/use-image-annotations";

interface PointMarkerProps {
  point: Point;
  isActive: boolean;
  onClick: (id: number, e: React.MouseEvent) => void;
  pointNumber: number;
}

export function PointMarker({ point, isActive, onClick, pointNumber }: PointMarkerProps) {
  return (
    <div
      className={`absolute w-6 h-6 flex items-center justify-center rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
        isActive
          ? 'bg-primary border-primary shadow-lg scale-125 z-20'
          : 'bg-background border-primary hover:scale-110 z-10'
      }`}
      style={{
        left: `${point.x}%`,
        top: `${point.y}%`,
      }}
      onClick={(e) => onClick(point.id, e)}
      title={isActive ? "Ctrl+Click para cancelar" : `Punto ${pointNumber} - Ctrl+Click para eliminar`}
    >
      <span className={`text-xs font-bold ${
        isActive ? 'text-primary-foreground' : 'text-primary'
      }`}>
        {pointNumber}
      </span>
    </div>
  );
}
