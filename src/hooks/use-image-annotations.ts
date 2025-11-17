import { useState, useCallback, useMemo } from 'react';

/**
 * Representa un punto de anotación en la imagen
 * @property {number} id - Identificador único del punto
 * @property {number} x - Posición horizontal en porcentaje (0-100)
 * @property {number} y - Posición vertical en porcentaje (0-100)
 * @property {string} [specification] - Texto de especificación opcional
 */
export interface Point {
  id: number;
  x: number;
  y: number;
  specification?: string;
}

/**
 * Hook personalizado para gestionar anotaciones en imágenes
 * Maneja la creación, actualización y eliminación de puntos de anotación
 * 
 * @param {Point[]} [initialPoints=[]] - Puntos iniciales para inicializar el estado
 * @returns {Object} Objeto con el estado y funciones para gestionar las anotaciones
 */
export function useImageAnnotations(initialPoints: Point[] = []) {
  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [activePointId, setActivePointId] = useState<number | null>(null);
  const [tempSpecification, setTempSpecification] = useState("");

  /**
   * Redondea un número a 2 decimales
   * @param {number} num - Número a redondear
   * @returns {number} Número redondeado a 2 decimales
   * @private
   */
  const roundToTwoDecimals = (num: number): number => {
    return parseFloat(num.toFixed(2));
  };

  /**
   * Añade un nuevo punto a la imagen
   * @param {number} x - Coordenada X en porcentaje (0-100)
   * @param {number} y - Coordenada Y en porcentaje (0-100)
   */
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

  /**
   * Elimina un punto por su ID
   * @param {number} id - ID del punto a eliminar
   */
  const removePoint = useCallback((id: number) => {
    setPoints(prev => prev.filter(point => point.id !== id));
    if (activePointId === id) {
      setActivePointId(null);
      setTempSpecification("");
    }
  }, [activePointId]);

  /**
   * Actualiza la especificación de un punto existente
   * @param {number} id - ID del punto a actualizar
   * @param {string} specification - Nuevo texto de especificación
   */
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

  /**
   * Actualiza la posición de un punto existente
   * @param {number} id - ID del punto a mover
   * @param {number} x - Nueva coordenada X en porcentaje (0-100)
   * @param {number} y - Nueva coordenada Y en porcentaje (0-100)
   */
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

  /**
   * Cancela la edición actual y limpia el estado
   * Elimina puntos temporales sin especificación
   */
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

  /**
   * Obtiene el punto actualmente activo
   * @returns {Point | null} Punto activo o null si no hay ninguno
   */
  const getActivePoint = useCallback(() => {
    return points.find(point => point.id === activePointId) || null;
  }, [points, activePointId]);

  /**
   * Obtiene el número de orden de un punto basado en su posición en el array
   * @param {Point} point - Punto del que se quiere obtener el número
   * @returns {number} Número de orden (1-based)
   */
  const getPointNumber = useCallback((point: Point) => {
    return points.findIndex(p => p.id === point.id) + 1;
  }, [points]);

  // Usar useMemo para optimizar las referencias de las funciones
  return useMemo(() => ({
    points,
    activePoint: getActivePoint(),
    tempSpecification,
    setTempSpecification,
    addPoint,
    removePoint,
    updatePointSpec,
    cancelPointEdit,
    setActivePointId,
    getPointNumber
  }), [
    points,
    tempSpecification,
    setTempSpecification,
    addPoint,
    removePoint,
    updatePointSpec,
    cancelPointEdit,
    setActivePointId,
    getPointNumber,
    getActivePoint
  ]);
}
