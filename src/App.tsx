import { useState } from 'react';
import Header from './components/Header';
import TabNav, { type TabId } from './components/TabNav';
import StatorCalculator from './components/StatorCalculator';
import RotorCalculator from './components/RotorCalculator';
import ElectrofreinCalculator from './components/ElectrofreinCalculator';
import WireReferenceTable from './components/WireReferenceTable';

export default function App() {
  const [tab, setTab] = useState<TabId>('stator');

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      <TabNav active={tab} onChange={setTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {tab === 'stator'       && <StatorCalculator />}
        {tab === 'rotor'        && <RotorCalculator />}
        {tab === 'electrofrein' && <ElectrofreinCalculator />}
        {tab === 'table'        && <WireReferenceTable />}
      </main>

      <footer className="border-t border-slate-200 bg-white mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-slate-400">
            ElectoCalc — Outil de calcul pour le rebobinage de machines électriques tournantes.
            Les résultats sont indicatifs et doivent être validés par un électricien qualifié.
          </p>
        </div>
      </footer>
    </div>
  );
}
