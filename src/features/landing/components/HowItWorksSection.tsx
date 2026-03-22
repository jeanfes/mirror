import { Download, SlidersHorizontal, Keyboard } from "lucide-react";
import { Dictionary } from "@/lib/i18n";


interface HowItWorksSectionProps {
    t: Dictionary;
}

export function HowItWorksSection({ t }: HowItWorksSectionProps) {
    return (
        <section className="w-full py-20 bg-surface-base border-y border-border-soft relative z-10 backdrop-blur-sm">
            <div className="mx-auto max-w-6xl px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black tracking-tight text-primary-dark sm:text-4xl">{t.howItWorks.title}</h2>
                    <p className="mt-4 text-secondary-text font-medium text-lg">{t.howItWorks.subtitle}</p>
                </div>

                <div
                    className="grid md:grid-cols-3 gap-8 relative"
                >
                    <div className="hidden md:block absolute top-13 left-[15%] right-[15%] h-0.5 bg-linear-to-r from-transparent via-border-soft to-transparent -z-10" />

                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 mb-6 rounded-4xl bg-bg-main shadow-inner flex items-center justify-center ring-1 ring-border-soft">
                            <Download className="h-10 w-10 text-primary-dark" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-primary-dark mb-2">{t.howItWorks.s1Title}</h3>
                        <p className="text-secondary-text font-medium text-[0.95rem] max-w-xs leading-relaxed">
                            {t.howItWorks.s1Desc}
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 mb-6 rounded-4xl bg-bg-main shadow-inner flex items-center justify-center ring-1 ring-border-soft">
                            <SlidersHorizontal className="h-10 w-10 text-primary-dark" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-primary-dark mb-2">{t.howItWorks.s2Title}</h3>
                        <p className="text-secondary-text font-medium text-[0.95rem] max-w-xs leading-relaxed">
                            {t.howItWorks.s2Desc}
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 mb-6 rounded-4xl bg-bg-main shadow-inner flex items-center justify-center ring-1 ring-border-soft">
                            <Keyboard className="h-10 w-10 text-primary-dark" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-xl font-bold text-primary-dark mb-2">{t.howItWorks.s3Title}</h3>
                        <p className="text-secondary-text font-medium text-[0.95rem] max-w-xs leading-relaxed">
                            {t.howItWorks.s3Desc}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
