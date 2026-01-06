# Documentación Técnica del Visor de Imágenes con Anotaciones

## Descripción General

Sistema completo de visualización de imágenes con capacidad de anotación interactiva. Permite a los usuarios colocar puntos en una imagen, agregar comentarios/especificaciones a cada punto, y gestionar estas anotaciones mediante una interfaz intuitiva con zoom, pan y panel lateral.

---

## Funcionalidad a Nivel de Usuario

### Características Principales

1. **Visualización de Imagen**
   - Zoom in/out con controles y rueda del mouse
   - Pan (arrastrar) para navegar por la imagen
   - Reset para volver a la vista original
   - Soporte para modo oscuro/claro

2. **Sistema de Anotaciones**
   - **Crear punto**: Doble clic en cualquier parte de la imagen
   - **Agregar comentario**: Al crear un punto, aparece un modal para escribir
   - **Editar comentario**: Clic en un punto existente para editar su comentario
   - **Eliminar punto**: Ctrl + Clic en un punto
   - **Panel lateral**: Muestra lista de todos los puntos con comentarios

3. **Controles de Interacción**
   - **Doble clic en imagen**: Crear nuevo punto
   - **Clic en punto**: Seleccionar/editar punto
   - **Ctrl + Clic en punto**: Eliminar punto
   - **Enter**: Guardar comentario
   - **Escape**: Cancelar edición
   - **Shift + Enter**: Nueva línea en textarea

---

## Arquitectura del Código

### Estructura de Archivos

```
src/
├── app/
│   ├── layout.tsx              # Layout principal con ThemeProvider
│   ├── page.tsx                # Redirige a /visor
│   └── visor/
│       └── page.tsx            # Página principal del visor
├── components/
│   ├── visor/
│   │   ├── image-display.tsx   # Componente principal (orquestador)
│   │   ├── PointMarker.tsx     # Marcador visual de puntos
│   │   ├── SpecificationModal.tsx  # Modal para editar comentarios
│   │   ├── SidePanel.tsx       # Panel lateral con lista
│   │   └── ZoomControls.tsx    # Controles de zoom
│   ├── ui/
│   │   └── button.tsx          # Componente Button reutilizable
│   └── theme-provider.tsx      # Provider de temas
└── hooks/
    ├── use-image-annotations.ts # Hook principal de gestión de puntos
    └── use-specification-logger.ts  # Hook para logging
```

---

## Dependencias y Versiones Específicas

### Dependencias Principales

```json
{
  "next": "16.0.3",
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "react-zoom-pan-pinch": "^3.7.0",
  "next-themes": "^0.4.6",
  "tailwindcss": "^4",
  "@radix-ui/react-slot": "^1.2.4",
  "lucide-react": "^0.553.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0"
}
```

### Propósito de Cada Dependencia

- **next**: Framework React con SSR y optimizaciones
- **react-zoom-pan-pinch**: Biblioteca para zoom y pan en imágenes
- **next-themes**: Gestión de temas oscuro/claro
- **tailwindcss**: Framework CSS utility-first
- **@radix-ui/react-slot**: Componente Slot para composición
- **lucide-react**: Iconos SVG
- **class-variance-authority**: Gestión de variantes de componentes
- **clsx + tailwind-merge**: Utilidades para clases CSS condicionales

---

## Flujo de Datos y Estado

### Modelo de Datos

```typescript
interface Point {
  id: number;              // Timestamp único (Date.now())
  x: number;              // Posición X en porcentaje (0-100)
  y: number;              // Posición Y en porcentaje (0-100)
  specification?: string;  // Comentario opcional
}
```

### Gestión de Estado

El estado se gestiona mediante el hook `useImageAnnotations`:

```typescript
// Estado interno del hook
const [points, setPoints] = useState<Point[]>([]);
const [activePointId, setActivePointId] = useState<number | null>(null);
const [tempSpecification, setTempSpecification] = useState("");
```

**Flujo de actualización:**
1. Usuario hace doble clic → `addPoint(x, y)` → nuevo punto agregado a `points`
2. Usuario escribe comentario → `setTempSpecification(value)` → estado temporal
3. Usuario guarda → `updatePointSpec(id, spec)` → punto actualizado en `points`
4. Usuario cancela → `cancelPointEdit()` → punto temporal eliminado si no tiene spec

---

## Componentes Detallados

### 1. ImageDisplay (Componente Principal)

**Ubicación**: `src/components/visor/image-display.tsx`

**Responsabilidades**:
- Orquestar todos los subcomponentes
- Manejar eventos de interacción (doble clic, clic en puntos)
- Integrar `TransformWrapper` para zoom/pan
- Gestionar el ciclo de vida de puntos y comentarios

**Props**:
```typescript
interface ImageDisplayProps {
  showSpecificationsPanel?: boolean; // Default: true
}
```

**Lógica Clave**:

```typescript
// Cálculo de coordenadas relativas al contenedor
const handleImageDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
  const rect = imageRef.current.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  // ... validación de distancia mínima (1.8%)
  addPoint(x, y);
};
```

**Integración con react-zoom-pan-pinch**:

```typescript
<TransformWrapper
  initialScale={1}
  minScale={0.5}
  maxScale={3}
  wheel={{ step: 0.1 }}
  doubleClick={{ disabled: false }}
>
  {({ zoomIn, zoomOut, resetTransform }) => (
    <TransformComponent>
      {/* Contenido transformable */}
    </TransformComponent>
  )}
</TransformWrapper>
```

**Puntos importantes**:
- El `imageRef` se usa para calcular coordenadas relativas
- Los puntos se posicionan con porcentajes para mantener posición relativa al zoom
- El modal se renderiza condicionalmente solo cuando hay `activePoint`

---

### 2. useImageAnnotations Hook

**Ubicación**: `src/hooks/use-image-annotations.ts`

**API Pública**:

```typescript
const {
  points,              // Point[] - Todos los puntos
  activePoint,        // Point | null - Punto actualmente activo
  tempSpecification,  // string - Comentario temporal en edición
  setTempSpecification, // (value: string) => void
  addPoint,           // (x: number, y: number) => void
  removePoint,         // (id: number) => void
  updatePointSpec,     // (id: number, spec: string) => void
  cancelPointEdit,     // () => void
  setActivePointId,    // (id: number | null) => void
  getPointNumber       // (point: Point) => number
} = useImageAnnotations(initialPoints);
```

**Funciones Clave**:

1. **addPoint(x, y)**:
   - Crea nuevo punto con `id = Date.now()`
   - Normaliza coordenadas a rango 0-100
   - Redondea a 2 decimales
   - Establece el punto como activo

2. **updatePointSpec(id, specification)**:
   - Valida que el comentario no esté vacío (trim)
   - Actualiza solo si hay contenido válido
   - Cierra el modal después de guardar

3. **cancelPointEdit()**:
   - Elimina puntos temporales (sin especificación)
   - Mantiene puntos con especificación existente
   - Limpia estado de edición

4. **getPointNumber(point)**:
   - Retorna índice + 1 del punto en el array
   - Usado para mostrar números en marcadores

**Optimizaciones**:
- Usa `useCallback` para todas las funciones
- Usa `useMemo` para el objeto de retorno
- Evita dependencias innecesarias (setters de useState son estables)

---

### 3. PointMarker Component

**Ubicación**: `src/components/visor/PointMarker.tsx`

**Props**:
```typescript
interface PointMarkerProps {
  point: Point;
  isActive: boolean;
  onClick: (id: number, e: React.MouseEvent) => void;
  pointNumber: number;
}
```

**Renderizado**:
- Círculo con borde y número interno
- Posicionamiento absoluto con `left: ${point.x}%` y `top: ${point.y}%`
- Transform `translate(-50%, -50%)` para centrar en coordenadas
- Estados visuales: activo (escala 1.25, z-index 20) vs inactivo

**Eventos**:
- `onClick`: Maneja clic normal y Ctrl+Clic para eliminar
- `stopPropagation()` para evitar triggers en contenedor padre

---

### 4. SpecificationModal Component

**Ubicación**: `src/components/visor/SpecificationModal.tsx`

**Props**:
```typescript
interface SpecificationModalProps {
  point: Point;
  tempSpecification: string;
  onSpecificationChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  pointNumber: number;
  isEditing?: boolean;
}
```

**Características**:
- Textarea con auto-resize (máx 120px altura)
- Posicionamiento relativo al punto: `top: ${point.y + 3}%`
- Auto-focus al abrir
- Atajos de teclado:
  - `Enter`: Guardar
  - `Shift+Enter`: Nueva línea
  - `Escape`: Cancelar

**Prevención de eventos**:
- `stopPropagation()` en todos los eventos para evitar zoom/pan accidental
- `onDoubleClick` prevenido en textarea

**Estilos**:
- `min-w-[340px]` para ancho mínimo
- `z-30` para estar sobre puntos pero bajo controles

---

### 5. SidePanel Component

**Ubicación**: `src/components/visor/SidePanel.tsx`

**Props**:
```typescript
interface SidePanelProps {
  points: Point[];  // Solo puntos con specification
  onPointSelect: (point: Point) => void;
}
```

**Funcionalidad**:
- Muestra solo puntos que tienen `specification`
- Lista clickeable para seleccionar puntos
- Scroll automático si hay muchos puntos
- Estado vacío cuando no hay especificaciones

---

### 6. ZoomControls Component

**Ubicación**: `src/components/visor/ZoomControls.tsx`

**Funcionalidad**:
- Tres botones: Zoom In (+), Zoom Out (-), Reset (⟲)
- Posicionamiento fijo en esquina superior izquierda
- Estilos adaptativos para tema oscuro/claro
- Integración con funciones de `TransformWrapper`

---

## Flujo Completo de Crear Comentario

### Paso a Paso

1. **Usuario hace doble clic en imagen**
   ```typescript
   handleImageDoubleClick(e) {
     // 1. Calcula coordenadas relativas (0-100%)
     const x = ((e.clientX - rect.left) / rect.width) * 100;
     const y = ((e.clientY - rect.top) / rect.height) * 100;
     
     // 2. Verifica distancia mínima (1.8%) para evitar duplicados
     const existingPoint = points.find(/* distancia < 1.8% */);
     
     // 3. Si existe punto cercano, lo activa en lugar de crear nuevo
     // 4. Si hay punto activo sin spec, lo cancela primero
     // 5. Crea nuevo punto con addPoint(x, y)
   }
   ```

2. **Hook crea punto**
   ```typescript
   addPoint(x, y) {
     const newPoint = {
       id: Date.now(),
       x: roundToTwoDecimals(x),
       y: roundToTwoDecimals(y)
     };
     setPoints(prev => [...prev, newPoint]);
     setActivePointId(newPoint.id);  // Activa el punto
     setTempSpecification('');        // Limpia spec temporal
   }
   ```

3. **Modal se renderiza**
   ```typescript
   {activePoint && (
     <SpecificationModal
       point={activePoint}
       tempSpecification={tempSpecification}
       // ... otros props
     />
   )}
   ```

4. **Usuario escribe comentario**
   ```typescript
   // Cada cambio actualiza tempSpecification
   onChange={(e) => setTempSpecification(e.target.value)}
   ```

5. **Usuario guarda (Enter o botón)**
   ```typescript
   handleSaveSpecification() {
     if (!tempSpecification.trim()) {
       cancelPointEdit();  // Si está vacío, cancela
       return;
     }
     updatePointSpec(activePoint.id, tempSpecification);
   }
   ```

6. **Hook actualiza punto**
   ```typescript
   updatePointSpec(id, specification) {
     const trimmedSpec = specification.trim();
     if (trimmedSpec) {
       setPoints(prev => prev.map(point =>
         point.id === id
           ? { ...point, specification: trimmedSpec }
           : point
       ));
     }
     setActivePointId(null);  // Cierra modal
     setTempSpecification("");
   }
   ```

---

## Configuración de TransformWrapper

### Parámetros Importantes

```typescript
<TransformWrapper
  initialScale={1}           // Escala inicial (1 = 100%)
  minScale={0.5}            // Zoom mínimo (50%)
  maxScale={3}              // Zoom máximo (300%)
  wheel={{ step: 0.1 }}     // Incremento por rueda del mouse
  doubleClick={{ disabled: false }}  // Permite doble clic (usado para puntos)
  onZoom={(ref) => {        // Callback de validación
    const scale = parseFloat(ref.state.scale.toFixed(2));
    if (isNaN(scale)) {
      // Reset si escala inválida
      ref.resetTransform(300, 'easeOut');
    }
  }}
>
```

**Nota crítica**: `doubleClick={{ disabled: false }}` es necesario porque el doble clic se usa para crear puntos, no para zoom.

---

## Sistema de Coordenadas

### Porcentajes vs Píxeles

**Por qué usar porcentajes:**
- Los puntos mantienen su posición relativa al hacer zoom/pan
- Funciona con cualquier tamaño de imagen
- Responsive automáticamente

**Cálculo de coordenadas:**
```typescript
// Coordenadas del evento del mouse (píxeles absolutos)
const clientX = e.clientX;
const clientY = e.clientY;

// Posición del contenedor (píxeles absolutos)
const rect = imageRef.current.getBoundingClientRect();

// Conversión a porcentaje relativo al contenedor
const x = ((clientX - rect.left) / rect.width) * 100;
const y = ((clientY - rect.top) / rect.height) * 100;
```

**Aplicación en renderizado:**
```typescript
// Los puntos se posicionan con porcentajes
<div style={{
  left: `${point.x}%`,
  top: `${point.y}%`
}} />
```

---

## Validaciones y Reglas de Negocio

### 1. Distancia Mínima Entre Puntos
- **Valor**: 1.8% de distancia euclidiana
- **Propósito**: Evitar puntos duplicados muy cercanos
- **Implementación**:
```typescript
const minDistance = 1.8;
const distance = Math.sqrt(
  Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)
);
if (distance < minDistance) {
  // Activar punto existente en lugar de crear nuevo
}
```

### 2. Validación de Comentarios Vacíos
- Si el usuario intenta guardar comentario vacío → se cancela la edición
- Solo se guardan comentarios con contenido válido (trim)

### 3. Eliminación de Puntos Temporales
- Al cancelar edición, si el punto no tiene `specification` → se elimina
- Si el punto ya tiene `specification` → se mantiene pero se cierra el modal

---

## Integración con Next.js

### Configuración Requerida

**next.config.ts**:
```typescript
const nextConfig: NextConfig = {
  reactCompiler: true,  // Habilita React Compiler
};
```

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**globals.css**:
```css
@import "tailwindcss";
/* NO incluir tw-animate-css - no es necesario */
```

---

## Estilos y Temas

### Variables CSS Personalizadas

El sistema usa variables CSS para temas:
- `--background`, `--foreground`
- `--primary`, `--primary-foreground`
- `--muted`, `--muted-foreground`
- `--border`, `--card`

**Aplicación en componentes**:
```typescript
style={{
  backgroundColor: 'var(--background)'
}}
```

### Clases Tailwind Utilizadas

- Layout: `w-full`, `h-full`, `flex`, `relative`, `absolute`
- Posicionamiento: `translate-x-1/2`, `translate-y-1/2`
- Estados: `hover:`, `focus-visible:`, `dark:`
- Z-index: `z-10`, `z-20`, `z-30`, `z-50`

---

## Manejo de Eventos

### Prevención de Propagación

**Crítico**: Muchos eventos necesitan `stopPropagation()`:

```typescript
// En PointMarker
onClick={(e) => {
  e.stopPropagation();  // Evita trigger en imagen
  onClick(point.id, e);
}}

// En SpecificationModal
onClick={(e) => e.stopPropagation()}  // Evita zoom/pan
onDoubleClick={(e) => e.stopPropagation()}  // Evita zoom
```

### Atajos de Teclado

```typescript
onKeyDown={(e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    onSave();
  }
  if (e.key === 'Escape') {
    e.preventDefault();
    onCancel();
  }
}}
```

---

## Optimizaciones y Mejores Prácticas

### 1. useCallback para Funciones
Todas las funciones pasadas como props usan `useCallback` para evitar re-renders innecesarios.

### 2. useMemo para Objetos de Retorno
El hook `useImageAnnotations` retorna un objeto memoizado.

### 3. Filtrado Eficiente
```typescript
// SidePanel solo recibe puntos con specification
points={points.filter(p => p.specification)}
```

### 4. Referencias Estables
Los setters de `useState` no necesitan estar en dependencias de `useCallback`.

---

## Ejemplo de Implementación Completa

### Estructura Mínima Requerida

```tsx
// app/visor/page.tsx
"use client";
import { ImageDisplay } from "@/components/visor/image-display";

export default function VisorPage() {
  return (
    <div className="w-full h-screen">
      <ImageDisplay showSpecificationsPanel={true} />
    </div>
  );
}
```

### Hook Mínimo Funcional

```typescript
export function useImageAnnotations(initialPoints: Point[] = []) {
  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [activePointId, setActivePointId] = useState<number | null>(null);
  const [tempSpecification, setTempSpecification] = useState("");

  const addPoint = useCallback((x: number, y: number) => {
    const newPoint = {
      id: Date.now(),
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    };
    setPoints(prev => [...prev, newPoint]);
    setActivePointId(newPoint.id);
  }, []);

  // ... resto de funciones

  return {
    points,
    activePoint: points.find(p => p.id === activePointId) || null,
    tempSpecification,
    setTempSpecification,
    addPoint,
    // ... resto de retorno
  };
}
```

---

## Consideraciones para Replicación

### Checklist de Implementación

1. ✅ Instalar dependencias exactas (versiones especificadas)
2. ✅ Configurar Next.js con React Compiler
3. ✅ Configurar Tailwind CSS 4
4. ✅ Crear estructura de carpetas
5. ✅ Implementar hook `useImageAnnotations`
6. ✅ Crear componente `ImageDisplay` con `TransformWrapper`
7. ✅ Implementar `PointMarker` con posicionamiento porcentual
8. ✅ Crear `SpecificationModal` con textarea auto-resize
9. ✅ Implementar `SidePanel` para lista de puntos
10. ✅ Agregar `ZoomControls` con funciones de zoom
11. ✅ Configurar prevención de eventos (`stopPropagation`)
12. ✅ Implementar validaciones (distancia mínima, comentarios vacíos)
13. ✅ Configurar temas oscuro/claro con `next-themes`

### Puntos Críticos

- **Coordenadas en porcentajes**: Esencial para funcionamiento con zoom
- **Prevención de eventos**: Sin `stopPropagation`, el zoom/pan interferirá
- **Distancia mínima**: Evita puntos duplicados
- **Validación de comentarios**: No guardar comentarios vacíos
- **Estado temporal**: Usar `tempSpecification` para edición antes de guardar

---

## Extensibilidad

### Posibles Mejoras

1. **Persistencia**: Guardar puntos en localStorage o API
2. **Exportación**: Exportar puntos como JSON/CSV
3. **Importación**: Cargar puntos desde archivo
4. **Drag & Drop**: Mover puntos arrastrándolos
5. **Categorías**: Agregar tipos/categorías a puntos
6. **Búsqueda**: Buscar en comentarios del panel lateral
7. **Filtros**: Filtrar puntos por criterios
8. **Undo/Redo**: Historial de acciones

---

## Troubleshooting Común

### Problema: Los puntos no se posicionan correctamente con zoom
**Solución**: Asegurar que coordenadas están en porcentajes, no píxeles

### Problema: El doble clic hace zoom en lugar de crear punto
**Solución**: Verificar que `doubleClick={{ disabled: false }}` en TransformWrapper

### Problema: El modal se cierra al hacer clic fuera
**Solución**: Agregar `stopPropagation()` en eventos del modal

### Problema: Puntos duplicados muy cercanos
**Solución**: Verificar que la validación de distancia mínima (1.8%) esté activa

---

## Conclusión

Este sistema proporciona una base sólida para anotación de imágenes con:
- Arquitectura modular y escalable
- Gestión de estado eficiente
- Interfaz de usuario intuitiva
- Código optimizado y mantenible

La documentación anterior proporciona todos los detalles necesarios para replicar o extender el sistema.
