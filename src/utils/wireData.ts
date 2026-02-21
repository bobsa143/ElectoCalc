import type { WireEntry } from '../types';

export const COPPER_RESISTIVITY = 0.01724;
export const COPPER_DENSITY = 8900;

export const WIRE_TABLE: WireEntry[] = [
  { diameter: 0.10, section: 0.00785, resistancePerM: 2.195, maxCurrentMotor: 0.04, maxCurrentGeneral: 0.03 },
  { diameter: 0.12, section: 0.01131, resistancePerM: 1.524, maxCurrentMotor: 0.06, maxCurrentGeneral: 0.05 },
  { diameter: 0.14, section: 0.01539, resistancePerM: 1.120, maxCurrentMotor: 0.08, maxCurrentGeneral: 0.07 },
  { diameter: 0.16, section: 0.02011, resistancePerM: 0.857, maxCurrentMotor: 0.10, maxCurrentGeneral: 0.09 },
  { diameter: 0.18, section: 0.02545, resistancePerM: 0.677, maxCurrentMotor: 0.13, maxCurrentGeneral: 0.11 },
  { diameter: 0.20, section: 0.03142, resistancePerM: 0.548, maxCurrentMotor: 0.16, maxCurrentGeneral: 0.14 },
  { diameter: 0.25, section: 0.04909, resistancePerM: 0.351, maxCurrentMotor: 0.25, maxCurrentGeneral: 0.22 },
  { diameter: 0.30, section: 0.07069, resistancePerM: 0.244, maxCurrentMotor: 0.35, maxCurrentGeneral: 0.31 },
  { diameter: 0.35, section: 0.09621, resistancePerM: 0.179, maxCurrentMotor: 0.48, maxCurrentGeneral: 0.42 },
  { diameter: 0.40, section: 0.12566, resistancePerM: 0.137, maxCurrentMotor: 0.63, maxCurrentGeneral: 0.55 },
  { diameter: 0.45, section: 0.15904, resistancePerM: 0.108, maxCurrentMotor: 0.80, maxCurrentGeneral: 0.70 },
  { diameter: 0.50, section: 0.19635, resistancePerM: 0.0877, maxCurrentMotor: 1.00, maxCurrentGeneral: 0.87 },
  { diameter: 0.56, section: 0.24630, resistancePerM: 0.0700, maxCurrentMotor: 1.23, maxCurrentGeneral: 1.08 },
  { diameter: 0.60, section: 0.28274, resistancePerM: 0.0610, maxCurrentMotor: 1.41, maxCurrentGeneral: 1.24 },
  { diameter: 0.63, section: 0.31173, resistancePerM: 0.0553, maxCurrentMotor: 1.56, maxCurrentGeneral: 1.37 },
  { diameter: 0.71, section: 0.39592, resistancePerM: 0.0435, maxCurrentMotor: 1.98, maxCurrentGeneral: 1.74 },
  { diameter: 0.75, section: 0.44179, resistancePerM: 0.0390, maxCurrentMotor: 2.21, maxCurrentGeneral: 1.94 },
  { diameter: 0.80, section: 0.50265, resistancePerM: 0.0343, maxCurrentMotor: 2.51, maxCurrentGeneral: 2.21 },
  { diameter: 0.85, section: 0.56745, resistancePerM: 0.0304, maxCurrentMotor: 2.84, maxCurrentGeneral: 2.49 },
  { diameter: 0.90, section: 0.63617, resistancePerM: 0.0271, maxCurrentMotor: 3.18, maxCurrentGeneral: 2.79 },
  { diameter: 0.95, section: 0.70882, resistancePerM: 0.0243, maxCurrentMotor: 3.54, maxCurrentGeneral: 3.11 },
  { diameter: 1.00, section: 0.78540, resistancePerM: 0.0220, maxCurrentMotor: 3.93, maxCurrentGeneral: 3.45 },
  { diameter: 1.06, section: 0.88247, resistancePerM: 0.0195, maxCurrentMotor: 4.41, maxCurrentGeneral: 3.87 },
  { diameter: 1.12, section: 0.98520, resistancePerM: 0.0175, maxCurrentMotor: 4.93, maxCurrentGeneral: 4.33 },
  { diameter: 1.18, section: 1.09359, resistancePerM: 0.0158, maxCurrentMotor: 5.47, maxCurrentGeneral: 4.80 },
  { diameter: 1.25, section: 1.22718, resistancePerM: 0.0140, maxCurrentMotor: 6.14, maxCurrentGeneral: 5.39 },
  { diameter: 1.32, section: 1.36848, resistancePerM: 0.0126, maxCurrentMotor: 6.84, maxCurrentGeneral: 6.01 },
  { diameter: 1.40, section: 1.53938, resistancePerM: 0.0112, maxCurrentMotor: 7.70, maxCurrentGeneral: 6.76 },
  { diameter: 1.50, section: 1.76715, resistancePerM: 0.00976, maxCurrentMotor: 8.84, maxCurrentGeneral: 7.76 },
  { diameter: 1.60, section: 2.01062, resistancePerM: 0.00857, maxCurrentMotor: 10.1, maxCurrentGeneral: 8.85 },
  { diameter: 1.70, section: 2.26980, resistancePerM: 0.00760, maxCurrentMotor: 11.4, maxCurrentGeneral: 9.98 },
  { diameter: 1.80, section: 2.54469, resistancePerM: 0.00677, maxCurrentMotor: 12.7, maxCurrentGeneral: 11.2 },
  { diameter: 1.90, section: 2.83529, resistancePerM: 0.00608, maxCurrentMotor: 14.2, maxCurrentGeneral: 12.5 },
  { diameter: 2.00, section: 3.14159, resistancePerM: 0.00549, maxCurrentMotor: 15.7, maxCurrentGeneral: 13.8 },
  { diameter: 2.12, section: 3.52999, resistancePerM: 0.00488, maxCurrentMotor: 17.7, maxCurrentGeneral: 15.5 },
  { diameter: 2.24, section: 3.94082, resistancePerM: 0.00437, maxCurrentMotor: 19.7, maxCurrentGeneral: 17.3 },
  { diameter: 2.36, section: 4.37366, resistancePerM: 0.00394, maxCurrentMotor: 21.9, maxCurrentGeneral: 19.2 },
  { diameter: 2.50, section: 4.90874, resistancePerM: 0.00351, maxCurrentMotor: 24.5, maxCurrentGeneral: 21.6 },
  { diameter: 2.65, section: 5.51547, resistancePerM: 0.00313, maxCurrentMotor: 27.6, maxCurrentGeneral: 24.2 },
  { diameter: 2.80, section: 6.15752, resistancePerM: 0.00280, maxCurrentMotor: 30.8, maxCurrentGeneral: 27.1 },
  { diameter: 3.00, section: 7.06858, resistancePerM: 0.00244, maxCurrentMotor: 35.3, maxCurrentGeneral: 31.1 },
  { diameter: 3.15, section: 7.79313, resistancePerM: 0.00221, maxCurrentMotor: 39.0, maxCurrentGeneral: 34.3 },
  { diameter: 3.35, section: 8.81448, resistancePerM: 0.00196, maxCurrentMotor: 44.1, maxCurrentGeneral: 38.8 },
  { diameter: 3.55, section: 9.89804, resistancePerM: 0.00174, maxCurrentMotor: 49.5, maxCurrentGeneral: 43.5 },
  { diameter: 3.75, section: 11.04465, resistancePerM: 0.00156, maxCurrentMotor: 55.2, maxCurrentGeneral: 48.6 },
  { diameter: 4.00, section: 12.56637, resistancePerM: 0.00137, maxCurrentMotor: 62.8, maxCurrentGeneral: 55.3 },
  { diameter: 4.25, section: 14.18625, resistancePerM: 0.00122, maxCurrentMotor: 70.9, maxCurrentGeneral: 62.4 },
  { diameter: 4.50, section: 15.90431, resistancePerM: 0.00108, maxCurrentMotor: 79.5, maxCurrentGeneral: 69.9 },
  { diameter: 4.75, section: 17.72054, resistancePerM: 0.000973, maxCurrentMotor: 88.6, maxCurrentGeneral: 77.9 },
  { diameter: 5.00, section: 19.63495, resistancePerM: 0.000878, maxCurrentMotor: 98.2, maxCurrentGeneral: 86.4 },
];

export function findStandardWire(section: number): WireEntry {
  for (const wire of WIRE_TABLE) {
    if (wire.section >= section) return wire;
  }
  return WIRE_TABLE[WIRE_TABLE.length - 1];
}
