import { useState } from 'react';
import { RotateCw, Cable, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { RotorInputs, RotorResults } from '../types';
import { calcRotor } from '../utils/calculations';
import InputField from './InputField';
import SelectField from './SelectField';
import ResultCard from './ResultCard';
import SectionPanel from './SectionPanel';
import CalculateButton from './CalculateButton';
import GlossarySection from './GlossarySection';

const DEFAULT: RotorInputs = {
  rotorVoltage: 220,
  statorVoltage: 380,
  statorCurrent: 20,
  turnsRatio: 1.0,
  frequency: 50,
  polePairs: 2,
  slots: 28,
  currentDensity: 4.5,
  connection: 'star',
  layers: 2,
  boreDiameter: 108,
  stackLength: 130,
  windingFactor: 0.955,
  fluxDensity: 0.65,
};

export default function RotorCalculator() {
  const [inp, setInp] = useState<RotorInputs>(DEFAULT);
  const [res, setRes] = useState<RotorResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof RotorInputs>(key: K, val: RotorInputs[K]) => {
    setInp(prev => ({ ...prev, [key]: val }));
    setRes(null);
    setError(null);
  };

  const handleCalculate = () => {
    try {
      if (inp.rotorVoltage <= 0 || inp.statorCurrent <= 0 || inp.boreDiameter <= 0) {
        setError('Veuillez vérifier que toutes les valeurs sont supérieures à zéro.');
        return;
      }
      setRes(calcRotor(inp));
      setError(null);
    } catch {
      setError('Erreur de calcul. Veuillez vérifier les données saisies.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 p-4 bg-teal-50 border border-teal-200 rounded-xl">
        <AlertCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-teal-700">
          Calculateur pour les rotors bobinés à bagues frottantes. Remplissez les données puis cliquez sur <strong>Calculer</strong>.
        </p>
      </div>

      <SectionPanel title="Données du Rotor Bobiné" description="Caractéristiques à vide / plaque signalétique">
        <InputField label="Tension rotor (à vide)" unit="V" value={inp.rotorVoltage} onChange={v => set('rotorVoltage', v)} min={1} hint="Tension entre bagues à l'arrêt" />
        <InputField label="Courant stator nominal" unit="A" value={inp.statorCurrent} onChange={v => set('statorCurrent', v)} min={0.1} step={0.5} />
        <InputField label="Rapport de transformation" value={inp.turnsRatio} onChange={v => set('turnsRatio', v)} min={0.01} step={0.01} hint="I_rotor = I_stator × ratio" />
        <InputField label="Fréquence réseau" unit="Hz" value={inp.frequency} onChange={v => set('frequency', v)} min={1} />
        <InputField label="Paires de pôles p" value={inp.polePairs} onChange={v => set('polePairs', Math.max(1, Math.round(v)))} min={1} max={8} step={1} />
        <InputField label="Densité de courant J" unit="A/mm²" value={inp.currentDensity} onChange={v => set('currentDensity', v)} min={1} max={10} step={0.5} hint="Typique rotor: 4–5 A/mm²" />
      </SectionPanel>

      <SectionPanel title="Configuration du Bobinage Rotor">
        <SelectField
          label="Couplage rotor"
          value={inp.connection}
          onChange={v => set('connection', v as 'star' | 'delta')}
          options={[{ value: 'star', label: 'Étoile (Y)' }, { value: 'delta', label: 'Triangle (Δ)' }]}
        />
        <InputField label="Encoches rotor Zr" value={inp.slots} onChange={v => set('slots', Math.max(1, Math.round(v)))} min={1} step={1} />
        <SelectField
          label="Nombre de couches"
          value={inp.layers}
          onChange={v => set('layers', v as 1 | 2)}
          options={[{ value: 1, label: '1 couche' }, { value: 2, label: '2 couches' }]}
        />
        <InputField label="Facteur de bobinage kw" value={inp.windingFactor} onChange={v => set('windingFactor', v)} min={0.5} max={1} step={0.001} />
      </SectionPanel>

      <SectionPanel title="Dimensions du Noyau Rotor">
        <InputField label="Diamètre extérieur rotor" unit="mm" value={inp.boreDiameter} onChange={v => set('boreDiameter', v)} min={1} step={1} hint="≈ alésage stator − 2×entrefer" />
        <InputField label="Longueur de paquet L" unit="mm" value={inp.stackLength} onChange={v => set('stackLength', v)} min={1} step={1} />
        <InputField label="Induction Bav" unit="T" value={inp.fluxDensity} onChange={v => set('fluxDensity', v)} min={0.1} max={2} step={0.01} hint="Typique: 0.60–0.75 T" />
      </SectionPanel>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <CalculateButton onClick={handleCalculate} />

      {res && (
        <>
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            Calcul effectué avec succès.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <ResultCard
              title="Courant et Section"
              icon={<Cable className="w-4 h-4" />}
              color="teal"
              items={[
                { label: 'Courant rotor', value: res.rotorCurrent.toFixed(2), unit: 'A', highlight: true },
                { label: 'Section calculée', value: res.wireSection.toFixed(4), unit: 'mm²' },
                { label: 'Diamètre calculé', value: res.wireDiameter.toFixed(3), unit: 'mm' },
              ]}
            />
            <ResultCard
              title="Fil Normalisé"
              icon={<Cable className="w-4 h-4" />}
              color="cyan"
              items={[
                { label: 'Diamètre standard', value: res.standardWireDiameter.toFixed(2), unit: 'mm', highlight: true },
                { label: 'Section standard', value: res.standardWireSection.toFixed(5), unit: 'mm²' },
              ]}
            />
            <ResultCard
              title="Bobinage Rotor"
              icon={<Layers className="w-4 h-4" />}
              color="amber"
              items={[
                { label: 'Spires / phase', value: res.turnsPerPhase, highlight: true },
                { label: 'Spires / encoche', value: res.turnsPerSlot, highlight: true },
                { label: 'Longueur totale', value: res.totalWireLengthM.toFixed(1), unit: 'm' },
                { label: 'Masse cuivre', value: res.copperMassKg.toFixed(3), unit: 'kg' },
              ]}
            />
          </div>
        </>
      )}

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-start gap-2">
          <RotateCw className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">Note — Rotor Cage d'Écureuil</p>
            <p>Pour un rotor à cage, la section des barres est : S_barre = I_barre / J avec I_barre = I_stator × (2m × N_stator × kw_s) / (Zr × kw_r). Densité de courant barres cuivre : 5–7 A/mm², aluminium : 3–5 A/mm².</p>
          </div>
        </div>
      </div>

      <GlossarySection context="rotor" />
    </div>
  );
}
