import { useState } from 'react';
import { Gauge, Cable, Layers, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { MesureResistanceInputs, MesureResistanceResults, MeasureCoilType } from '../types';
import { calcMesureResistance } from '../utils/calculations';
import InputField from './InputField';
import SelectField from './SelectField';
import ResultCard from './ResultCard';
import SectionPanel from './SectionPanel';
import CalculateButton from './CalculateButton';

const DEFAULT: MesureResistanceInputs = {
  measuredResistance: 4.2,
  coilType: 'stator_star',
  innerDiameter: 60,
  outerDiameter: 90,
  coilHeight: 50,
  fillFactor: 0.65,
  boreDiameter: 110,
  stackLength: 130,
  phases: 3,
  slots: 36,
  polePairs: 2,
};

const COIL_TYPES: { value: MeasureCoilType; label: string }[] = [
  { value: 'stator_star',  label: 'Stator triphasé — couplage Étoile (Y)' },
  { value: 'stator_delta', label: 'Stator triphasé — couplage Triangle (Δ)' },
  { value: 'electrofrein', label: 'Électrofrein / Bobine DC' },
];

const EXPLAIN: Record<MeasureCoilType, string> = {
  stator_star:  'Mesure entre 2 bornes (U–V) sur couplage étoile = 2 × R_phase → R_phase = R_mesurée / 2',
  stator_delta: 'Mesure entre 2 bornes sur couplage triangle = R_phase || 2R_phase = 2/3 × R_phase → R_phase = R_mesurée × 1,5',
  electrofrein: 'Mesure directe aux bornes de la bobine = R_bobine',
};

export default function MesureResistanceCalculator() {
  const [inp, setInp] = useState<MesureResistanceInputs>(DEFAULT);
  const [res, setRes] = useState<MesureResistanceResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof MesureResistanceInputs>(key: K, val: MesureResistanceInputs[K]) => {
    setInp(prev => ({ ...prev, [key]: val }));
    setRes(null); setError(null);
  };

  const isMotor = inp.coilType !== 'electrofrein';

  const handleCalculate = () => {
    if (inp.measuredResistance <= 0) {
      setError('La résistance mesurée doit être supérieure à zéro.');
      return;
    }
    if (inp.outerDiameter <= inp.innerDiameter) {
      setError('Le diamètre extérieur doit être supérieur au diamètre intérieur.');
      return;
    }
    if (isMotor && (!inp.boreDiameter || !inp.stackLength)) {
      setError('Le diamètre d\'alésage et la longueur de paquet sont requis pour un stator moteur.');
      return;
    }
    try {
      setRes(calcMesureResistance(inp)); setError(null);
    } catch {
      setError('Erreur de calcul. Veuillez vérifier les données saisies.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 p-4 bg-teal-50 border border-teal-200 rounded-xl">
        <Gauge className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-teal-700 space-y-1">
          <p className="font-semibold">Méthode inversée — à partir de la résistance mesurée</p>
          <p>Mesurez la résistance entre deux bornes (ex. U–V) avec un ohmmètre, entrez la valeur et les dimensions du bobineau. L'outil calcule la section du fil et le nombre de spires.</p>
        </div>
      </div>

      <SectionPanel title="Résistance Mesurée" description="Mesure ohmmètre sur la bobine ou le moteur">
        <SelectField
          label="Type de bobine / couplage"
          value={inp.coilType}
          onChange={v => set('coilType', v as MeasureCoilType)}
          options={COIL_TYPES}
        />
        <InputField
          label="Résistance mesurée"
          unit="Ω"
          value={inp.measuredResistance}
          onChange={v => set('measuredResistance', v)}
          min={0.001}
          step={0.01}
          hint="Valeur lue sur l'ohmmètre"
        />
        <div className="flex items-start gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg sm:col-span-2 lg:col-span-1">
          <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">{EXPLAIN[inp.coilType]}</p>
        </div>
      </SectionPanel>

      {isMotor && (
        <SectionPanel title="Dimensions du Noyau Magnétique" description="Mesures sur le stator démonté">
          <InputField label="Diamètre d'alésage D" unit="mm" value={inp.boreDiameter ?? 110} onChange={v => set('boreDiameter', v)} min={1} step={1} hint="Diamètre intérieur du stator" />
          <InputField label="Longueur de paquet L" unit="mm" value={inp.stackLength ?? 130} onChange={v => set('stackLength', v)} min={1} step={1} />
          <InputField label="Encoches Z" value={inp.slots ?? 36} onChange={v => set('slots', Math.max(1, Math.round(v)))} min={1} step={1} />
          <InputField label="Paires de pôles p" value={inp.polePairs ?? 2} onChange={v => set('polePairs', Math.max(1, Math.round(v)))} min={1} max={8} step={1} />
          <SelectField label="Nombre de phases" value={inp.phases ?? 3}
            onChange={v => set('phases', Number(v) as 1 | 3)}
            options={[{ value: 3, label: '3 phases' }, { value: 1, label: '1 phase' }]} />
        </SectionPanel>
      )}

      <SectionPanel title={isMotor ? 'Dimensions du Bobineau / Encoche' : 'Dimensions du Bobineau'} description="Mesures internes du support">
        <InputField label={isMotor ? 'Diam. intérieur encoche Di' : 'Diamètre intérieur Di'} unit="mm" value={inp.innerDiameter} onChange={v => set('innerDiameter', v)} min={1} step={1} hint={isMotor ? 'Côté alésage' : 'Diamètre du noyau magnétique'} />
        <InputField label={isMotor ? 'Diam. extérieur encoche De' : 'Diamètre extérieur De'} unit="mm" value={inp.outerDiameter} onChange={v => set('outerDiameter', v)} min={1} step={1} hint={isMotor ? 'Côté culasse' : 'Diamètre extérieur bobineau'} />
        <InputField label="Hauteur h" unit="mm" value={inp.coilHeight} onChange={v => set('coilHeight', v)} min={1} step={1} hint="Profondeur / hauteur de l'encoche" />
        <InputField label="Facteur de remplissage kf" value={inp.fillFactor} onChange={v => set('fillFactor', v)} min={0.3} max={0.85} step={0.01} hint="Typique: 0.60–0.70" />
      </SectionPanel>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      <CalculateButton onClick={handleCalculate} label="Identifier le Fil" />

      {res && (
        <>
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            Calcul effectué — R_phase retenue : <strong className="ml-1">{res.phaseResistance.toFixed(4)} Ω</strong>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <ResultCard title="Fil Identifié" icon={<Cable className="w-4 h-4" />} color="cyan"
              items={[
                { label: 'Section calculée', value: res.wireSection.toFixed(4), unit: 'mm²' },
                { label: 'Diamètre calculé', value: res.wireDiameter.toFixed(3), unit: 'mm' },
                { label: 'Diamètre standard', value: res.standardWireDiameter.toFixed(2), unit: 'mm', highlight: true },
                { label: 'Section standard', value: res.standardWireSection.toFixed(5), unit: 'mm²' },
              ]} />

            <ResultCard title="Nombre de Spires" icon={<Layers className="w-4 h-4" />} color="teal"
              items={[
                { label: 'Nombre de spires total', value: res.numberOfTurns, highlight: true },
                ...(res.turnsPerSlot !== undefined
                  ? [{ label: 'Spires / encoche', value: res.turnsPerSlot, highlight: true }]
                  : []),
                { label: 'Longueur spire moy.', value: res.meanTurnLength.toFixed(1), unit: 'mm' },
                { label: 'Longueur totale fil', value: res.totalWireLength.toFixed(1), unit: 'm' },
              ]} />

            <ResultCard title="Vérification" icon={<Gauge className="w-4 h-4" />} color="amber"
              items={[
                { label: 'R mesurée', value: inp.measuredResistance.toFixed(4), unit: 'Ω' },
                { label: 'R phase retenue', value: res.phaseResistance.toFixed(4), unit: 'Ω' },
                { label: 'ρ vérifié (≈0,01724)', value: res.resistivityCheck.toFixed(5), unit: 'Ω·mm²/m' },
                { label: 'Masse cuivre estimée', value: res.copperMassG.toFixed(1), unit: 'g' },
              ]} />
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <p className="text-xs font-semibold text-slate-700">Méthode de calcul</p>
            <p className="text-xs text-slate-500">
              R_phase = {res.phaseResistance.toFixed(4)} Ω →
              S_fil = ρ × L_fil / R_phase →
              L_fil = R_phase × S_std / ρ = {res.totalWireLength.toFixed(1)} m →
              N = L_fil / l_spire = {res.totalWireLength.toFixed(1)} / {(res.meanTurnLength / 1000).toFixed(4)} = <strong>{res.numberOfTurns} spires</strong>
            </p>
            <p className="text-xs text-slate-400">
              ρ_Cu = 0,01724 Ω·mm²/m à 20°C — Section standard utilisée : {res.standardWireDiameter.toFixed(2)} mm (Ø) = {res.standardWireSection.toFixed(5)} mm²
            </p>
          </div>
        </>
      )}
    </div>
  );
}
