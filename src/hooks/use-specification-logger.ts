import { Point } from "./use-image-annotations";

/**
 * Hook personalizado para registrar y formatear especificaciones de puntos
 * Proporciona funcionalidad para mostrar las especificaciones en la consola
 * en formato de tabla y JSON
 * 
 * @param {Point[]} points - Array de puntos a registrar
 * @returns {Object} Objeto con funciones para registrar especificaciones
 */
export function useSpecificationLogger(points: Point[]) {
  /**
   * Registra las especificaciones de los puntos en la consola
   * Muestra una tabla formateada y el objeto JSON completo
   * @returns {Array} Array con las especificaciones formateadas
   */
  const logSpecifications = () => {
    const specs = points.map(point => ({
      'Punto #': points.findIndex(p => p.id === point.id) + 1,
      'X (%)': point.x,
      'Y (%)': point.y,
      'Especificación': point.specification || 'Sin especificación'
    }));
    
    console.table(specs);
    console.log('Especificaciones completas:', JSON.stringify(specs, null, 2));
    
    // Devolvemos los datos por si se necesitan en otro lugar
    return specs;
  };

  // Retornar solo las funciones que se necesitan exponer
  return { logSpecifications };
}
