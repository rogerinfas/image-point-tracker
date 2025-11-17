# Image Point Tracker

A React component library for annotating images with customizable points and specifications. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🖱️ Interactive point placement on images
- 🔍 Zoom and pan functionality
- 📝 Add specifications to each point
- 📱 Responsive design
- 🎨 Customizable styling
- 📊 Export point data
- 🔄 Real-time updates

## Installation

```bash
# Using npm
npm install @your-org/image-point-tracker

# Using yarn
yarn add @your-org/image-point-tracker

# Using pnpm
pnpm add @your-org/image-point-tracker
```

## Quick Start

```tsx
import { ImageDisplay } from '@your-org/image-point-tracker';

export default function App() {
  return (
    <div className="w-full h-screen p-4">
      <ImageDisplay 
        src="/path/to/your/image.jpg"
        initialPoints={[]}
        onPointsChange={(points) => console.log('Updated points:', points)}
      />
    </div>
  );
}
```

## Components

### ImageDisplay

The main component that renders the image and handles point interactions.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `src` | string | ✅ | - | Image source URL |
| `initialPoints` | `Point[]` | ❌ | `[]` | Initial points to display |
| `onPointsChange` | `(points: Point[]) => void` | ❌ | - | Callback when points are updated |
| `showSpecificationsPanel` | boolean | ❌ | `true` | Show/hide the specifications panel |
| `className` | string | ❌ | - | Additional CSS classes |

### PointMarker

Renders an individual point marker on the image.

### SpecificationModal

Modal for adding/editing point specifications.

### ZoomControls

Component for zoom and reset functionality.

## Hooks

### useImageAnnotations

Manages the state and logic for image annotations.

### useSpecificationLogger

Utility hook for logging point specifications.

## Types

```typescript
interface Point {
  id: number;
  x: number; // Percentage (0-100)
  y: number; // Percentage (0-100)
  specification?: string;
}
```

## Development

### Prerequisites

- Node.js 16+
- pnpm

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building

```bash
# Build the project
pnpm build

# Run the production build
pnpm start
```

## License

MIT
