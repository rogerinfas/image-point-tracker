"use client";

import Image from "next/image";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useRef, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import { useImageAnnotations, type Point } from "@/hooks/use-image-annotations";
import { PointMarker } from "./PointMarker";
import { SpecificationModal } from "./SpecificationModal";
import { ZoomControls } from "./ZoomControls";
import { SidePanel } from "./SidePanel";

const SEED_POINTS: Point[] = [
  {
    id: 1,
    x: 25,
    y: 30,
    specification: "Pecho: 95cm\nContorno completo del pecho\nTomar con cinta métrica horizontal"
  },
  {
    id: 2,
    x: 75,
    y: 30,
    specification: "Espalda: 92cm\nAncho de espalda\nMedir de hombro a hombro"
  },
  {
    id: 3,
    x: 50,
    y: 45,
    specification: "Cintura: 78cm\nPunto más estrecho\nA nivel del ombligo"
  },
  {
    id: 4,
    x: 50,
    y: 65,
    specification: "Cadera: 102cm\nPunto más ancho\nA nivel de los glúteos"
  },
  {
    id: 5,
    x: 30,
    y: 80,
    specification: "Largo manga: 62cm\nDesde hombro hasta muñeca\nBrazo ligeramente doblado"
  },
  {
    id: 6,
    x: 70,
    y: 80,
    specification: "Largo total: 165cm\nDesde hombro hasta tobillo\nCon zapatos puestos"
  }
];

interface ImageDisplayProps {
  showSpecificationsPanel?: boolean;
}

export function ImageDisplay({ showSpecificationsPanel = true }: ImageDisplayProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  
  const {
    points,
    activePoint,
    tempSpecification,
    setTempSpecification,
    addPoint,
    removePoint,
    updatePointSpec,
    cancelPointEdit,
    setActivePointId
  } = useImageAnnotations(SEED_POINTS);

  const handleImageDoubleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Verificar si ya existe un punto cerca de esta posición
    const minDistance = 1.5; // Distancia mínima en porcentaje
    const existingPoint = points.find((point) => {
      const distance = Math.sqrt(
        Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)
      );
      return distance < minDistance;
    });

    // Si ya existe un punto cerca, no crear uno nuevo
    if (existingPoint) {
      setActivePointId(existingPoint.id);
      return;
    }

    // Si hay un punto activo sin especificación, cancelarlo primero
    if (activePoint && !activePoint.specification) {
      cancelPointEdit();
    }

    addPoint(x, y);
  }, [points, activePoint, addPoint, cancelPointEdit, setActivePointId]);

  const handlePointClick = useCallback((id: number, e: React.MouseEvent) => {
    if (e.ctrlKey) {
      e.stopPropagation();
      removePoint(id);
    } else {
      setActivePointId(id);
    }
  }, [removePoint, setActivePointId]);

  const handleSaveSpecification = useCallback(() => {
    if (activePoint) {
      updatePointSpec(activePoint.id, tempSpecification);
    }
  }, [activePoint, tempSpecification, updatePointSpec]);

  const handlePointSelect = useCallback((point: Point) => {
    setActivePointId(point.id);
    // Aquí podrías agregar lógica para hacer scroll a la vista
  }, [setActivePointId]);

  const getPointNumber = useCallback((point: Point) => {
    return points.findIndex(p => p.id === point.id) + 1;
  }, [points]);

  // Funciones de zoom movidas dentro del render del TransformWrapper

  return (
    <div className="w-full h-full flex">
      <div className="flex-1 relative">
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={3}
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: false }}
          onZoom={(ref) => {
            // Asegurarse de que la escala sea un número válido
            const scale = parseFloat(ref.state.scale.toFixed(2));
            if (isNaN(scale)) {
              // Usar el elemento raíz del transformador como respaldo
              const target = document.querySelector('.react-transform-element') as HTMLElement;
              if (target) {
                ref.zoomToElement(target, 1, 0);
              } else {
                ref.resetTransform(300, 'easeOut');
              }
            }
          }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => {
            const handleZoomIn = (step: number = 0.2) => {
              const newScale = Math.min(3, 1 + step);
              zoomIn(step, 100);
            };

            const handleZoomOut = (step: number = 0.2) => {
              const newScale = Math.max(0.5, 1 - step);
              zoomOut(step, 100);
            };

            const handleReset = () => {
              resetTransform(300, 'easeOut');
            };

            return (
              <div className="relative w-full h-full">
                <ZoomControls 
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onReset={handleReset}
                />
                
                <TransformComponent
                  wrapperClass="w-full h-full"
                  contentClass="w-full h-full"
                  wrapperStyle={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'var(--background)'
                  }}
                >
                  <div 
                    ref={imageRef}
                    className="relative w-full h-full flex items-center justify-center cursor-crosshair"
                    onDoubleClick={handleImageDoubleClick}
                  >
                    <Image
                      src="/image.png"
                      alt="Imagen de ejemplo"
                      width={1920}
                      height={1080}
                      className="max-w-full max-h-full object-contain select-none pointer-events-none"
                      priority
                    />
                    
                    {points.map((point) => (
                      <PointMarker
                        key={point.id}
                        point={point}
                        isActive={point.id === activePoint?.id}
                        onClick={handlePointClick}
                        pointNumber={getPointNumber(point)}
                      />
                    ))}
                    
                    {activePoint && !activePoint.specification && (
                      <SpecificationModal
                        point={activePoint}
                        tempSpecification={tempSpecification}
                        onSpecificationChange={setTempSpecification}
                        onSave={handleSaveSpecification}
                        onCancel={cancelPointEdit}
                        pointNumber={getPointNumber(activePoint)}
                      />
                    )}
                  </div>
                </TransformComponent>
              </div>
            );
          }}
        </TransformWrapper>
      </div>

      {/* Panel lateral derecho */}
      {showSpecificationsPanel && (
        <SidePanel 
          points={points.filter(p => p.specification)} 
          onPointSelect={handlePointSelect} 
        />
      )}
    </div>
  );
}
