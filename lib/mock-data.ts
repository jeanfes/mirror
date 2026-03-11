import type { AccountStatus, DashboardSeed, HistoryItem, Persona, QuickStats } from "@/lib/types"

const personas: Persona[] = [
  {
    id: "persona_1",
    name: "Insight Architect",
    description: "Turns technical posts into strategic insights.",
    tone: "Confident, practical, concise",
    examples: [
      "Strong release. The real advantage is the shorter validation loop.",
      "Great framing. Teams scale better when the process is explicit.",
      "This is useful. Pair this with a weekly review and outcomes improve quickly."
    ],
    allowEmojis: false,
    enabled: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2
  },
  {
    id: "persona_2",
    name: "Warm Connector",
    description: "Builds trust while keeping a professional voice.",
    tone: "Friendly, collaborative, human",
    examples: [
      "Love this perspective. The people side is often the missing layer.",
      "This is a great reminder. Alignment usually beats speed.",
      "Appreciate this post. The execution details made it very practical."
    ],
    allowEmojis: true,
    enabled: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24
  }
]

const history: HistoryItem[] = [
  {
    id: "hist_1",
    personaId: "persona_1",
    postAuthor: "Elena Torres",
    postHeadline: "VP Product at Nova",
    postSnippet: "We reduced customer churn by 18% in one quarter with one process change.",
    generatedComment: "Excellent execution. The real win is converting feedback into a repeatable operating rhythm.",
    goal: "add_value",
    source: "generated",
    applied: true,
    timestamp: Date.now() - 1000 * 60 * 60 * 4
  },
  {
    id: "hist_2",
    personaId: "persona_2",
    postAuthor: "Marcus Lee",
    postHeadline: "Founder",
    postSnippet: "Hiring your first PM is not about frameworks, it is about decision quality.",
    generatedComment: "Great point. Decision quality compounds over time and shapes culture faster than any process chart.",
    goal: "networking",
    source: "alternative",
    applied: false,
    timestamp: Date.now() - 1000 * 60 * 60 * 18
  }
]

const account: AccountStatus = {
  plan: "Pro",
  creditsRemaining: 842,
  renewalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString()
}

function getQuickStats(): QuickStats {
  const now = new Date()
  const generatedThisMonth = history.filter((item) => {
    const ts = new Date(item.timestamp)
    return ts.getMonth() === now.getMonth() && ts.getFullYear() === now.getFullYear()
  }).length

  return {
    generatedThisMonth,
    activePersonas: personas.filter((item) => item.enabled).length,
    lastGeneratedAt: history[0]?.timestamp ?? null
  }
}

export function getDashboardSeed(): DashboardSeed {
  return {
    personas,
    history,
    account,
    stats: getQuickStats()
  }
}
