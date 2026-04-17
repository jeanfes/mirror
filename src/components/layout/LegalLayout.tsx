import { ReactNode } from "react"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

interface LegalLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  lastUpdated: string
  backLabel: string
  backHref?: string
  isPrivateView?: boolean
  badgeLabel: string
  lastUpdatedLabel: string
}

export function LegalLayout({
  children,
  title,
  subtitle,
  lastUpdated,
  backLabel,
  backHref,
  isPrivateView = false,
  badgeLabel,
  lastUpdatedLabel
}: LegalLayoutProps) {
  return (
    <div
      className={cn(
        isPrivateView ? "space-y-6" : "pt-12 pb-20 px-6"
      )}
    >
      <div className={cn(isPrivateView ? "w-full" : "max-w-4xl mx-auto")}>

        <div
          className={cn(isPrivateView ? "mb-4" : "mb-8")}
        >
          <Link
            href={backHref ?? ROUTES.public.index}
            className="inline-flex items-center gap-2 text-[14px] font-bold text-secondary-text hover:text-primary-dark transition-colors group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-subtle group-hover:bg-surface-elevated transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </div>
            {backLabel}
          </Link>
        </div>


        <header className={cn(isPrivateView ? "mb-10" : "mb-16")}>
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-[11px] font-black uppercase tracking-[0.15em] mb-4">
              {badgeLabel}
            </span>
            <h1 className={cn(
              "font-black tracking-tight text-primary-dark mb-4",
              isPrivateView ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl"
            )}>
              {title}
            </h1>
            <p className={cn(
              "text-secondary-text font-medium leading-relaxed",
              isPrivateView ? "text-[16px] max-w-none" : "text-lg max-w-2xl"
            )}>
              {subtitle}
            </p>
            <div className={cn(
              "flex items-center gap-3 text-[13px] font-bold text-secondary-text/60 uppercase tracking-wider",
              isPrivateView ? "mt-6" : "mt-8"
            )}>
              <div className="h-px w-8 bg-border-soft" />
              {lastUpdatedLabel}: {lastUpdated}
            </div>
          </div>
        </header>


        <div
          className="legal-content prose prose-slate max-w-none 
            prose-headings:text-primary-dark prose-headings:font-black prose-headings:tracking-tight 
            prose-p:text-secondary-text prose-p:leading-relaxed prose-p:text-[16px]
            prose-li:text-secondary-text prose-li:text-[16px]
            prose-strong:text-primary-dark prose-strong:font-bold
            prose-hr:border-border-soft
            [&>section]:mb-12"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

