import { LegalLayout } from "@/components/layout/LegalLayout"

export default async function TermsPage() {
  return (
    <LegalLayout
      title="Términos y Condiciones de Uso"
      subtitle="Lee atentamente las reglas que rigen el uso de Mirror para asegurar una experiencia segura y transparente."
      lastUpdated="17 de Marzo de 2026"
    >

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4">PREÁMBULO</h2>
        <p>
          Los presentes Términos y Condiciones de Uso (en adelante &quot;los Términos&quot;) constituyen un contrato legalmente vinculante entre usted (en adelante &quot;el Usuario&quot;) y el propietario y operador de Mirror (en adelante &quot;Mirror&quot;, &quot;nosotros&quot; o &quot;el Proveedor&quot;), con domicilio en la República de Colombia.
        </p>
        <p>
          Al acceder, registrarse o utilizar la plataforma web de Mirror, su extensión de navegador o cualquier servicio relacionado (en adelante colectivamente &quot;el Servicio&quot;), usted declara haber leído, comprendido y aceptado íntegramente estos Términos. Si no está de acuerdo con alguna disposición, debe abstenerse de usar el Servicio.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4">ARTÍCULO 1 — DEFINICIONES</h2>
        <ul className="space-y-3 list-none pl-0">
          <li><strong>&quot;Servicio&quot;:</strong> La plataforma web Mirror, su extensión de navegador para Chrome, las interfaces de programación (API) asociadas y cualquier funcionalidad ofrecida por Mirror.</li>
          <li><strong>&quot;Usuario&quot;:</strong> Toda persona natural mayor de dieciocho (18) años que cree una cuenta y use el Servicio.</li>
          <li><strong>&quot;Perfil de Voz&quot;:</strong> Configuración personalizada creada por el Usuario que contiene parámetros de tono, estilo de escritura y ejemplos para guiar la generación de contenido.</li>
          <li><strong>&quot;Contenido Generado&quot;:</strong> Textos, comentarios o publicaciones producidos por el Servicio mediante inteligencia artificial con base en las instrucciones del Usuario.</li>
          <li><strong>&quot;Créditos&quot;:</strong> Unidades de uso asignadas mensualmente según el plan contratado, que se consumen con cada generación de contenido.</li>
          <li><strong>&quot;Datos Personales&quot;:</strong> Toda información que permita identificar o hacer identificable al Usuario, conforme a la Ley 1581 de 2012 y normativa aplicable.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4">ARTÍCULO 2 — OBJETO DEL CONTRATO</h2>
        <p>
          Mirror presta un servicio de asistencia de escritura basado en inteligencia artificial que permite al Usuario crear perfiles de voz personalizados y generar, mediante dichos perfiles, respuestas, comentarios y publicaciones para plataformas profesionales compatibles. El Servicio no constituye, en ningún caso, una herramienta de automatización masiva, bot o sistema de publicación automática en dichas plataformas.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4">ARTÍCULO 3 — REGISTRO Y CONDICIONES DE ACCESO</h2>
        <div className="space-y-4">
          <p>3.1 El acceso al Servicio requiere la creación de una cuenta mediante correo electrónico o autenticación con Google OAuth.</p>
          <p>3.2 El Usuario declara, bajo su responsabilidad, que:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Es mayor de dieciocho (18) años</li>
            <li>La información proporcionada durante el registro es veraz, completa y actualizada</li>
            <li>Tiene capacidad legal para celebrar contratos en su jurisdicción</li>
          </ul>
          <p>3.3 El Usuario es el único responsable de la confidencialidad de sus credenciales de acceso. Mirror no será responsable por accesos no autorizados derivados de la negligencia del Usuario en la custodia de sus credenciales.</p>
          <p>3.4 El Usuario deberá notificar a Mirror de forma inmediata ante cualquier sospecha de acceso no autorizado a su cuenta.</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4">ARTÍCULO 4 — PLANES, PRECIOS Y FACTURACIÓN</h2>
        <div className="overflow-hidden rounded-2xl border border-border-soft bg-surface-base shadow-sm mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-subtle/50">
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-secondary-text">Plan</th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-secondary-text">Precio</th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-secondary-text">Créditos</th>
                <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-secondary-text">Perfiles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              <tr>
                <td className="px-6 py-4 font-bold text-primary-dark italic">Free</td>
                <td className="px-6 py-4">$0 USD/mes</td>
                <td className="px-6 py-4">120</td>
                <td className="px-6 py-4">1</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-primary-dark italic">Pro</td>
                <td className="px-6 py-4">$19 USD/mes</td>
                <td className="px-6 py-4">1.200</td>
                <td className="px-6 py-4">10</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-bold text-primary-dark italic">Elite</td>
                <td className="px-6 py-4">$59 USD/mes</td>
                <td className="px-6 py-4">4.000</td>
                <td className="px-6 py-4">Ilimitados</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="space-y-4">
          <p>4.2 Los precios están expresados en dólares estadounidenses (USD). Mirror se reserva el derecho de modificar los precios con previo aviso de treinta (30) días calendario.</p>
          <p>4.3 Los pagos son procesados exclusivamente por <strong>Lemon Squeezy</strong>, quien actúa como Merchant of Record. Mirror no almacena datos de tarjetas de crédito.</p>
          <p>4.4 Las suscripciones se renuevan automáticamente, salvo cancelación previa.</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4">ARTÍCULO 11 — TERMINACIÓN</h2>
        <p>
          11.1 Por el Usuario: El Usuario puede cancelar su cuenta en cualquier momento desde <strong>Configuración → Exportar → Eliminar cuenta</strong>. La eliminación es permanente e irreversible.
        </p>
      </section>

      <section className="bg-surface-subtle p-8 rounded-3xl border border-border-soft">
        <h2 className="text-2xl font-black tracking-tight text-primary-dark mb-4 italic underline decoration-accent-blue decoration-4 underline-offset-8">ARTÍCULO 13 — LEY APLICABLE Y JURISDICCIÓN</h2>
        <p className="mb-0">
          Estos Términos se rigen por las leyes de la República de Colombia. Para la resolución de controversias, las partes se someten a la competencia de los jueces y tribunales de la ciudad de <strong>Bogotá</strong>, Colombia.
        </p>
      </section>

      <section className="text-center pt-12">
        <p className="text-secondary-text font-bold mb-4 italic">Para cualquier comunicación relacionada con estos Términos:</p>
        <a href="mailto:legal@mirror.com" className="text-2xl font-black text-accent-blue hover:underline">legal@mirror.com</a>
      </section>
    </LegalLayout>
  )
}
