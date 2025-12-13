import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-background")}>
      <div className={cn("text-center space-y-4")}>
        <h1 className={cn("text-4xl font-bold text-foreground")}>
          Contos de Pegriam
        </h1>
        <p className={cn("text-muted-foreground")}>
          Sistema Editorial Avançado - O Bardo Multiversal
        </p>
        <p className={cn("text-sm text-muted-foreground")}>
          Arquitetura limpa baseada em Clean Architecture, SOLID e Design Patterns
        </p>
      </div>
    </div>
  );
}

