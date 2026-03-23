import { LegalLayout } from "@/components/layout/LegalLayout"

export default async function PrivacyPage() {
  return (
    <LegalLayout
      title="Política de Privacidad"
      subtitle="Tu privacidad es nuestra prioridad absoluta. Aquí detallamos cómo protegemos y tratamos tus datos personales bajo los más altos estándares internacionales."
      lastUpdated="17 de Marzo de 2026"
    >

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4 italic underline decoration-accent-blue decoration-4 underline-offset-8">PREÁMBULO</h2>
        <p>
          La presente Política de Privacidad y Tratamiento de Datos Personales es emitida por el operador de Mirror en cumplimiento de la Ley Estatutaria 1581 de 2012 de Colombia, el GDPR de la Unión Europea y la CCPA de California.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4">ARTÍCULO 1 — RESPONSABLE DEL TRATAMIENTO</h2>
        <p>
          El Responsable del Tratamiento de los datos personales recopilados a través de Mirror es su propietario y operador, con domicilio en <strong>Bogotá, Colombia</strong>. Para consultas, contactar a: <a href="mailto:privacy@mirror.com" className="text-accent-blue font-bold hover:underline">privacy@mirror.com</a>
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4">ARTÍCULO 2 — DATOS PERSONALES QUE RECOPILAMOS</h2>
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <div className="bg-surface-subtle p-6 rounded-2xl border border-border-soft">
            <h3 className="text-[14px] font-black uppercase tracking-wider text-primary-dark mb-3">Datos Directos</h3>
            <ul className="text-[14px] space-y-2 list-none pl-0 mb-0">
              <li>• Nombre y Email</li>
              <li>• Perfiles de voz (tono, estilo)</li>
              <li>• Fragmentos de publicaciones</li>
              <li>• Preferencias de configuración</li>
            </ul>
          </div>
          <div className="bg-surface-subtle p-6 rounded-2xl border border-border-soft">
            <h3 className="text-[14px] font-black uppercase tracking-wider text-primary-dark mb-3">Datos Automáticos</h3>
            <ul className="text-[14px] space-y-2 list-none pl-0 mb-0">
              <li>• Historial de generación</li>
              <li>• Créditos consumidos/disponibles</li>
              <li>• Metadatos técnicos (tokens, modelo)</li>
              <li>• Timestamp de uso</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 bg-accent-blue/5 p-6 rounded-2xl border border-accent-blue/10">
          <h3 className="text-[14px] font-black uppercase tracking-wider text-accent-blue mb-3 italic">Lo que NO recopilamos</h3>
          <ul className="text-[14px] space-y-2 list-disc pl-5 mb-0 text-secondary-text font-medium italic">
            <li>Datos de tarjetas de crédito o CVV</li>
            <li>Credenciales de acceso a LinkedIn</li>
            <li>Contenido completo de tu perfil</li>
            <li>Historial de navegación externo</li>
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4">ARTÍCULO 3 — FINALIDADES DEL TRATAMIENTO</h2>
        <p>Los datos personales del Usuario son tratados exclusivamente para:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Prestación del Servicio:</strong> Gestión de cuenta, procesamiento de IA y personalización.</li>
          <li><strong>Relación Contractual:</strong> Gestión de suscripciones y pagos vía Lemon Squeezy.</li>
          <li><strong>Seguridad:</strong> Detección de fraude y prevención de abusos.</li>
          <li><strong>Cumplimiento Legal:</strong> Obligaciones fiscales y requerimientos legales.</li>
        </ul>
        <p className="mt-6 font-black text-primary-dark bg-yellow-400/10 px-4 py-2 rounded-lg inline-block italic">
          Mirror no vende ni comercializa datos personales a terceros bajo ninguna circunstancia.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4 italic underline decoration-accent-blue decoration-4 underline-offset-8">ARTÍCULO 7 — DERECHOS DEL TITULAR</h2>
        <div className="space-y-4">
          <p>Tienes el control total de tus datos. Puedes ejercer tus derechos directamente desde la aplicación:</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-border-soft p-4 rounded-xl">
              <span className="font-black text-primary-dark">Acceso y Portabilidad</span>
              <p className="text-[13px] mt-1 mb-0">Configuración → Exportar → Start Backup</p>
            </div>
            <div className="border border-border-soft p-4 rounded-xl">
              <span className="font-black text-primary-dark">Rectificación</span>
              <p className="text-[13px] mt-1 mb-0">Directamente en tu Perfil o Configuración</p>
            </div>
            <div className="border border-border-soft p-4 rounded-xl">
              <span className="font-black text-primary-dark">Eliminación</span>
              <p className="text-[13px] mt-1 mb-0">Configuración → Exportar → Eliminar cuenta</p>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center pt-12">
        <p className="text-secondary-text font-bold mb-4 italic">¿Consultas sobre tu privacidad?</p>
        <a href="mailto:privacy@mirror.com" className="text-2xl font-black text-accent-blue hover:underline">privacy@mirror.com</a>
      </section>
    </LegalLayout>
  )
}
