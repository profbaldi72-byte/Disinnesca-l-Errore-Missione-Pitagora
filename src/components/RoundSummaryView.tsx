import React from 'react';
import { Award, CheckCircle2, RefreshCw, Shield, Trophy, XCircle } from 'lucide-react';
import { ACHIEVEMENT_BADGES } from '../data/scenarios';
import { Scenario } from '../types/game';

interface RoundSummaryViewProps {
  scenario: Scenario;
  round: 1 | 2;
  score: number;
  lives: number;
  maxLives: number;
  timeLeft: number;
  defusedModuleIds: string[];
  unlockedBadges: string[];
  onSwapRolesAndPlayNext: () => void;
  onReturnHome: () => void;
}

export const RoundSummaryView: React.FC<RoundSummaryViewProps> = ({
  scenario,
  round,
  score,
  lives,
  maxLives,
  timeLeft,
  defusedModuleIds,
  unlockedBadges,
  onSwapRolesAndPlayNext,
  onReturnHome,
}) => {
  const allDefused = defusedModuleIds.length === scenario.modules.length;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-medium text-slate-500">
            Fine Round {round} · {scenario.title}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            {allDefused
              ? 'Complimenti! Tutti i 4 errori disinnescati!'
              : lives === 0
              ? 'Vite terminate — Rivediamo insieme le soluzioni!'
              : 'Tempo di 05:00 scaduto — Momento del Cambio Ruolo!'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            {allDefused
              ? 'Avete collaborato con metodo verificando formule ed enunciato. Ora scambiatevi i ruoli per affrontare il prossimo scenario!'
              : 'Ogni errore è un’occasione per imparare: controllate le spiegazioni qui sotto e poi scambiate i ruoli per la rivincita!'}
          </p>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
            <div className="text-xs font-medium text-slate-500">Punteggio Coppia</div>
            <div className="font-mono tabular-nums text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D97706]" />
              {score} pt
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
            <div className="text-xs font-medium text-slate-500">Moduli Disinnescati</div>
            <div className="font-mono tabular-nums text-2xl font-bold text-[#059669]">
              {defusedModuleIds.length} / {scenario.modules.length}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
            <div className="text-xs font-medium text-slate-500">Vite & Tempo Residuo</div>
            <div className="font-mono tabular-nums text-lg font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#0284C7]" />
              {lives}/{maxLives} · {timeStr}
            </div>
          </div>
        </div>

        {/* Module by module review */}
        <div className="space-y-3">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Riepilogo delle 4 Verifiche
          </h2>
          {scenario.modules.map((mod) => {
            const ok = defusedModuleIds.includes(mod.id);
            return (
              <div
                key={mod.id}
                className={`rounded-xl border p-4 space-y-1.5 ${
                  ok ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm font-bold text-slate-900">
                    {mod.title}
                  </span>
                  {ok ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#059669]">
                      <CheckCircle2 className="w-4 h-4" />
                      Disinnescato
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                      <XCircle className="w-4 h-4 text-slate-400" />
                      Da ripassare
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {mod.explanationOnDefuse}
                </p>
              </div>
            );
          })}
        </div>

        {/* Unlocked badges */}
        {unlockedBadges.length > 0 && (
          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-2">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#B45309]">
              <Trophy className="w-4 h-4" />
              Traguardi Sbloccati
            </div>
            <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-slate-800">
              {unlockedBadges.map((id) => {
                const badge = ACHIEVEMENT_BADGES.find((b) => b.id === id);
                return badge ? (
                  <span key={id} className="font-semibold">
                    ★ {badge.title}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onReturnHome}
            className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            Torna alla Home
          </button>

          <button
            type="button"
            onClick={onSwapRolesAndPlayNext}
            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Scambia i Ruoli e Avvia Nuovo Scenario
          </button>
        </div>
      </section>
    </main>
  );
};
