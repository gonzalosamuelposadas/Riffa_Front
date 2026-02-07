import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Política de Privacidad | RifaApp',
  description: 'Política de privacidad y protección de datos de RifaApp',
}

export default function PrivacidadPage() {
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
            Política de Privacidad
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Última actualización: Febrero 2025
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2>1. Introducción</h2>
            <p>
              En RifaApp nos comprometemos a proteger la privacidad de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos su información personal cuando utiliza nuestra plataforma.
            </p>

            <h2>2. Información que Recopilamos</h2>

            <h3>2.1 Información proporcionada directamente</h3>
            <ul>
              <li><strong>Datos de registro:</strong> Nombre, correo electrónico, teléfono y contraseña</li>
              <li><strong>Datos de perfil:</strong> Información adicional que elija proporcionar</li>
              <li><strong>Datos de transacciones:</strong> Información sobre rifas, compras y reservas</li>
              <li><strong>Comunicaciones:</strong> Mensajes enviados a través de la plataforma</li>
            </ul>

            <h3>2.2 Información recopilada automáticamente</h3>
            <ul>
              <li><strong>Datos de uso:</strong> Páginas visitadas, funciones utilizadas, tiempo de sesión</li>
              <li><strong>Datos técnicos:</strong> Dirección IP, tipo de navegador, dispositivo, sistema operativo</li>
              <li><strong>Cookies:</strong> Utilizamos cookies para mantener sesiones y preferencias</li>
            </ul>

            <h2>3. Uso de la Información</h2>
            <p>Utilizamos su información para:</p>
            <ul>
              <li>Proporcionar y mantener nuestros servicios</li>
              <li>Procesar transacciones y enviar notificaciones relacionadas</li>
              <li>Verificar su identidad y prevenir fraudes</li>
              <li>Comunicarnos con usted sobre su cuenta o servicios</li>
              <li>Mejorar y personalizar la experiencia del usuario</li>
              <li>Cumplir con obligaciones legales</li>
              <li>Resolver disputas y hacer cumplir nuestros términos</li>
            </ul>

            <h2>4. Compartición de Información</h2>

            <h3>4.1 Con Organizadores (Tiendas)</h3>
            <p>
              Cuando participa en una rifa o realiza una reserva, compartimos información necesaria con el Organizador correspondiente, incluyendo:
            </p>
            <ul>
              <li>Nombre y datos de contacto</li>
              <li>Información de la transacción</li>
              <li>Números de boleto adquiridos</li>
            </ul>

            <h3>4.2 Con terceros</h3>
            <p>Podemos compartir información con:</p>
            <ul>
              <li><strong>Proveedores de servicios:</strong> Que nos ayudan a operar la plataforma (hosting, pagos, email)</li>
              <li><strong>Autoridades:</strong> Cuando sea requerido por ley o para proteger derechos</li>
              <li><strong>Socios comerciales:</strong> Con su consentimiento previo</li>
            </ul>

            <h3>4.3 Información que NO compartimos</h3>
            <ul>
              <li>No vendemos su información personal a terceros</li>
              <li>No compartimos contraseñas ni datos de acceso</li>
              <li>No compartimos información financiera sensible sin su autorización</li>
            </ul>

            <h2>5. Seguridad de los Datos</h2>
            <p>Implementamos medidas de seguridad para proteger su información:</p>
            <ul>
              <li>Encriptación de datos sensibles (contraseñas, información de pago)</li>
              <li>Conexiones seguras (HTTPS/SSL)</li>
              <li>Acceso restringido a datos personales</li>
              <li>Monitoreo de actividades sospechosas</li>
              <li>Copias de seguridad regulares</li>
            </ul>
            <p>
              Sin embargo, ningún sistema es 100% seguro. No podemos garantizar la seguridad absoluta de su información.
            </p>

            <h2>6. Retención de Datos</h2>
            <p>
              Conservamos su información mientras su cuenta esté activa o según sea necesario para:
            </p>
            <ul>
              <li>Proporcionar servicios</li>
              <li>Cumplir con obligaciones legales</li>
              <li>Resolver disputas</li>
              <li>Hacer cumplir acuerdos</li>
            </ul>
            <p>
              Puede solicitar la eliminación de su cuenta y datos personales, sujeto a requisitos legales de retención.
            </p>

            <h2>7. Sus Derechos</h2>
            <p>Usted tiene derecho a:</p>
            <ul>
              <li><strong>Acceso:</strong> Solicitar una copia de sus datos personales</li>
              <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
              <li><strong>Eliminación:</strong> Solicitar la eliminación de sus datos</li>
              <li><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado</li>
              <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos</li>
              <li><strong>Limitación:</strong> Restringir el uso de sus datos</li>
            </ul>
            <p>
              Para ejercer estos derechos, contáctenos a través de los canales oficiales.
            </p>

            <h2>8. Cookies y Tecnologías Similares</h2>
            <p>Utilizamos cookies para:</p>
            <ul>
              <li>Mantener su sesión iniciada</li>
              <li>Recordar sus preferencias</li>
              <li>Analizar el uso de la plataforma</li>
              <li>Mejorar la seguridad</li>
            </ul>
            <p>
              Puede configurar su navegador para rechazar cookies, aunque esto puede afectar la funcionalidad.
            </p>

            <h2>9. Menores de Edad</h2>
            <p>
              RifaApp no está dirigida a menores de 18 años. No recopilamos intencionalmente información de menores. Si descubrimos que hemos recopilado datos de un menor, los eliminaremos.
            </p>

            <h2>10. Transferencias Internacionales</h2>
            <p>
              Sus datos pueden ser procesados en servidores ubicados fuera de México. Tomamos medidas para garantizar protección adecuada según las leyes aplicables.
            </p>

            <h2>11. Cambios a esta Política</h2>
            <p>
              Podemos actualizar esta política periódicamente. Notificaremos cambios significativos a través de la plataforma o por correo electrónico. El uso continuado constituye aceptación de los cambios.
            </p>

            <h2>12. Contacto</h2>
            <p>
              Para preguntas sobre privacidad o ejercer sus derechos, contáctenos a través de los canales oficiales disponibles en la plataforma.
            </p>

            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                Al utilizar RifaApp, usted acepta las prácticas descritas en esta Política de Privacidad.
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
            href="/legal/antifraude"
            className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400"
          >
            Política Anti-fraude
          </Link>
        </div>
      </div>
    </div>
  )
}
