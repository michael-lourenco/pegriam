/**
 * Loading State — Painel Admin
 */

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-10 w-56 bg-muted animate-pulse rounded mb-2" />
          <div className="h-5 w-72 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg border border-border" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 w-full bg-muted animate-pulse rounded-lg border border-border" />
          ))}
        </div>
      </div>
    </div>
  );
}
