import React, { useState } from 'react';
import {
  CheckCircle2,
  EyeOff,
  Highlighter,
  Map as MapIcon,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { CONTEXT_IMAGES } from '../data/scenarioImages';
import { PlayerRole, Scenario } from '../types/game';
import { InteractiveCityMap } from './InteractiveCityMap';
import { MissionStatusHeader } from './MissionStatusHeader';

interface Player1ViewProps {
  scenario: Scenario;
  round: 1 | 2;
  timeLeft: number;
  lives: number;
  maxLives: number;
  score: number;
  defusedModuleIds: string[];
  roomCode?: string | null;
  isLiveSync: boolean;
  onSwapRoles: () => void;
  onQuickSwitchRole?: (role: PlayerRole) => void;
}

export const Player1View: React.FC<Player1ViewProps> = ({
  scenario,
  round,
  timeLeft,
  lives,
  maxLives,
  score,
  defusedModuleIds,
  roomCode,
  isLiveSync,
  onSwapRoles,
  onQuickSwitchRole,
}) => {
  const [highlightedSnippets, setHighlightedSnippets] = useState<string[]>([]);
  const [showMapHelper, setShowMapHelper] = useState<boolean>(scenario.context === 'mappa');
  const [imgError, setImgError] = useState(false);

  const toggleSnippet = (snippet: string) => {
    setHighlightedSnippets((prev) =>
      prev.includes(snippet) ? prev.filter((s) => s !== snippet) : [...prev, snippet]
    );
  };

  const renderHighlightedParagraph = (text: string, snippets: string[]) => {
    if (!snippets.length) return <span>{text}</span>;
    // Highlight clicked snippets cleanly without breaking text flow
    let parts: { str: string; active: boolean; snippet?: string }[] = [{ str: text, active: false }];
    snippets.forEach((snip) => {
      if (!snip) return;
      const nextParts: typeof parts = [];
      for (const p of parts) {
        if (p.active) {
          nextParts.push(p);
          continue;
        }
        const idx = p.str.indexOf(snip);
        if (idx === -1) {
          nextParts.push(p);
        } else {
          if (idx > 0) nextParts.push({ str: p.str.slice(0, idx), active: false });
          nextParts.push({
            str: snip,
            active: highlightedSnippets.includes(snip),
            snippet: snip,
          });
          if (idx + snip.length < p.str.length) {
            nextParts.push({ str: p.str.slice(idx + snip.length), active: false });
          }
        }
      }
      parts = nextParts;
    });

    return (
      <>
        {parts.map((p, i) =>
          p.snippet ? (
            <button
              key={i}
              type="button"
              onClick={() => toggleSnippet(p.snippet!)}
              title="Clicca per evidenziare o togliere l'evidenziazione"
              className={`inline text-left rounded px-1 py-0.5 transition-colors cursor-pointer underline decoration-dotted underline-offset-4 ${
                p.active
                  ? 'bg-amber-200/80 text-slate-900 font-medium decoration-amber-600'
                  : 'hover:bg-slate-100 decoration-slate-400'
              }`}
            >
              {p.str}
            </button>
          ) : (
            <span key={i}>{p.str}</span>
          )
        )}
      </>
    );
  };

  const contextImage = CONTEXT_IMAGES[scenario.context];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <MissionStatusHeader
        role="player1"
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

      {/* Secret screen reminder */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <EyeOff className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-slate-900">
              Schermata riservata al Giocatore 1 — Non mostrarla al Giocatore 2!
            </p>
            <p className="text-xs sm:text-sm text-slate-700">
              {scenario.briefingForPlayer1} Clicca sulle frasi sottolineate per evidenziare i possibili errori mentre leggi ad alta voce.
            </p>
          </div>
        </div>
        {onQuickSwitchRole && !isLiveSync && (
          <button
            type="button"
            onClick={() => onQuickSwitchRole('player2')}
            className="px-3 py-1.5 text-xs font-semibold text-[#0284C7] bg-white border border-slate-200 hover:border-[#0284C7] rounded-lg whitespace-nowrap cursor-pointer"
          >
            Passa a Schermo Giocatore 2
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: AI Dossier with 4 Modules */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-slate-500">
                Dossier generato dall’IA · {scenario.difficulty}
                {scenario.isAiGenerated ? ' · Creato al momento' : ''}
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                {scenario.title}
              </h2>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <Highlighter className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{highlightedSnippets.length} evidenziazioni</span>
            </div>
          </div>

          <div className="space-y-4">
            {scenario.modules.map((mod) => {
              const isDefused = defusedModuleIds.includes(mod.id);
              return (
                <article
                  key={mod.id}
                  className={`rounded-xl border p-5 transition-colors ${
                    isDefused
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <h3 className="font-display text-base font-bold text-slate-900">
                      {mod.title}
                    </h3>
                    {isDefused ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#059669]">
                        <CheckCircle2 className="w-4 h-4" />
                        Errore disinnescato
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                        Contiene 1 errore nascosto
                      </span>
                    )}
                  </div>

                  <p className="text-sm sm:text-base leading-relaxed text-slate-800">
                    {renderHighlightedParagraph(mod.aiParagraph, mod.suspiciousSnippets)}
                  </p>

                  {isDefused && (
                    <div className="mt-3 pt-3 border-t border-emerald-200 text-xs sm:text-sm text-[#065F46]">
                      <span className="font-semibold">Correzione verificata: </span>
                      {mod.explanationOnDefuse}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* Right: Visual Illustration & Communication Aids */}
        <aside className="lg:col-span-5 space-y-4">
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
            <div className="p-4 space-y-2 border-t border-slate-100">
              <div className="text-xs font-semibold text-[#0284C7]">Contesto Visivo dello Scenario</div>
              <p className="text-sm text-slate-700">{scenario.diagramConfig.caption}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <MessageSquare className="w-4 h-4 text-[#0284C7]" />
              <span>Consigli per la collaborazione a voce</span>
            </div>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
              <li>1. Leggi i numeri e le unità di misura con precisione (es. centimetri vs metri).</li>
              <li>2. Specifica sempre quale lato il testo chiama cateto e quale chiama ipotenusa.</li>
              <li>3. Se una formula o un risultato ti sembra strano, cliccaci sopra per evidenziarlo in giallo e chiedi al Giocatore 2 di controllarlo nel Manuale!</li>
            </ul>
          </div>

          {scenario.context === 'mappa' && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowMapHelper((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 hover:border-[#0284C7] rounded-xl text-xs font-semibold text-slate-800 cursor-pointer"
              >
                <span className="inline-flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-[#0284C7]" />
                  {showMapHelper ? 'Nascondi riferimento mappa griglia' : 'Mostra riferimento mappa griglia'}
                </span>
                <span className="text-[#0284C7]">{showMapHelper ? 'Chiudi' : 'Apri'}</span>
              </button>
              {showMapHelper && <InteractiveCityMap />}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
