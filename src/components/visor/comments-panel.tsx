"use client";

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: Date;
}

// Datos de ejemplo (puedes reemplazarlos con datos reales)
const exampleComments: Comment[] = [
  {
    id: '1',
    user: 'Ana García',
    text: 'Revisar las dimensiones del componente central',
    timestamp: new Date('2025-11-14T10:30:00')
  },
  {
    id: '2',
    user: 'Carlos López',
    text: 'El diseño cumple con los requisitos de accesibilidad',
    timestamp: new Date('2025-11-14T11:15:00')
  },
  {
    id: '3',
    user: 'María Fernández',
    text: 'Favor de verificar los márgenes en móviles',
    timestamp: new Date('2025-11-14T12:45:00')
  }
];

export function CommentsPanel() {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="h-full flex flex-col border-l border-border bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Comentarios</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {exampleComments.map((comment, index) => (
          <div key={comment.id} className="p-3 rounded-lg bg-muted/30 relative">
            <div className="absolute -top-2 -left-2 w-6 h-6 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {index + 1}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-primary">{comment.user}</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(comment.timestamp)}
              </span>
            </div>
            <p className="mt-1 text-sm">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
