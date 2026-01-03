import { Point } from "./use-image-annotations";

/**
 * Hook para registrar especificaciones de puntos
 */
export function useSpecificationLogger(points: Point[]) {
  const logSpecifications = () => {
    const specs = points.map(point => ({
      'Punto #': points.findIndex(p => p.id === point.id) + 1,
      'X (%)': point.x,
      'Y (%)': point.y,
      'Especificación': point.specification || 'Sin especificación'
    }));
    
    console.table(specs);
    console.log('Especificaciones completas:', JSON.stringify(specs, null, 2));
    
    return specs;
  };

  return { logSpecifications };
}
