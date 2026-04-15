"use client";

import { Chrome, Compass, AppWindow, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import Link from "next/link";
import { useLanguageStore } from "@/store/useLanguageStore";

interface DownloadDropdownProps {
    className?: string;
}

export function DownloadDropdown({ className }: DownloadDropdownProps) {
    const t = useLanguageStore((state) => state.t);

    const downloadLinks = [
        { name: "Chrome", icon: Chrome, href: "https://chrome.google.com/webstore", description: t.header.download.chrome },
        { name: "Edge", icon: AppWindow, href: "https://microsoftedge.microsoft.com/addons", description: t.header.download.edge },
        { name: "Safari", icon: Compass, href: "https://apps.apple.com/", description: t.header.download.safari },
    ];

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-soft bg-surface-subtle text-secondary-text transition-all duration-200 hover:bg-surface-elevated hover:border-border-light hover:shadow-premium-sm hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/35",
                        className
                    )}
                    aria-label={t.header.download.button}
                >
                    <Download className="h-4 w-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 p-1.5">
                <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-secondary-text mb-1 relative after:absolute after:bottom-0 after:left-2 after:right-2 after:h-px after:bg-border-soft">
                    {t.header.download.availableFor}
                </div>
                {downloadLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <DropdownMenuItem key={link.name} asChild className="cursor-pointer">
                            <Link href={link.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 rounded-[10px] border border-transparent px-2 py-2 outline-none transition-all duration-200 hover:bg-surface-elevated hover:border-border-soft hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:text-primary-dark w-full group dark:hover:shadow-[0_4px_12px_rgba(255,255,255,0.03)]">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-elevated border border-border-soft shadow-premium-sm transition-all duration-200 group-hover:bg-[#111111] group-hover:border-[#111111] group-hover:text-white group-hover:shadow-md dark:group-hover:bg-white dark:group-hover:border-white dark:group-hover:text-black">
                                    <Icon className="h-5 w-5 transition-colors duration-200" />
                                </div>
                                <div className="flex flex-col items-start gap-0.5">
                                    <span className="text-[13px] font-semibold leading-none text-primary-text">{link.name}</span>
                                    <span className="text-[11px] font-medium leading-none text-tertiary-text">{link.description}</span>
                                </div>
                            </Link>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
