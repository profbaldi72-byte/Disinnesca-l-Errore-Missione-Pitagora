import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Compass,
  HelpCircle,
  Lightbulb,
  Map as MapIcon,
  ShieldAlert,
  Wrench,
} from 'lucide-react';
import { PYTHAGORAS_MANUAL } from '../data/manual';
import { CONTEXT_IMAGES } from '../data/scenarioImages';
import { PlayerRole, PresetLabValues, Scenario, VerificationFeedback } from '../types/game';
import { GeometryVisualizer } from './GeometryVisualizer';
import { InteractiveCityMap } from './InteractiveCityMap';
import { MissionStatusHeader } from './MissionStatusHeader';

interface Player2ViewProps {
  scenario: Scenario;
  round: 1 | 2;
  timeLeft: number;
  lives: number;
  maxLives: number;
  score: number;
  defusedModuleIds: string[];
  hintedModuleIds: string[];
  lastFeedback: VerificationFeedback | null;
  roomCode?: string | null;
  isLiveSync: boolean;
  onVerifyModule: (moduleId: string, errorClaimId: string, correctionId: string) => void;
  onUseHint: (moduleId: string) => void;
  onSwapRoles: () => void;
  onQuickSwitchRole?: (role: PlayerRole) => void;
}

export const Player2View: React.FC<Player2ViewProps> = ({
  scenario,
  round,
  timeLeft,
  lives,
  maxLives,
  score,
  defusedModuleIds,
  hintedModuleIds,
  lastFeedback,
  roomCode,
  isLiveSync,
  onVerifyModule,
  onUseHint,
  onSwapRoles,
  onQuickSwitchRole,
}) => {
  const firstPending =
    scenario.modules.find((m) => !defusedModuleIds.includes(m.id))?.id || scenario.modules[0].id;
  const [selectedModuleId, setSelectedModuleId] = useState<string>(firstPending);
  const [selectedClaimByMod, setSelectedClaimByMod] = useState<Record<string, string>>({});
  const [selectedCorrectionByMod, setSelectedCorrectionByMod] = useState<Record<string, string>>({});
  const [activeToolTab, setActiveToolTab] = useState<'manual' | 'lab' | 'map'>('manual');
  const [labPreset, setLabPreset] = useState<PresetLabValues | null>(null);
  const [imgError, setImgError] = useState(false);

  const activeModule =
    scenario.modules.find((m) => m.id === selectedModuleId) || scenario.modules[0];
  const isModuleDefused = defusedModuleIds.includes(activeModule.id);
  const isModuleHinted = hintedModuleIds.includes(activeModule.id);

  const selectedClaim = selectedClaimByMod[activeModule.id] || '';
  const selectedFix = selectedCorrectionByMod[activeModule.id] || '';
  const canSubmit = !isModuleDefused && Boolean(selectedClaim && selectedFix);

  const handleLoadIntoLab = () => {
    if (activeModule.presetLabValues) {
      setLabPreset({ ...activeModule.presetLabValues });
    }
    setActiveToolTab('lab');
  };

  const contextImage = CONTEXT_IMAGES[scenario.context];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <MissionStatusHeader
        role="player2"
        round={round}
        timeLeft={timeLeft}
        lives={lives}
        maxLives={maxLives}
        score={score}
        defusedCount={defusedModuleIds.length}
        totalModules={scenario.modules.length}
        roomCode={roomCode}
        isLiveSync={isLiveSync}
        onSwapRoles={onSwapRoles}
      />

      {/* Briefing & Single-Device helper */}
      <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-[#0284C7] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-slate-900">
              Postazione Artificiere — Ascolta il Giocatore 1 e usa il Manuale per verificare
            </p>
            <p className="text-xs sm:text-sm text-slate-700">{scenario.briefingForPlayer2}</p>
          </div>
        </div>
        {onQuickSwitchRole && !isLiveSync && (
          <button
            type="button"
            onClick={() => onQuickSwitchRole('player1')}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-[#0284C7] rounded-lg whitespace-nowrap cursor-pointer"
          >
            Torna a Schermo Giocatore 1
          </button>
        )}
      </div>

      {/* Positive Feedback / Reinforcement Banner */}
      {lastFeedback && (
        <div
          role="status"
          className={`rounded-xl border p-4 flex items-start gap-3 ${
            lastFeedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : lastFeedback.type === 'hint'
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : 'bg-red-50 border-red-200 text-red-950'
          }`}
        >
          {lastFeedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
          ) : lastFeedback.type === 'hint' ? (
            <Lightbulb className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold">{lastFeedback.title}</span>
              {typeof lastFeedback.pointsDelta === 'number' && lastFeedback.pointsDelta > 0 && (
                <span className="font-mono tabular-nums text-xs font-bold text-[#059669]">
                  +{lastFeedback.pointsDelta} punti precisione
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">{lastFeedback.message}</p>
          </div>
        </div>
      )}

      {/* Main Two-Zone Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Error Identification & Defusal Panel */}
        <section className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 space-y-5">
          <div className="space-y-1">
            <div className="text-xs font-medium text-slate-500">
              Pannello di Disinnesco · {scenario.title}
            </div>
            <h2 className="font-display text-lg font-bold text-slate-900">
              Seleziona il Modulo e Correggi l’Errore
            </h2>
          </div>

          {/* 4 Module selector tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {scenario.modules.map((mod) => {
              const defused = defusedModuleIds.includes(mod.id);
              const selected = mod.id === activeModule.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => setSelectedModuleId(mod.id)}
                  className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    selected
                      ? 'bg-[#0284C7] text-white border-[#0284C7]'
                      : defused
                      ? 'bg-emerald-50 text-[#059669] border-emerald-200'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {defused && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                  <span>Modulo {mod.index}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-base font-bold text-slate-900">
                {activeModule.title}
              </h3>
              {activeModule.presetLabValues && (
                <button
                  type="button"
                  onClick={handleLoadIntoLab}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0284C7] bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  Prova i numeri nel Laboratorio
                </button>
              )}
            </div>

            {isModuleDefused ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                <div className="inline-flex items-center gap-2 text-sm font-bold text-[#059669]">
                  <CheckCircle2 className="w-5 h-5" />
                  Modulo {activeModule.index} disinnescato con successo!
                </div>
                <p className="text-sm text-emerald-950 leading-relaxed">
                  {activeModule.explanationOnDefuse}
                </p>
              </div>
            ) : (
              <>
                {/* Step 1: Identify Error */}
                <fieldset className="space-y-2.5">
                  <legend className="text-xs sm:text-sm font-semibold text-slate-800">
                    1. Cosa ha sbagliato l’IA in questo modulo? (Chiedi al Giocatore 1)
                  </legend>
                  <div className="space-y-2">
                    {activeModule.errorClaimOptions.map((opt) => {
                      const checked = selectedClaim === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border text-xs sm:text-sm cursor-pointer transition-colors ${
                            checked
                              ? 'border-[#0284C7] bg-sky-50/70 text-slate-900 font-medium'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`claim-${activeModule.id}`}
                            value={opt.id}
                            checked={checked}
                            onChange={() =>
                              setSelectedClaimByMod((prev) => ({
                                ...prev,
                                [activeModule.id]: opt.id,
                              }))
                            }
                            className="mt-0.5 accent-[#0284C7]"
                          />
                          <span>{opt.text}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Step 2: Choose Correction */}
                <fieldset className="space-y-2.5">
                  <legend className="text-xs sm:text-sm font-semibold text-slate-800">
                    2. Scegli la correzione matematica esatta:
                  </legend>
                  <div className="space-y-2">
                    {activeModule.correctionOptions.map((opt) => {
                      const checked = selectedFix === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border text-xs sm:text-sm cursor-pointer transition-colors ${
                            checked
                              ? 'border-[#059669] bg-emerald-50/60 text-slate-900 font-medium'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`fix-${activeModule.id}`}
                            value={opt.id}
                            checked={checked}
                            onChange={() =>
                              setSelectedCorrectionByMod((prev) => ({
                                ...prev,
                                [activeModule.id]: opt.id,
                              }))
                            }
                            className="mt-0.5 accent-[#059669]"
                          />
                          <span>{opt.text}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Positive Hint readout if requested */}
                {isModuleHinted && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs sm:text-sm text-amber-950 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">Aiuto Positivo: </span>
                      {activeModule.positiveHint}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      onUseHint(activeModule.id);
                      setActiveToolTab('manual');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#B45309] bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Chiedi Aiuto Positivo
                  </button>

                  <button
                    type="button"
                    disabled={!canSubmit}
                    onClick={() => onVerifyModule(activeModule.id, selectedClaim, selectedFix)}
                    className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                      canSubmit
                        ? 'bg-[#0284C7] hover:bg-[#0369A1] text-white'
                        : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Verifica e Disinnesca
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Right Zone: Manual, Geometric Lab & Map */}
        <section className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveToolTab('manual')}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeToolTab === 'manual'
                  ? 'bg-white text-[#0284C7] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Manuale e Fonti
            </button>
            <button
              type="button"
              onClick={() => setActiveToolTab('lab')}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeToolTab === 'lab'
                  ? 'bg-white text-[#0284C7] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Laboratorio Formule
            </button>
            <button
              type="button"
              onClick={() => setActiveToolTab('map')}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeToolTab === 'map'
                  ? 'bg-white text-[#0284C7] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              Mappa & Contesto
            </button>
          </div>

          {activeToolTab === 'manual' && (
            <div className="space-y-3">
              {PYTHAGORAS_MANUAL.map((sec) => {
                const isRecommended = sec.id === activeModule.manualRefId;
                return (
                  <article
                    key={sec.id}
                    className={`rounded-xl border p-4 space-y-2.5 transition-colors ${
                      isRecommended
                        ? 'bg-sky-50/60 border-[#0284C7]'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs font-mono font-semibold text-slate-500">
                        {sec.code}
                        {isRecommended ? ' · Consigliata per il Modulo ' + activeModule.index : ''}
                      </div>
                      <span className="font-mono text-xs font-bold text-[#0284C7]">
                        {sec.formula}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-900">{sec.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{sec.summary}</p>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {sec.keyRules.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#0284C7] font-bold">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 border-t border-slate-200/70 text-[11px] text-slate-500">
                      {sec.sourceNote}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {activeToolTab === 'lab' && <GeometryVisualizer preset={labPreset} compact />}

          {activeToolTab === 'map' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                {!imgError ? (
                  <img
                    src={contextImage.src}
                    alt={contextImage.alt}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="w-full aspect-4/3 object-cover"
                  />
                ) : (
                  <div className="w-full aspect-4/3 blueprint-grid flex items-center justify-center p-6 text-center">
                    <span className="text-sm font-medium text-slate-600">{contextImage.alt}</span>
                  </div>
                )}
                <div className="p-3.5 text-xs text-slate-600 border-t border-slate-100">
                  {scenario.diagramConfig.caption}
                </div>
              </div>
              <InteractiveCityMap />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
