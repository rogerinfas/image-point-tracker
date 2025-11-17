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
      className={`absolute w-4 h-4 rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
        isActive
          ? 'bg-primary border-primary shadow-lg scale-125 z-20'
          : 'bg-background border-primary hover:scale-110 z-10'
      }`}
      style={{
        left: `${point.x}%`,
        top: `${point.y}%`,
      }}
      onClick={(e) => onClick(point.id, e)}
      title={isActive ? "Ctrl+Click para cancelar" : "Ctrl+Click para eliminar"}
    >
      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-primary bg-background px-1 rounded shadow-sm whitespace-nowrap">
        {pointNumber}
      </span>
    </div>
  );
}
