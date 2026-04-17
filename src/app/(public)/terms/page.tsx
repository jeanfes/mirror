import { cookies, headers } from "next/headers"
import { LegalLayout } from "@/components/layout/LegalLayout"
import { ROUTES } from "@/lib/routes"

type LegalLocale = "es" | "en" | "pt" | "fr" | "de"

type TermsCopy = {
  backLabel: string
  badgeLabel: string
  lastUpdatedLabel: string
  title: string
  subtitle: string
  lastUpdated: string
  preambleTitle: string
  preambleP1: string
  preambleP2: string
  article1Title: string
  definitions: Array<{ term: string; description: string }>
  article2Title: string
  article2Body: string
  article3Title: string
  article31: string
  article32: string
  article32Bullets: string[]
  article33: string
  article34: string
  article4Title: string
  tableHeaders: {
    plan: string
    price: string
    credits: string
    profiles: string
  }
  tableRows: Array<{
    plan: string
    price: string
    credits: string
    profiles: string
  }>
  article42: string
  article43: string
  article44: string
  article11Title: string
  article11Body: string
  article13Title: string
  article13Body: string
  contactLabel: string
  contactEmail: string
}

const termsCopy: Record<LegalLocale, TermsCopy> = {
  es: {
    backLabel: "Volver al inicio",
    badgeLabel: "Legal y Privacidad",
    lastUpdatedLabel: "Última actualización",
    title: "Términos y Condiciones de Uso",
    subtitle: "Lee atentamente las reglas que rigen el uso de Mirror para asegurar una experiencia segura y transparente.",
    lastUpdated: "17 de marzo de 2026",
    preambleTitle: "PREÁMBULO",
    preambleP1:
      "Los presentes Términos y Condiciones de Uso constituyen un contrato legalmente vinculante entre usted y el operador de Mirror, con domicilio en la República de Colombia.",
    preambleP2:
      "Al acceder, registrarse o utilizar la plataforma web de Mirror, su extensión de navegador o cualquier servicio relacionado, usted declara haber leído, comprendido y aceptado íntegramente estos Términos.",
    article1Title: "ARTÍCULO 1 — DEFINICIONES",
    definitions: [
      {
        term: "Servicio",
        description:
          "La plataforma web Mirror, su extensión de navegador, las APIs asociadas y cualquier funcionalidad ofrecida por Mirror."
      },
      {
        term: "Usuario",
        description:
          "Toda persona natural mayor de dieciocho (18) años que cree una cuenta y use el Servicio."
      },
      {
        term: "Perfil de Voz",
        description:
          "Configuración personalizada que contiene parámetros de tono, estilo y ejemplos para guiar la generación de contenido."
      },
      {
        term: "Contenido Generado",
        description:
          "Textos, comentarios o publicaciones producidos por el Servicio mediante inteligencia artificial según instrucciones del Usuario."
      },
      {
        term: "Créditos",
        description:
          "Unidades de uso asignadas mensualmente según el plan contratado y consumidas con cada generación de contenido."
      },
      {
        term: "Datos Personales",
        description:
          "Toda información que permita identificar al Usuario, conforme a la Ley 1581 de 2012 y normativa aplicable."
      }
    ],
    article2Title: "ARTÍCULO 2 — OBJETO DEL CONTRATO",
    article2Body:
      "Mirror presta un servicio de asistencia de escritura con IA que permite crear perfiles de voz y generar respuestas para plataformas compatibles. El Servicio no constituye una herramienta de automatización masiva, bot o sistema de publicación automática.",
    article3Title: "ARTÍCULO 3 — REGISTRO Y CONDICIONES DE ACCESO",
    article31: "3.1 El acceso al Servicio requiere crear una cuenta por correo electrónico o Google OAuth.",
    article32: "3.2 El Usuario declara, bajo su responsabilidad, que:",
    article32Bullets: [
      "Es mayor de dieciocho (18) años.",
      "La información de registro es veraz, completa y actualizada.",
      "Tiene capacidad legal para celebrar contratos en su jurisdicción."
    ],
    article33:
      "3.3 El Usuario es responsable de la confidencialidad de sus credenciales. Mirror no responde por accesos no autorizados derivados de negligencia del Usuario.",
    article34:
      "3.4 El Usuario deberá notificar de forma inmediata cualquier sospecha de acceso no autorizado a su cuenta.",
    article4Title: "ARTÍCULO 4 — PLANES, PRECIOS Y FACTURACIÓN",
    tableHeaders: {
      plan: "Plan",
      price: "Precio",
      credits: "Créditos",
      profiles: "Perfiles"
    },
    tableRows: [
      { plan: "Free", price: "$0 USD/mes", credits: "120", profiles: "1" },
      { plan: "Pro", price: "$19 USD/mes", credits: "1.200", profiles: "10" },
      { plan: "Elite", price: "$59 USD/mes", credits: "4.000", profiles: "Ilimitados" }
    ],
    article42:
      "4.2 Los precios están expresados en USD. Mirror puede modificarlos con un aviso previo de treinta (30) días calendario.",
    article43:
      "4.3 Los pagos son procesados por Lemon Squeezy como Merchant of Record. Mirror no almacena datos de tarjetas de crédito.",
    article44: "4.4 Las suscripciones se renuevan automáticamente, salvo cancelación previa.",
    article11Title: "ARTÍCULO 11 — TERMINACIÓN",
    article11Body:
      "11.1 El Usuario puede cancelar su cuenta en cualquier momento desde Configuración → Exportar → Eliminar cuenta. La eliminación es permanente e irreversible.",
    article13Title: "ARTÍCULO 13 — LEY APLICABLE Y JURISDICCIÓN",
    article13Body:
      "Estos Términos se rigen por las leyes de la República de Colombia. Para resolver controversias, las partes se someten a la competencia de los jueces y tribunales de Bogotá, Colombia.",
    contactLabel: "Para cualquier comunicación relacionada con estos Términos:",
    contactEmail: "legal@mirror.com"
  },
  en: {
    backLabel: "Back to home",
    badgeLabel: "Legal and Privacy",
    lastUpdatedLabel: "Last updated",
    title: "Terms and Conditions of Use",
    subtitle: "Please review the rules governing the use of Mirror to ensure a safe and transparent experience.",
    lastUpdated: "March 17, 2026",
    preambleTitle: "PREAMBLE",
    preambleP1:
      "These Terms and Conditions of Use form a legally binding agreement between you and the operator of Mirror, domiciled in the Republic of Colombia.",
    preambleP2:
      "By accessing, registering, or using Mirror web, browser extension, or related services, you confirm that you have read, understood, and fully accepted these Terms.",
    article1Title: "ARTICLE 1 — DEFINITIONS",
    definitions: [
      {
        term: "Service",
        description:
          "The Mirror web platform, browser extension, associated APIs, and any functionality offered by Mirror."
      },
      {
        term: "User",
        description: "Any natural person over eighteen (18) years old who creates an account and uses the Service."
      },
      {
        term: "Voice Profile",
        description:
          "A personalized setup containing tone, style, and examples used to guide generated content."
      },
      {
        term: "Generated Content",
        description:
          "Texts, comments, or posts produced by the Service through artificial intelligence based on User instructions."
      },
      {
        term: "Credits",
        description:
          "Usage units assigned monthly according to the selected plan and consumed with each content generation."
      },
      {
        term: "Personal Data",
        description:
          "Any information that identifies or can identify the User, according to applicable data protection rules."
      }
    ],
    article2Title: "ARTICLE 2 — PURPOSE OF THE AGREEMENT",
    article2Body:
      "Mirror provides an AI writing assistant that lets Users create voice profiles and generate responses for compatible platforms. The Service is not a mass automation tool, bot, or automatic posting system.",
    article3Title: "ARTICLE 3 — REGISTRATION AND ACCESS CONDITIONS",
    article31: "3.1 Access to the Service requires an account created through email or Google OAuth.",
    article32: "3.2 The User declares and guarantees that:",
    article32Bullets: [
      "They are over eighteen (18) years old.",
      "Registration information is accurate, complete, and up to date.",
      "They have legal capacity to enter into contracts in their jurisdiction."
    ],
    article33:
      "3.3 The User is solely responsible for safeguarding access credentials. Mirror is not liable for unauthorized access caused by User negligence.",
    article34: "3.4 The User must notify Mirror immediately of any suspected unauthorized account access.",
    article4Title: "ARTICLE 4 — PLANS, PRICING, AND BILLING",
    tableHeaders: {
      plan: "Plan",
      price: "Price",
      credits: "Credits",
      profiles: "Profiles"
    },
    tableRows: [
      { plan: "Free", price: "$0 USD/month", credits: "120", profiles: "1" },
      { plan: "Pro", price: "$19 USD/month", credits: "1,200", profiles: "10" },
      { plan: "Elite", price: "$59 USD/month", credits: "4,000", profiles: "Unlimited" }
    ],
    article42:
      "4.2 Prices are shown in USD. Mirror may update pricing with at least thirty (30) calendar days prior notice.",
    article43:
      "4.3 Payments are processed by Lemon Squeezy as Merchant of Record. Mirror does not store credit card data.",
    article44: "4.4 Subscriptions renew automatically unless cancelled in advance.",
    article11Title: "ARTICLE 11 — TERMINATION",
    article11Body:
      "11.1 Users can cancel their account at any time from Settings → Export → Delete account. Deletion is permanent and irreversible.",
    article13Title: "ARTICLE 13 — GOVERNING LAW AND JURISDICTION",
    article13Body:
      "These Terms are governed by the laws of the Republic of Colombia. Any dispute will be subject to the courts of Bogotá, Colombia.",
    contactLabel: "For any communication related to these Terms:",
    contactEmail: "legal@mirror.com"
  },
  pt: {
    backLabel: "Voltar ao início",
    badgeLabel: "Legal e Privacidade",
    lastUpdatedLabel: "Última atualização",
    title: "Termos e Condições de Uso",
    subtitle: "Leia com atenção as regras que regem o uso do Mirror para garantir uma experiência segura e transparente.",
    lastUpdated: "17 de março de 2026",
    preambleTitle: "PREÂMBULO",
    preambleP1:
      "Estes Termos e Condições de Uso constituem um contrato legalmente vinculante entre você e o operador do Mirror, com domicílio na República da Colômbia.",
    preambleP2:
      "Ao acessar, registrar-se ou usar o Mirror na web, a extensão de navegador ou serviços relacionados, você declara que leu, compreendeu e aceitou integralmente estes Termos.",
    article1Title: "ARTIGO 1 — DEFINIÇÕES",
    definitions: [
      {
        term: "Serviço",
        description:
          "A plataforma web Mirror, sua extensão de navegador, APIs associadas e qualquer funcionalidade oferecida pelo Mirror."
      },
      {
        term: "Usuário",
        description: "Toda pessoa física maior de dezoito (18) anos que cria uma conta e utiliza o Serviço."
      },
      {
        term: "Perfil de Voz",
        description:
          "Configuração personalizada com parâmetros de tom, estilo e exemplos para orientar a geração de conteúdo."
      },
      {
        term: "Conteúdo Gerado",
        description:
          "Textos, comentários ou publicações gerados pelo Serviço com inteligência artificial com base nas instruções do Usuário."
      },
      {
        term: "Créditos",
        description:
          "Unidades de uso atribuídas mensalmente conforme o plano contratado e consumidas a cada geração de conteúdo."
      },
      {
        term: "Dados Pessoais",
        description:
          "Toda informação que identifique ou possa identificar o Usuário, conforme a legislação aplicável."
      }
    ],
    article2Title: "ARTIGO 2 — OBJETO DO CONTRATO",
    article2Body:
      "O Mirror oferece um serviço de assistência de escrita com IA que permite criar perfis de voz e gerar respostas para plataformas compatíveis. O Serviço não constitui automação em massa, bot ou sistema de publicação automática.",
    article3Title: "ARTIGO 3 — REGISTRO E CONDIÇÕES DE ACESSO",
    article31: "3.1 O acesso ao Serviço exige criação de conta por e-mail ou Google OAuth.",
    article32: "3.2 O Usuário declara, sob sua responsabilidade, que:",
    article32Bullets: [
      "É maior de dezoito (18) anos.",
      "As informações de cadastro são verdadeiras, completas e atualizadas.",
      "Possui capacidade legal para contratar em sua jurisdição."
    ],
    article33:
      "3.3 O Usuário é o único responsável pela confidencialidade das credenciais de acesso. O Mirror não responde por acessos não autorizados decorrentes de negligência do Usuário.",
    article34: "3.4 O Usuário deve notificar imediatamente qualquer suspeita de acesso não autorizado à conta.",
    article4Title: "ARTIGO 4 — PLANOS, PREÇOS E FATURAMENTO",
    tableHeaders: {
      plan: "Plano",
      price: "Preço",
      credits: "Créditos",
      profiles: "Perfis"
    },
    tableRows: [
      { plan: "Free", price: "$0 USD/mês", credits: "120", profiles: "1" },
      { plan: "Pro", price: "$19 USD/mês", credits: "1.200", profiles: "10" },
      { plan: "Elite", price: "$59 USD/mês", credits: "4.000", profiles: "Ilimitados" }
    ],
    article42:
      "4.2 Os preços são expressos em USD. O Mirror pode alterá-los com aviso prévio de trinta (30) dias corridos.",
    article43:
      "4.3 Os pagamentos são processados pela Lemon Squeezy como Merchant of Record. O Mirror não armazena dados de cartão de crédito.",
    article44: "4.4 As assinaturas são renovadas automaticamente, salvo cancelamento prévio.",
    article11Title: "ARTIGO 11 — RESCISÃO",
    article11Body:
      "11.1 O Usuário pode cancelar a conta a qualquer momento em Configurações → Exportar → Excluir conta. A exclusão é permanente e irreversível.",
    article13Title: "ARTIGO 13 — LEI APLICÁVEL E JURISDIÇÃO",
    article13Body:
      "Estes Termos são regidos pelas leis da República da Colômbia. Para resolver controvérsias, as partes se submetem aos juízes e tribunais de Bogotá, Colômbia.",
    contactLabel: "Para qualquer comunicação relacionada a estes Termos:",
    contactEmail: "legal@mirror.com"
  },
  fr: {
    backLabel: "Retour à l'accueil",
    badgeLabel: "Légal et Confidentialité",
    lastUpdatedLabel: "Dernière mise à jour",
    title: "Conditions Générales d'Utilisation",
    subtitle: "Veuillez lire attentivement les règles d'utilisation de Mirror afin de garantir une expérience sûre et transparente.",
    lastUpdated: "17 mars 2026",
    preambleTitle: "PRÉAMBULE",
    preambleP1:
      "Les présentes Conditions Générales d'Utilisation constituent un contrat juridiquement contraignant entre vous et l'opérateur de Mirror, domicilié en République de Colombie.",
    preambleP2:
      "En accédant à Mirror, en vous inscrivant ou en utilisant la plateforme web, l'extension navigateur ou tout service connexe, vous reconnaissez avoir lu, compris et accepté intégralement ces Conditions.",
    article1Title: "ARTICLE 1 — DÉFINITIONS",
    definitions: [
      {
        term: "Service",
        description:
          "La plateforme web Mirror, son extension navigateur, les API associées et toute fonctionnalité fournie par Mirror."
      },
      {
        term: "Utilisateur",
        description:
          "Toute personne physique âgée de plus de dix-huit (18) ans qui crée un compte et utilise le Service."
      },
      {
        term: "Profil de Voix",
        description:
          "Configuration personnalisée contenant ton, style et exemples afin de guider la génération de contenu."
      },
      {
        term: "Contenu Généré",
        description:
          "Textes, commentaires ou publications produits par le Service via intelligence artificielle selon les instructions de l'Utilisateur."
      },
      {
        term: "Crédits",
        description:
          "Unités d'usage attribuées mensuellement selon le plan choisi et consommées à chaque génération."
      },
      {
        term: "Données Personnelles",
        description:
          "Toute information permettant d'identifier l'Utilisateur, conformément à la réglementation applicable."
      }
    ],
    article2Title: "ARTICLE 2 — OBJET DU CONTRAT",
    article2Body:
      "Mirror fournit un service d'assistance rédactionnelle par IA permettant de créer des profils de voix et de générer des réponses pour des plateformes compatibles. Le Service n'est pas un outil d'automatisation massive, un bot ou un système de publication automatique.",
    article3Title: "ARTICLE 3 — INSCRIPTION ET CONDITIONS D'ACCÈS",
    article31: "3.1 L'accès au Service nécessite la création d'un compte par e-mail ou Google OAuth.",
    article32: "3.2 L'Utilisateur déclare sous sa responsabilité que :",
    article32Bullets: [
      "Il/elle est âgé(e) de plus de dix-huit (18) ans.",
      "Les informations fournies à l'inscription sont exactes, complètes et à jour.",
      "Il/elle dispose de la capacité juridique de contracter dans sa juridiction."
    ],
    article33:
      "3.3 L'Utilisateur est seul responsable de la confidentialité de ses identifiants. Mirror n'est pas responsable des accès non autorisés résultant d'une négligence de l'Utilisateur.",
    article34:
      "3.4 L'Utilisateur doit notifier Mirror immédiatement en cas de suspicion d'accès non autorisé à son compte.",
    article4Title: "ARTICLE 4 — OFFRES, TARIFS ET FACTURATION",
    tableHeaders: {
      plan: "Offre",
      price: "Prix",
      credits: "Crédits",
      profiles: "Profils"
    },
    tableRows: [
      { plan: "Free", price: "$0 USD/mois", credits: "120", profiles: "1" },
      { plan: "Pro", price: "$19 USD/mois", credits: "1 200", profiles: "10" },
      { plan: "Elite", price: "$59 USD/mois", credits: "4 000", profiles: "Illimités" }
    ],
    article42:
      "4.2 Les prix sont indiqués en USD. Mirror peut les modifier avec un préavis de trente (30) jours calendaires.",
    article43:
      "4.3 Les paiements sont traités par Lemon Squeezy en tant que Merchant of Record. Mirror ne stocke pas les données de carte bancaire.",
    article44: "4.4 Les abonnements sont renouvelés automatiquement sauf résiliation préalable.",
    article11Title: "ARTICLE 11 — RÉSILIATION",
    article11Body:
      "11.1 L'Utilisateur peut supprimer son compte à tout moment depuis Paramètres → Exporter → Supprimer le compte. La suppression est permanente et irréversible.",
    article13Title: "ARTICLE 13 — DROIT APPLICABLE ET JURIDICTION",
    article13Body:
      "Les présentes Conditions sont régies par les lois de la République de Colombie. Tout litige relève de la compétence des tribunaux de Bogotá, Colombie.",
    contactLabel: "Pour toute communication relative à ces Conditions :",
    contactEmail: "legal@mirror.com"
  },
  de: {
    backLabel: "Zurück zur Startseite",
    badgeLabel: "Rechtliches und Datenschutz",
    lastUpdatedLabel: "Letzte Aktualisierung",
    title: "Nutzungsbedingungen",
    subtitle: "Bitte lesen Sie die Regeln zur Nutzung von Mirror sorgfältig, um eine sichere und transparente Erfahrung zu gewährleisten.",
    lastUpdated: "17. März 2026",
    preambleTitle: "PRÄAMBEL",
    preambleP1:
      "Diese Nutzungsbedingungen bilden einen rechtlich bindenden Vertrag zwischen Ihnen und dem Betreiber von Mirror mit Sitz in der Republik Kolumbien.",
    preambleP2:
      "Durch Zugriff auf Mirror, Registrierung oder Nutzung der Webplattform, Browser-Erweiterung oder verwandter Dienste bestätigen Sie, dass Sie diese Bedingungen gelesen, verstanden und vollständig akzeptiert haben.",
    article1Title: "ARTIKEL 1 — DEFINITIONEN",
    definitions: [
      {
        term: "Dienst",
        description:
          "Die Mirror-Webplattform, die Browser-Erweiterung, zugehörige APIs und alle von Mirror angebotenen Funktionen."
      },
      {
        term: "Nutzer",
        description:
          "Jede natürliche Person über achtzehn (18) Jahre, die ein Konto erstellt und den Dienst nutzt."
      },
      {
        term: "Stimmprofil",
        description:
          "Personalisierte Konfiguration mit Ton, Stil und Beispielen zur Steuerung der Inhaltsgenerierung."
      },
      {
        term: "Generierter Inhalt",
        description:
          "Texte, Kommentare oder Beiträge, die der Dienst mittels KI auf Grundlage der Nutzeranweisungen erstellt."
      },
      {
        term: "Credits",
        description:
          "Monatlich zugewiesene Nutzungseinheiten je nach Tarif, die pro Generierung verbraucht werden."
      },
      {
        term: "Personenbezogene Daten",
        description: "Alle Informationen, die den Nutzer identifizieren oder identifizierbar machen."
      }
    ],
    article2Title: "ARTIKEL 2 — VERTRAGSGEGENSTAND",
    article2Body:
      "Mirror bietet einen KI-gestützten Schreibassistenten, mit dem Nutzer Stimmprofile erstellen und Antworten für kompatible Plattformen generieren können. Der Dienst ist kein Massenautomatisierungs-Tool, Bot oder automatisches Veröffentlichungssystem.",
    article3Title: "ARTIKEL 3 — REGISTRIERUNG UND ZUGANGSBEDINGUNGEN",
    article31: "3.1 Der Zugriff auf den Dienst erfordert ein Konto per E-Mail oder Google OAuth.",
    article32: "3.2 Der Nutzer erklärt in eigener Verantwortung, dass:",
    article32Bullets: [
      "er/sie über achtzehn (18) Jahre alt ist.",
      "die Registrierungsdaten wahr, vollständig und aktuell sind.",
      "er/sie rechtsfähig ist, Verträge in seiner/ihrer Gerichtsbarkeit abzuschließen."
    ],
    article33:
      "3.3 Der Nutzer ist allein für die Vertraulichkeit seiner Zugangsdaten verantwortlich. Mirror haftet nicht für unbefugte Zugriffe aufgrund von Fahrlässigkeit des Nutzers.",
    article34: "3.4 Der Nutzer muss Mirror bei Verdacht auf unbefugten Kontozugriff unverzüglich informieren.",
    article4Title: "ARTIKEL 4 — TARIFE, PREISE UND ABRECHNUNG",
    tableHeaders: {
      plan: "Tarif",
      price: "Preis",
      credits: "Credits",
      profiles: "Profile"
    },
    tableRows: [
      { plan: "Free", price: "$0 USD/Monat", credits: "120", profiles: "1" },
      { plan: "Pro", price: "$19 USD/Monat", credits: "1.200", profiles: "10" },
      { plan: "Elite", price: "$59 USD/Monat", credits: "4.000", profiles: "Unbegrenzt" }
    ],
    article42:
      "4.2 Preise sind in USD angegeben. Mirror kann Preise mit einer Frist von dreißig (30) Kalendertagen anpassen.",
    article43:
      "4.3 Zahlungen werden von Lemon Squeezy als Merchant of Record verarbeitet. Mirror speichert keine Kreditkartendaten.",
    article44: "4.4 Abonnements verlängern sich automatisch, sofern sie nicht vorher gekündigt werden.",
    article11Title: "ARTIKEL 11 — KÜNDIGUNG",
    article11Body:
      "11.1 Nutzer können ihr Konto jederzeit über Einstellungen → Exportieren → Konto löschen kündigen. Die Löschung ist dauerhaft und unwiderruflich.",
    article13Title: "ARTIKEL 13 — ANWENDBARES RECHT UND GERICHTSSTAND",
    article13Body:
      "Diese Bedingungen unterliegen dem Recht der Republik Kolumbien. Für Streitigkeiten sind die Gerichte in Bogotá, Kolumbien zuständig.",
    contactLabel: "Für Mitteilungen zu diesen Bedingungen:",
    contactEmail: "legal@mirror.com"
  }
}

const privateBackLabelByLocale: Record<LegalLocale, string> = {
  es: "Volver a configuración",
  en: "Back to settings",
  pt: "Voltar às configurações",
  fr: "Retour aux paramètres",
  de: "Zurück zu Einstellungen",
}

export default async function TermsPage() {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()])
  const localeRaw = cookieStore.get("NEXT_LOCALE")?.value ?? "es"
  const locale = localeRaw in termsCopy ? (localeRaw as LegalLocale) : "es"
  const copy = termsCopy[locale]
  const pathname = headerStore.get("x-pathname") ?? ""
  const isPrivateTermsRoute = pathname === ROUTES.private.terms
  const resolvedBackLabel = isPrivateTermsRoute ? privateBackLabelByLocale[locale] : copy.backLabel
  const resolvedBackHref = isPrivateTermsRoute ? ROUTES.private.settings : ROUTES.public.index

  return (
    <LegalLayout
      title={copy.title}
      subtitle={copy.subtitle}
      lastUpdated={copy.lastUpdated}
      backLabel={resolvedBackLabel}
      backHref={resolvedBackHref}
      isPrivateView={isPrivateTermsRoute}
      badgeLabel={copy.badgeLabel}
      lastUpdatedLabel={copy.lastUpdatedLabel}
    >
      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4">{copy.preambleTitle}</h2>
        <p>{copy.preambleP1}</p>
        <p>{copy.preambleP2}</p>
      </section>

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4">{copy.article1Title}</h2>
        <ul className="space-y-3 list-none pl-0">
          {copy.definitions.map((definition) => (
            <li key={definition.term}>
              <strong>{definition.term}:</strong> {definition.description}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4">{copy.article2Title}</h2>
        <p>{copy.article2Body}</p>
      </section>

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4">{copy.article3Title}</h2>
        <div className="space-y-4">
          <p>{copy.article31}</p>
          <p>{copy.article32}</p>
          <ul className="list-disc pl-6 space-y-2">
            {copy.article32Bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <p>{copy.article33}</p>
          <p>{copy.article34}</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4">{copy.article4Title}</h2>
        <div className="overflow-hidden rounded-2xl border border-border-soft bg-surface-base shadow-sm mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-subtle/50">
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-secondary-text">{copy.tableHeaders.plan}</th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-secondary-text">{copy.tableHeaders.price}</th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-secondary-text">{copy.tableHeaders.credits}</th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-secondary-text">{copy.tableHeaders.profiles}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {copy.tableRows.map((row) => (
                <tr key={row.plan}>
                  <td className="px-6 py-4 font-bold text-primary-dark italic">{row.plan}</td>
                  <td className="px-6 py-4">{row.price}</td>
                  <td className="px-6 py-4">{row.credits}</td>
                  <td className="px-6 py-4">{row.profiles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-4">
          <p>{copy.article42}</p>
          <p>{copy.article43}</p>
          <p>{copy.article44}</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4">{copy.article11Title}</h2>
        <p>{copy.article11Body}</p>
      </section>

      <section className="bg-surface-subtle p-8 rounded-3xl border border-border-soft">
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4 italic underline decoration-accent-blue decoration-4 underline-offset-8">{copy.article13Title}</h2>
        <p className="mb-0">{copy.article13Body}</p>
      </section>

      <section className="text-center pt-12">
        <p className="text-secondary-text font-bold mb-4 italic">{copy.contactLabel}</p>
        <a href={`mailto:${copy.contactEmail}`} className="text-2xl font-black text-accent-blue hover:underline">{copy.contactEmail}</a>
      </section>
    </LegalLayout>
  )
}
