import { useState, useCallback } from 'react';

export interface Point {
  id: number;
  x: number;
  y: number;
  specification?: string;
}

export function useImageAnnotations(initialPoints: Point[] = []) {
  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [activePointId, setActivePointId] = useState<number | null>(null);
  const [tempSpecification, setTempSpecification] = useState("");

  const addPoint = useCallback((x: number, y: number) => {
    const newPoint: Point = {
      id: Date.now() + Math.random(),
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    };
    
    setPoints(prev => [...prev, newPoint]);
    setActivePointId(newPoint.id);
    return newPoint;
  }, []);

  const removePoint = useCallback((id: number) => {
    setPoints(prev => prev.filter(point => point.id !== id));
    if (activePointId === id) {
      setActivePointId(null);
      setTempSpecification("");
    }
  }, [activePointId]);

  const updatePointSpec = useCallback((id: number, specification: string) => {
    setPoints(prev => 
      prev.map(point => 
        point.id === id 
          ? { ...point, specification: specification.trim() || "Sin especificación" }
          : point
      )
    );
    setActivePointId(null);
    setTempSpecification("");
  }, []);

  const cancelPointEdit = useCallback(() => {
    if (activePointId) {
      setPoints(prev => prev.filter(point => {
        // Eliminar solo si no tiene especificación (punto temporal)
        return point.id !== activePointId || point.specification;
      }));
      setActivePointId(null);
      setTempSpecification("");
    }
  }, [activePointId]);

  const getActivePoint = useCallback(() => {
    return points.find(point => point.id === activePointId) || null;
  }, [points, activePointId]);

  return {
    points,
    activePoint: getActivePoint(),
    tempSpecification,
    setTempSpecification,
    addPoint,
    removePoint,
    updatePointSpec,
    cancelPointEdit,
    setActivePointId,
  };
}
