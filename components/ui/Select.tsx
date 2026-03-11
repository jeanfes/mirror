"use client"

import { useMemo } from "react"
import { Check, ChevronDown } from "lucide-react"

export interface SelectOption {
    label: string
    value: string
}

interface SelectProps {
    value: string
    onChange: (value: string) => void
    options: SelectOption[]
    className?: string
}

export function Select({ value, onChange, options, className = "" }: SelectProps) {
    const selected = useMemo(() => options.find((option) => option.value === value), [options, value])

    return (
        <label className={`relative block ${className}`}>
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Selection</span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full h-10 appearance-none rounded-[12px] border border-[#E6EAF2] bg-white px-3 pr-9 text-[13px] font-medium text-[#1A1D26] focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-[31px] h-4 w-4 text-slate-500" />
            {selected && <Check className="pointer-events-none absolute right-8 top-[31px] h-4 w-4 text-[#8B5CF6]" />}
        </label>
    )
}
