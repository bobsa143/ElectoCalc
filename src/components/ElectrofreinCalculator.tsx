import { useState } from 'react';
import { Magnet, Cable, Thermometer, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import type { ElectrofreinInputs, ElectrofreinResults, ElectrofreinSupplyType } from '../types';
import { calcElectrofrein } from '../utils/calculations';
import InputField from './InputField';
import ResultCard from './ResultCard';
import SectionPanel from './SectionPanel';
import CalculateButton from './CalculateButton';
import GlossarySection from './GlossarySection';

const DEFAULT_DC: ElectrofreinInputs = {
  supplyType: 'dc',
  voltage: 24, current: 0.8, frequency: 50, powerFactor: 1,
  innerDiameter: 30, outerDiameter: 70, coilHeight: 25,
  fillFactor: 0.65, temperatureRise: 80,
};

const DEFAULT_AC3: ElectrofreinInputs = {
  supplyType: 'ac3phase',
  voltage: 380, current: 0.5, frequency: 50, powerFactor: 0.85,
  innerDiameter: 40, outerDiameter: 90, coilHeight: 35,
  fillFactor: 0.65, temperatureRise: 80,
};

export default function ElectrofreinCalculator() {
  const [supplyType, setSupplyType] = useState<ElectrofreinSupplyType>('dc');
  const [inp, setInp] = useState<ElectrofreinInputs>(DEFAULT_DC);
  const [res, setRes] = useState<ElectrofreinResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSupplyChange = (type: ElectrofreinSupplyType) => {
    setSupplyType(type);
    setInp(type === 'dc' ? DEFAULT_DC : DEFAULT_AC3);
    setRes(null);
    setError(null);
  };

  const set = <K extends keyof ElectrofreinInputs>(key: K, val: ElectrofreinInputs[K]) => {
    setInp(prev => ({ ...prev, [key]: val }));
    setRes(null);
    setError(null);
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
    if (supplyType === 'ac3phase' && (inp.powerFactor <= 0 || inp.powerFactor > 1)) {
      setError('Le facteur de puissance doit être compris entre 0 et 1.');
      return;
    }
    try {
      setRes(calcElectrofrein({ ...inp, supplyType }));
      setError(null);
    } catch {
      setError('Erreur de calcul. Veuillez vérifier les données saisies.');
    }
  };

  const isAC = supplyType === 'ac3phase';

  return (
    <div className="space-y-5">
      <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
        <button
          onClick={() => handleSupplyChange('dc')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold transition-colors ${
            !isAC
              ? 'bg-amber-500 text-white'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Zap className="w-4 h-4" />
          Alimentation DC
        </button>
        <div className="w-px bg-slate-200" />
        <button
          onClick={() => handleSupplyChange('ac3phase')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold transition-colors ${
            isAC
              ? 'bg-cyan-600 text-white'
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Zap className="w-4 h-4" />
          AC 3 Phases 380V
        </button>
      </div>

      <div className={`flex items-start gap-3 p-4 rounded-xl border ${
        isAC ? 'bg-cyan-50 border-cyan-200' : 'bg-amber-50 border-amber-200'
      }`}>
        <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isAC ? 'text-cyan-500' : 'text-amber-500'}`} />
        <p className="text-sm">
          {isAC ? (
            <span className="text-cyan-800">
              <strong>Bobine AC 3 phases 380V — alimentation directe</strong> sans pont de diodes. La bobine est conçue pour fonctionner directement sur le réseau triphasé (impédance Z = R + jX). Le fil est dimensionné sur la résistance de phase R = Z × cos&nbsp;φ.
            </span>
          ) : (
            <span className="text-amber-700">
              <strong>Bobine DC</strong> (24V, 48V, 180V, 380V rectifié…) — un <strong>pont de diodes externe</strong> est nécessaire pour redresser la tension secteur avant alimentation de la bobine. Entrez la tension et le courant DC nominaux.
            </span>
          )}
        </p>
      </div>

      <SectionPanel
        title={isAC ? 'Caractéristiques Réseau AC 3 Phases' : 'Caractéristiques Électriques DC'}
        description={isAC ? 'Paramètres réseau triphasé 380V' : 'Tension et courant nominaux'}
      >
        <InputField
          label={isAC ? 'Tension réseau (entre phases)' : "Tension d'alimentation"}
          unit="V"
          value={inp.voltage}
          onChange={v => set('voltage', v)}
          min={1}
          step={1}
          hint={isAC ? 'Standard : 380V triphasé' : 'Valeur nominale DC'}
        />
        <InputField
          label={isAC ? 'Courant de ligne (par phase)' : 'Courant nominal'}
          unit="A"
          value={inp.current}
          onChange={v => set('current', v)}
          min={0.001}
          step={0.01}
          hint={isAC ? 'Courant efficace par phase' : undefined}
        />
        {isAC && (
          <>
            <InputField
              label="Fréquence"
              unit="Hz"
              value={inp.frequency}
              onChange={v => set('frequency', v)}
              min={1}
              step={1}
              hint="50 Hz (Europe) ou 60 Hz"
            />
            <InputField
              label="Facteur de puissance cos φ"
              value={inp.powerFactor}
              onChange={v => set('powerFactor', v)}
              min={0.1}
              max={1}
              step={0.01}
              hint="Typique : 0.80 – 0.90 pour électrofrein AC"
            />
          </>
        )}
        <InputField
          label="Élévation de température"
          unit="°C"
          value={inp.temperatureRise}
          onChange={v => set('temperatureRise', v)}
          min={0}
          max={200}
          step={5}
          hint="Pour calcul résistance à chaud"
        />
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

          {isAC && res.phaseVoltage != null && (
            <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
              <p className="text-xs font-semibold text-cyan-700 mb-2">Paramètres AC par phase (connexion étoile implicite)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 border border-cyan-100 text-center">
                  <p className="text-xs text-slate-500">V ligne</p>
                  <p className="text-base font-bold text-cyan-700">{inp.voltage} <span className="text-xs font-normal">V</span></p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-cyan-100 text-center">
                  <p className="text-xs text-slate-500">V phase</p>
                  <p className="text-base font-bold text-cyan-700">{res.phaseVoltage.toFixed(1)} <span className="text-xs font-normal">V</span></p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-cyan-100 text-center">
                  <p className="text-xs text-slate-500">Impédance Z</p>
                  <p className="text-base font-bold text-cyan-700">{res.impedance?.toFixed(1)} <span className="text-xs font-normal">Ω</span></p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-cyan-100 text-center">
                  <p className="text-xs text-slate-500">Inductance L</p>
                  <p className="text-base font-bold text-cyan-700">{res.inductance != null ? (res.inductance * 1000).toFixed(1) : '—'} <span className="text-xs font-normal">mH</span></p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <ResultCard
              title="Résistance et Puissance"
              icon={<Magnet className="w-4 h-4" />}
              color="amber"
              items={isAC ? [
                { label: 'Résistance / phase (R)', value: res.resistance.toFixed(3), unit: 'Ω', highlight: true },
                { label: `Résistance à +${inp.temperatureRise}°C`, value: res.resistanceAtTemp.toFixed(3), unit: 'Ω' },
                { label: 'Puissance active 3Ph', value: res.power.toFixed(2), unit: 'W', highlight: true },
                { label: 'cos φ', value: inp.powerFactor.toFixed(2), unit: '' },
              ] : [
                { label: 'Résistance à 20°C', value: res.resistance.toFixed(3), unit: 'Ω', highlight: true },
                { label: `Résistance à +${inp.temperatureRise}°C`, value: res.resistanceAtTemp.toFixed(3), unit: 'Ω' },
                { label: 'Puissance dissipée', value: res.power.toFixed(2), unit: 'W', highlight: true },
              ]}
            />
            <ResultCard
              title="Fil Recommandé"
              icon={<Cable className="w-4 h-4" />}
              color="cyan"
              items={[
                { label: 'Section calculée', value: res.wireSection.toFixed(4), unit: 'mm²' },
                { label: 'Diamètre calculé', value: res.wireDiameter.toFixed(3), unit: 'mm' },
                { label: 'Diamètre standard', value: res.standardWireDiameter.toFixed(2), unit: 'mm', highlight: true },
                { label: 'Section standard', value: res.standardWireSection.toFixed(5), unit: 'mm²' },
              ]}
            />
            <ResultCard
              title="Bobinage"
              icon={<Thermometer className="w-4 h-4" />}
              color="teal"
              items={[
                { label: 'Nombre de spires', value: res.numberOfTurns, highlight: true },
                { label: 'Longueur de fil', value: res.totalWireLength.toFixed(1), unit: 'm' },
                { label: 'Longueur spire moy.', value: res.meanTurnLength.toFixed(1), unit: 'mm' },
                { label: 'Masse cuivre', value: res.copperMassG.toFixed(1), unit: 'g' },
              ]}
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Formule : </span>
              S = &#x221A;(&#x03C1; &times; k<sub>f</sub> &times; A<sub>bob</sub> &times; l<sub>moy</sub> / R) — A<sub>bob</sub> = {(((inp.outerDiameter - inp.innerDiameter) / 2) * inp.coilHeight).toFixed(1)} mm² — l<sub>moy</sub> = {res.meanTurnLength.toFixed(1)} mm — &#x03C1;<sub>Cu</sub> = 0,01724 &#x03A9;&#x00B7;mm²/m
              {isAC
                ? <> — Mode AC 3Ph&nbsp;: Z = V<sub>ph</sub>/I<sub>ph</sub> = {res.impedance?.toFixed(2)}&nbsp;&#x03A9; — R = Z &times; cos&nbsp;&#x03C6; = {res.resistance.toFixed(2)}&nbsp;&#x03A9;</>
                : null
              }
            </p>
          </div>
        </>
      )}

      <GlossarySection context="electrofrein" />
    </div>
  );
}
