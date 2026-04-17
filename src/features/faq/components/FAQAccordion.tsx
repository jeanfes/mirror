"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  readonly q: string;
  readonly a: string;
}

interface FAQAccordionProps {
  readonly questions: readonly FAQItem[];
}

export function FAQAccordion({ questions }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4 text-left max-w-3xl mx-auto">
      {questions.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={faq.q}
            className={`neo-card rounded-[18px] border border-border-light bg-surface-card backdrop-blur-sm shadow-premium-sm transition-all duration-300 ${isOpen ? 'shadow-premium-md scale-[1.02]' : 'hover:shadow-premium-sm'}`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between p-6 md:p-8 text-left"
            >
              <h3 className="text-lg md:text-xl font-black text-primary-dark pr-8">{faq.q}</h3>
              <div className={`shrink-0 h-10 w-10 flex items-center justify-center rounded-full transition-colors duration-300 ${isOpen ? 'bg-primary-dark text-text-inverse' : 'bg-surface-base text-primary-dark shadow-sm'}`}>
                <Plus className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
              </div>
            </button>
            <div
              className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-8 md:px-8 text-secondary-text text-[1.05rem] font-medium leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );
}
