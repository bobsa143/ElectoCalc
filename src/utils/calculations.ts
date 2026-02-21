import type {
  StatorInputs, StatorResults,
  RotorInputs, RotorResults,
  ElectrofreinInputs, ElectrofreinResults,
  MesureResistanceInputs, MesureResistanceResults,
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

export function calcMesureResistance(inp: MesureResistanceInputs): MesureResistanceResults {
  let phaseResistance: number;
  if (inp.coilType === 'stator_star') {
    phaseResistance = inp.measuredResistance / 2;
  } else if (inp.coilType === 'stator_delta') {
    phaseResistance = inp.measuredResistance * 1.5;
  } else {
    phaseResistance = inp.measuredResistance;
  }

  const Di = inp.innerDiameter / 1000;
  const De = inp.outerDiameter / 1000;
  const h = inp.coilHeight / 1000;

  let meanTurnLengthM: number;
  let windingArea: number;

  if (inp.coilType !== 'electrofrein' && inp.boreDiameter && inp.stackLength) {
    const D_m = inp.boreDiameter / 1000;
    const L_m = inp.stackLength / 1000;
    meanTurnLengthM = Math.PI * (D_m + L_m) / 2 + L_m * 1.3;
    const phases = inp.phases ?? 3;
    const slots = inp.slots ?? 36;
    const polePairs = inp.polePairs ?? 2;
    const coilsPerPhase = polePairs * (slots / (2 * polePairs * phases));
    windingArea = (De - Di) / 2 * h;
    const totalLengthPerPhase = phaseResistance * 1e6 * (windingArea * inp.fillFactor) / (COPPER_RESISTIVITY * 1e6 * meanTurnLengthM);
    const wireSection = Math.sqrt(COPPER_RESISTIVITY * meanTurnLengthM * totalLengthPerPhase / phaseResistance);

    const std = findStandardWire(wireSection);
    const totalWireLength = (phaseResistance * std.section) / COPPER_RESISTIVITY;
    const numberOfTurns = Math.round(totalWireLength / (meanTurnLengthM * 1000) * 1000);
    const turnsPerSlot = Math.max(1, Math.round(numberOfTurns / coilsPerPhase));
    const copperMassG = (totalWireLength / 1000) * (std.section / 1e6) * COPPER_DENSITY * 1000;
    const resistivityCheck = std.section * phaseResistance / (totalWireLength / 1000);

    return {
      phaseResistance,
      wireSection,
      wireDiameter: 1.1284 * Math.sqrt(wireSection),
      standardWireDiameter: std.diameter,
      standardWireSection: std.section,
      numberOfTurns,
      totalWireLength,
      meanTurnLength: meanTurnLengthM * 1000,
      turnsPerSlot,
      copperMassG,
      windingArea: windingArea * 1e6,
      resistivityCheck,
    };
  } else {
    meanTurnLengthM = Math.PI * (Di + De) / 2;
    windingArea = (De - Di) / 2 * h;

    const section = Math.sqrt(
      COPPER_RESISTIVITY * inp.fillFactor * (windingArea * 1e6) * (meanTurnLengthM * 1000) / (phaseResistance * 1000)
    );
    const std = findStandardWire(section);
    const totalWireLength = (phaseResistance * std.section) / COPPER_RESISTIVITY;
    const numberOfTurns = Math.round(totalWireLength / (meanTurnLengthM * 1000) * 1000);
    const copperMassG = (totalWireLength / 1000) * (std.section / 1e6) * COPPER_DENSITY * 1000;
    const resistivityCheck = std.section * phaseResistance / (totalWireLength / 1000);

    return {
      phaseResistance,
      wireSection: section,
      wireDiameter: 1.1284 * Math.sqrt(section),
      standardWireDiameter: std.diameter,
      standardWireSection: std.section,
      numberOfTurns,
      totalWireLength,
      meanTurnLength: meanTurnLengthM * 1000,
      copperMassG,
      windingArea: windingArea * 1e6,
      resistivityCheck,
    };
  }
}

export function calcElectrofrein(inp: ElectrofreinInputs): ElectrofreinResults {
  const Di = inp.innerDiameter / 1000;
  const De = inp.outerDiameter / 1000;
  const h = inp.coilHeight / 1000;
  const meanTurnLengthM = Math.PI * (Di + De) / 2;
  const windingArea = (De - Di) / 2 * h;
  const alpha = 0.00393;

  if (inp.supplyType === 'ac3phase') {
    // Bobine AC 3 phases 380V — alimentation DIRECTE sur réseau triphasé, sans pont de diodes
    // La bobine est dimensionnée pour fonctionner en AC à la tension de phase
    // Connexion étoile implicite : V_phase = V_ligne / sqrt(3)
    const V_line = inp.voltage;
    const phaseVoltage = V_line / SQRT3;
    const phaseCurrent = inp.current;

    // Impédance par phase : Z = V_phase / I_phase
    const impedance = phaseVoltage / phaseCurrent;

    // Résistance par phase : R = Z * cos(φ)
    const resistance = impedance * inp.powerFactor;

    // Réactance : X = Z * sin(φ) = Z * sqrt(1 - cos²φ)
    const sinPhi = Math.sqrt(Math.max(0, 1 - inp.powerFactor * inp.powerFactor));
    const reactance = impedance * sinPhi;

    // Inductance : L = X / (2π * f)
    const inductance = reactance > 0 ? reactance / (2 * Math.PI * inp.frequency) : 0;

    // Puissance active totale 3 phases
    const power = SQRT3 * V_line * phaseCurrent * inp.powerFactor;

    // Dimensionnement du fil basé sur la résistance AC par phase
    const section = Math.sqrt(
      COPPER_RESISTIVITY * inp.fillFactor * (windingArea * 1e6) * (meanTurnLengthM * 1000) / (resistance * 1000)
    );
    const wireDiameter = 1.1284 * Math.sqrt(section);
    const std = findStandardWire(section);

    const totalWireLength = resistance * std.section / COPPER_RESISTIVITY;
    const numberOfTurns = Math.round((totalWireLength / (meanTurnLengthM * 1000)) * 1000);
    const resistanceAtTemp = resistance * (1 + alpha * inp.temperatureRise);
    const windingVolume = Math.PI / 4 * (De * De - Di * Di) * h * 1e9;
    const copperMassG = (totalWireLength / 1000) * (std.section / 1e6) * COPPER_DENSITY * 1000;

    return {
      resistance, power, wireSection: section, wireDiameter,
      standardWireDiameter: std.diameter,
      standardWireSection: std.section,
      numberOfTurns, totalWireLength, resistanceAtTemp,
      windingVolume, copperMassG, meanTurnLength: meanTurnLengthM * 1000,
      phaseVoltage, phaseCurrent, impedance, inductance,
    };
  }

  // Mode DC
  const resistance = inp.voltage / inp.current;
  const power = inp.voltage * inp.current;

  const section = Math.sqrt(
    COPPER_RESISTIVITY * inp.fillFactor * (windingArea * 1e6) * (meanTurnLengthM * 1000) / (resistance * 1000)
  );
  const wireDiameter = 1.1284 * Math.sqrt(section);
  const std = findStandardWire(section);

  const totalWireLength = resistance * std.section / COPPER_RESISTIVITY;
  const numberOfTurns = Math.round((totalWireLength / (meanTurnLengthM * 1000)) * 1000);
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
