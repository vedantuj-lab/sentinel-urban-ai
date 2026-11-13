import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function KpiSkeleton() {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>
        <div className="flex items-end gap-2">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-3 w-10 mb-1" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ChartSkeleton() {
  return (
    <Card className="shadow-panel border-border bg-card overflow-hidden">
      <CardHeader className="pb-0 border-b border-border bg-surface/30">
        <div className="flex items-center justify-between mb-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      </CardHeader>
      <CardContent className="pt-6 h-[280px] flex items-end gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export function ListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl border border-border bg-surface/50 flex items-center gap-4"
        >
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
