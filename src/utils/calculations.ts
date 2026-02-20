import type {
  StatorInputs, StatorResults,
  RotorInputs, RotorResults,
  ElectrofreinInputs, ElectrofreinResults,
} from '../types';
import { findStandardWire, COPPER_RESISTIVITY, COPPER_DENSITY } from './wireData';

const SQRT3 = Math.sqrt(3);

export function calcStator(inp: StatorInputs): StatorResults {
  const { power, voltage, frequency, powerFactor, efficiency, phases,
    connection, polePairs, slots, currentDensity, layers,
    boreDiameter, stackLength, windingFactor, fluxDensity } = inp;

  const powerW = power * 1000;
  const etaFrac = efficiency / 100;

  let ratedCurrent: number;
  if (phases === 3) {
    ratedCurrent = powerW / (SQRT3 * voltage * powerFactor * etaFrac);
  } else {
    ratedCurrent = powerW / (voltage * powerFactor * etaFrac);
  }

  const wireSection = ratedCurrent / currentDensity;
  const wireDiameter = 1.1284 * Math.sqrt(wireSection);
  const std = findStandardWire(wireSection);

  const phaseVoltage = connection === 'star' ? voltage / SQRT3 : voltage;

  const D_m = boreDiameter / 1000;
  const L_m = stackLength / 1000;
  const polePitch = Math.PI * D_m / (2 * polePairs);
  const fluxPeak = fluxDensity * (Math.PI / 2) * polePitch * L_m;

  const turnsPerPhase = Math.round(phaseVoltage / (4.44 * frequency * windingFactor * fluxPeak));

  const slotsPerPolePerPhase = phases === 3 ? slots / (2 * polePairs * 3) : slots / (2 * polePairs);
  const coilsPerPhase = polePairs * (slots / (2 * polePairs * (phases === 3 ? 3 : 1)));
  const turnsPerSlot = layers === 2
    ? Math.round((turnsPerPhase * phases) / slots)
    : Math.round(turnsPerPhase / coilsPerPhase);

  const meanTurnLength = Math.PI * ((boreDiameter / 1000) + stackLength / 1000) / 2 + stackLength / 1000 * 1.3;
  const totalWireLengthM = turnsPerPhase * phases * meanTurnLength;

  const copperMassKg = totalWireLengthM * (wireSection / 1e6) * COPPER_DENSITY;

  const emfPerTurn = phaseVoltage / turnsPerPhase;

  return {
    ratedCurrent,
    wireSection,
    wireDiameter,
    standardWireDiameter: std.diameter,
    standardWireSection: std.section,
    phaseVoltage,
    turnsPerPhase,
    turnsPerSlot,
    slotsPerPolePerPhase,
    totalWireLengthM,
    copperMassKg,
    emfPerTurn,
  };
}

export function calcRotor(inp: RotorInputs): RotorResults {
  const { rotorVoltage, statorCurrent, turnsRatio, frequency, polePairs,
    slots, currentDensity, connection, layers,
    boreDiameter, stackLength, windingFactor, fluxDensity } = inp;

  const rotorCurrent = statorCurrent * turnsRatio * 0.95;

  const wireSection = rotorCurrent / currentDensity;
  const wireDiameter = 1.1284 * Math.sqrt(wireSection);
  const std = findStandardWire(wireSection);

  const phaseVoltage = connection === 'star' ? rotorVoltage / SQRT3 : rotorVoltage;

  const D_m = boreDiameter / 1000;
  const L_m = stackLength / 1000;
  const polePitch = Math.PI * D_m / (2 * polePairs);
  const fluxPeak = fluxDensity * (Math.PI / 2) * polePitch * L_m;

  const turnsPerPhase = Math.max(1, Math.round(phaseVoltage / (4.44 * frequency * windingFactor * fluxPeak)));
  const turnsPerSlot = layers === 2
    ? Math.round((turnsPerPhase * 3) / slots)
    : Math.max(1, Math.round(turnsPerPhase / (polePairs * slots / (2 * polePairs * 3))));

  const meanTurnLength = Math.PI * ((boreDiameter / 1000) + stackLength / 1000) / 2 + stackLength / 1000 * 1.2;
  const totalWireLengthM = turnsPerPhase * 3 * meanTurnLength;

  const copperMassKg = totalWireLengthM * (wireSection / 1e6) * COPPER_DENSITY;

  return {
    rotorCurrent,
    wireSection,
    wireDiameter,
    standardWireDiameter: std.diameter,
    standardWireSection: std.section,
    turnsPerPhase,
    turnsPerSlot,
    totalWireLengthM,
    copperMassKg,
  };
}

export function calcElectrofrein(inp: ElectrofreinInputs): ElectrofreinResults {
  const { voltage, current, innerDiameter, outerDiameter, coilHeight, fillFactor, temperatureRise } = inp;

  const resistance = voltage / current;
  const power = voltage * current;

  const Di = innerDiameter / 1000;
  const De = outerDiameter / 1000;
  const h = coilHeight / 1000;

  const meanTurnLengthM = Math.PI * (Di + De) / 2;
  const windingArea = (De - Di) / 2 * h;

  const section = Math.sqrt(COPPER_RESISTIVITY * fillFactor * (windingArea * 1e6) * (meanTurnLengthM * 1000) / (resistance * 1000));
  const wireDiameter = 1.1284 * Math.sqrt(section);
  const std = findStandardWire(section);

  const totalWireLength = resistance * std.section / COPPER_RESISTIVITY;
  const numberOfTurns = Math.round(totalWireLength / (meanTurnLengthM * 1000) * 1000);

  const alpha = 0.00393;
  const resistanceAtTemp = resistance * (1 + alpha * temperatureRise);

  const windingVolume = Math.PI / 4 * (De * De - Di * Di) * h * 1e9;
  const copperMassG = (totalWireLength / 1000) * (std.section / 1e6) * COPPER_DENSITY * 1000;

  return {
    resistance,
    power,
    wireSection: section,
    wireDiameter,
    standardWireDiameter: std.diameter,
    standardWireSection: std.section,
    numberOfTurns,
    totalWireLength,
    resistanceAtTemp,
    windingVolume,
    copperMassG,
    meanTurnLength: meanTurnLengthM * 1000,
  };
}
