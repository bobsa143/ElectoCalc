import { Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-slate-900 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500 shadow-lg shadow-cyan-500/30">
            <Zap className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              ElectoCalc — Rebobinage Moteur
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Calcul de section de fil de cuivre et nombre de spires
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
