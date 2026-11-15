import React, { useEffect, useState } from 'react';
import { PresetLabValues } from '../types/game';
import { RotateCcw } from 'lucide-react';

interface GeometryVisualizerProps {
  preset?: PresetLabValues | null;
  compact?: boolean;
  onTripleMatched?: (a: number, b: number, c: number) => void;
}

const FAMOUS_TRIPLES = [
  { label: '3 - 4 - 5', a: 3, b: 4 },
  { label: '6 - 8 - 10', a: 6, b: 8 },
  { label: '5 - 12 - 13', a: 5, b: 12 },
  { label: '8 - 15 - 17', a: 8, b: 15 },
];

export const GeometryVisualizer: React.FC<GeometryVisualizerProps> = ({
  preset,
  compact = false,
  onTripleMatched,
}) => {
  const [mode, setMode] = useState<'hypotenuse' | 'leg'>('hypotenuse');
  const [catetoA, setCatetoA] = useState<number>(3);
  const [catetoB, setCatetoB] = useState<number>(4);
  const [hypotenuseC, setHypotenuseC] = useState<number>(5);
  const [unit, setUnit] = useState<string>('cm');
  const [labelA, setLabelA] = useState<string>('Cateto a');
  const [labelB, setLabelB] = useState<string>('Cateto b');
  const [labelC, setLabelC] = useState<string>('Ipotenusa c');

  useEffect(() => {
    if (preset) {
      setMode(preset.mode || 'hypotenuse');
      setCatetoA(preset.a);
      setCatetoB(preset.b);
      setHypotenuseC(Number(Math.sqrt(preset.a * preset.a + preset.b * preset.b).toFixed(2)));
      setUnit(preset.unit);
      setLabelA(preset.labelA);
      setLabelB(preset.labelB);
      setLabelC(preset.labelC);
    }
  }, [preset]);

  // Derived side values depending on mode
  const aVal = catetoA;
  let bVal = catetoB;
  let cVal = Math.sqrt(aVal * aVal + bVal * bVal);

  if (mode === 'leg') {
    const safeC = Math.max(aVal + 1, hypotenuseC);
    cVal = safeC;
    bVal = Math.sqrt(Math.max(0, cVal * cVal - aVal * aVal));
  }

  const areaA = aVal * aVal;
  const areaB = bVal * bVal;
  const areaC = cVal * cVal;

  useEffect(() => {
    if (onTripleMatched && Math.abs(cVal - Math.round(cVal)) < 0.001) {
      onTripleMatched(aVal, Number(bVal.toFixed(2)), Math.round(cVal));
    }
  }, [aVal, bVal, cVal, onTripleMatched]);

  // Compute exact geometry for SVG (460 x 340) so all 3 squares always fit cleanly
  const svgW = 460;
  const svgH = 340;
  const margin = 34;
  const innerW = svgW - margin * 2;
  const innerH = svgH - margin * 2;
  const safeA = Math.max(1, aVal);
  const safeB = Math.max(1, bVal);

  const scale = Math.min(innerW / (2 * safeA + safeB), innerH / (safeA + 2 * safeB));
  const scaledA = safeA * scale;
  const scaledB = safeB * scale;

  const totalDrawW = (2 * safeA + safeB) * scale;
  const totalDrawH = (safeA + 2 * safeB) * scale;

  // Right angle vertex P0
  const x0 = margin + scaledA + (innerW - totalDrawW) / 2;
  const y0 = margin + scaledA + scaledB + (innerH - totalDrawH) / 2;

  const pA = { x: x0, y: y0 - scaledA };
  const pB = { x: x0 + scaledB, y: y0 };

  // Outward normal for hypotenuse square
  const nx = scaledA;
  const ny = -scaledB;
  const pA2 = { x: pA.x + nx, y: pA.y + ny };
  const pB2 = { x: pB.x + nx, y: pB.y + ny };

  const formatNum = (n: number) =>
    Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ',');

  const showUnitGrid = aVal <= 10 && bVal <= 10 && Number.isInteger(bVal);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold text-slate-900">
            Laboratorio Visivo dei Quadrati
          </h3>
          <p className="text-xs text-slate-500">
            L’area del quadrato sull’ipotenusa è sempre uguale alla somma dei due quadrati sui cateti
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => setMode('hypotenuse')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              mode === 'hypotenuse'
                ? 'bg-white text-[#0284C7] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trova Ipotenusa (c)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('leg');
              setHypotenuseC(Math.max(catetoA + 1, Math.round(Math.sqrt(catetoA ** 2 + catetoB ** 2))));
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              mode === 'leg'
                ? 'bg-white text-[#D97706] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Formula Inversa (Cateto b)
          </button>
        </div>
      </div>

      <div className={`grid gap-5 ${compact ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12 items-start'}`}>
        {/* Interactive SVG Canvas */}
        <div className={`${compact ? '' : 'lg:col-span-7'} blueprint-grid border border-slate-200 rounded-lg overflow-hidden`}>
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            className="w-full h-auto block"
            role="img"
            aria-label={`Triangolo rettangolo con cateti ${formatNum(aVal)} e ${formatNum(bVal)} e ipotenusa ${formatNum(cVal)}`}
          >
            {/* Square on Cateto a (Azure) */}
            <rect
              x={x0 - scaledA}
              y={y0 - scaledA}
              width={scaledA}
              height={scaledA}
              fill="rgba(2, 132, 199, 0.14)"
              stroke="#0284C7"
              strokeWidth="2"
            />
            {showUnitGrid &&
              Array.from({ length: aVal - 1 }).map((_, idx) => {
                const step = scaledA / aVal;
                return (
                  <g key={`ga-${idx}`} opacity={0.35}>
                    <line
                      x1={x0 - scaledA + step * (idx + 1)}
                      y1={y0 - scaledA}
                      x2={x0 - scaledA + step * (idx + 1)}
                      y2={y0}
                      stroke="#0284C7"
                      strokeWidth="1"
                    />
                    <line
                      x1={x0 - scaledA}
                      y1={y0 - scaledA + step * (idx + 1)}
                      x2={x0}
                      y2={y0 - scaledA + step * (idx + 1)}
                      stroke="#0284C7"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}

            {/* Square on Cateto b (Indigo) */}
            <rect
              x={x0}
              y={y0}
              width={scaledB}
              height={scaledB}
              fill="rgba(79, 70, 229, 0.14)"
              stroke="#4F46E5"
              strokeWidth="2"
            />
            {showUnitGrid &&
              Array.from({ length: Math.round(bVal) - 1 }).map((_, idx) => {
                const step = scaledB / bVal;
                return (
                  <g key={`gb-${idx}`} opacity={0.35}>
                    <line
                      x1={x0 + step * (idx + 1)}
                      y1={y0}
                      x2={x0 + step * (idx + 1)}
                      y2={y0 + scaledB}
                      stroke="#4F46E5"
                      strokeWidth="1"
                    />
                    <line
                      x1={x0}
                      y1={y0 + step * (idx + 1)}
                      x2={x0 + scaledB}
                      y2={y0 + step * (idx + 1)}
                      stroke="#4F46E5"
                      strokeWidth="1"
                    />
                  </g>
                );
              })}

            {/* Square on Hypotenuse c (Amber) */}
            <polygon
              points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pB2.x},${pB2.y} ${pA2.x},${pA2.y}`}
              fill="rgba(217, 119, 6, 0.16)"
              stroke="#D97706"
              strokeWidth="2"
            />

            {/* Right Triangle Fill */}
            <polygon
              points={`${pA.x},${pA.y} ${x0},${y0} ${pB.x},${pB.y}`}
              fill="#FFFFFF"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* 90 degree angle indicator */}
            <path
              d={`M ${x0} ${y0 - Math.min(14, scaledA * 0.35)} L ${x0 + Math.min(14, scaledB * 0.35)} ${
                y0 - Math.min(14, scaledA * 0.35)
              } L ${x0 + Math.min(14, scaledB * 0.35)} ${y0}`}
              fill="none"
              stroke="#0F172A"
              strokeWidth="1.5"
            />

            {/* Labels inside squares */}
            <text
              x={x0 - scaledA / 2}
              y={y0 - scaledA / 2 + 4}
              textAnchor="middle"
              className="font-mono text-[11px] font-bold fill-[#0369A1]"
            >
              a² = {formatNum(areaA)}
            </text>
            <text
              x={x0 + scaledB / 2}
              y={y0 + scaledB / 2 + 4}
              textAnchor="middle"
              className="font-mono text-[11px] font-bold fill-[#4338CA]"
            >
              b² = {formatNum(areaB)}
            </text>
            <text
              x={(pA.x + pB.x + pA2.x + pB2.x) / 4}
              y={(pA.y + pB.y + pA2.y + pB2.y) / 4 + 4}
              textAnchor="middle"
              className="font-mono text-[11px] font-bold fill-[#B45309]"
            >
              c² = {formatNum(areaC)}
            </text>
          </svg>
        </div>

        {/* Sliders & Live Step-by-Step Equation */}
        <div className={`${compact ? '' : 'lg:col-span-5'} space-y-4`}>
          <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-lg p-3.5">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="text-[#0284C7]">{labelA} (a)</span>
                <span className="font-mono tabular-nums text-slate-900">
                  {formatNum(aVal)} {unit}
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={20}
                step={1}
                value={catetoA}
                onChange={(e) => {
                  const nextA = Number(e.target.value);
                  setCatetoA(nextA);
                  if (mode === 'leg' && hypotenuseC <= nextA) {
                    setHypotenuseC(nextA + 2);
                  }
                }}
                aria-label={`${labelA} in ${unit}`}
                className="w-full accent-[#0284C7] cursor-pointer"
              />
            </div>

            {mode === 'hypotenuse' ? (
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-[#4F46E5]">{labelB} (b)</span>
                  <span className="font-mono tabular-nums text-slate-900">
                    {formatNum(bVal)} {unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={24}
                  step={1}
                  value={catetoB}
                  onChange={(e) => setCatetoB(Number(e.target.value))}
                  aria-label={`${labelB} in ${unit}`}
                  className="w-full accent-[#4F46E5] cursor-pointer"
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-[#D97706]">{labelC} (c)</span>
                  <span className="font-mono tabular-nums text-slate-900">
                    {formatNum(cVal)} {unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={catetoA + 1}
                  max={26}
                  step={1}
                  value={Math.max(catetoA + 1, hypotenuseC)}
                  onChange={(e) => setHypotenuseC(Number(e.target.value))}
                  aria-label={`${labelC} in ${unit}`}
                  className="w-full accent-[#D97706] cursor-pointer"
                />
              </div>
            )}

            <div className="pt-1">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1.5">
                <span>Terne pitagoriche rapide</span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('hypotenuse');
                    setCatetoA(3);
                    setCatetoB(4);
                    setUnit('cm');
                    setLabelA('Cateto a');
                    setLabelB('Cateto b');
                    setLabelC('Ipotenusa c');
                  }}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {FAMOUS_TRIPLES.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => {
                      setCatetoA(t.a);
                      setCatetoB(t.b);
                      setHypotenuseC(Math.round(Math.sqrt(t.a * t.a + t.b * t.b)));
                    }}
                    className="px-2.5 py-1 text-xs font-mono tabular-nums bg-white border border-slate-200 hover:border-[#0284C7] hover:text-[#0284C7] rounded-md transition-colors cursor-pointer"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step by step formula readout */}
          <div className="border border-slate-200 rounded-lg p-3.5 bg-white space-y-2">
            <div className="text-xs font-semibold text-slate-500">
              {mode === 'hypotenuse' ? 'Calcolo passo dopo passo (Formula Diretta)' : 'Calcolo passo dopo passo (Formula Inversa)'}
            </div>
            {mode === 'hypotenuse' ? (
              <div className="font-mono tabular-nums text-xs sm:text-sm space-y-1 text-slate-800">
                <div>
                  c = √(<span className="text-[#0284C7] font-semibold">{formatNum(aVal)}²</span> +{' '}
                  <span className="text-[#4F46E5] font-semibold">{formatNum(bVal)}²</span>)
                </div>
                <div>
                  c = √(<span className="text-[#0284C7]">{formatNum(areaA)}</span> +{' '}
                  <span className="text-[#4F46E5]">{formatNum(areaB)}</span>) = √
                  <span className="text-[#D97706] font-semibold">{formatNum(areaC)}</span>
                </div>
                <div className="pt-1 border-t border-slate-100 text-sm font-bold text-[#B45309]">
                  {labelC} = {formatNum(cVal)} {unit}
                </div>
              </div>
            ) : (
              <div className="font-mono tabular-nums text-xs sm:text-sm space-y-1 text-slate-800">
                <div>
                  b = √(<span className="text-[#D97706] font-semibold">{formatNum(cVal)}²</span> −{' '}
                  <span className="text-[#0284C7] font-semibold">{formatNum(aVal)}²</span>)
                </div>
                <div>
                  b = √(<span className="text-[#D97706]">{formatNum(areaC)}</span> −{' '}
                  <span className="text-[#0284C7]">{formatNum(areaA)}</span>) = √
                  <span className="text-[#4F46E5] font-semibold">{formatNum(areaB)}</span>
                </div>
                <div className="pt-1 border-t border-slate-100 text-sm font-bold text-[#4338CA]">
                  {labelB} = {formatNum(bVal)} {unit}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
