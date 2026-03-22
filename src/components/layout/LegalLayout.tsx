import { ReactNode } from "react"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"

interface LegalLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  lastUpdated: string
}

export function LegalLayout({ children, title, subtitle, lastUpdated }: LegalLayoutProps) {
  return (
    <div className="bg-surface-base min-h-screen pt-12 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        <div
          className="mb-8"
        >
          <Link
            href={ROUTES.public.index}
            className="inline-flex items-center gap-2 text-[14px] font-bold text-secondary-text hover:text-primary-dark transition-colors group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-subtle group-hover:bg-surface-elevated transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </div>
            Volver al inicio
          </Link>
        </div>

        
        <header className="mb-16">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-[11px] font-black uppercase tracking-[0.15em] mb-4">
              Legal & Privacidad
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-primary-dark mb-4">
              {title}
            </h1>
            <p className="text-lg text-secondary-text font-medium max-w-2xl leading-relaxed">
              {subtitle}
            </p>
            <div className="mt-8 flex items-center gap-3 text-[13px] font-bold text-secondary-text/60 uppercase tracking-wider">
              <div className="h-px w-8 bg-border-soft" />
              Última actualización: {lastUpdated}
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

