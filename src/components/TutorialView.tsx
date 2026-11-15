import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, Sparkles } from 'lucide-react';
import { GeometryVisualizer } from './GeometryVisualizer';

interface TutorialViewProps {
  onFinishToHome: () => void;
}

export const TutorialView: React.FC<TutorialViewProps> = ({ onFinishToHome }) => {
  const [step, setStep] = useState<number>(1);
  const [tripleMatched, setTripleMatched] = useState(false);
  const [sampleChoice, setSampleChoice] = useState<string>('');
  const [sampleChecked, setSampleChecked] = useState<'idle' | 'ok' | 'retry'>('idle');

  const steps = [
    { id: 1, label: '01. I Due Ruoli' },
    { id: 2, label: '02. I Quadrati' },
    { id: 3, label: '03. Prova Pratica' },
    { id: 4, label: '04. Cambio Ruolo' },
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="space-y-2">
        <div className="text-xs font-medium text-slate-500">
          Guida Interattiva · Passo dopo Passo
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
          Come si gioca a Disinnesca l’Errore
        </h1>
      </div>

      {/* Stepper */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {steps.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setStep(s.id)}
            className={`px-3 py-2.5 rounded-lg border text-xs sm:text-sm font-semibold text-left transition-colors cursor-pointer ${
              step === s.id
                ? 'bg-[#0284C7] text-white border-[#0284C7]'
                : step > s.id
                ? 'bg-emerald-50 text-[#059669] border-emerald-200'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Step Content */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-slate-900">
              Due Schermate Diverse, Un Unico Obiettivo
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              In coppia lavorate come una squadra di artificieri matematici. Avete{' '}
              <strong className="text-slate-900">5 minuti (05:00)</strong> per trovare e correggere{' '}
              <strong className="text-slate-900">4 errori nascosti</strong> in un testo scritto dall’IA.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                <div className="text-xs font-bold text-[#D97706]">Giocatore 1 · Analista</div>
                <p className="text-sm text-slate-700">
                  Legge i 4 moduli del testo IA, evidenzia le frasi sospette e le descrive a voce
                  al compagno senza mostrare il proprio schermo.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                <div className="text-xs font-bold text-[#0284C7]">Giocatore 2 · Artificiere</div>
                <p className="text-sm text-slate-700">
                  Ascolta, verifica i calcoli sul Manuale Ufficiale e nel Laboratorio Geometrico, e
                  seleziona la correzione esatta nel pannello di disinnesco.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900">
                  Prova dal Vivo: Perché c² = a² + b²?
                </h2>
                <p className="text-sm text-slate-600">
                  Sfida rapida: prova a impostare i cateti su <strong className="font-mono">a = 6</strong> e{' '}
                  <strong className="font-mono">b = 8</strong> per vedere quanto misura l’ipotenusa!
                </p>
              </div>
              {tripleMatched && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#059669]">
                  <CheckCircle2 className="w-4 h-4" />
                  Terna 6-8-10 verificata!
                </span>
              )}
            </div>

            <GeometryVisualizer
              onTripleMatched={(a, b, c) => {
                if (a === 6 && b === 8 && c === 10) {
                  setTripleMatched(true);
                }
              }}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-slate-900">
              Allena l’Occhio: Scova l’Errore di Prova
            </h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706]">
                <Sparkles className="w-3.5 h-3.5" />
                Esempio di testo IA letto dal Giocatore 1:
              </div>
              <p className="text-sm sm:text-base text-slate-900 font-medium">
                “In un triangolo rettangolo con i cateti lunghi 3 cm e 4 cm, l’ipotenusa misura
                esattamente 3 + 4 = 7 cm.”
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs sm:text-sm font-semibold text-slate-800">
                Qual è la correzione esatta che deve scegliere il Giocatore 2?
              </div>
              {[
                {
                  id: 'opt-wrong1',
                  text: 'L’ipotenusa misura 3 × 4 = 12 cm.',
                },
                {
                  id: 'opt-right',
                  text: 'Bisogna sommare i quadrati e fare la radice: √(3² + 4²) = √(9 + 16) = √25 = 5 cm.',
                },
                {
                  id: 'opt-wrong2',
                  text: 'Non si può calcolare perché manca il terzo angolo.',
                },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border text-sm cursor-pointer ${
                    sampleChoice === opt.id
                      ? 'border-[#0284C7] bg-sky-50/70 font-medium'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="tutorial-sample"
                    checked={sampleChoice === opt.id}
                    onChange={() => {
                      setSampleChoice(opt.id);
                      setSampleChecked('idle');
                    }}
                    className="mt-1 accent-[#0284C7]"
                  />
                  <span>{opt.text}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={!sampleChoice}
                onClick={() =>
                  setSampleChecked(sampleChoice === 'opt-right' ? 'ok' : 'retry')
                }
                className="px-4 py-2 text-sm font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] disabled:bg-slate-200 disabled:text-slate-500 rounded-lg cursor-pointer"
              >
                Verifica Risposta di Prova
              </button>
            </div>

            {sampleChecked === 'ok' && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 text-sm text-emerald-950 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
                <div>
                  <strong>Fantastico!</strong> Hai disinnescato il tuo primo errore: 3² + 4² = 9 + 16 = 25, e √25 = 5 cm.
                </div>
              </div>
            )}

            {sampleChecked === 'retry' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 text-sm text-amber-950 flex items-start gap-2.5">
                <Lightbulb className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <strong>Rinforzo positivo:</strong> ci sei quasi! Ricorda che Pitagora lavora con i{' '}
                  <em>quadrati</em> dei cateti (3² e 4²) prima della radice quadrata finale. Riprova!
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-slate-900">
              Cambio di Ruolo dopo 5 Minuti e Punteggio Finale
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Quando scade il conto alla rovescia di <strong className="font-mono">05:00</strong>{' '}
              (oppure quando disinnescate tutti e 4 i moduli prima del tempo), il gioco vi invita a
              premere <strong className="text-slate-900">Scambia Ruolo</strong> per avviare il Round 2
              su un nuovo contesto: chi leggeva passa al Manuale e viceversa!
            </p>
            <ul className="text-sm text-slate-700 space-y-2">
              <li>• Ogni modulo disinnescato assegna <strong>+250 punti</strong> (+100 bonus al primo tentativo).</li>
              <li>• Avete <strong>3 Vite (Scudi)</strong> per round e potete sempre chiedere un <strong>Aiuto Positivo</strong>.</li>
              <li>• Risolvete tutti gli scenari per sbloccare i 5 Traguardi di Coppia.</li>
            </ul>
          </div>
        )}

        {/* Navigation footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Indietro
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg cursor-pointer"
            >
              Avanti
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onFinishToHome}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-lg cursor-pointer"
            >
              Vai agli Ingressi della Partita
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>
    </main>
  );
};
