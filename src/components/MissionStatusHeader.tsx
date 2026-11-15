import React from 'react';
import { Clock, Shield, Award, RefreshCw, CheckCircle2 } from 'lucide-react';
import { PlayerRole } from '../types/game';

interface MissionStatusHeaderProps {
  role: PlayerRole;
  round: 1 | 2;
  timeLeft: number;
  lives: number;
  maxLives: number;
  score: number;
  defusedCount: number;
  totalModules: number;
  roomCode?: string | null;
  isLiveSync: boolean;
  onSwapRoles: () => void;
}

export const MissionStatusHeader: React.FC<MissionStatusHeaderProps> = ({
  role,
  round,
  timeLeft,
  lives,
  maxLives,
  score,
  defusedCount,
  totalModules,
  roomCode,
  isLiveSync,
  onSwapRoles,
}) => {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const isUrgent = timeLeft <= 60;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="font-semibold text-slate-900">
            {role === 'player1' ? 'Giocatore 1 · Analista del Dossier IA' : 'Giocatore 2 · Artificiere col Manuale'}
          </span>
          <span aria-hidden="true">·</span>
          <span>Round {round} di 2</span>
          {roomCode && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-[#0284C7] font-semibold">
                Stanza {roomCode} ({isLiveSync ? 'Sincronizzata' : 'Locale'})
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800 font-mono tabular-nums">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            {defusedCount} / {totalModules} Errori disinnescati
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        {/* Lives */}
        <div className="flex items-center gap-1.5" aria-label={`Vite rimaste: ${lives} su ${maxLives}`}>
          {Array.from({ length: maxLives }).map((_, i) => (
            <Shield
              key={i}
              className={`w-5 h-5 ${
                i < lives ? 'text-[#0284C7] fill-[#0284C7]/15' : 'text-slate-300'
              }`}
            />
          ))}
          <span className="text-xs font-mono tabular-nums font-semibold text-slate-700 ml-1">
            {lives}/{maxLives}
          </span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-1.5 text-sm font-mono tabular-nums font-bold text-slate-900">
          <Award className="w-4 h-4 text-[#D97706]" />
          <span>{score} pt</span>
        </div>

        {/* 5:00 Countdown */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono tabular-nums text-base font-bold ${
            isUrgent
              ? 'bg-red-50 border-red-200 text-[#DC2626]'
              : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <Clock className={`w-4 h-4 ${isUrgent ? 'text-[#DC2626]' : 'text-[#0284C7]'}`} />
          <span>{formattedTime}</span>
        </div>

        <button
          type="button"
          onClick={onSwapRoles}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Scambia Ruolo
        </button>
      </div>
    </div>
  );
};
