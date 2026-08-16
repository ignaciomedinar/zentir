import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/shared/header";

export const metadata = {
  title: "Aviso de Privacidad — Zentir",
};

export default async function PrivacidadPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header user={user} isAdmin={isAdmin} variant="light" />

      <main className="flex-1 py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          <div>
            <p className="text-sm uppercase tracking-widest text-zentir font-medium mb-3">Legal</p>
            <h1 className="text-3xl sm:text-4xl font-semibold leading-tight mb-3">Aviso de Privacidad</h1>
            <p className="text-[#737373]">Última actualización: agosto de 2026</p>
          </div>

          <div className="prose-content space-y-8 text-[#404040] leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-black mb-3">1. Responsable del tratamiento</h2>
              <p>
                Zentir (&ldquo;nosotros&rdquo;, &ldquo;Zentir&rdquo;) es responsable del tratamiento de tus datos
                personales cuando usas venazentir.com, te registras en la plataforma o te inscribes a uno de
                nuestros retiros. Puedes contactarnos para cualquier tema relacionado con privacidad escribiendo a{" "}
                <a href="mailto:hola@venazentir.com" className="text-zentir hover:underline">hola@venazentir.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">2. Qué datos recopilamos</h2>
              <p className="mb-3">Recopilamos los siguientes datos:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Datos de registro:</strong> nombre, apellido, correo electrónico y tipo de perfil, cuando creas una cuenta.</li>
                <li><strong>Datos de uso del sitio:</strong> páginas visitadas, país aproximado y tipo de dispositivo, a través de Google Analytics — solo si aceptaste cookies de analítica.</li>
                <li><strong>Datos de contenido descargado:</strong> qué materiales de la biblioteca descargas, para llevar un control de acceso.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">3. Para qué usamos tus datos</h2>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Crear y administrar tu cuenta, y darte acceso a la biblioteca de contenidos.</li>
                <li>Gestionar tu inscripción o interés en retiros y experiencias de Zentir.</li>
                <li>Comunicarnos contigo sobre tu cuenta, retiros o novedades relevantes.</li>
                <li>Entender cómo se usa el sitio para mejorarlo (analítica, solo con tu consentimiento).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">4. Cookies y Google Analytics</h2>
              <p>
                Usamos Google Analytics para entender de forma agregada cómo se usa el sitio. Estas cookies solo se
                activan si das tu consentimiento en el banner que aparece al entrar por primera vez. Puedes cambiar
                de opinión en cualquier momento borrando las cookies de tu navegador, lo que hará que el banner
                vuelva a aparecer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">5. Con quién compartimos tus datos</h2>
              <p className="mb-3">No vendemos tus datos. Los compartimos únicamente con proveedores que nos ayudan a operar el sitio:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Supabase:</strong> alojamiento de la base de datos y autenticación.</li>
                <li><strong>Google Analytics:</strong> analítica de uso del sitio (solo con consentimiento).</li>
                <li><strong>Resend:</strong> envío de correos transaccionales (verificación de cuenta, notificaciones).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">6. Cuánto tiempo conservamos tus datos</h2>
              <p>
                Conservamos tus datos mientras tu cuenta esté activa. Si quieres que eliminemos tu cuenta y tus
                datos, escríbenos a{" "}
                <a href="mailto:hola@venazentir.com" className="text-zentir hover:underline">hola@venazentir.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">7. Tus derechos</h2>
              <p className="mb-3">
                <strong>Si estás en México:</strong> tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al uso
                de tus datos personales (derechos ARCO), conforme a la Ley Federal de Protección de Datos Personales
                en Posesión de los Particulares.
              </p>
              <p>
                <strong>Si estás en la Unión Europea:</strong> tienes derecho de acceso, rectificación, supresión,
                limitación del tratamiento, portabilidad y oposición, conforme al Reglamento General de Protección
                de Datos (RGPD).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">8. Cómo ejercer tus derechos</h2>
              <p>
                Escríbenos a{" "}
                <a href="mailto:hola@venazentir.com" className="text-zentir hover:underline">hola@venazentir.com</a>{" "}
                indicando tu solicitud. Te responderemos en un plazo razonable conforme a la ley aplicable.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-black mb-3">9. Cambios a este aviso</h2>
              <p>
                Podemos actualizar este aviso de vez en cuando. Si hacemos cambios importantes, lo indicaremos en
                esta misma página con la fecha de actualización.
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-[#a8a29e] border-t border-[#e5e0da]">
        <p>© {new Date().getFullYear()} Zentir. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
