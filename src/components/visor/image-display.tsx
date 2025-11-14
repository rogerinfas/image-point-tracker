import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export function ImageDisplay() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full aspect-video">
          <Image
            src="/image.png"
            alt="Imagen de ejemplo"
            fill
            className="object-cover"
            priority
          />
        </div>
      </CardContent>
    </Card>
  );
}
