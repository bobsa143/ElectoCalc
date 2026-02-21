import { useState } from 'react';
import { Cpu, Cable, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { StatorInputs, StatorResults } from '../types';
import { calcStator } from '../utils/calculations';
import InputField from './InputField';
import SelectField from './SelectField';
import ResultCard from './ResultCard';
import SectionPanel from './SectionPanel';
import CalculateButton from './CalculateButton';
import GlossarySection from './GlossarySection';

const DEFAULT: StatorInputs = {
  power: 7.5, voltage: 380, frequency: 50, powerFactor: 0.85,
  efficiency: 90, phases: 3, connection: 'star', polePairs: 2,
  slots: 36, currentDensity: 5, layers: 2, boreDiameter: 110,
  stackLength: 130, windingFactor: 0.955, fluxDensity: 0.72,
};

export default function StatorCalculator() {
  const [inp, setInp] = useState<StatorInputs>(DEFAULT);
  const [res, setRes] = useState<StatorResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof StatorInputs>(key: K, val: StatorInputs[K]) => {
    setInp(prev => ({ ...prev, [key]: val }));
    setRes(null); setError(null);
  };

  const handleCalculate = () => {
    try {
      if (inp.power <= 0 || inp.voltage <= 0 || inp.boreDiameter <= 0 || inp.stackLength <= 0) {
        setError('Veuillez vérifier que toutes les valeurs sont supérieures à zéro.');
        return;
      }
      setRes(calcStator(inp)); setError(null);
    } catch {
      setError('Erreur de calcul. Veuillez vérifier les données saisies.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Entrez les caractéristiques nominales du moteur et les dimensions du noyau magnétique, puis cliquez sur <strong>Calculer</strong>.
        </p>
      </div>

      <SectionPanel title="Données Nominales du Moteur" description="Plaque signalétique">
        <InputField label="Puissance" unit="kW" value={inp.power} onChange={v => set('power', v)} min={0.01} step={0.25} />
        <InputField label="Tension réseau" unit="V" value={inp.voltage} onChange={v => set('voltage', v)} min={1} />
        <InputField label="Fréquence" unit="Hz" value={inp.frequency} onChange={v => set('frequency', v)} min={1} />
        <InputField label="Facteur de puissance cos φ" value={inp.powerFactor} onChange={v => set('powerFactor', v)} min={0.1} max={1} step={0.01} />
        <InputField label="Rendement η" unit="%" value={inp.efficiency} onChange={v => set('efficiency', v)} min={1} max={99.9} step={0.5} />
        <SelectField label="Nombre de phases" value={inp.phases}
          onChange={v => set('phases', v as 1 | 3)}
          options={[{ value: 3, label: '3 phases (triphasé)' }, { value: 1, label: '1 phase (monophasé)' }]} />
      </SectionPanel>

      <SectionPanel title="Configuration du Bobinage" description="Géométrie et schéma de câblage">
        <SelectField label="Couplage" value={inp.connection}
          onChange={v => set('connection', v as 'star' | 'delta')}
          options={[{ value: 'star', label: 'Étoile (Y)' }, { value: 'delta', label: 'Triangle (Δ)' }]} />
        <InputField label="Paires de pôles p" value={inp.polePairs} onChange={v => set('polePairs', Math.max(1, Math.round(v)))} min={1} max={8} step={1} hint="2p = nombre total de pôles" />
        <InputField label="Encoches stator Z" value={inp.slots} onChange={v => set('slots', Math.max(1, Math.round(v)))} min={1} step={1} />
        <SelectField label="Nombre de couches" value={inp.layers}
          onChange={v => set('layers', v as 1 | 2)}
          options={[{ value: 1, label: '1 couche' }, { value: 2, label: '2 couches' }]} />
        <InputField label="Densité de courant J" unit="A/mm²" value={inp.currentDensity} onChange={v => set('currentDensity', v)} min={1} max={10} step={0.5} hint="Typique: 4–6 A/mm²" />
        <InputField label="Facteur de bobinage kw" value={inp.windingFactor} onChange={v => set('windingFactor', v)} min={0.5} max={1} step={0.001} hint="Dist./pas: 0.92–0.96" />
      </SectionPanel>

      <SectionPanel title="Dimensions du Noyau Magnétique" description="Mesures à prendre sur le moteur démonté">
        <InputField label="Diamètre d'alésage D" unit="mm" value={inp.boreDiameter} onChange={v => set('boreDiameter', v)} min={1} step={1} hint="Diamètre intérieur du stator" />
        <InputField label="Longueur de paquet L" unit="mm" value={inp.stackLength} onChange={v => set('stackLength', v)} min={1} step={1} hint="Longueur axiale des tôles" />
        <InputField label="Induction moyenne Bav" unit="T" value={inp.fluxDensity} onChange={v => set('fluxDensity', v)} min={0.1} max={2} step={0.01} hint="Typique: 0.60–0.85 T" />
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
            <ResultCard title="Courant et Section" icon={<Cable className="w-4 h-4" />} color="cyan"
              items={[
                { label: 'Courant nominal', value: res.ratedCurrent.toFixed(2), unit: 'A', highlight: true },
                { label: 'Tension de phase', value: res.phaseVoltage.toFixed(1), unit: 'V' },
                { label: 'Section calculée', value: res.wireSection.toFixed(4), unit: 'mm²' },
                { label: 'Diamètre calculé', value: res.wireDiameter.toFixed(3), unit: 'mm' },
              ]} />
            <ResultCard title="Fil Normalisé" icon={<Cable className="w-4 h-4" />} color="teal"
              items={[
                { label: 'Diamètre standard', value: res.standardWireDiameter.toFixed(2), unit: 'mm', highlight: true },
                { label: 'Section standard', value: res.standardWireSection.toFixed(5), unit: 'mm²' },
                { label: 'Résistance/m (20°C)', value: (0.01724 / res.standardWireSection).toFixed(4), unit: 'Ω/m' },
              ]} />
            <ResultCard title="Bobinage" icon={<Layers className="w-4 h-4" />} color="amber"
              items={[
                { label: 'EMF / spire', value: res.emfPerTurn.toFixed(3), unit: 'V/sp.' },
                { label: 'Spires / phase', value: res.turnsPerPhase, highlight: true },
                { label: 'Spires / encoche', value: res.turnsPerSlot, highlight: true },
                { label: 'Encoches/pôle/phase', value: res.slotsPerPolePerPhase.toFixed(2) },
              ]} />
          </div>
          <ResultCard title="Estimation du Cuivre" icon={<Cpu className="w-4 h-4" />} color="rose"
            items={[
              { label: 'Longueur totale de fil', value: res.totalWireLengthM.toFixed(1), unit: 'm' },
              { label: 'Masse de cuivre estimée', value: res.copperMassKg.toFixed(3), unit: 'kg' },
            ]} />
        </>
      )}

      <GlossarySection context="stator" />
    </div>
  );
}
