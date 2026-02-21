import type {
  StatorInputs, StatorResults,
  RotorInputs, RotorResults,
  ElectrofreinInputs, ElectrofreinResults,
} from '../types';
import { findStandardWire, COPPER_RESISTIVITY, COPPER_DENSITY } from './wireData';

const SQRT3 = Math.sqrt(3);

export function calcStator(inp: StatorInputs): StatorResults {
  const powerW = inp.power * 1000;
  const etaFrac = inp.efficiency / 100;

  let ratedCurrent: number;
  if (inp.phases === 3) {
    ratedCurrent = powerW / (SQRT3 * inp.voltage * inp.powerFactor * etaFrac);
  } else {
    ratedCurrent = powerW / (inp.voltage * inp.powerFactor * etaFrac);
  }

  const wireSection = ratedCurrent / inp.currentDensity;
  const wireDiameter = 1.1284 * Math.sqrt(wireSection);
  const std = findStandardWire(wireSection);

  const phaseVoltage = inp.connection === 'star' ? inp.voltage / SQRT3 : inp.voltage;

  const D_m = inp.boreDiameter / 1000;
  const L_m = inp.stackLength / 1000;
  const polePitch = Math.PI * D_m / (2 * inp.polePairs);
  const fluxPeak = inp.fluxDensity * (Math.PI / 2) * polePitch * L_m;

  const turnsPerPhase = Math.max(1, Math.round(phaseVoltage / (4.44 * inp.frequency * inp.windingFactor * fluxPeak)));

  const slotsPerPolePerPhase = inp.phases === 3 ? inp.slots / (2 * inp.polePairs * 3) : inp.slots / (2 * inp.polePairs);
  const coilsPerPhase = inp.polePairs * (inp.slots / (2 * inp.polePairs * (inp.phases === 3 ? 3 : 1)));
  const turnsPerSlot = inp.layers === 2
    ? Math.max(1, Math.round((turnsPerPhase * inp.phases) / inp.slots))
    : Math.max(1, Math.round(turnsPerPhase / coilsPerPhase));

  const meanTurnLength = Math.PI * (D_m + L_m) / 2 + L_m * 1.3;
  const totalWireLengthM = turnsPerPhase * inp.phases * meanTurnLength;
  const copperMassKg = totalWireLengthM * (wireSection / 1e6) * COPPER_DENSITY;
  const emfPerTurn = phaseVoltage / turnsPerPhase;

  return {
    ratedCurrent, wireSection, wireDiameter,
    standardWireDiameter: std.diameter,
    standardWireSection: std.section,
    phaseVoltage, turnsPerPhase, turnsPerSlot,
    slotsPerPolePerPhase, totalWireLengthM, copperMassKg, emfPerTurn,
  };
}

export function calcRotor(inp: RotorInputs): RotorResults {
  const rotorCurrent = inp.statorCurrent * inp.turnsRatio * 0.95;
  const wireSection = rotorCurrent / inp.currentDensity;
  const wireDiameter = 1.1284 * Math.sqrt(wireSection);
  const std = findStandardWire(wireSection);

  const phaseVoltage = inp.connection === 'star' ? inp.rotorVoltage / SQRT3 : inp.rotorVoltage;
  const D_m = inp.boreDiameter / 1000;
  const L_m = inp.stackLength / 1000;
  const polePitch = Math.PI * D_m / (2 * inp.polePairs);
  const fluxPeak = inp.fluxDensity * (Math.PI / 2) * polePitch * L_m;

  const turnsPerPhase = Math.max(1, Math.round(phaseVoltage / (4.44 * inp.frequency * inp.windingFactor * fluxPeak)));
  const turnsPerSlot = inp.layers === 2
    ? Math.max(1, Math.round((turnsPerPhase * 3) / inp.slots))
    : Math.max(1, Math.round(turnsPerPhase / (inp.polePairs * inp.slots / (2 * inp.polePairs * 3))));

  const meanTurnLength = Math.PI * (D_m + L_m) / 2 + L_m * 1.2;
  const totalWireLengthM = turnsPerPhase * 3 * meanTurnLength;
  const copperMassKg = totalWireLengthM * (wireSection / 1e6) * COPPER_DENSITY;

  return {
    rotorCurrent, wireSection, wireDiameter,
    standardWireDiameter: std.diameter,
    standardWireSection: std.section,
    turnsPerPhase, turnsPerSlot, totalWireLengthM, copperMassKg,
  };
}

export function calcElectrofrein(inp: ElectrofreinInputs): ElectrofreinResults {
  const resistance = inp.voltage / inp.current;
  const power = inp.voltage * inp.current;

  const Di = inp.innerDiameter / 1000;
  const De = inp.outerDiameter / 1000;
  const h = inp.coilHeight / 1000;

  const meanTurnLengthM = Math.PI * (Di + De) / 2;
  const windingArea = (De - Di) / 2 * h;

  const section = Math.sqrt(
    COPPER_RESISTIVITY * inp.fillFactor * (windingArea * 1e6) * (meanTurnLengthM * 1000) / (resistance * 1000)
  );
  const wireDiameter = 1.1284 * Math.sqrt(section);
  const std = findStandardWire(section);

  const totalWireLength = resistance * std.section / COPPER_RESISTIVITY;
  const numberOfTurns = Math.round((totalWireLength / (meanTurnLengthM * 1000)) * 1000);

  const alpha = 0.00393;
  const resistanceAtTemp = resistance * (1 + alpha * inp.temperatureRise);
  const windingVolume = Math.PI / 4 * (De * De - Di * Di) * h * 1e9;
  const copperMassG = (totalWireLength / 1000) * (std.section / 1e6) * COPPER_DENSITY * 1000;

  return {
    resistance, power, wireSection: section, wireDiameter,
    standardWireDiameter: std.diameter,
    standardWireSection: std.section,
    numberOfTurns, totalWireLength, resistanceAtTemp,
    windingVolume, copperMassG, meanTurnLength: meanTurnLengthM * 1000,
  };
}
