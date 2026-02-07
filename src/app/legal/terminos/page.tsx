import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Términos y Condiciones | RifaApp',
  description: 'Términos y condiciones de uso de la plataforma RifaApp',
}

export default function TerminosPage() {
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
            Términos y Condiciones
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Última actualización: Febrero 2025
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2>1. Definiciones</h2>
            <p>
              Para los efectos de estos Términos y Condiciones, se entenderá por:
            </p>
            <ul>
              <li>
                <strong>"RifaApp" o "Plataforma":</strong> Se refiere al software, aplicación web y servicios tecnológicos que facilitan la conexión entre Organizadores y Usuarios.
              </li>
              <li>
                <strong>"Organizador" o "Tienda":</strong> Persona física o moral que utiliza la Plataforma para organizar, administrar y llevar a cabo rifas, sorteos o ventas de productos.
              </li>
              <li>
                <strong>"Usuario" o "Participante":</strong> Persona que utiliza la Plataforma para participar en rifas, adquirir boletos o reservar productos.
              </li>
            </ul>

            <h2>2. Naturaleza del Servicio</h2>
            <p>
              <strong>RifaApp actúa EXCLUSIVAMENTE como una plataforma tecnológica facilitadora.</strong> La Plataforma proporciona herramientas digitales que permiten a los Organizadores gestionar sus rifas, sorteos y catálogos de productos de manera independiente.
            </p>
            <p>
              <strong>RifaApp NO organiza, patrocina, respalda ni lleva a cabo ninguna rifa o sorteo.</strong> Cada rifa, sorteo o venta de productos es organizada y ejecutada de manera independiente por cada Organizador (Tienda), quien es el único responsable de:
            </p>
            <ul>
              <li>La legalidad de la rifa o sorteo en su jurisdicción</li>
              <li>El cumplimiento de todas las regulaciones locales, estatales y federales aplicables</li>
              <li>La obtención de permisos, licencias o autorizaciones necesarias</li>
              <li>La entrega de premios a los ganadores</li>
              <li>La veracidad de la información publicada sobre premios y condiciones</li>
              <li>La realización del sorteo en la fecha y hora indicadas</li>
              <li>La gestión de pagos y reembolsos con los participantes</li>
            </ul>

            <h2>3. Limitación de Responsabilidad</h2>
            <p>
              <strong>RifaApp no asume ninguna responsabilidad por:</strong>
            </p>
            <ul>
              <li>Las acciones, omisiones o incumplimientos de los Organizadores</li>
              <li>La calidad, existencia o entrega de los premios ofrecidos</li>
              <li>Disputas entre Organizadores y Participantes</li>
              <li>Pérdidas económicas derivadas de la participación en rifas</li>
              <li>La veracidad de la información proporcionada por los Organizadores</li>
              <li>Fraudes, estafas o engaños perpetrados por terceros</li>
              <li>Problemas técnicos que afecten el desarrollo de los sorteos</li>
            </ul>
            <p>
              La relación contractual para la participación en rifas se establece directamente entre el Organizador y el Participante. RifaApp no es parte de dicha relación.
            </p>

            <h2>4. Obligaciones del Organizador</h2>
            <p>Al utilizar la Plataforma, el Organizador acepta y se compromete a:</p>
            <ul>
              <li>Cumplir con todas las leyes y regulaciones aplicables a rifas y sorteos</li>
              <li>Proporcionar información veraz y precisa sobre sus rifas y premios</li>
              <li>Realizar los sorteos de manera transparente y en las fechas indicadas</li>
              <li>Entregar los premios a los ganadores en los términos establecidos</li>
              <li>Mantener comunicación con los participantes</li>
              <li>Asumir toda responsabilidad legal derivada de sus actividades</li>
              <li>Indemnizar a RifaApp por cualquier reclamación derivada de sus rifas</li>
            </ul>

            <h2>5. Obligaciones del Usuario</h2>
            <p>Al utilizar la Plataforma, el Usuario acepta:</p>
            <ul>
              <li>Verificar la legitimidad del Organizador antes de participar</li>
              <li>Proporcionar información veraz y actualizada</li>
              <li>Aceptar que participa bajo su propio riesgo</li>
              <li>No utilizar la plataforma para actividades ilegales</li>
              <li>Resolver cualquier disputa directamente con el Organizador</li>
            </ul>

            <h2>6. Proceso de Sorteos</h2>
            <p>
              Los sorteos son organizados y ejecutados exclusivamente por cada Organizador. RifaApp proporciona herramientas para la gestión, pero <strong>no participa en la selección de ganadores ni garantiza la imparcialidad del proceso</strong>.
            </p>
            <p>
              Es responsabilidad del Participante verificar:
            </p>
            <ul>
              <li>La reputación del Organizador</li>
              <li>Los términos específicos de cada rifa</li>
              <li>El método de selección del ganador</li>
              <li>Las condiciones de entrega del premio</li>
            </ul>

            <h2>7. Pagos y Transacciones</h2>
            <p>
              Los pagos por boletos o reservas se realizan directamente entre el Participante y el Organizador. RifaApp puede facilitar la gestión de pagos, pero <strong>no es responsable de reembolsos, chargebacks o disputas de pago</strong>.
            </p>

            <h2>8. Reserva de Productos</h2>
            <p>
              La funcionalidad de reserva de productos conecta a Usuarios con Organizadores. La reserva no constituye una compra hasta que el Usuario y el Organizador acuerden los términos de pago y entrega fuera de la Plataforma.
            </p>

            <h2>9. Propiedad Intelectual</h2>
            <p>
              Todo el contenido de la Plataforma (código, diseño, marcas) es propiedad de RifaApp. Los Organizadores mantienen los derechos sobre su contenido, pero otorgan a RifaApp licencia para mostrarlo en la Plataforma.
            </p>

            <h2>10. Suspensión y Terminación</h2>
            <p>
              RifaApp se reserva el derecho de suspender o terminar cuentas que violen estos términos, sin previo aviso y sin responsabilidad.
            </p>

            <h2>11. Modificaciones</h2>
            <p>
              RifaApp puede modificar estos términos en cualquier momento. El uso continuado de la Plataforma constituye aceptación de los términos modificados.
            </p>

            <h2>12. Ley Aplicable y Jurisdicción</h2>
            <p>
              Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier disputa será resuelta en los tribunales competentes de la Ciudad de México.
            </p>

            <h2>13. Contacto</h2>
            <p>
              Para cualquier consulta sobre estos términos, puede contactarnos a través de los canales oficiales disponibles en la Plataforma.
            </p>

            <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-amber-800 dark:text-amber-200 font-medium">
                Al utilizar RifaApp, usted reconoce haber leído, entendido y aceptado estos Términos y Condiciones en su totalidad.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center text-sm">
          <Link
            href="/legal/privacidad"
            className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400"
          >
            Política de Privacidad
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
