/**
 * Loading State Global
 * 
 * Exibido durante transições de rota no nível da aplicação.
 * Usa skeleton pattern para feedback visual.
 */

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Carregando...
        </p>
      </div>
    </div>
  );
}
