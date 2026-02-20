export type ConnectionType = 'star' | 'delta';
export type PhaseCount = 1 | 3;
export type RotorType = 'wound' | 'squirrel';

export interface StatorInputs {
  power: number;
  voltage: number;
  frequency: number;
  powerFactor: number;
  efficiency: number;
  phases: PhaseCount;
  connection: ConnectionType;
  polePairs: number;
  slots: number;
  currentDensity: number;
  layers: 1 | 2;
  boreDiameter: number;
  stackLength: number;
  windingFactor: number;
  fluxDensity: number;
}

export interface StatorResults {
  ratedCurrent: number;
  wireSection: number;
  wireDiameter: number;
  standardWireDiameter: number;
  standardWireSection: number;
  phaseVoltage: number;
  turnsPerPhase: number;
  turnsPerSlot: number;
  slotsPerPolePerPhase: number;
  totalWireLengthM: number;
  copperMassKg: number;
  emfPerTurn: number;
}

export interface RotorInputs {
  rotorVoltage: number;
  statorVoltage: number;
  statorCurrent: number;
  turnsRatio: number;
  frequency: number;
  polePairs: number;
  slots: number;
  currentDensity: number;
  connection: ConnectionType;
  layers: 1 | 2;
  boreDiameter: number;
  stackLength: number;
  windingFactor: number;
  fluxDensity: number;
}

export interface RotorResults {
  rotorCurrent: number;
  wireSection: number;
  wireDiameter: number;
  standardWireDiameter: number;
  standardWireSection: number;
  turnsPerPhase: number;
  turnsPerSlot: number;
  totalWireLengthM: number;
  copperMassKg: number;
}

export interface ElectrofreinInputs {
  voltage: number;
  current: number;
  innerDiameter: number;
  outerDiameter: number;
  coilHeight: number;
  fillFactor: number;
  temperatureRise: number;
}

export interface ElectrofreinResults {
  resistance: number;
  power: number;
  wireSection: number;
  wireDiameter: number;
  standardWireDiameter: number;
  standardWireSection: number;
  numberOfTurns: number;
  totalWireLength: number;
  resistanceAtTemp: number;
  windingVolume: number;
  copperMassG: number;
  meanTurnLength: number;
}

export interface WireEntry {
  diameter: number;
  section: number;
  resistancePerM: number;
  maxCurrentMotor: number;
  maxCurrentGeneral: number;
}
