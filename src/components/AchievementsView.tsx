import React from 'react';
import { Award, CheckCircle2, Lock, Trophy } from 'lucide-react';
import { ACHIEVEMENT_BADGES } from '../data/scenarios';
import { PairMatchRecord } from '../types/game';

interface AchievementsViewProps {
  unlockedBadgeIds: string[];
  matchHistory: PairMatchRecord[];
  bestScore: number;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  unlockedBadgeIds,
  matchHistory,
  bestScore,
}) => {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-medium text-slate-500">
            Gamification e Progressi di Coppia
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
            Traguardi e Storico Sfide
          </h1>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <Award className="w-5 h-5 text-[#D97706]" />
          <div>
            <div className="text-[11px] font-medium text-slate-500">Record Punteggio</div>
            <div className="font-mono tabular-nums text-lg font-bold text-slate-900">
              {bestScore} pt
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-bold text-slate-900">
          Distintivi Sbloccabili ({unlockedBadgeIds.length} / {ACHIEVEMENT_BADGES.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACHIEVEMENT_BADGES.map((badge) => {
            const unlocked = unlockedBadgeIds.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`rounded-xl border p-4 space-y-2 ${
                  unlocked
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-white border-slate-200 opacity-85'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 font-display text-base font-bold text-slate-900">
                    {unlocked ? (
                      <Trophy className="w-4 h-4 text-[#D97706]" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                    <span>{badge.title}</span>
                  </div>
                  {unlocked && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#059669]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ottenuto
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-600">{badge.description}</p>
                <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-100">
                  Obiettivo: {badge.criteria}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Match History */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-bold text-slate-900">
          Ultime Partite della Classe
        </h2>
        {matchHistory.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-sm text-slate-500">
            Completa il tuo primo round per registrare il punteggio di coppia nello storico.
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Scenario</th>
                  <th className="py-3 px-4">Round</th>
                  <th className="py-3 px-4">Errori</th>
                  <th className="py-3 px-4">Vite</th>
                  <th className="py-3 px-4 text-right">Punteggio</th>
                </tr>
              </thead>
              <tbody>
                {matchHistory.map((m) => (
                  <tr key={m.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div>{m.scenarioTitle}</div>
                      <div className="text-[11px] text-slate-500">{m.dateLabel}</div>
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                      Round {m.round}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-[#059669] font-semibold">
                      {m.defusedCount}/4
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                      {m.livesLeft}/3
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums font-bold text-slate-900 text-right">
                      {m.score} pt
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};
