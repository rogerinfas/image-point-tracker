# Documentación del Visor de Imágenes

## Características

- **Zoom In/Out**: Acerca o aleja la imagen
- **Pan**: Arrastra la imagen para moverla
- **Reinicio**: Vuelve a la vista original
- **Responsivo**: Se adapta a diferentes tamaños de pantalla
- **Modo Oscuro/Claro**: Compatible con el tema de la aplicación

## Uso

1. **Controles de Zoom**:
   - **+** : Acerca la imagen
   - **-** : Aleja la imagen
   - **⟲** : Reinicia la vista

2. **Controles de Navegación**:
   - **Click y arrastrar**: Mueve la imagen
   - **Rueda del ratón**: Zoom in/out
   - **Doble click**: Alternar entre zoom máximo y mínimo

## Personalización

### Parámetros del Componente

```typescript
<TransformWrapper
  initialScale={1}      // Escala inicial
  minScale={0.5}        // Escala mínima
  maxScale={8}          // Escala máxima
  wheel={{ step: 0.1 }} // Sensibilidad de la rueda
>
```

### Estilos

- La imagen ocupa el 90% del ancho del contenedor
- Mantiene su relación de aspecto original
- Se ajusta automáticamente al tamaño de la pantalla

## Dependencias

- `react-zoom-pan-pinch`: Para la funcionalidad de zoom y pan
- `next/image`: Para la carga optimizada de imágenes
- `shadcn/ui`: Para los componentes de la interfaz

## Ejemplo de Uso

```tsx
<ImageDisplay />
```

## Notas

- La imagen debe estar en la carpeta `public/`
- El componente es compatible con el tema oscuro/claro de la aplicación
- Se recomienda usar imágenes con una resolución mínima de 1200x800px para mejor calidad
