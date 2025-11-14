"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export function ImageDisplay() {
  return (
    <div className="w-full h-full">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={8}
        wheel={{ step: 0.1 }}
        centerOnInit
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <div className="relative w-full h-full">
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              <button
                onClick={() => zoomIn()}
                className="p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                title="Acercar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <button
                onClick={() => zoomOut()}
                className="p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                title="Alejar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <button
                onClick={() => resetTransform()}
                className="p-3 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                title="Reiniciar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                </svg>
              </button>
            </div>
            <TransformComponent 
              wrapperClass="w-full h-full" 
              contentClass="w-full h-full"
              wrapperStyle={{
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--background)'
              }}
            >
              <div className="w-full h-full flex items-center justify-center p-4">
                <Image
                  src="/image.png"
                  alt="Imagen de ejemplo"
                  width={1920}
                  height={1080}
                  className="max-w-full max-h-full object-contain"
                  priority
                />
              </div>
            </TransformComponent>
          </div>
        )}
      </TransformWrapper>
    </div>
  );
}
