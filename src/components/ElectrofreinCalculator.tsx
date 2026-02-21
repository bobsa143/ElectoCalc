import { useState } from 'react';
import { Magnet, Cable, Thermometer, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { ElectrofreinInputs, ElectrofreinResults } from '../types';
import { calcElectrofrein } from '../utils/calculations';
import InputField from './InputField';
import ResultCard from './ResultCard';
import SectionPanel from './SectionPanel';
import CalculateButton from './CalculateButton';
import GlossarySection from './GlossarySection';

const DEFAULT: ElectrofreinInputs = {
  voltage: 24, current: 0.8, innerDiameter: 30,
  outerDiameter: 70, coilHeight: 25, fillFactor: 0.65, temperatureRise: 80,
};

export default function ElectrofreinCalculator() {
  const [inp, setInp] = useState<ElectrofreinInputs>(DEFAULT);
  const [res, setRes] = useState<ElectrofreinResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof ElectrofreinInputs>(key: K, val: ElectrofreinInputs[K]) => {
    setInp(prev => ({ ...prev, [key]: val }));
    setRes(null); setError(null);
  };

  const handleCalculate = () => {
    if (inp.outerDiameter <= inp.innerDiameter) {
      setError('Le diamètre extérieur doit être supérieur au diamètre intérieur.');
      return;
    }
    if (inp.voltage <= 0 || inp.current <= 0 || inp.coilHeight <= 0) {
      setError('Veuillez vérifier que toutes les valeurs sont supérieures à zéro.');
      return;
    }
    try {
      setRes(calcElectrofrein(inp)); setError(null);
    } catch {
      setError('Erreur de calcul. Veuillez vérifier les données saisies.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-700">
          Calculateur pour bobines d'électrofrein et électroaimants. Entrez les dimensions du bobineau puis cliquez sur <strong>Calculer</strong>.
        </p>
      </div>

      <SectionPanel title="Caractéristiques Électriques" description="Tension et courant nominaux">
        <InputField label="Tension d'alimentation" unit="V" value={inp.voltage} onChange={v => set('voltage', v)} min={1} step={1} hint="DC ou AC (valeur efficace)" />
        <InputField label="Courant nominal" unit="A" value={inp.current} onChange={v => set('current', v)} min={0.001} step={0.01} />
        <InputField label="Élévation de température" unit="°C" value={inp.temperatureRise} onChange={v => set('temperatureRise', v)} min={0} max={200} step={5} hint="Pour calcul résistance à chaud" />
      </SectionPanel>

      <SectionPanel title="Dimensions du Bobineau" description="Dimensions internes du support de bobinage">
        <InputField label="Diamètre intérieur Di" unit="mm" value={inp.innerDiameter} onChange={v => set('innerDiameter', v)} min={1} step={1} hint="Diamètre du noyau magnétique" />
        <InputField label="Diamètre extérieur De" unit="mm" value={inp.outerDiameter} onChange={v => set('outerDiameter', v)} min={1} step={1} hint="Diamètre extérieur du bobineau" />
        <InputField label="Hauteur h" unit="mm" value={inp.coilHeight} onChange={v => set('coilHeight', v)} min={1} step={1} hint="Largeur de la fenêtre de bobinage" />
        <InputField label="Facteur de remplissage kf" value={inp.fillFactor} onChange={v => set('fillFactor', v)} min={0.3} max={0.85} step={0.01} hint="Typique: 0.60–0.70" />
      </SectionPanel>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      <CalculateButton onClick={handleCalculate} />

      {res && (
        <>
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />Calcul effectué avec succès.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <ResultCard title="Résistance et Puissance" icon={<Magnet className="w-4 h-4" />} color="amber"
              items={[
                { label: 'Résistance à 20°C', value: res.resistance.toFixed(3), unit: 'Ω', highlight: true },
                { label: `Résistance à +${inp.temperatureRise}°C`, value: res.resistanceAtTemp.toFixed(3), unit: 'Ω' },
                { label: 'Puissance dissipée', value: res.power.toFixed(2), unit: 'W', highlight: true },
              ]} />
            <ResultCard title="Fil Recommandé" icon={<Cable className="w-4 h-4" />} color="cyan"
              items={[
                { label: 'Section calculée', value: res.wireSection.toFixed(4), unit: 'mm²' },
                { label: 'Diamètre calculé', value: res.wireDiameter.toFixed(3), unit: 'mm' },
                { label: 'Diamètre standard', value: res.standardWireDiameter.toFixed(2), unit: 'mm', highlight: true },
                { label: 'Section standard', value: res.standardWireSection.toFixed(5), unit: 'mm²' },
              ]} />
            <ResultCard title="Bobinage" icon={<Thermometer className="w-4 h-4" />} color="teal"
              items={[
                { label: 'Nombre de spires', value: res.numberOfTurns, highlight: true },
                { label: 'Longueur de fil', value: res.totalWireLength.toFixed(1), unit: 'm' },
                { label: 'Longueur spire moy.', value: res.meanTurnLength.toFixed(1), unit: 'mm' },
                { label: 'Masse cuivre', value: res.copperMassG.toFixed(1), unit: 'g' },
              ]} />
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Formule : </span>
              S = √(ρ × kf × A_bob × l_moy / R) — A_bob = {(((inp.outerDiameter - inp.innerDiameter) / 2) * inp.coilHeight).toFixed(1)} mm² — l_moy = {res.meanTurnLength.toFixed(1)} mm — ρ_Cu = 0,01724 Ω·mm²/m
            </p>
          </div>
        </>
      )}

      <GlossarySection context="electrofrein" />
    </div>
  );
}
