import Link from 'next/link'
import { ArrowLeft, AlertTriangle, Shield, Eye, Ban } from 'lucide-react'

export const metadata = {
  title: 'Política Anti-fraude | RifaApp',
  description: 'Política de prevención de fraudes y medidas de seguridad de RifaApp',
}

export default function AntiFraudePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            Política Anti-fraude
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Última actualización: Febrero 2025
          </p>

          {/* Alert Banner */}
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200">Aviso Importante</h3>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                RifaApp es una plataforma tecnológica que facilita la conexión entre organizadores y participantes.
                <strong> No organizamos ni garantizamos ninguna rifa o sorteo.</strong> Los usuarios participan bajo su propio riesgo y deben verificar la legitimidad de cada organizador.
              </p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2>1. Compromiso con la Seguridad</h2>
            <p>
              En RifaApp trabajamos constantemente para prevenir fraudes y proteger a nuestra comunidad. Sin embargo, es fundamental que los usuarios comprendan que:
            </p>
            <ul>
              <li>La plataforma es un <strong>intermediario tecnológico</strong>, no un organizador de rifas</li>
              <li>Cada organizador (tienda) opera de manera <strong>independiente</strong></li>
              <li>RifaApp <strong>no puede garantizar</strong> el comportamiento de terceros</li>
              <li>Los usuarios deben ejercer <strong>diligencia debida</strong> antes de participar</li>
            </ul>

            <h2>2. Medidas de Seguridad Implementadas</h2>

            <div className="grid gap-4 not-prose my-6">
              <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <Shield className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Verificación de Organizadores</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Los organizadores deben proporcionar información de contacto verificable. Sin embargo, esto no constituye una garantía de su comportamiento.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <Eye className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Monitoreo de Actividad</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Monitoreamos patrones de actividad sospechosa y podemos suspender cuentas que violen nuestros términos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <Ban className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-white">Sistema de Reportes</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    Los usuarios pueden reportar actividades sospechosas. Investigamos reportes y tomamos acciones cuando corresponde.
                  </p>
                </div>
              </div>
            </div>

            <h2>3. Responsabilidades del Usuario</h2>
            <p>
              Antes de participar en cualquier rifa o realizar una reserva, <strong>es su responsabilidad:</strong>
            </p>
            <ul>
              <li>
                <strong>Investigar al organizador:</strong> Verifique su reputación, historial y presencia en redes sociales
              </li>
              <li>
                <strong>Leer los términos:</strong> Revise las condiciones específicas de cada rifa
              </li>
              <li>
                <strong>Verificar el premio:</strong> Asegúrese de que el premio ofrecido sea realista y verificable
              </li>
              <li>
                <strong>Mantener comunicación:</strong> Contacte al organizador si tiene dudas antes de participar
              </li>
              <li>
                <strong>Conservar comprobantes:</strong> Guarde evidencia de sus transacciones
              </li>
              <li>
                <strong>No compartir información sensible:</strong> Nunca proporcione datos bancarios o contraseñas
              </li>
            </ul>

            <h2>4. Señales de Alerta</h2>
            <p>Desconfíe de rifas que presenten las siguientes características:</p>
            <ul>
              <li>Premios de valor excesivamente alto con boletos muy baratos</li>
              <li>Organizadores sin historial verificable</li>
              <li>Presión para comprar rápidamente</li>
              <li>Falta de información de contacto</li>
              <li>Solicitudes de pago por métodos no rastreables</li>
              <li>Promesas de ganancias garantizadas</li>
              <li>Cambios constantes en las fechas de sorteo</li>
              <li>Negativa a mostrar el premio o proporcionar detalles</li>
            </ul>

            <h2>5. Qué Hacer si Sospecha de Fraude</h2>
            <ol>
              <li>
                <strong>No realice más pagos</strong> al organizador sospechoso
              </li>
              <li>
                <strong>Documente todo:</strong> Capturas de pantalla, conversaciones, comprobantes
              </li>
              <li>
                <strong>Reporte en la plataforma:</strong> Use nuestro sistema de reportes
              </li>
              <li>
                <strong>Contacte a las autoridades:</strong> Presente denuncia ante las autoridades competentes (Policía Cibernética, Profeco, Fiscalía)
              </li>
              <li>
                <strong>Alerte a otros:</strong> Advierta a otros usuarios potenciales
              </li>
            </ol>

            <h2>6. Limitación de Responsabilidad</h2>
            <p>
              <strong>RifaApp no se hace responsable de:</strong>
            </p>
            <ul>
              <li>Fraudes cometidos por organizadores o terceros</li>
              <li>Pérdidas económicas derivadas de participación en rifas</li>
              <li>Incumplimiento de organizadores en la entrega de premios</li>
              <li>Disputas entre usuarios y organizadores</li>
              <li>Información falsa proporcionada por organizadores</li>
            </ul>
            <p>
              La plataforma actúa como facilitador tecnológico. La responsabilidad de verificar la legitimidad de cada rifa recae en el usuario.
            </p>

            <h2>7. Acciones contra Infractores</h2>
            <p>
              Cuando identificamos o recibimos reportes sobre organizadores fraudulentos, podemos:
            </p>
            <ul>
              <li>Suspender temporalmente la cuenta</li>
              <li>Cancelar rifas activas</li>
              <li>Banear permanentemente al usuario</li>
              <li>Cooperar con autoridades en investigaciones</li>
              <li>Publicar alertas para otros usuarios</li>
            </ul>

            <h2>8. Cooperación con Autoridades</h2>
            <p>
              RifaApp coopera plenamente con las autoridades en investigaciones de fraude. Proporcionamos información según lo requiera la ley, incluyendo:
            </p>
            <ul>
              <li>Datos de registro de usuarios</li>
              <li>Historial de transacciones</li>
              <li>Registros de comunicaciones</li>
              <li>Evidencia de actividades reportadas</li>
            </ul>

            <h2>9. Educación y Prevención</h2>
            <p>
              Fomentamos una comunidad informada. Recomendamos a todos los usuarios:
            </p>
            <ul>
              <li>Participar solo en rifas de organizadores conocidos o verificados</li>
              <li>Comenzar con montos pequeños en organizadores nuevos</li>
              <li>Compartir experiencias con otros usuarios</li>
              <li>Reportar cualquier comportamiento sospechoso</li>
            </ul>

            <h2>10. Contacto para Reportes</h2>
            <p>
              Si identifica actividad fraudulenta o sospechosa, repórtela inmediatamente a través de los canales oficiales de la plataforma.
            </p>

            <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-amber-800 dark:text-amber-200 font-medium">
                Recuerde: La mejor protección contra el fraude es la precaución. Investigue antes de participar y nunca arriesgue más de lo que puede permitirse perder.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
          <Link
            href="/legal/terminos"
            className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400"
          >
            Términos y Condiciones
          </Link>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <Link
            href="/legal/privacidad"
            className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400"
          >
            Política de Privacidad
          </Link>
        </div>
      </div>
    </div>
  )
}
