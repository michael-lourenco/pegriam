/**
 * Loading State — Detalhe da História
 */

export default function StoryDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-40 bg-muted animate-pulse rounded mb-6" />
        <div className="mb-8 space-y-4">
          <div className="h-12 w-2/3 bg-muted animate-pulse rounded" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
            <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
            <div className="h-6 w-14 bg-muted animate-pulse rounded-full" />
          </div>
          <div className="h-20 w-full bg-muted animate-pulse rounded" />
        </div>
        <div className="flex justify-center mb-12">
          <div className="h-64 w-44 bg-muted animate-pulse rounded-lg" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 w-full bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
