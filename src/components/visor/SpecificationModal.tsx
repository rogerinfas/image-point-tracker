import { useState, useEffect, useRef } from 'react';
import { Point } from "@/hooks/use-image-annotations";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SpecificationModalProps {
  point: Point;
  tempSpecification: string;
  onSpecificationChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  pointNumber: number;
}

export function SpecificationModal({ 
  point, 
  tempSpecification, 
  onSpecificationChange, 
  onSave, 
  onCancel,
  pointNumber
}: SpecificationModalProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-ajustar altura del textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [tempSpecification]);

  return (
    <div 
      className="absolute bg-background border border-border rounded-lg shadow-lg p-2 min-w-64 z-30"
      style={{
        left: `${point.x}%`,
        top: `${point.y + 3}%`,
        transform: 'translateX(-50%)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-xs font-medium text-muted-foreground">
          Punto #{pointNumber}
        </span>
      </div>

      <div className="flex items-start gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            placeholder="Agregar un comentario..."
            value={tempSpecification}
            onChange={(e) => onSpecificationChange(e.target.value)}
            className="w-full px-2 py-1 text-sm bg-transparent border-0 outline-none placeholder:text-muted-foreground/60 resize-none overflow-hidden"
            autoFocus
            rows={1}
            style={{
              minHeight: '24px',
              maxHeight: '120px',
              resize: 'none',
            }}
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
          />
        </div>

        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
            className="h-6 w-6 p-0 rounded hover:bg-primary/10 flex-shrink-0"
            title="Guardar (Enter)"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="h-6 w-6 p-0 rounded hover:bg-destructive/10 flex-shrink-0"
            title="Cancelar (Esc)"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
