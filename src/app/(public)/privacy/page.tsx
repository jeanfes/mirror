import { cookies, headers } from "next/headers"
import { LegalLayout } from "@/components/layout/LegalLayout"
import { ROUTES } from "@/lib/routes"

type LegalLocale = "es" | "en" | "pt" | "fr" | "de"

type PrivacyCopy = {
  backLabel: string
  badgeLabel: string
  lastUpdatedLabel: string
  title: string
  subtitle: string
  lastUpdated: string
  preambleTitle: string
  preambleBody: string
  article1Title: string
  article1Body: string
  article2Title: string
  directDataTitle: string
  directDataItems: string[]
  automaticDataTitle: string
  automaticDataItems: string[]
  noCollectTitle: string
  noCollectItems: string[]
  article3Title: string
  article3Intro: string
  article3Items: Array<{ label: string; text: string }>
  article3Badge: string
  article7Title: string
  article7Intro: string
  rightsCards: Array<{ title: string; text: string }>
  contactLabel: string
  contactEmail: string
}

const privacyCopy: Record<LegalLocale, PrivacyCopy> = {
  es: {
    backLabel: "Volver al inicio",
    badgeLabel: "Legal y Privacidad",
    lastUpdatedLabel: "Última actualización",
    title: "Política de Privacidad",
    subtitle:
      "Tu privacidad es nuestra prioridad. Aquí explicamos cómo tratamos y protegemos tus datos personales.",
    lastUpdated: "17 de marzo de 2026",
    preambleTitle: "PREÁMBULO",
    preambleBody:
      "Esta Política de Privacidad y Tratamiento de Datos Personales se emite conforme a la Ley 1581 de 2012 de Colombia, el GDPR de la Unión Europea y la CCPA de California.",
    article1Title: "ARTÍCULO 1 — RESPONSABLE DEL TRATAMIENTO",
    article1Body:
      "El responsable del tratamiento de los datos personales recopilados a través de Mirror es su propietario y operador, con domicilio en Bogotá, Colombia. Para consultas: privacy@mirror.com",
    article2Title: "ARTÍCULO 2 — DATOS PERSONALES QUE RECOPILAMOS",
    directDataTitle: "Datos directos",
    directDataItems: [
      "Nombre y correo electrónico",
      "Perfiles de voz (tono y estilo)",
      "Fragmentos de publicaciones",
      "Preferencias de configuración"
    ],
    automaticDataTitle: "Datos automáticos",
    automaticDataItems: [
      "Historial de generación",
      "Créditos consumidos y disponibles",
      "Metadatos técnicos (tokens, modelo)",
      "Marca de tiempo de uso"
    ],
    noCollectTitle: "Lo que no recopilamos",
    noCollectItems: [
      "Datos de tarjetas de crédito o CVV",
      "Credenciales de acceso a plataformas de terceros",
      "Contenido completo de tus perfiles externos",
      "Historial de navegación fuera del Servicio"
    ],
    article3Title: "ARTÍCULO 3 — FINALIDADES DEL TRATAMIENTO",
    article3Intro: "Los datos personales del Usuario se tratan exclusivamente para:",
    article3Items: [
      { label: "Prestación del Servicio", text: "Gestión de cuenta, procesamiento con IA y personalización." },
      { label: "Relación Contractual", text: "Gestión de suscripciones y pagos vía Lemon Squeezy." },
      { label: "Seguridad", text: "Detección de fraude y prevención de abuso del Servicio." },
      { label: "Cumplimiento Legal", text: "Obligaciones fiscales y requerimientos normativos aplicables." }
    ],
    article3Badge: "Mirror no vende ni comercializa datos personales a terceros bajo ninguna circunstancia.",
    article7Title: "ARTÍCULO 7 — DERECHOS DEL TITULAR",
    article7Intro: "Tienes control sobre tus datos. Puedes ejercer tus derechos desde la aplicación:",
    rightsCards: [
      { title: "Acceso y Portabilidad", text: "Configuración → Exportar → Iniciar copia de seguridad" },
      { title: "Rectificación", text: "Directamente en tu Perfil o Configuración" },
      { title: "Eliminación", text: "Configuración → Exportar → Eliminar cuenta" }
    ],
    contactLabel: "¿Consultas sobre tu privacidad?",
    contactEmail: "privacy@mirror.com"
  },
  en: {
    backLabel: "Back to home",
    badgeLabel: "Legal and Privacy",
    lastUpdatedLabel: "Last updated",
    title: "Privacy Policy",
    subtitle:
      "Your privacy is our priority. Here we explain how we handle and protect your personal data.",
    lastUpdated: "March 17, 2026",
    preambleTitle: "PREAMBLE",
    preambleBody:
      "This Privacy Policy and Personal Data Processing Policy is issued in accordance with Colombia Law 1581/2012, the EU GDPR, and the California CCPA.",
    article1Title: "ARTICLE 1 — DATA CONTROLLER",
    article1Body:
      "The data controller of personal data collected through Mirror is its owner and operator, based in Bogotá, Colombia. Contact: privacy@mirror.com",
    article2Title: "ARTICLE 2 — PERSONAL DATA WE COLLECT",
    directDataTitle: "Direct data",
    directDataItems: [
      "Name and email address",
      "Voice profiles (tone and style)",
      "Post snippets",
      "Configuration preferences"
    ],
    automaticDataTitle: "Automatic data",
    automaticDataItems: [
      "Generation history",
      "Used and available credits",
      "Technical metadata (tokens, model)",
      "Usage timestamps"
    ],
    noCollectTitle: "What we do not collect",
    noCollectItems: [
      "Credit card or CVV data",
      "Third-party platform login credentials",
      "Full external profile content",
      "Browsing history outside the Service"
    ],
    article3Title: "ARTICLE 3 — PURPOSES OF PROCESSING",
    article3Intro: "Personal data is processed exclusively for:",
    article3Items: [
      { label: "Service delivery", text: "Account management, AI processing, and personalization." },
      { label: "Contractual relationship", text: "Subscription and payment management via Lemon Squeezy." },
      { label: "Security", text: "Fraud detection and abuse prevention." },
      { label: "Legal compliance", text: "Tax obligations and applicable legal requirements." }
    ],
    article3Badge: "Mirror does not sell or trade personal data with third parties under any circumstance.",
    article7Title: "ARTICLE 7 — DATA SUBJECT RIGHTS",
    article7Intro: "You remain in control of your data. You can exercise your rights from the app:",
    rightsCards: [
      { title: "Access and Portability", text: "Settings → Export → Start Backup" },
      { title: "Rectification", text: "Directly in your Profile or Settings" },
      { title: "Deletion", text: "Settings → Export → Delete account" }
    ],
    contactLabel: "Questions about your privacy?",
    contactEmail: "privacy@mirror.com"
  },
  pt: {
    backLabel: "Voltar ao início",
    badgeLabel: "Legal e Privacidade",
    lastUpdatedLabel: "Última atualização",
    title: "Política de Privacidade",
    subtitle:
      "Sua privacidade é nossa prioridade. Aqui explicamos como tratamos e protegemos seus dados pessoais.",
    lastUpdated: "17 de março de 2026",
    preambleTitle: "PREÂMBULO",
    preambleBody:
      "Esta Política de Privacidade e Tratamento de Dados Pessoais é emitida em conformidade com a Lei 1581/2012 da Colômbia, o GDPR da União Europeia e a CCPA da Califórnia.",
    article1Title: "ARTIGO 1 — CONTROLADOR DE DADOS",
    article1Body:
      "O controlador dos dados pessoais coletados pelo Mirror é seu proprietário e operador, com domicílio em Bogotá, Colômbia. Contato: privacy@mirror.com",
    article2Title: "ARTIGO 2 — DADOS PESSOAIS COLETADOS",
    directDataTitle: "Dados diretos",
    directDataItems: [
      "Nome e e-mail",
      "Perfis de voz (tom e estilo)",
      "Trechos de publicações",
      "Preferências de configuração"
    ],
    automaticDataTitle: "Dados automáticos",
    automaticDataItems: [
      "Histórico de geração",
      "Créditos consumidos e disponíveis",
      "Metadados técnicos (tokens, modelo)",
      "Marcação de tempo de uso"
    ],
    noCollectTitle: "O que não coletamos",
    noCollectItems: [
      "Dados de cartão de crédito ou CVV",
      "Credenciais de acesso de plataformas de terceiros",
      "Conteúdo completo de perfis externos",
      "Histórico de navegação fora do Serviço"
    ],
    article3Title: "ARTIGO 3 — FINALIDADES DO TRATAMENTO",
    article3Intro: "Os dados pessoais são tratados exclusivamente para:",
    article3Items: [
      { label: "Prestação do Serviço", text: "Gestão de conta, processamento com IA e personalização." },
      { label: "Relação contratual", text: "Gestão de assinaturas e pagamentos via Lemon Squeezy." },
      { label: "Segurança", text: "Detecção de fraude e prevenção de abuso." },
      { label: "Cumprimento legal", text: "Obrigações fiscais e exigências legais aplicáveis." }
    ],
    article3Badge: "O Mirror não vende nem comercializa dados pessoais com terceiros em nenhuma hipótese.",
    article7Title: "ARTIGO 7 — DIREITOS DO TITULAR",
    article7Intro: "Você mantém controle dos seus dados. Pode exercer seus direitos no aplicativo:",
    rightsCards: [
      { title: "Acesso e Portabilidade", text: "Configurações → Exportar → Iniciar Backup" },
      { title: "Retificação", text: "Diretamente no seu Perfil ou Configurações" },
      { title: "Exclusão", text: "Configurações → Exportar → Excluir conta" }
    ],
    contactLabel: "Dúvidas sobre sua privacidade?",
    contactEmail: "privacy@mirror.com"
  },
  fr: {
    backLabel: "Retour à l'accueil",
    badgeLabel: "Légal et Confidentialité",
    lastUpdatedLabel: "Dernière mise à jour",
    title: "Politique de Confidentialité",
    subtitle:
      "Votre vie privée est notre priorité. Voici comment nous traitons et protégeons vos données personnelles.",
    lastUpdated: "17 mars 2026",
    preambleTitle: "PRÉAMBULE",
    preambleBody:
      "Cette Politique de Confidentialité et de Traitement des Données Personnelles est émise conformément à la loi colombienne 1581/2012, au RGPD de l'Union européenne et à la CCPA californienne.",
    article1Title: "ARTICLE 1 — RESPONSABLE DU TRAITEMENT",
    article1Body:
      "Le responsable du traitement des données personnelles collectées via Mirror est son propriétaire et opérateur, domicilié à Bogotá, Colombie. Contact : privacy@mirror.com",
    article2Title: "ARTICLE 2 — DONNÉES PERSONNELLES COLLECTÉES",
    directDataTitle: "Données directes",
    directDataItems: [
      "Nom et e-mail",
      "Profils de voix (ton et style)",
      "Extraits de publications",
      "Préférences de configuration"
    ],
    automaticDataTitle: "Données automatiques",
    automaticDataItems: [
      "Historique de génération",
      "Crédits utilisés et disponibles",
      "Métadonnées techniques (tokens, modèle)",
      "Horodatage d'utilisation"
    ],
    noCollectTitle: "Ce que nous ne collectons pas",
    noCollectItems: [
      "Données de carte bancaire ou CVV",
      "Identifiants de connexion de plateformes tierces",
      "Contenu complet des profils externes",
      "Historique de navigation hors Service"
    ],
    article3Title: "ARTICLE 3 — FINALITÉS DU TRAITEMENT",
    article3Intro: "Les données personnelles sont traitées exclusivement pour :",
    article3Items: [
      { label: "Prestation du Service", text: "Gestion du compte, traitement IA et personnalisation." },
      { label: "Relation contractuelle", text: "Gestion des abonnements et paiements via Lemon Squeezy." },
      { label: "Sécurité", text: "Détection de fraude et prévention des abus." },
      { label: "Conformité légale", text: "Obligations fiscales et exigences réglementaires applicables." }
    ],
    article3Badge: "Mirror ne vend ni ne commercialise de données personnelles à des tiers, en aucune circonstance.",
    article7Title: "ARTICLE 7 — DROITS DE LA PERSONNE CONCERNÉE",
    article7Intro: "Vous gardez le contrôle de vos données. Vous pouvez exercer vos droits depuis l'application :",
    rightsCards: [
      { title: "Accès et Portabilité", text: "Paramètres → Exporter → Démarrer la sauvegarde" },
      { title: "Rectification", text: "Directement dans votre Profil ou Paramètres" },
      { title: "Suppression", text: "Paramètres → Exporter → Supprimer le compte" }
    ],
    contactLabel: "Des questions sur votre confidentialité ?",
    contactEmail: "privacy@mirror.com"
  },
  de: {
    backLabel: "Zurück zur Startseite",
    badgeLabel: "Rechtliches und Datenschutz",
    lastUpdatedLabel: "Letzte Aktualisierung",
    title: "Datenschutzrichtlinie",
    subtitle:
      "Ihre Privatsphäre hat für uns Priorität. Hier erklären wir, wie wir Ihre personenbezogenen Daten verarbeiten und schützen.",
    lastUpdated: "17. März 2026",
    preambleTitle: "PRÄAMBEL",
    preambleBody:
      "Diese Datenschutz- und Datenverarbeitungsrichtlinie wird gemäß dem kolumbianischen Gesetz 1581/2012, der EU-DSGVO und dem kalifornischen CCPA bereitgestellt.",
    article1Title: "ARTIKEL 1 — VERANTWORTLICHER",
    article1Body:
      "Verantwortlicher für die über Mirror erhobenen personenbezogenen Daten ist der Eigentümer und Betreiber mit Sitz in Bogotá, Kolumbien. Kontakt: privacy@mirror.com",
    article2Title: "ARTIKEL 2 — PERSONENBEZOGENE DATEN, DIE WIR ERHEBEN",
    directDataTitle: "Direkte Daten",
    directDataItems: [
      "Name und E-Mail-Adresse",
      "Stimmprofile (Ton und Stil)",
      "Beitragsausschnitte",
      "Konfigurationseinstellungen"
    ],
    automaticDataTitle: "Automatische Daten",
    automaticDataItems: [
      "Generierungsverlauf",
      "Verbrauchte und verfügbare Credits",
      "Technische Metadaten (Tokens, Modell)",
      "Nutzungszeitstempel"
    ],
    noCollectTitle: "Was wir nicht erheben",
    noCollectItems: [
      "Kreditkarten- oder CVV-Daten",
      "Login-Zugangsdaten für Drittplattformen",
      "Vollständige externe Profilinhalte",
      "Browserverlauf außerhalb des Dienstes"
    ],
    article3Title: "ARTIKEL 3 — ZWECKE DER VERARBEITUNG",
    article3Intro: "Personenbezogene Daten werden ausschließlich verarbeitet für:",
    article3Items: [
      { label: "Bereitstellung des Dienstes", text: "Kontoverwaltung, KI-Verarbeitung und Personalisierung." },
      { label: "Vertragliche Beziehung", text: "Abonnement- und Zahlungsverwaltung über Lemon Squeezy." },
      { label: "Sicherheit", text: "Betrugserkennung und Missbrauchsprävention." },
      { label: "Rechtliche Pflichten", text: "Steuerliche Verpflichtungen und gesetzliche Anforderungen." }
    ],
    article3Badge: "Mirror verkauft oder handelt unter keinen Umständen personenbezogene Daten an Dritte.",
    article7Title: "ARTIKEL 7 — RECHTE DER BETROFFENEN PERSON",
    article7Intro: "Sie behalten die Kontrolle über Ihre Daten. Rechte können direkt in der App ausgeübt werden:",
    rightsCards: [
      { title: "Auskunft und Portabilität", text: "Einstellungen → Exportieren → Backup starten" },
      { title: "Berichtigung", text: "Direkt im Profil oder in den Einstellungen" },
      { title: "Löschung", text: "Einstellungen → Exportieren → Konto löschen" }
    ],
    contactLabel: "Fragen zu Ihrem Datenschutz?",
    contactEmail: "privacy@mirror.com"
  }
}

const privateBackLabelByLocale: Record<LegalLocale, string> = {
  es: "Volver a configuración",
  en: "Back to settings",
  pt: "Voltar às configurações",
  fr: "Retour aux paramètres",
  de: "Zurück zu Einstellungen",
}

export default async function PrivacyPage() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()])
  const localeRaw = cookieStore.get("NEXT_LOCALE")?.value ?? "es"
  const locale = localeRaw in privacyCopy ? (localeRaw as LegalLocale) : "es"
  const copy = privacyCopy[locale]
  const pathname = headerStore.get("x-pathname") ?? ""
  const isPrivatePrivacyRoute = pathname === ROUTES.private.privacy
  const resolvedBackLabel = isPrivatePrivacyRoute ? privateBackLabelByLocale[locale] : copy.backLabel
  const resolvedBackHref = isPrivatePrivacyRoute ? ROUTES.private.settings : ROUTES.public.index

  return (
    <LegalLayout
      title={copy.title}
      subtitle={copy.subtitle}
      lastUpdated={copy.lastUpdated}
      backLabel={resolvedBackLabel}
      backHref={resolvedBackHref}
      isPrivateView={isPrivatePrivacyRoute}
      badgeLabel={copy.badgeLabel}
      lastUpdatedLabel={copy.lastUpdatedLabel}
    >
      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4 italic underline decoration-accent-blue decoration-4 underline-offset-8">{copy.preambleTitle}</h2>
        <p>{copy.preambleBody}</p>
      </section>

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4">{copy.article1Title}</h2>
        <p>{copy.article1Body}</p>
      </section>

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4">{copy.article2Title}</h2>
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <div className="bg-surface-subtle p-6 rounded-2xl border border-border-soft">
            <h3 className="text-[14px] font-black uppercase tracking-wider text-primary-dark mb-3">{copy.directDataTitle}</h3>
            <ul className="text-[14px] space-y-2 list-none pl-0 mb-0">
              {copy.directDataItems.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-surface-subtle p-6 rounded-2xl border border-border-soft">
            <h3 className="text-[14px] font-black uppercase tracking-wider text-primary-dark mb-3">{copy.automaticDataTitle}</h3>
            <ul className="text-[14px] space-y-2 list-none pl-0 mb-0">
              {copy.automaticDataItems.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 bg-accent-blue/5 p-6 rounded-2xl border border-accent-blue/10">
          <h3 className="text-[14px] font-black uppercase tracking-wider text-accent-blue mb-3 italic">{copy.noCollectTitle}</h3>
          <ul className="text-[14px] space-y-2 list-disc pl-5 mb-0 text-secondary-text font-medium italic">
            {copy.noCollectItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4">{copy.article3Title}</h2>
        <p>{copy.article3Intro}</p>
        <ul className="list-disc pl-6 space-y-2">
          {copy.article3Items.map((item) => (
            <li key={item.label}>
              <strong>{item.label}:</strong> {item.text}
            </li>
          ))}
        </ul>
        <p className="mt-6 font-black text-primary-dark bg-yellow-400/10 px-4 py-2 rounded-lg inline-block italic">
          {copy.article3Badge}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4 italic underline decoration-accent-blue decoration-4 underline-offset-8">{copy.article7Title}</h2>
        <div className="space-y-4">
          <p>{copy.article7Intro}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {copy.rightsCards.map((card) => (
              <div key={card.title} className="border border-border-soft p-4 rounded-xl">
                <span className="font-black text-primary-dark">{card.title}</span>
                <p className="text-[13px] mt-1 mb-0">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="text-center pt-12">
        <p className="text-secondary-text font-bold mb-4 italic">{copy.contactLabel}</p>
        <a href={`mailto:${copy.contactEmail}`} className="text-2xl font-black text-accent-blue hover:underline">{copy.contactEmail}</a>
      </section>
    </LegalLayout>
  )
}
