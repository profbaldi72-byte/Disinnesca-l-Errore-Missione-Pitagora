import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  FileSearch,
  Loader2,
  Play,
  Sparkles,
  Users,
} from 'lucide-react';
import { CONTEXT_IMAGES, HERO_LAB_IMAGE } from '../data/scenarioImages';
import { ContextCategory, PlayerRole, Scenario } from '../types/game';

interface LandingViewProps {
  scenarios: Scenario[];
  selectedScenarioId: string;
  onSelectScenario: (id: string) => void;
  onGenerateAiScenario: (context: ContextCategory) => Promise<void>;
  isGeneratingAi: boolean;
  aiError: string | null;
  activeRoomCode: string | null;
  onCreateRoom: () => Promise<void>;
  onJoinRoom: (code: string, role: PlayerRole) => Promise<void>;
  roomError: string | null;
  onEnterRole: (role: PlayerRole) => void;
  onOpenTutorial: () => void;
}

const CONTEXT_LABELS: Record<ContextCategory, string> = {
  enunciato: 'Enunciato e Triangoli',
  mappa: 'Mappa Urbana e Sentieri',
  architettura: 'Scale, Rampe e Tetti',
  sport: 'Sport e Schermi TV',
};

export const LandingView: React.FC<LandingViewProps> = ({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  onGenerateAiScenario,
  isGeneratingAi,
  aiError,
  activeRoomCode,
  onCreateRoom,
  onJoinRoom,
  roomError,
  onEnterRole,
  onOpenTutorial,
}) => {
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [aiContext, setAiContext] = useState<ContextCategory>('mappa');
  const [heroImgError, setHeroImgError] = useState(false);

  const selectedScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
          <div className="text-xs font-medium text-slate-500">
            Geometria Cooperativa · Studenti 12 anni · Cambio ruolo a 05:00
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight text-balance">
            Disinnesca l’Errore: Missione Pitagora
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
            Un gioco cooperativo a due ruoli per padroneggiare il Teorema di Pitagora tra mappe
            cittadine, scale, campi sportivi ed enunciato teorico. Un giocatore legge il testo
            generato dall’IA con 4 errori nascosti; l’altro consulta il Manuale Ufficiale e i
            quadrati geometrici per correggerli entro 5 minuti.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onOpenTutorial}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:border-[#0284C7] hover:text-[#0284C7] rounded-lg transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 text-[#0284C7]" />
              Avvia Tutorial Interattivo Passo-Passo
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="h-full bg-white border border-slate-200 rounded-xl overflow-hidden">
            {!heroImgError ? (
              <img
                src={HERO_LAB_IMAGE}
                alt="Banco di geometria con triangolo rettangolo, quadrati costruiti sui tre lati e cronometro"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgError(true)}
                className="w-full h-full min-h-[240px] object-cover"
              />
            ) : (
              <div className="w-full h-full min-h-[240px] blueprint-grid flex items-center justify-center p-6 text-center">
                <Compass className="w-10 h-10 text-[#0284C7]" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Step 1: Choose Scenario or Generate AI Scenario */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              1. Scegli lo Scenario della Sfida
            </h2>
            <p className="text-sm text-slate-600">
              Ogni scenario affronta situazioni quotidiane con 4 errori nascosti da disinnescare.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Contesto per nuovo scenario IA"
              value={aiContext}
              onChange={(e) => setAiContext(e.target.value as ContextCategory)}
              className="px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
            >
              {Object.entries(CONTEXT_LABELS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={isGeneratingAi}
              onClick={() => onGenerateAiScenario(aiContext)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              {isGeneratingAi ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-400" />
              )}
              {isGeneratingAi ? 'Generazione IA in corso...' : 'Genera Nuovo Scenario IA'}
            </button>
          </div>
        </div>

        {aiError && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs sm:text-sm text-amber-900">
            {aiError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scenarios.map((scen) => {
            const isSelected = scen.id === selectedScenario.id;
            const thumb = CONTEXT_IMAGES[scen.context];
            return (
              <button
                key={scen.id}
                type="button"
                onClick={() => onSelectScenario(scen.id)}
                className={`text-left rounded-xl border overflow-hidden transition-colors flex flex-col cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50/50 border-[#0284C7] ring-2 ring-[#0284C7]/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <img
                  src={thumb.src}
                  alt={thumb.alt}
                  referrerPolicy="no-referrer"
                  className="w-full aspect-4/3 object-cover border-b border-slate-100"
                />
                <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-medium text-slate-500">
                      {CONTEXT_LABELS[scen.context]} · {scen.difficulty}
                      {scen.isAiGenerated ? ' · IA' : ''}
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-900 mt-0.5">
                      {scen.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{scen.subtitle}</p>
                  </div>
                  <div className="pt-2 text-xs font-semibold text-[#0284C7]">
                    {isSelected ? 'Scenario selezionato' : 'Seleziona scenario'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2: Optional 2-Device Room Sync + Dual Entry Portals */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              2. Scegli il tuo Ingresso nella Partita
            </h2>
            <p className="text-sm text-slate-600">
              Ogni studente apre il proprio ruolo su uno schermo separato (oppure collegate due dispositivi con un Codice Stanza).
            </p>
          </div>
        </div>

        {/* Optional Room Sync Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#0284C7] shrink-0" />
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Sincronizzazione tra 2 Dispositivi (Opzionale)
              </div>
              <p className="text-xs text-slate-600">
                {activeRoomCode
                  ? `Stanza attiva: ${activeRoomCode}. Comunica questo codice al tuo compagno per sincronizzare timer e cambio ruolo.`
                  : 'Crea una stanza per giocare su due computer/tablet collegati, oppure entra subito in modalità diretta.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeRoomCode ? (
              <div className="px-3 py-1.5 bg-sky-50 border border-sky-200 rounded-lg font-mono text-sm font-bold text-[#0284C7]">
                Codice: {activeRoomCode}
              </div>
            ) : (
              <button
                type="button"
                onClick={onCreateRoom}
                className="px-3.5 py-2 text-xs font-semibold text-[#0284C7] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
              >
                Crea Codice Stanza
              </button>
            )}

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                maxLength={4}
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                placeholder="CODICE"
                aria-label="Inserisci codice stanza a 4 caratteri"
                className="w-24 px-2.5 py-2 text-xs font-mono uppercase bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              />
              <button
                type="button"
                disabled={joinCodeInput.trim().length < 4}
                onClick={() => onJoinRoom(joinCodeInput.trim(), 'player1')}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg cursor-pointer"
              >
                Unisciti G1
              </button>
              <button
                type="button"
                disabled={joinCodeInput.trim().length < 4}
                onClick={() => onJoinRoom(joinCodeInput.trim(), 'player2')}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg cursor-pointer"
              >
                Unisciti G2
              </button>
            </div>
          </div>
          {roomError && <p className="w-full text-xs text-[#DC2626] font-medium">{roomError}</p>}
        </div>

        {/* TWO MAIN ENTRY PORTALS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Entry Portal Player 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D97706]">
                <FileSearch className="w-4 h-4" />
                <span>Primo Ingresso · Ruolo Lettura e Analisi</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900">
                Ingresso Giocatore 1
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Visualizzi il dossier scritto dall’IA sullo scenario{' '}
                <strong className="text-slate-900">{selectedScenario.title}</strong>, contenente{' '}
                <strong className="text-slate-900">4 errori nascosti</strong>. Evidenzia le frasi
                sospette e descrivile a voce al tuo compagno senza mostrargli lo schermo.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onEnterRole('player1')}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <span>Entra come Giocatore 1</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Entry Portal Player 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0284C7]">
                <BookOpen className="w-4 h-4" />
                <span>Secondo Ingresso · Ruolo Manuale e Verifica</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-900">
                Ingresso Giocatore 2
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Hai a disposizione il <strong className="text-slate-900">Manuale Ufficiale di Pitagora</strong>,
                il laboratorio visivo dei quadrati <span className="font-mono">a² + b² = c²</span> e la
                mappa interattiva per individuare, correggere e disinnescare i 4 errori.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onEnterRole('player2')}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg transition-colors cursor-pointer"
            >
              <span>Entra come Giocatore 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
