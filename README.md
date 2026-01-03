# Image Point Tracker

Una aplicación React para anotar imágenes con puntos interactivos y especificaciones personalizadas. Construida con Next.js, TypeScript y Tailwind CSS.

## Características

✨ **Funcionalidades principales:**
- 🖱️ Colocación interactiva de puntos (doble clic en la imagen)
- 🔍 Zoom y navegación (pan) en la imagen
- 📝 Agregar especificaciones a cada punto
- ✏️ Editar puntos existentes
- 🗑️ Eliminar puntos (Ctrl + Clic)
- 📊 Panel lateral con lista de especificaciones
- 🎨 Modo oscuro/claro
- 📱 Diseño responsive

## Instalación

```bash
pnpm install
```

## Ejecución

```bash
# Modo desarrollo
pnpm run dev

# Compilar para producción
pnpm run build

# Iniciar servidor de producción
pnpm run start
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## Uso

### Controles básicos

- **Doble clic en la imagen**: Crear nuevo punto
- **Clic en un punto**: Seleccionar/editar punto
- **Ctrl + Clic en un punto**: Eliminar punto
- **Botón de zoom (+/-)**: Acercar o alejar la imagen
- **Botón de reset**: Restablecer vista original
- **Rueda del mouse**: Zoom in/out

### Agregar especificaciones

1. Haz doble clic en la imagen donde quieras colocar un punto
2. Escribe la especificación en el modal que aparece
3. Presiona Enter o haz clic en el botón de guardar
4. Los puntos con especificaciones aparecerán en el panel lateral

## Estructura del Proyecto

```
src/
├── app/                    # Páginas de Next.js
│   ├── page.tsx           # Redirige al visor
│   └── visor/             # Página principal del visor
├── components/
│   ├── theme/             # Componentes de tema
│   ├── ui/                # Componentes UI reutilizables
│   └── visor/             # Componentes del visor
│       ├── image-display.tsx
│       ├── PointMarker.tsx
│       ├── SidePanel.tsx
│       ├── SpecificationModal.tsx
│       └── ZoomControls.tsx
├── hooks/                 # Custom hooks
│   ├── use-image-annotations.ts
│   └── use-specification-logger.ts
└── lib/                   # Utilidades
```

## Tecnologías

- **Framework**: Next.js 16
- **UI**: React 19
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS 4
- **Zoom/Pan**: react-zoom-pan-pinch
- **Componentes UI**: Radix UI
- **Tema**: next-themes

## Licencia

MIT
