import type { GoalType, PlatformId } from "@/types/database.types"

export interface ObjectiveSeed {
  id: string
  name: string
  canonicalGoal: GoalType
  description: string
  strategyPrompt: string
  scope: PlatformId[]
  source: "platform_base"
}

export const BASE_OBJECTIVE_SEEDS: ObjectiveSeed[] = [
  {
    id: "base-linkedin-job-search",
    name: "Job search positioning",
    canonicalGoal: "Networking",
    description: "Construir credibilidad para atraer oportunidades laborales.",
    strategyPrompt: "Write as a professional seeking opportunities: show fit, curiosity and business value.",
    scope: ["linkedin"],
    source: "platform_base"
  },
  {
    id: "base-linkedin-networking",
    name: "Strategic networking",
    canonicalGoal: "Networking",
    description: "Abrir conversaciones con pares y referentes.",
    strategyPrompt: "Open a high-signal networking conversation with one practical angle and a clear follow-up invitation.",
    scope: ["linkedin"],
    source: "platform_base"
  },
  {
    id: "base-linkedin-authority",
    name: "Authority via insights",
    canonicalGoal: "Add Value",
    description: "Aportar un insight practico y aplicable.",
    strategyPrompt: "Share one concrete insight and one actionable next step to position expertise.",
    scope: ["linkedin"],
    source: "platform_base"
  },
  {
    id: "base-linkedin-conversation",
    name: "Conversation starter",
    canonicalGoal: "Question",
    description: "Activar respuesta del autor y de la audiencia.",
    strategyPrompt: "Ask a focused question that triggers practical discussion and invites a reply from the author.",
    scope: ["linkedin"],
    source: "platform_base"
  },
  {
    id: "base-linkedin-followup",
    name: "Professional follow-up",
    canonicalGoal: "Challenge",
    description: "Dar contrapunto respetuoso y elevar el debate.",
    strategyPrompt: "Respectfully challenge one assumption and provide a constructive alternative viewpoint.",
    scope: ["linkedin"],
    source: "platform_base"
  },
  {
    id: "base-upwork-proposal",
    name: "Freelance proposal",
    canonicalGoal: "Networking",
    description: "Orientado a propuesta concreta de trabajo.",
    strategyPrompt: "Respond like a freelancer proposal opener: prove relevance, reference scope and suggest a next step.",
    scope: ["upwork"],
    source: "platform_base"
  },
  {
    id: "base-upwork-scope-discovery",
    name: "Scope discovery",
    canonicalGoal: "Question",
    description: "Aclarar requerimientos antes de estimar.",
    strategyPrompt: "Ask diagnostic questions that clarify deliverables, constraints and timeline before committing.",
    scope: ["upwork"],
    source: "platform_base"
  },
  {
    id: "base-upwork-value-diff",
    name: "Value differentiation",
    canonicalGoal: "Add Value",
    description: "Mostrar enfoque y valor diferencial.",
    strategyPrompt: "Highlight a differentiated execution approach and measurable value for the client.",
    scope: ["upwork"],
    source: "platform_base"
  },
  {
    id: "base-upwork-close-cta",
    name: "Close with CTA",
    canonicalGoal: "Networking",
    description: "Cerrar con siguiente paso claro.",
    strategyPrompt: "Close with a clear call to action (brief call, scope confirmation, or pilot step).",
    scope: ["upwork"],
    source: "platform_base"
  },
  {
    id: "base-upwork-objections",
    name: "Objection handling",
    canonicalGoal: "Challenge",
    description: "Responder objeciones con claridad y calma.",
    strategyPrompt: "Address likely client objections directly with concise trade-offs and confidence.",
    scope: ["upwork"],
    source: "platform_base"
  },
  {
    id: "base-twitter-hot-take",
    name: "Constructive hot take",
    canonicalGoal: "Challenge",
    description: "Contrapunto corto con propuesta concreta.",
    strategyPrompt: "Offer a concise challenge and one practical alternative in a sharp tone.",
    scope: ["twitter"],
    source: "platform_base"
  },
  {
    id: "base-twitter-thread-value",
    name: "Thread value add",
    canonicalGoal: "Add Value",
    description: "Agregar ejemplo o data en una respuesta corta.",
    strategyPrompt: "Add one useful datapoint or mini-example that extends the thread's value.",
    scope: ["twitter"],
    source: "platform_base"
  },
  {
    id: "base-reddit-context-help",
    name: "Contextual help",
    canonicalGoal: "Add Value",
    description: "Responder utilmente segun contexto del sub.",
    strategyPrompt: "Provide practical, context-aware help with clear reasoning and no fluff.",
    scope: ["reddit"],
    source: "platform_base"
  },
  {
    id: "base-reddit-question",
    name: "Clarifying question",
    canonicalGoal: "Question",
    description: "Pedir info clave para mejorar la respuesta.",
    strategyPrompt: "Ask one clarifying question that unlocks a higher-quality answer.",
    scope: ["reddit"],
    source: "platform_base"
  },
  {
    id: "base-youtube-insight",
    name: "Insightful reaction",
    canonicalGoal: "Add Value",
    description: "Aportar insight a partir del video.",
    strategyPrompt: "Add one insight that builds on the video and encourages deeper discussion.",
    scope: ["youtube"],
    source: "platform_base"
  },
  {
    id: "base-youtube-engage-question",
    name: "Engagement question",
    canonicalGoal: "Question",
    description: "Pregunta que invite comentarios de calidad.",
    strategyPrompt: "Ask a thoughtful question that encourages viewers to share specific perspectives.",
    scope: ["youtube"],
    source: "platform_base"
  }
]
