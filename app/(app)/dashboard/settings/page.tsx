"use client"

import { useState } from "react"
import { SectionHeader } from "@/components/layout/SectionHeader"
import { Card, Select, Toggle } from "@/components/ui"

export default function SettingsPage() {
    const [autoInsert, setAutoInsert] = useState(false)
    const [saveHistory, setSaveHistory] = useState(true)
    const [language, setLanguage] = useState("en")

    return (
        <div>
            <SectionHeader
                eyebrow="Private"
                title="Settings"
                description="Tune defaults for generation, language, and extension behavior."
            />

            <Card className="space-y-3 p-5">
                <Toggle checked={autoInsert} onChange={setAutoInsert} label="Auto-insert generated comments" />
                <Toggle checked={saveHistory} onChange={setSaveHistory} label="Save generation history" />
                <Select
                    value={language}
                    onChange={setLanguage}
                    options={[
                        { label: "English", value: "en" },
                        { label: "Spanish", value: "es" },
                        { label: "Portuguese", value: "pt" }
                    ]}
                />
            </Card>
        </div>
    )
}
