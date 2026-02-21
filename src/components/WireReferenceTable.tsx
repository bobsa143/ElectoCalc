import { useState } from 'react';
import { Search } from 'lucide-react';
import { WIRE_TABLE } from '../utils/wireData';

export default function WireReferenceTable() {
  const [filter, setFilter] = useState('');

  const filtered = WIRE_TABLE.filter(w => {
    if (!filter) return true;
    const q = parseFloat(filter);
    if (isNaN(q)) return false;
    return w.diameter >= q - 0.01 && w.diameter <= q + 0.5;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <p className="text-sm text-slate-600">
          Table de référence des fils de cuivre émaillés (norme IEC 60317). Résistivité cuivre : <strong>0,01724 Ω·mm²/m</strong> à 20°C.
          Coefficient thermique α = <strong>0,00393 /°C</strong>.
        </p>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="number"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filtrer par diamètre min. (mm)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm
            focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        />
      </div>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wide">Ø (mm)</th>
                <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wide">Section (mm²)</th>
                <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wide">R/m (Ω/m)</th>
                <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">I max moteur (A)</th>
                <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wide whitespace-nowrap">I max général (A)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((w, i) => (
                <tr key={w.diameter} className={`transition-colors hover:bg-cyan-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="px-4 py-2.5 font-bold text-slate-900">{w.diameter.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-right text-slate-700 font-mono">{w.section.toFixed(5)}</td>
                  <td className="px-4 py-2.5 text-right text-slate-700 font-mono">{w.resistancePerM.toFixed(5)}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-700 font-semibold text-xs">
                      {w.maxCurrentMotor.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-teal-100 text-teal-700 font-semibold text-xs">
                      {w.maxCurrentGeneral.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-slate-400 text-center">
        {filtered.length} fil(s) affiché(s) sur {WIRE_TABLE.length}
      </p>
    </div>
  );
}
