import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Coins,
  Crosshair,
  Gamepad2,
  Sparkles,
  Trophy,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../../../../Context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { gameAccounts, user } = useAuth();

  const hasGameLinked = gameAccounts.length > 0;

  const onboardingSteps = [
    {
      id: 1,
      title: 'Conecta tu cuenta de Steam',
      description:
        'Necesitas una cuenta vinculada para validar tu perfil competitivo.',
      done: hasGameLinked,
      actionLabel: hasGameLinked ? 'Conectada' : 'Vincular ahora',
      actionPath: '/main/settings/integraciones',
    },
    {
      id: 2,
      title: 'Recarga y paga la cuota de ingreso',
      description:
        'Carga saldo para entrar a salas con apuestas y premios reales.',
      done: (user?.saldoReal ?? 0) > 0,
      actionLabel: 'Recargar saldo',
      actionPath: '/main/recarga',
    },
    {
      id: 3,
      title: 'Entra a una sala y compite',
      description:
        'Si ganas, obtienes experiencia y ganancias para subir de nivel.',
      done: false,
      actionLabel: 'Ir a salas',
      actionPath: '/main/salas',
    },
  ];

  const completedSteps = onboardingSteps.filter((step) => step.done).length;
  const progressPercent = Math.round(
    (completedSteps / onboardingSteps.length) * 100,
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Hero Banner Superior */}
      <div className="relative w-full h-64 lg:h-80 bg-[#1a1b2e] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c1b] via-[#0b0c1b]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c1b] to-transparent" />

        <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-center max-w-3xl">
          <span className="inline-block px-3 py-1 bg-orange-600/20 text-orange-500 text-xs font-bold rounded mb-4 w-max border border-orange-500/30">
            TEMPORADA 1 ACTIVA
          </span>
          <h2 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight">
            COMPITE. APUESTA. <br />
            <span className="text-orange-500">DEMUESTRA TU NIVEL.</span>
          </h2>
          <p className="text-gray-400 text-sm lg:text-base max-w-xl">
            Encuentra rivales de tu mismo MMR, únete a salas personalizadas y
            multiplica tus creditos. La Arena te espera.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/main/salas')}
              className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-sm font-bold text-white transition-colors"
            >
              Buscar salas
            </button>
            <button
              onClick={() => navigate('/main/como-jugar')}
              className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-bold text-white transition-colors"
            >
              Ver como jugar
            </button>
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="px-4 lg:px-8 max-w-[1600px] mx-auto mt-6 lg:mt-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          <div className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#141526] border border-white/5 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-3">
                  <Gamepad2 size={18} className="text-green-400" />
                </div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">
                  Cuenta de juego
                </p>
                <p className="text-lg font-black mt-1">
                  {hasGameLinked ? 'Conectada' : 'No vinculada'}
                </p>
              </div>

              <div className="bg-[#141526] border border-white/5 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-3">
                  <Coins size={18} className="text-yellow-400" />
                </div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">
                  Saldo disponible
                </p>
                <p className="text-lg font-black mt-1">
                  {(user?.saldoReal ?? 0).toFixed(2)} PEN
                </p>
              </div>

              <div className="bg-[#141526] border border-white/5 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
                  <Trophy size={18} className="text-blue-400" />
                </div>
                <p className="text-gray-400 text-xs uppercase tracking-wider">
                  Progreso actual
                </p>
                <p className="text-lg font-black mt-1">{progressPercent}%</p>
              </div>
            </div>

            {/* Conectar Juego */}
            {!hasGameLinked ? (
              <div className="bg-[#141526] border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-600/10 border border-red-500/20 rounded-xl flex items-center justify-center">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Dota_2_icon.svg/1024px-Dota_2_icon.svg.png"
                      alt="Dota 2"
                      className="w-8 h-8 opacity-80"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">CONECTAR JUEGO</h3>
                    <p className="text-xs text-gray-400">
                      Vincula tu cuenta de Steam para validar tu MMR y habilitar
                      el acceso a salas personalizadas.
                    </p>
                  </div>
                </div>
                <NavLink
                  to="/main/settings/integraciones"
                  className="w-full sm:w-auto px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-lg border border-white/10 transition-colors"
                >
                  Vincular Cuenta
                </NavLink>
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tarjeta Emparejamiento */}
              <div
                onClick={() => navigate('/main/salas')}
                className="group bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl p-1 pb-0 overflow-hidden cursor-pointer shadow-lg shadow-orange-600/10 hover:shadow-orange-600/30 transition-all hover:-translate-y-1"
              >
                <div className="bg-[#141526] w-full h-full rounded-xl rounded-b-none p-6 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden group-hover:bg-[#1a1b30] transition-colors">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative w-24 h-24 mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    <div className="absolute inset-0 bg-orange-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-black border-2 border-orange-500/30 flex items-center justify-center relative z-10">
                      <Crosshair size={32} className="text-orange-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-black tracking-tight mb-2 relative z-10">
                    EMPAREJAMIENTO
                  </h3>
                  <p className="text-sm text-gray-400 text-center px-4 relative z-10">
                    Busca salas activas o crea la tuya para apostar contra otros
                    jugadores.
                  </p>
                </div>
                <div className="h-1.5 w-full bg-orange-500"></div>
              </div>

              <div className="bg-[#141526] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-lg tracking-tight">
                    Ruta para empezar
                  </h3>
                  <Trophy size={18} className="text-orange-500" />
                </div>
                <div className="space-y-4">
                  {onboardingSteps.map((step) => (
                    <div
                      key={step.id}
                      className="border border-white/10 rounded-xl p-3 bg-[#0f1020]"
                    >
                      <div className="flex items-start gap-3">
                        {step.done ? (
                          <CheckCircle2
                            size={18}
                            className="text-green-400 mt-0.5"
                          />
                        ) : (
                          <Circle size={18} className="text-gray-500 mt-0.5" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm">{step.title}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {step.description}
                          </p>
                          {!step.done ? (
                            <NavLink
                              to={step.actionPath}
                              className="mt-3 inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 font-semibold"
                            >
                              {step.actionLabel}
                              <ArrowRight size={14} />
                            </NavLink>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#141526] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black tracking-tight">Tu progreso</h3>
                <Sparkles size={18} className="text-emerald-400" />
              </div>

              <div className="rounded-xl bg-[#0f1020] border border-white/5 p-4 mb-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span>Checklist de inicio</span>
                  <span>
                    {completedSteps}/{onboardingSteps.length}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-orange-500 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="rounded-xl bg-[#0f1020] border border-white/5 p-3">
                  <p className="text-xs text-gray-400">Cuenta de juego</p>
                  <p className="text-sm font-semibold mt-1">
                    {hasGameLinked ? 'Lista para competir' : 'Falta vincular'}
                  </p>
                </div>
                <div className="rounded-xl bg-[#0f1020] border border-white/5 p-3">
                  <p className="text-xs text-gray-400">Saldo para cuota</p>
                  <p className="text-sm font-semibold mt-1">
                    {(user?.saldoReal ?? 0) > 0
                      ? 'Saldo disponible'
                      : 'Sin saldo cargado'}
                  </p>
                </div>
                <div className="rounded-xl bg-[#0f1020] border border-white/5 p-3">
                  <p className="text-xs text-gray-400">Siguiente paso</p>
                  <p className="text-sm font-semibold mt-1">
                    {onboardingSteps.find((step) => !step.done)?.title ??
                      'Ya puedes entrar a competir'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#141526] border border-white/5 rounded-2xl p-6">
              <h3 className="font-black tracking-tight mb-3">
                Acciones rapidas
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/main/recarga')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-green-600/15 border border-green-500/20 hover:bg-green-600/25 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Wallet size={16} className="text-green-400" />
                    Recargar saldo
                  </span>
                  <ArrowRight size={16} className="text-green-400" />
                </button>

                <button
                  onClick={() => navigate('/main/salas')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-orange-600/15 border border-orange-500/20 hover:bg-orange-600/25 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Crosshair size={16} className="text-orange-400" />
                    Entrar a salas
                  </span>
                  <ArrowRight size={16} className="text-orange-400" />
                </button>

                <button
                  onClick={() => navigate('/main/como-jugar')}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-blue-600/15 border border-blue-500/20 hover:bg-blue-600/25 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Trophy size={16} className="text-blue-400" />
                    Reglas y guia
                  </span>
                  <ArrowRight size={16} className="text-blue-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
