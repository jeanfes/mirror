import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200/50", className)}
      {...props}
    />
  )
}

function SkeletonLine({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("loading-shimmer rounded-full bg-slate-200/50", className)} aria-hidden="true" {...props} />
}

function SkeletonBlock({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("loading-shimmer rounded-3xl bg-slate-200/50", className)} aria-hidden="true" {...props} />
}

export { Skeleton, SkeletonLine, SkeletonBlock }
