import React, { useRef, useState } from 'react';
import { X, ScrollText, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="mb-6">
    <h3 className="text-orange-400 font-bold text-sm uppercase tracking-wide mb-2">
      {title}
    </h3>
    <div className="text-gray-300 text-sm leading-relaxed space-y-2">
      {children}
    </div>
  </div>
);

const Ul: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

export const TerminosCondiciones: React.FC<Props> = ({
  isOpen,
  onClose,
  onAccept,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  if (!isOpen) return null;

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    if (atBottom) setScrolledToBottom(true);
  };

  const handleAccept = () => {
    onAccept();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700 shrink-0">
          <div className="flex items-center gap-3">
            <ScrollText className="text-orange-400" size={22} />
            <div>
              <h2 className="text-white font-black text-lg tracking-tight">
                Términos y Condiciones de Uso
              </h2>
              <p className="text-zinc-500 text-xs">
                ArenaGamer · Última actualización: 05/03/2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scroll hint */}
        {!scrolledToBottom && (
          <div className="bg-zinc-800/70 text-zinc-400 text-xs text-center py-2 shrink-0 border-b border-zinc-700">
            Desplázate hasta el final para poder aceptar los términos
          </div>
        )}

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="overflow-y-auto px-6 py-5 flex-1"
        >
          <p className="text-gray-400 text-sm mb-6">
            Bienvenido a{' '}
            <span className="text-white font-semibold">ArenaGamer</span> (en
            adelante, la "Plataforma"). Al registrarse, acceder o utilizar los
            servicios ofrecidos, el usuario acepta cumplir con los presentes
            Términos y Condiciones. Si no está de acuerdo, deberá abstenerse de
            utilizar la Plataforma.
          </p>

          <Section title="1. Definición del Servicio">
            <p>
              ArenaGamer es una plataforma digital que permite a los usuarios
              participar en partidas competitivas organizadas del videojuego
              Dota 2 en formato 5 vs 5, administradas por hosts o
              administradores que establecen las condiciones de participación.
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              ArenaGamer no está afiliado ni respaldado oficialmente por Valve
              Corporation.
            </p>
          </Section>

          <Section title="2. Requisitos para el Uso">
            <Ul
              items={[
                'Ser mayor de 18 años',
                'Registrarse con información real y verificable',
                'Aceptar los presentes Términos y Condiciones',
                'Cumplir con las normas de conducta de la plataforma',
              ]}
            />
            <p className="text-zinc-500 text-xs mt-2">
              ArenaGamer se reserva el derecho de suspender o cancelar cuentas
              con información falsa.
            </p>
          </Section>

          <Section title="3. Cuentas de Usuario">
            <p>
              Cada usuario es responsable de mantener la confidencialidad de su
              cuenta, proteger sus credenciales y todas las actividades
              realizadas desde su cuenta.
            </p>
          </Section>

          <Section title="4. Sistema de Saldo">
            <Ul
              items={[
                'Recarga mínima: 20 soles',
                'El saldo solo puede utilizarse dentro de la plataforma',
                'El saldo no constituye una cuenta bancaria ni instrumento financiero',
              ]}
            />
            <p className="text-zinc-500 text-xs mt-1">
              ArenaGamer puede aplicar comisiones por servicio dentro de las
              salas de juego.
            </p>
          </Section>

          <Section title="5. Participación en Salas">
            <Ul
              items={[
                'Partidas 5 vs 5',
                'Cada sala tiene un costo de entrada',
                'Los jugadores pagan la entrada usando su saldo',
                'El equipo ganador recibe el premio definido para la sala',
              ]}
            />
            <p className="text-zinc-500 text-xs mt-1">
              Ejemplo: Costo de entrada 6 soles · Premio por jugador ganador 10
              soles. ArenaGamer puede aplicar comisión por organización.
            </p>
          </Section>

          <Section title="6. Retiros de Saldo">
            <Ul
              items={[
                'Retiro mínimo: 30 soles',
                'El saldo debe haber sido utilizado previamente en partidas',
              ]}
            />
            <p>
              ArenaGamer podrá aplicar procesos de verificación antes de aprobar
              un retiro.
            </p>
          </Section>

          <Section title="7. Administradores de Sala (Hosts)">
            <p>
              Los hosts pueden crear salas, definir costos y premios, y moderar
              jugadores. Deben actuar de forma justa. ArenaGamer podrá suspender
              a administradores que abusen de sus funciones.
            </p>
          </Section>

          <Section title="8. Sistema de Ranking y MMR">
            <p>
              ArenaGamer utiliza un sistema interno de MMR para mejorar el
              balance competitivo. Este MMR:
            </p>
            <Ul
              items={[
                'Es un sistema interno de ArenaGamer',
                'Puede ser asignado o modificado por administradores',
                'Puede actualizarse según el desempeño del jugador',
              ]}
            />
            <p className="text-sm mt-2">
              Los administradores podrán modificar el MMR de cualquier jugador
              (detección de smurfs, corrección de balance). Los usuarios aceptan
              que el MMR puede ajustarse sin previo aviso.
            </p>
          </Section>

          <Section title="9. Normas de Conducta">
            <p>Está prohibido:</p>
            <Ul
              items={[
                'Toxicidad o insultos',
                'Trolling o sabotaje de partidas',
                'Abandono intencional',
                'Comportamiento antideportivo',
                'Uso de cheats o software ilegal',
                'Manipulación de resultados',
                'Smurfing',
                'Colusión entre jugadores',
              ]}
            />
          </Section>

          <Section title="10. Sistema de Reportes">
            <p>
              Los usuarios pueden reportar: comportamiento tóxico, trolling,
              abandono, smurf, trampas y manipulación de partidas. Los reportes
              serán evaluados por administradores o moderadores.
            </p>
          </Section>

          <Section title="11. Sistema de Sanciones">
            <p>
              Las sanciones pueden incluir: advertencias, penalizaciones de
              saldo, expulsión de salas, suspensión temporal y baneo permanente.
            </p>
            <div className="mt-2 border border-zinc-700 rounded overflow-hidden text-xs">
              <div className="grid grid-cols-2 bg-zinc-800 font-semibold text-zinc-400 px-3 py-2">
                <span>Infracción</span>
                <span>Penalización</span>
              </div>
              {[
                ['Toxicidad', 'Penalización de saldo'],
                ['Abandono de partida', 'Penalización de saldo'],
                ['Trolling', 'Penalización o suspensión'],
                ['Smurf', 'Suspensión'],
                ['Manipulación de partidas', 'Baneo permanente'],
              ].map(([inf, pen]) => (
                <div
                  key={inf}
                  className="grid grid-cols-2 px-3 py-1.5 border-t border-zinc-700 text-gray-400"
                >
                  <span>{inf}</span>
                  <span className="text-orange-400">{pen}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="12. Política Anti-Smurf">
            <p>
              ArenaGamer prohíbe el uso de cuentas secundarias para competir
              contra jugadores de menor nivel. Las sanciones incluyen
              suspensión, eliminación de ganancias y baneo permanente.
            </p>
          </Section>

          <Section title="13. Manipulación de Partidas">
            <p>
              Está estrictamente prohibido perder intencionalmente, arreglar
              partidas o coordinar resultados. ArenaGamer podrá cancelar
              partidas, eliminar premios, suspender cuentas o aplicar baneo
              permanente.
            </p>
          </Section>

          <Section title="14. Política Anti-Fraude">
            <p>
              ArenaGamer investiga actividades sospechosas: fraude financiero,
              uso indebido del saldo, explotación de errores y manipulación de
              partidas. El saldo obtenido fraudulentamente puede ser congelado o
              eliminado.
            </p>
          </Section>

          <Section title="15. Verificación de Identidad (KYC)">
            <p>
              ArenaGamer puede solicitar verificación de identidad para procesar
              retiros. Esto puede incluir: documento de identidad, fotografía de
              verificación y confirmación del método de pago.
            </p>
          </Section>

          <Section title="16. Política de Reembolsos">
            <p>
              Las recargas no son reembolsables, excepto en casos de error
              técnico comprobado o fallas del sistema atribuibles a ArenaGamer.
              Cada caso será evaluado individualmente.
            </p>
          </Section>

          <Section title="17. Interrupción del Servicio">
            <p>
              ArenaGamer no garantiza disponibilidad permanente. El servicio
              puede verse afectado por mantenimiento, fallas técnicas, problemas
              de internet o del videojuego.
            </p>
          </Section>

          <Section title="18. Limitación de Responsabilidad">
            <p>
              ArenaGamer no se responsabiliza por: comportamiento de jugadores,
              resultados de partidas, problemas de conexión ni fallas del
              videojuego. La plataforma facilita únicamente la organización de
              partidas.
            </p>
          </Section>

          <Section title="19. Competencias Basadas en Habilidad">
            <p>
              Los resultados dependen exclusivamente de la habilidad del
              jugador, estrategia del equipo y desempeño en el videojuego.{' '}
              <span className="text-white font-semibold">
                ArenaGamer no ofrece apuestas ni juegos de azar.
              </span>{' '}
              Los premios provienen de las contribuciones de los participantes.
            </p>
          </Section>

          <Section title="20. Cuentas Múltiples">
            <Ul
              items={[
                'Cada usuario puede tener una sola cuenta',
                'Está prohibido crear múltiples cuentas, compartirlas o usar cuentas de terceros',
              ]}
            />
          </Section>

          <Section title="21. Propiedad Intelectual">
            <p>
              Todos los elementos de la plataforma (software, diseño, marca
              ArenaGamer, contenido) son propiedad de ArenaGamer. Queda
              prohibida su reproducción sin autorización.
            </p>
          </Section>

          <Section title="22 – 24. Terminación, Modificaciones y Legislación">
            <p>
              ArenaGamer podrá suspender o eliminar cuentas que incumplan los
              términos. Los términos pueden modificarse en cualquier momento; el
              uso continuado implica aceptación. Estos términos se rigen por las
              leyes de la <span className="text-white">República del Perú</span>
              .
            </p>
          </Section>

          <Section title="25. Política de Privacidad">
            <p>
              Datos recopilados: correo electrónico, nombre de usuario,
              dirección IP, historial de partidas y movimientos de saldo. Usados
              para gestión de cuentas, prevención de fraude, soporte técnico y
              mejora del servicio.{' '}
              <span className="text-white">
                ArenaGamer no vende datos personales a terceros.
              </span>
            </p>
          </Section>

          <Section title="26. Aceptación de los Términos">
            <p>
              Al registrarse en ArenaGamer el usuario declara que ha leído estos
              Términos y Condiciones, comprende las reglas de la plataforma y
              acepta cumplir con todas las políticas establecidas.
            </p>
          </Section>

          {/* Spacer so user must scroll past the last section */}
          <div className="h-6" />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-700 shrink-0 bg-zinc-900 rounded-b-xl">
          {scrolledToBottom ? (
            <button
              onClick={handleAccept}
              className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded uppercase tracking-widest transition-all hover:scale-[1.01]"
            >
              <CheckCircle size={18} />
              He leído y acepto los Términos y Condiciones
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 bg-zinc-700 text-zinc-500 font-bold rounded uppercase tracking-widest cursor-not-allowed text-sm"
            >
              Desplázate hasta el final para aceptar ↓
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full mt-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors py-1"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
