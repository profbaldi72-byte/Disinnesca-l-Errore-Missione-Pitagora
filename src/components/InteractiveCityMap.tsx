import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

const LANDMARKS: { name: string; pos: Point; color: string }[] = [
  { name: 'Scuola', pos: { x: 2, y: 1 }, color: '#0284C7' },
  { name: 'Biblioteca', pos: { x: 5, y: 5 }, color: '#059669' },
  { name: 'Stazione', pos: { x: 10, y: 7 }, color: '#D97706' },
];

export const InteractiveCityMap: React.FC = () => {
  const [start, setStart] = useState<Point>({ x: 2, y: 1 });
  const [end, setEnd] = useState<Point>({ x: 10, y: 7 });
  const [activeSelect, setActiveSelect] = useState<'start' | 'end'>('end');

  const cols = 12;
  const rows = 8;
  const cell = 34;
  const pad = 30;
  const svgW = cols * cell + pad * 2;
  const svgH = rows * cell + pad * 2;

  const toSvg = (p: Point) => ({
    cx: pad + p.x * cell,
    cy: pad + (rows - p.y) * cell,
  });

  const dx = Math.abs(end.x - start.x);
  const dy = Math.abs(end.y - start.y);
  const streetBlocks = dx + dy;
  const diagonalBlocks = Math.sqrt(dx * dx + dy * dy);
  const scaleMeters = 100;
  const streetMeters = streetBlocks * scaleMeters;
  const airMeters = diagonalBlocks * scaleMeters;
  const savedMeters = Math.max(0, streetMeters - airMeters);

  const pStart = toSvg(start);
  const pEnd = toSvg(end);
  const pCorner = toSvg({ x: end.x, y: start.y });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
            Mappa Interattiva delle Distanze (1 quadretto = 100 m)
          </h3>
          <p className="text-xs text-slate-500">
            Clicca sugli incroci della griglia per spostare Partenza o Arrivo e confrontare strade e linea d’aria
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveSelect('start')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeSelect === 'start'
                ? 'bg-white text-[#0284C7] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sposta Partenza ({start.x},{start.y})
          </button>
          <button
            type="button"
            onClick={() => setActiveSelect('end')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeSelect === 'end'
                ? 'bg-white text-[#D97706] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sposta Arrivo ({end.x},{end.y})
          </button>
        </div>
      </div>

      {/* Quick preset city routes */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 font-medium">Percorsi rapidi:</span>
        <button
          type="button"
          onClick={() => {
            setStart({ x: 2, y: 1 });
            setEnd({ x: 5, y: 5 });
          }}
          className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md font-medium text-slate-700 cursor-pointer"
        >
          Scuola → Biblioteca (3-4-5)
        </button>
        <button
          type="button"
          onClick={() => {
            setStart({ x: 2, y: 1 });
            setEnd({ x: 10, y: 7 });
          }}
          className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md font-medium text-slate-700 cursor-pointer"
        >
          Scuola → Stazione (6-8-10)
        </button>
        <button
          type="button"
          onClick={() => {
            setStart({ x: 0, y: 1 });
            setEnd({ x: 12, y: 6 });
          }}
          className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md font-medium text-slate-700 cursor-pointer"
        >
          Parco Ovest → Est (5-12-13)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-8 bg-[#F8FAFC] border border-slate-200 rounded-lg overflow-hidden">
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            className="w-full h-auto block"
            role="img"
            aria-label="Griglia urbana interattiva con percorso stradale e diagonale"
          >
            {/* Park green zone */}
            <rect
              x={pad + 3 * cell}
              y={pad + (rows - 6) * cell}
              width={4 * cell}
              height={4 * cell}
              rx={4}
              fill="rgba(5, 150, 105, 0.1)"
              stroke="rgba(5, 150, 105, 0.35)"
              strokeDasharray="4 4"
            />
            <text
              x={pad + 5 * cell}
              y={pad + (rows - 4) * cell + 4}
              textAnchor="middle"
              className="text-[10px] font-semibold fill-[#047857]"
            >
              Parco Centrale
            </text>

            {/* Grid lines */}
            {Array.from({ length: cols + 1 }).map((_, x) => (
              <g key={`vx-${x}`}>
                <line
                  x1={pad + x * cell}
                  y1={pad}
                  x2={pad + x * cell}
                  y2={pad + rows * cell}
                  stroke="#CBD5E1"
                  strokeWidth="1"
                />
                <text
                  x={pad + x * cell}
                  y={pad + rows * cell + 16}
                  textAnchor="middle"
                  className="font-mono text-[9px] fill-slate-500"
                >
                  {x}
                </text>
              </g>
            ))}
            {Array.from({ length: rows + 1 }).map((_, y) => (
              <g key={`hy-${y}`}>
                <line
                  x1={pad}
                  y1={pad + (rows - y) * cell}
                  x2={pad + cols * cell}
                  y2={pad + (rows - y) * cell}
                  stroke="#CBD5E1"
                  strokeWidth="1"
                />
                <text
                  x={pad - 12}
                  y={pad + (rows - y) * cell + 3}
                  textAnchor="middle"
                  className="font-mono text-[9px] fill-slate-500"
                >
                  {y}
                </text>
              </g>
            ))}

            {/* Right triangle fill */}
            {dx > 0 && dy > 0 && (
              <polygon
                points={`${pStart.cx},${pStart.cy} ${pCorner.cx},${pCorner.cy} ${pEnd.cx},${pEnd.cy}`}
                fill="rgba(2, 132, 199, 0.08)"
              />
            )}

            {/* Street route (legs) */}
            <polyline
              points={`${pStart.cx},${pStart.cy} ${pCorner.cx},${pCorner.cy} ${pEnd.cx},${pEnd.cy}`}
              fill="none"
              stroke="#0284C7"
              strokeWidth="3"
              strokeDasharray="6 4"
            />

            {/* Straight line air shortcut */}
            <line
              x1={pStart.cx}
              y1={pStart.cy}
              x2={pEnd.cx}
              y2={pEnd.cy}
              stroke="#D97706"
              strokeWidth="3.5"
            />

            {/* Landmarks */}
            {LANDMARKS.map((lm) => {
              const p = toSvg(lm.pos);
              return (
                <g key={lm.name} pointerEvents="none">
                  <circle cx={p.cx} cy={p.cy} r={4} fill={lm.color} opacity={0.45} />
                  <text
                    x={p.cx}
                    y={p.cy - 9}
                    textAnchor="middle"
                    className="text-[9px] font-bold fill-slate-700"
                  >
                    {lm.name}
                  </text>
                </g>
              );
            })}

            {/* Clickable intersections */}
            {Array.from({ length: cols + 1 }).map((_, x) =>
              Array.from({ length: rows + 1 }).map((__, y) => {
                const pt = toSvg({ x, y });
                return (
                  <circle
                    key={`pt-${x}-${y}`}
                    cx={pt.cx}
                    cy={pt.cy}
                    r={7}
                    fill="transparent"
                    className="cursor-pointer hover:fill-[#0284C7]/20"
                    onClick={() => {
                      if (activeSelect === 'start') setStart({ x, y });
                      else setEnd({ x, y });
                    }}
                  />
                );
              })
            )}

            {/* Start & End markers */}
            <circle cx={pStart.cx} cy={pStart.cy} r={6} fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" pointerEvents="none" />
            <circle cx={pEnd.cx} cy={pEnd.cy} r={6} fill="#D97706" stroke="#FFFFFF" strokeWidth="2" pointerEvents="none" />
          </svg>
        </div>

        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <MapPin className="w-4 h-4 text-[#0284C7]" />
              <span>Spostamenti sugli assi</span>
            </div>
            <div className="font-mono tabular-nums text-xs space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span>Δx = |{end.x} − {start.x}|</span>
                <span className="font-semibold text-[#0284C7]">{dx} u ({dx * scaleMeters} m)</span>
              </div>
              <div className="flex justify-between">
                <span>Δy = |{end.y} − {start.y}|</span>
                <span className="font-semibold text-[#4F46E5]">{dy} u ({dy * scaleMeters} m)</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Navigation className="w-4 h-4 text-[#D97706]" />
              <span>Confronto Percorsi</span>
            </div>
            <div className="font-mono tabular-nums text-xs space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Lungo le vie (Δx + Δy):</span>
                <span className="font-semibold text-slate-900">{streetMeters} m</span>
              </div>
              <div className="flex justify-between text-[#B45309] font-bold">
                <span>In linea d’aria √(Δx²+Δy²):</span>
                <span>{Math.round(airMeters)} m</span>
              </div>
              <div className="pt-1.5 border-t border-slate-100 flex justify-between text-[#059669] font-semibold">
                <span>Risparmio scorciatoia:</span>
                <span>−{Math.round(savedMeters)} m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
