"use client";

import Image from "next/image";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useRef, useCallback } from "react";
import { useImageAnnotations, type Point } from "@/hooks/use-image-annotations";
import { PointMarker } from "./PointMarker";
import { SpecificationModal } from "./SpecificationModal";
import { ZoomControls } from "./ZoomControls";
import { SidePanel } from "./SidePanel";

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
    setActivePointId,
    getPointNumber,
  } = useImageAnnotations([]);

  const handleImageDoubleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Verificar si ya existe un punto cerca de esta posición
    const minDistance = 1.8; // Distancia mínima en porcentaje
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
    e.stopPropagation();

    if (e.ctrlKey) {
      removePoint(id);
      return;
    }

    const pointToEdit = points.find(p => p.id === id);

    // Si es el mismo punto, alternamos la visibilidad del modal
    if (activePoint?.id === id) {
      if (pointToEdit?.specification) {
        // Si ya tiene especificación, alternar entre mostrar/ocultar el modal
        if (tempSpecification === '') {
          setTempSpecification(pointToEdit.specification);
        } else {
          cancelPointEdit();
        }
      }
    } else {
      // Si es un punto diferente, lo activamos y cargamos su especificación si existe
      setActivePointId(id);
      if (pointToEdit?.specification) {
        setTempSpecification(pointToEdit.specification);
      } else {
        setTempSpecification('');
      }
    }
  }, [removePoint, setActivePointId, points, activePoint, tempSpecification, cancelPointEdit, setTempSpecification]);

  const handleSaveSpecification = useCallback(() => {
    if (activePoint) {
      // Si el comentario está vacío o solo tiene espacios, cancelar en lugar de guardar
      if (!tempSpecification.trim()) {
        cancelPointEdit();
        return;
      }
      updatePointSpec(activePoint.id, tempSpecification);
    }
  }, [activePoint, tempSpecification, updatePointSpec, cancelPointEdit]);

  const handlePointSelect = useCallback((point: Point) => {
    // Si el punto ya está activo, no hacemos nada para evitar parpadeos
    if (activePoint?.id === point.id) return;

    // Establecer el punto activo
    setActivePointId(point.id);

    // Cargar la especificación del punto seleccionado
    if (point.specification) {
      setTempSpecification(point.specification);
    } else {
      setTempSpecification('');
    }

    // Aquí podrías agregar lógica para hacer scroll a la vista
  }, [activePoint, setActivePointId, setTempSpecification]);

  // getPointNumber es importado desde useImageAnnotations
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
              zoomIn(step, 100);
            };

            const handleZoomOut = (step: number = 0.2) => {
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

                    {activePoint && (
                      <SpecificationModal
                        point={activePoint}
                        tempSpecification={tempSpecification}
                        onSpecificationChange={setTempSpecification}
                        onSave={handleSaveSpecification}
                        onCancel={cancelPointEdit}
                        pointNumber={getPointNumber(activePoint)}
                        isEditing={!!activePoint.specification}
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
