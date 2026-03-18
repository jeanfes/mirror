import { AccountStatus, HistoryItem, Profile } from "@/types/dashboard"

export const profiles: Profile[] = [
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

export const history: HistoryItem[] = [
  {
    id: "hist_1",
    profileId: "persona_1",
    postAuthor: "Elena Torres",
    postHeadline: "VP Product at Nova",
    postSnippet: "We reduced customer churn by 18% in one quarter with one process change.",
    generatedText: "Excellent execution. The real win is converting feedback into a repeatable operating rhythm.",
    goal: "add_value",
    source: "generated",
    applied: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 4
  },
  {
    id: "hist_2",
    profileId: "persona_2",
    postAuthor: "Marcus Lee",
    postHeadline: "Founder",
    postSnippet: "Hiring your first PM is not about frameworks, it is about decision quality.",
    generatedText: "Great point. Decision quality compounds over time and shapes culture faster than any process chart.",
    goal: "networking",
    source: "alternative",
    applied: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 18
  }
]

export const account: AccountStatus = {
  plan: "Pro",
  creditsRemaining: 842,
  renewalDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString()
}