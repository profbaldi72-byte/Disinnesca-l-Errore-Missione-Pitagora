import React from 'react';
import { GeometryVisualizer } from './GeometryVisualizer';
import { InteractiveCityMap } from './InteractiveCityMap';
import { PYTHAGORAS_MANUAL } from '../data/manual';

export const FreeLabView: React.FC = () => {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="space-y-1.5">
        <div className="text-xs font-medium text-slate-500">
          Esplorazione Libera · Senza Timer
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
          Laboratorio Interattivo di Pitagora
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Sperimenta con i quadrati sui cateti e sull’ipotenusa, misura le scorciatoie sulla mappa
          cittadina e ripassa le formule del Manuale prima di iniziare la sfida a tempo.
        </p>
      </div>

      <GeometryVisualizer />

      <InteractiveCityMap />

      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-slate-900">
          Manuale Rapido delle Formule
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PYTHAGORAS_MANUAL.map((sec) => (
            <article
              key={sec.id}
              className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="text-xs font-mono font-semibold text-[#0284C7]">
                  {sec.code} · {sec.formula}
                </div>
                <h3 className="font-display text-base font-bold text-slate-900">{sec.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{sec.summary}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                {sec.sourceNote}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};
