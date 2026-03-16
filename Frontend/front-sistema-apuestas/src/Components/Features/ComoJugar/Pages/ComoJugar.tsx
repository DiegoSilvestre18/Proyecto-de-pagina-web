import React from 'react';
import {
  CheckCircle2,
  CircleDollarSign,
  Gamepad2,
  GraduationCap,
  ShieldCheck,
  Swords,
  Trophy,
  UserCheck,
  Wallet,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const ComoJugar: React.FC = () => {
  const pasos = [
    {
      title: 'Ten una cuenta de Steam activa',
      description:
        'La plataforma valida tu identidad y tu cuenta de juego desde Steam.',
      icon: <UserCheck size={18} className="text-blue-400" />,
    },
    {
      title: 'Juega Dota previamente',
      description:
        'Tu historial y experiencia ayudan a emparejarte con rivales de nivel similar.',
      icon: <Gamepad2 size={18} className="text-emerald-400" />,
    },
    {
      title: 'Recarga y paga la cuota inicial',
      description:
        'Necesitas saldo para entrar a la sala y confirmar tu participacion.',
      icon: <Wallet size={18} className="text-yellow-400" />,
    },
    {
      title: 'Compite y gana',
      description:
        'Si eres el ganador, recibes ganancia economica y experiencia dentro del sistema.',
      icon: <Trophy size={18} className="text-orange-400" />,
    },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#141526]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,146,60,0.12),_transparent_45%)]" />
        <div className="relative p-6 lg:p-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-xs font-bold text-orange-400 mb-4">
            <GraduationCap size={14} /> Guia oficial
          </span>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight max-w-3xl">
            Como funciona el juego en nuestras salas de Dota 2
          </h1>
          <p className="text-gray-400 mt-4 max-w-3xl text-sm lg:text-base">
            Compites en salas personalizadas para demostrar habilidad, subir de
            nivel y ganar dinero. Mientras mejor desempeno tengas, mas opciones
            tendras de enfrentar jugadores de mayor nivel.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <NavLink
              to="/main/salas"
              className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold transition-colors"
            >
              Ir a salas
            </NavLink>
            <NavLink
              to="/main/recarga"
              className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold transition-colors"
            >
              Recargar saldo
            </NavLink>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-[#141526] border border-white/5 rounded-2xl p-6 lg:p-8">
          <h2 className="text-xl font-black tracking-tight">
            Pasos para jugar
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Sigue este flujo para entrar correctamente a las salas y competir.
          </p>

          <div className="mt-6 space-y-4">
            {pasos.map((paso, index) => (
              <div
                key={paso.title}
                className="rounded-xl border border-white/10 bg-[#0f1020] p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    {paso.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                      Paso {index + 1}
                    </p>
                    <h3 className="font-bold mt-0.5">{paso.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {paso.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#141526] border border-white/5 rounded-2xl p-6">
            <h3 className="font-black tracking-tight mb-4">Reglas rapidas</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 mt-0.5" />
                <p className="text-sm text-gray-300">
                  Respeta las reglas de la sala y el tiempo de ingreso.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 mt-0.5" />
                <p className="text-sm text-gray-300">
                  Asegura saldo suficiente para cubrir la cuota inicial.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 mt-0.5" />
                <p className="text-sm text-gray-300">
                  Mantener buena conducta mejora tu reputacion en la plataforma.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#141526] border border-white/5 rounded-2xl p-6">
            <h3 className="font-black tracking-tight mb-4">Que puedes ganar</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0f1020] p-3">
                <CircleDollarSign size={18} className="text-green-400" />
                <p className="text-sm text-gray-300">
                  Ganancia economica por victoria.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0f1020] p-3">
                <Swords size={18} className="text-orange-400" />
                <p className="text-sm text-gray-300">
                  Partidas mas competitivas.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0f1020] p-3">
                <ShieldCheck size={18} className="text-blue-400" />
                <p className="text-sm text-gray-300">
                  Experiencia para acceder a rivales de mayor nivel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComoJugar;
