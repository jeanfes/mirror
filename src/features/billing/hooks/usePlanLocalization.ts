import { useLanguageStore } from "@/store/useLanguageStore"
import type { PlanDefinition } from "@/features/billing/services/billing.service"
import { useMemo } from "react"

export function usePlanLocalization(plan: PlanDefinition | undefined | null) {
  const { t, language } = useLanguageStore()

  return useMemo(() => {
    if (!plan) return { summary: "", features: [] as string[] }

    const { summary, features, metadata } = plan

    if (!metadata) {
      return { summary, features }
    }

    const { monthlyGenerations, maxProfiles, historyRetentionDays, allowedFeatures } = metadata

    // Localize Summary
    const profileText =
      maxProfiles === null || maxProfiles >= 999
        ? t.app.plans.features.summary_profiles_unlimited
        : t.app.plans.features.summary_profiles_count.replace("{0}", maxProfiles.toLocaleString(language))

    const localizedSummary = t.app.plans.features.summary_template
      .replace("{0}", monthlyGenerations.toLocaleString(language))
      .replace("{1}", profileText)

    // Localize Features
    const localizedFeatures: string[] = [
      t.app.plans.features.generations.replace("{0}", monthlyGenerations.toLocaleString(language)),
      maxProfiles === null || maxProfiles >= 999
        ? t.app.plans.features.profiles_unlimited
        : t.app.plans.features.profiles.replace("{0}", maxProfiles.toLocaleString(language)),
      historyRetentionDays >= 3650
        ? t.app.plans.features.history_unlimited
        : t.app.plans.features.history.replace("{0}", historyRetentionDays.toLocaleString(language)),
    ]

    // Add specific allowed features
    const featureDictionary = t.app.plans.features as Record<string, string | undefined>
    allowedFeatures.forEach((featureKey) => {
      const localizedKey = featureDictionary[featureKey]
      if (localizedKey) {
        localizedFeatures.push(localizedKey)
      }
    })

    return {
      summary: localizedSummary,
      features: Array.from(new Set(localizedFeatures)),
    }
  }, [plan, t, language])
}
