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

  const roundToTwoDecimals = (num: number): number => {
    return parseFloat(num.toFixed(2));
  };

  const addPoint = useCallback((x: number, y: number) => {
    const newPoint: Point = {
      id: Date.now(),
      x: roundToTwoDecimals(Math.max(0, Math.min(100, x))),
      y: roundToTwoDecimals(Math.max(0, Math.min(100, y)))
    };
    setPoints(prev => [...prev, newPoint]);
    setActivePointId(newPoint.id);
    setTempSpecification('');
  }, [setActivePointId, setTempSpecification]);

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

  const updatePointPosition = useCallback((id: number, x: number, y: number) => {
    setPoints(prev => 
      prev.map(point => 
        point.id === id 
          ? { 
              ...point, 
              x: roundToTwoDecimals(Math.max(0, Math.min(100, x))), 
              y: roundToTwoDecimals(Math.max(0, Math.min(100, y))) 
            }
          : point
      )
    );
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

  const getPointNumber = useCallback((point: Point) => {
    return points.findIndex(p => p.id === point.id) + 1;
  }, [points]);

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
    getPointNumber,
  };
}
