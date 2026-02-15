export default function GlossarioLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="h-10 w-56 bg-muted animate-pulse rounded mb-2" />
        <div className="h-5 w-80 bg-muted animate-pulse rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg border border-border" />
          ))}
        </div>
      </div>
    </div>
  );
}
