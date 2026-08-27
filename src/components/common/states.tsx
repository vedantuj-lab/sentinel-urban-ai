import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingPanel({ label = "Loading urban data…" }: { label?: string }) {
  return (
    <Card className="grid place-items-center gap-3 p-10 text-center shadow-panel">
      <Loader2 className="size-5 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-2 grid w-full max-w-md gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </Card>
  );
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <Card className="grid place-items-center gap-2 border-dashed p-10 text-center">
      <Icon className="size-6 text-muted-foreground" />
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? (
        <Button className="mt-2" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : null}
    </Card>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="grid place-items-center gap-2 border-destructive/40 p-10 text-center">
      <AlertTriangle className="size-6 text-destructive" />
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry ? (
        <Button className="mt-2" size="sm" variant="outline" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </Card>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
