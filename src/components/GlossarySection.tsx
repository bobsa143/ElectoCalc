import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

type Context = 'stator' | 'rotor' | 'electrofrein';

interface GlossaryEntry {
  term: string;
  symbol?: string;
  unit?: string;
  definition: string;
  formula?: string;
  typical?: string;
  diagram: React.ReactNode;
  contexts: Context[];
  photoFigure?: boolean;
}

const MotorCrossSVG = () => (
  <svg viewBox="0 0 220 220" className="w-full h-full">
    <circle cx="110" cy="110" r="100" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2"/>
    <circle cx="110" cy="110" r="78" fill="#ffffff" stroke="#64748b" strokeWidth="1.5"/>
    {Array.from({length:24}).map((_,i)=>{
      const a=(i*15-90)*Math.PI/180;
      const cx=110+78*Math.cos(a), cy=110+78*Math.sin(a);
      const fill=i%3===0?'#0ea5e9':i%3===1?'#f97316':'#22c55e';
      return <rect key={i} x={cx-4} y={cy-8} width="8" height="16" fill={fill} opacity="0.85" rx="1" transform={`rotate(${i*15} ${cx} ${cy})`}/>;
    })}
    <circle cx="110" cy="110" r="56" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
    {Array.from({length:16}).map((_,i)=>{
      const a=(i*22.5-90)*Math.PI/180;
      const cx=110+56*Math.cos(a), cy=110+56*Math.sin(a);
      return <rect key={i} x={cx-3} y={cy-6} width="6" height="12" fill="#93c5fd" rx="1" transform={`rotate(${i*22.5} ${cx} ${cy})`}/>;
    })}
    <circle cx="110" cy="110" r="18" fill="#94a3b8" stroke="#475569" strokeWidth="2"/>
    <circle cx="110" cy="110" r="8" fill="#64748b"/>
    <text x="110" y="16" textAnchor="middle" fontSize="9" fill="#0f172a" fontWeight="bold">STATOR</text>
    <text x="110" y="117" textAnchor="middle" fontSize="8" fill="#1d4ed8" fontWeight="bold">ROTOR</text>
    <text x="162" y="68" fontSize="7" fill="#0ea5e9">Encoches</text>
    <line x1="152" y1="72" x2="135" y2="82" stroke="#0ea5e9" strokeWidth="1"/>
    <text x="162" y="155" fontSize="7" fill="#64748b">Carcasse</text>
    <line x1="160" y1="150" x2="148" y2="140" stroke="#64748b" strokeWidth="1"/>
  </svg>
);

const SlotSVG = () => (
  <svg viewBox="0 0 180 200" className="w-full h-full">
    <rect x="30" y="10" width="120" height="180" fill="#e2e8f0" rx="4" stroke="#94a3b8" strokeWidth="2"/>
    <rect x="50" y="25" width="80" height="150" fill="#fff" rx="3" stroke="#64748b" strokeWidth="1.5"/>
    {Array.from({length:6}).map((_,row)=>Array.from({length:4}).map((_,col)=>(
      <circle key={`${row}-${col}`} cx={65+col*18} cy={42+row*22} r="7"
        fill={row<3?'#0ea5e9':'#f97316'} stroke={row<3?'#0369a1':'#c2410c'} strokeWidth="1.5"/>
    )))}
    <line x1="50" y1="113" x2="130" y2="113" stroke="#64748b" strokeWidth="1" strokeDasharray="4,2"/>
    <text x="135" y="105" fontSize="8" fill="#0369a1">C1</text>
    <text x="135" y="125" fontSize="8" fill="#c2410c">C2</text>
    <text x="90" y="196" textAnchor="middle" fontSize="9" fill="#0f172a" fontWeight="bold">Encoche — section</text>
  </svg>
);

const WireSVG = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <rect x="10" y="10" width="180" height="130" fill="#f8fafc" rx="8" stroke="#e2e8f0" strokeWidth="1"/>
    {[0,1,2,3,4].map(row=>[0,1,2,3,4].map(col=>(
      <g key={`${row}-${col}`}>
        <circle cx={28+col*30} cy={28+row*20} r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
        <circle cx={28+col*30} cy={28+row*20} r="5" fill="#f59e0b"/>
        <circle cx={28+col*30} cy={28+row*20} r="2" fill="#fef3c7"/>
      </g>
    )))}
    <line x1="138" y1="38" x2="158" y2="38" stroke="#dc2626" strokeWidth="1.5"/>
    <line x1="138" y1="48" x2="158" y2="48" stroke="#dc2626" strokeWidth="1.5"/>
    <line x1="148" y1="28" x2="148" y2="48" stroke="#dc2626" strokeWidth="1"/>
    <text x="163" y="44" fontSize="9" fill="#dc2626" fontWeight="bold">d</text>
    <text x="100" y="152" textAnchor="middle" fontSize="9" fill="#475569" fontWeight="bold">S = π×d²/4 (mm²)</text>
  </svg>
);

const StarDeltaSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full h-full">
    <text x="65" y="16" textAnchor="middle" fontSize="11" fill="#0f172a" fontWeight="bold">Étoile (Y)</text>
    <line x1="65" y1="50" x2="65" y2="90" stroke="#0ea5e9" strokeWidth="2.5"/>
    <line x1="65" y1="90" x2="30" y2="140" stroke="#f97316" strokeWidth="2.5"/>
    <line x1="65" y1="90" x2="100" y2="140" stroke="#22c55e" strokeWidth="2.5"/>
    <line x1="65" y1="90" x2="65" y2="158" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,3"/>
    <circle cx="65" cy="90" r="5" fill="#0f172a"/>
    <circle cx="65" cy="50" r="5" fill="#0ea5e9"/>
    <circle cx="30" cy="140" r="5" fill="#f97316"/>
    <circle cx="100" cy="140" r="5" fill="#22c55e"/>
    <text x="73" y="46" fontSize="9" fill="#0ea5e9">L1</text>
    <text x="10" y="148" fontSize="9" fill="#f97316">L2</text>
    <text x="104" y="148" fontSize="9" fill="#22c55e">L3</text>
    <text x="72" y="163" fontSize="9" fill="#64748b">N</text>
    <text x="215" y="16" textAnchor="middle" fontSize="11" fill="#0f172a" fontWeight="bold">Triangle (Δ)</text>
    <line x1="215" y1="45" x2="170" y2="140" stroke="#0ea5e9" strokeWidth="2.5"/>
    <line x1="215" y1="45" x2="260" y2="140" stroke="#22c55e" strokeWidth="2.5"/>
    <line x1="170" y1="140" x2="260" y2="140" stroke="#f97316" strokeWidth="2.5"/>
    <circle cx="215" cy="45" r="5" fill="#0ea5e9"/>
    <circle cx="170" cy="140" r="5" fill="#f97316"/>
    <circle cx="260" cy="140" r="5" fill="#22c55e"/>
    <text x="218" y="42" fontSize="9" fill="#0ea5e9">L1</text>
    <text x="152" y="153" fontSize="9" fill="#f97316">L2</text>
    <text x="263" y="153" fontSize="9" fill="#22c55e">L3</text>
    <line x1="140" y1="5" x2="140" y2="195" stroke="#e2e8f0" strokeWidth="1.5"/>
  </svg>
);

const PoleSVG = () => (
  <svg viewBox="0 0 220 180" className="w-full h-full">
    <circle cx="110" cy="90" r="75" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2"/>
    <circle cx="110" cy="90" r="45" fill="#ffffff" stroke="#64748b" strokeWidth="1.5"/>
    <path d="M110 15 A75 75 0 0 1 185 90 A75 75 0 0 0 110 15" fill="#fecaca" stroke="#ef4444" strokeWidth="1"/>
    <path d="M110 165 A75 75 0 0 1 35 90 A75 75 0 0 0 110 165" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1"/>
    <text x="148" y="58" fontSize="16" fill="#dc2626" fontWeight="bold">N</text>
    <text x="62" y="132" fontSize="16" fill="#2563eb" fontWeight="bold">S</text>
    <text x="110" y="92" textAnchor="middle" fontSize="9" fill="#475569">p = 1</text>
    <text x="110" y="104" textAnchor="middle" fontSize="8" fill="#475569">2 pôles</text>
    <line x1="35" y1="90" x2="185" y2="90" stroke="#64748b" strokeWidth="1" strokeDasharray="4,3"/>
    <text x="110" y="175" textAnchor="middle" fontSize="8" fill="#0f172a">n = 60f/p (tr/min)</text>
  </svg>
);

const CurrentDensitySVG = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full">
    <circle cx="100" cy="75" r="60" fill="#fef9c3" stroke="#ca8a04" strokeWidth="2.5"/>
    <circle cx="100" cy="75" r="40" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
    <circle cx="100" cy="75" r="20" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5"/>
    {[0,45,90,135,180,225,270,315].map((deg,i)=>{
      const r=deg*Math.PI/180;
      return <line key={i} x1={100+15*Math.cos(r)} y1={75+15*Math.sin(r)} x2={100+50*Math.cos(r)} y2={75+50*Math.sin(r)} stroke="#0f172a" strokeWidth="1.5"/>;
    })}
    <line x1="100" y1="75" x2="155" y2="75" stroke="#dc2626" strokeWidth="2"/>
    <text x="158" y="79" fontSize="10" fill="#dc2626" fontWeight="bold">d</text>
    <text x="100" y="150" textAnchor="middle" fontSize="9" fill="#0f172a" fontWeight="bold">J = I / S  (A/mm²)</text>
    <text x="100" y="140" textAnchor="middle" fontSize="8" fill="#475569">Courant par mm² de cuivre</text>
  </svg>
);

const FactorBobSVG = () => (
  <svg viewBox="0 0 240 180" className="w-full h-full">
    <rect x="10" y="75" width="220" height="30" fill="#e2e8f0" rx="4" stroke="#94a3b8" strokeWidth="1.5"/>
    {Array.from({length:12}).map((_,i)=>(
      <g key={i}>
        <rect x={15+i*18} y="25" width="10" height="80" fill={i<4?'#0ea5e9':i<8?'#f97316':'#22c55e'} rx="2" opacity="0.8"/>
        <text x={20+i*18} y="22" textAnchor="middle" fontSize="7" fill="#475569">{i+1}</text>
      </g>
    ))}
    <path d="M20 115 Q65 150 115 115" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="5,3"/>
    <path d="M20 115 Q90 160 165 115" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,3"/>
    <text x="60" y="168" textAnchor="middle" fontSize="8" fill="#0ea5e9">Pas bobine</text>
    <text x="100" y="178" textAnchor="middle" fontSize="8" fill="#dc2626">Pas polaire</text>
    <text x="120" y="14" textAnchor="middle" fontSize="9" fill="#0f172a" fontWeight="bold">kw = 0.955 (standard)</text>
  </svg>
);

const PackageSVG = () => (
  <svg viewBox="0 0 220 180" className="w-full h-full">
    <rect x="60" y="30" width="100" height="120" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="4"/>
    {Array.from({length:8}).map((_,i)=>(
      <line key={i} x1="60" y1={30+i*17} x2="160" y2={30+i*17} stroke="#93c5fd" strokeWidth="1"/>
    ))}
    <ellipse cx="110" cy="30" rx="50" ry="14" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2"/>
    <ellipse cx="110" cy="150" rx="50" ry="14" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2"/>
    <circle cx="110" cy="30" r="18" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5"/>
    <circle cx="110" cy="150" r="18" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5"/>
    <circle cx="110" cy="30" r="7" fill="#64748b"/>
    <circle cx="110" cy="150" r="7" fill="#64748b"/>
    <line x1="168" y1="30" x2="195" y2="30" stroke="#0f172a" strokeWidth="1"/>
    <line x1="168" y1="150" x2="195" y2="150" stroke="#0f172a" strokeWidth="1"/>
    <line x1="185" y1="30" x2="185" y2="150" stroke="#0f172a" strokeWidth="2"/>
    <text x="198" y="94" fontSize="10" fill="#0f172a" fontWeight="bold">L</text>
    <text x="110" y="175" textAnchor="middle" fontSize="8" fill="#3b82f6">Longueur de paquet</text>
  </svg>
);

const BoreSVG = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <circle cx="100" cy="100" r="90" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2"/>
    <circle cx="100" cy="100" r="65" fill="#ffffff" stroke="#64748b" strokeWidth="1.5"/>
    <circle cx="100" cy="100" r="56" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="5,3"/>
    <circle cx="100" cy="100" r="18" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5"/>
    <line x1="100" y1="100" x2="153" y2="100" stroke="#dc2626" strokeWidth="2.5"/>
    <line x1="145" y1="94" x2="153" y2="100" stroke="#dc2626" strokeWidth="2"/>
    <line x1="145" y1="106" x2="153" y2="100" stroke="#dc2626" strokeWidth="2"/>
    <text x="122" y="96" fontSize="9" fill="#dc2626" fontWeight="bold">D/2</text>
    <text x="100" y="192" textAnchor="middle" fontSize="8" fill="#3b82f6">Alésage D — diamètre intérieur stator</text>
  </svg>
);

const ACThreePhaseSVG = () => (
  <svg viewBox="0 0 240 200" className="w-full h-full">
    <text x="120" y="14" textAnchor="middle" fontSize="9" fill="#0f172a" fontWeight="bold">Alimentation AC 3Ph directe</text>
    <line x1="20" y1="40" x2="75" y2="40" stroke="#ef4444" strokeWidth="2"/>
    <line x1="20" y1="70" x2="75" y2="70" stroke="#f97316" strokeWidth="2"/>
    <line x1="20" y1="100" x2="75" y2="100" stroke="#22c55e" strokeWidth="2"/>
    <text x="14" y="44" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="bold">L1</text>
    <text x="14" y="74" textAnchor="middle" fontSize="9" fill="#f97316" fontWeight="bold">L2</text>
    <text x="14" y="104" textAnchor="middle" fontSize="9" fill="#22c55e" fontWeight="bold">L3</text>
    <rect x="75" y="30" width="90" height="80" fill="#fff7ed" stroke="#d97706" strokeWidth="2" rx="6"/>
    <text x="120" y="62" textAnchor="middle" fontSize="8" fill="#7c2d12" fontWeight="bold">BOBINE AC</text>
    <text x="120" y="75" textAnchor="middle" fontSize="7" fill="#92400e">Z = R + jX</text>
    <text x="120" y="88" textAnchor="middle" fontSize="7" fill="#92400e">cos φ ≈ 0,85</text>
    <line x1="165" y1="40" x2="215" y2="40" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,2"/>
    <line x1="165" y1="70" x2="215" y2="70" stroke="#f97316" strokeWidth="2" strokeDasharray="4,2"/>
    <line x1="165" y1="100" x2="215" y2="100" stroke="#22c55e" strokeWidth="2" strokeDasharray="4,2"/>
    <rect x="200" y="30" width="30" height="80" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" rx="4"/>
    <text x="215" y="68" textAnchor="middle" fontSize="7" fill="#14532d" fontWeight="bold">3Ph</text>
    <text x="215" y="80" textAnchor="middle" fontSize="7" fill="#14532d">380V</text>
    <line x1="75" y1="140" x2="165" y2="140" stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="none"/>
    <text x="120" y="155" textAnchor="middle" fontSize="8" fill="#0369a1">Pas de pont de diodes</text>
    <line x1="50" y1="163" x2="190" y2="163" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,3"/>
    <text x="120" y="178" textAnchor="middle" fontSize="8" fill="#dc2626">Bobine directement sur réseau AC</text>
  </svg>
);

const DiodeBridgeSVG = () => (
  <svg viewBox="0 0 240 200" className="w-full h-full">
    <text x="120" y="14" textAnchor="middle" fontSize="9" fill="#0f172a" fontWeight="bold">Pont de diodes (DC)</text>
    <line x1="10" y1="60" x2="50" y2="60" stroke="#64748b" strokeWidth="2"/>
    <line x1="10" y1="130" x2="50" y2="130" stroke="#64748b" strokeWidth="2"/>
    <text x="18" y="56" fontSize="8" fill="#64748b">AC~</text>
    <text x="18" y="148" fontSize="8" fill="#64748b">AC~</text>
    <polygon points="55,50 55,70 75,60" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5"/>
    <polygon points="75,50 75,70 55,60" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5"/>
    <polygon points="55,120 55,140 75,130" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5"/>
    <polygon points="75,120 75,140 55,130" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5"/>
    <text x="63" y="48" textAnchor="middle" fontSize="7" fill="#1d4ed8">D1</text>
    <text x="63" y="88" textAnchor="middle" fontSize="7" fill="#1d4ed8">D2</text>
    <text x="63" y="118" textAnchor="middle" fontSize="7" fill="#1d4ed8">D3</text>
    <text x="63" y="158" textAnchor="middle" fontSize="7" fill="#1d4ed8">D4</text>
    <line x1="75" y1="60" x2="100" y2="60" stroke="#64748b" strokeWidth="1.5"/>
    <line x1="75" y1="130" x2="100" y2="130" stroke="#64748b" strokeWidth="1.5"/>
    <line x1="100" y1="55" x2="100" y2="145" stroke="#64748b" strokeWidth="1.5"/>
    <line x1="100" y1="55" x2="165" y2="55" stroke="#ef4444" strokeWidth="2.5"/>
    <line x1="100" y1="145" x2="165" y2="145" stroke="#1d4ed8" strokeWidth="2.5"/>
    <text x="105" y="50" fontSize="8" fill="#dc2626" fontWeight="bold">+DC</text>
    <text x="105" y="160" fontSize="8" fill="#1d4ed8" fontWeight="bold">−DC</text>
    <rect x="165" y="70" width="60" height="60" fill="#fef3c7" stroke="#d97706" strokeWidth="2" rx="5"/>
    <text x="195" y="97" textAnchor="middle" fontSize="8" fill="#7c2d12" fontWeight="bold">Bobine</text>
    <text x="195" y="109" textAnchor="middle" fontSize="7" fill="#92400e">R = V/I</text>
    <line x1="165" y1="55" x2="225" y2="55" stroke="#ef4444" strokeWidth="2"/>
    <line x1="225" y1="55" x2="225" y2="70" stroke="#ef4444" strokeWidth="2"/>
    <line x1="165" y1="145" x2="225" y2="145" stroke="#1d4ed8" strokeWidth="2"/>
    <line x1="225" y1="130" x2="225" y2="145" stroke="#1d4ed8" strokeWidth="2"/>
  </svg>
);

const CoilDimensionsSVG = () => (
  <svg viewBox="0 0 240 200" className="w-full h-full">
    <text x="120" y="13" textAnchor="middle" fontSize="9" fill="#0f172a" fontWeight="bold">Dimensions du bobineau</text>
    <ellipse cx="120" cy="50" rx="80" ry="18" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
    <rect x="40" y="50" width="160" height="80" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
    <ellipse cx="120" cy="130" rx="80" ry="18" fill="#fcd34d" stroke="#d97706" strokeWidth="2"/>
    <ellipse cx="120" cy="50" rx="35" ry="8" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5"/>
    <rect x="85" y="50" width="70" height="80" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.5"/>
    <ellipse cx="120" cy="130" rx="35" ry="8" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5"/>
    <line x1="228" y1="50" x2="228" y2="130" stroke="#0f172a" strokeWidth="1.5"/>
    <line x1="223" y1="50" x2="233" y2="50" stroke="#0f172a" strokeWidth="1.5"/>
    <line x1="223" y1="130" x2="233" y2="130" stroke="#0f172a" strokeWidth="1.5"/>
    <text x="236" y="94" fontSize="9" fill="#0f172a" fontWeight="bold">h</text>
    <line x1="120" y1="148" x2="155" y2="148" stroke="#ef4444" strokeWidth="1.5"/>
    <line x1="120" y1="144" x2="120" y2="152" stroke="#ef4444" strokeWidth="1.5"/>
    <line x1="155" y1="144" x2="155" y2="152" stroke="#ef4444" strokeWidth="1.5"/>
    <text x="137" y="163" textAnchor="middle" fontSize="8" fill="#dc2626" fontWeight="bold">Di/2</text>
    <line x1="120" y1="172" x2="200" y2="172" stroke="#0ea5e9" strokeWidth="1.5"/>
    <line x1="120" y1="168" x2="120" y2="176" stroke="#0ea5e9" strokeWidth="1.5"/>
    <line x1="200" y1="168" x2="200" y2="176" stroke="#0ea5e9" strokeWidth="1.5"/>
    <text x="160" y="187" textAnchor="middle" fontSize="8" fill="#0369a1" fontWeight="bold">De/2</text>
    <line x1="120" y1="148" x2="120" y2="176" stroke="#475569" strokeWidth="1" strokeDasharray="3,2"/>
    <text x="38" y="95" textAnchor="middle" fontSize="7" fill="#92400e">Cu</text>
  </svg>
);

const ElectrofreinSVG = () => (
  <svg viewBox="0 0 240 200" className="w-full h-full">
    <rect x="20" y="60" width="200" height="80" fill="#fef3c7" stroke="#d97706" strokeWidth="2" rx="8"/>
    <rect x="50" y="75" width="60" height="50" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" rx="4"/>
    {Array.from({length:5}).map((_,i)=>(
      <line key={i} x1="50" y1={80+i*10} x2="110" y2={80+i*10} stroke="#b45309" strokeWidth="0.8"/>
    ))}
    <text x="80" y="104" textAnchor="middle" fontSize="8" fill="#7c2d12" fontWeight="bold">Bobine</text>
    <rect x="130" y="75" width="70" height="50" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" rx="2"/>
    <text x="165" y="104" textAnchor="middle" fontSize="8" fill="#475569">Noyau Fe</text>
    <rect x="20" y="55" width="200" height="10" fill="#94a3b8" stroke="#64748b" strokeWidth="1" rx="2"/>
    <rect x="20" y="135" width="200" height="10" fill="#94a3b8" stroke="#64748b" strokeWidth="1" rx="2"/>
    <line x1="55" y1="45" x2="55" y2="55" stroke="#ef4444" strokeWidth="2"/>
    <line x1="80" y1="45" x2="80" y2="55" stroke="#1d4ed8" strokeWidth="2"/>
    <text x="55" y="42" textAnchor="middle" fontSize="10" fill="#ef4444" fontWeight="bold">+</text>
    <text x="80" y="42" textAnchor="middle" fontSize="10" fill="#1d4ed8" fontWeight="bold">−</text>
    <text x="120" y="185" textAnchor="middle" fontSize="9" fill="#0f172a" fontWeight="bold">Électrofrein — principe de fonctionnement</text>
  </svg>
);

const FillFactorSVG = () => (
  <svg viewBox="0 0 200 180" className="w-full h-full">
    <rect x="40" y="20" width="120" height="140" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" rx="6"/>
    <rect x="52" y="32" width="96" height="116" fill="#fff" stroke="#cbd5e1" strokeWidth="1" rx="3"/>
    {Array.from({length:5}).map((_,row)=>Array.from({length:5}).map((_,col)=>(
      <circle key={`${row}-${col}`} cx={63+col*17} cy={43+row*19} r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2"/>
    )))}
    <rect x="40" y="20" width="120" height="140" fill="none" stroke="#d97706" strokeWidth="2.5" rx="6" strokeDasharray="6,3"/>
    <text x="100" y="172" textAnchor="middle" fontSize="8" fill="#0f172a" fontWeight="bold">kf = S_fils / S_bobineau</text>
    <text x="100" y="14" textAnchor="middle" fontSize="8" fill="#475569">kf typique = 0,60 – 0,70</text>
  </svg>
);

const CoilSVG = () => (
  <svg viewBox="0 0 240 180" className="w-full h-full">
    {[0,1,2,3,4,5].map(i=>(
      <g key={i}>
        <rect x={30+i*28} y="30" width="16" height="120" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" rx="3"/>
        <ellipse cx={38+i*28} cy="30" rx="8" ry="4" fill="#fcd34d" stroke="#d97706" strokeWidth="1"/>
        <ellipse cx={38+i*28} cy="150" rx="8" ry="4" fill="#fcd34d" stroke="#d97706" strokeWidth="1"/>
      </g>
    ))}
    <path d="M38 150 Q38 168 66 168 Q94 168 94 150" fill="none" stroke="#d97706" strokeWidth="2.5"/>
    <path d="M122 150 Q122 168 150 168 Q178 168 178 150" fill="none" stroke="#d97706" strokeWidth="2.5"/>
    <path d="M38 30 Q38 12 66 12 Q94 12 94 30" fill="none" stroke="#d97706" strokeWidth="2.5"/>
    <path d="M122 30 Q122 12 150 12 Q178 12 178 30" fill="none" stroke="#d97706" strokeWidth="2.5"/>
    <text x="120" y="98" textAnchor="middle" fontSize="10" fill="#0f172a">6 spires</text>
    <text x="120" y="110" textAnchor="middle" fontSize="8" fill="#475569">= 6 tours de fil</text>
  </svg>
);

const ENTRIES: GlossaryEntry[] = [
  {
    term: 'Stator', symbol: 'Z_s',
    definition: "Partie fixe du moteur électrique. Contient les bobinages de cuivre logés dans des encoches. Quand le courant alternatif le traverse, il génère un champ magnétique tournant qui entraîne le rotor.",
    typical: '24 à 72 encoches pour un moteur standard',
    diagram: <MotorCrossSVG />, contexts: ['stator', 'rotor'],
  },
  {
    term: 'Rotor',
    definition: "Partie tournante du moteur placée à l'intérieur du stator. Le rotor bobiné possède des enroulements reliés à des bagues frottantes (rotor à bagues). La cage d'écureuil utilise des barres conductrices court-circuitées.",
    typical: 'Entrefer stator-rotor : 0,3 à 1,5 mm',
    diagram: <MotorCrossSVG />, contexts: ['rotor'],
  },
  {
    term: 'Encoche (Slot)', symbol: 'Z',
    definition: "Rainure rectangulaire ou trapézoïdale découpée dans les tôles du stator ou du rotor. Les conducteurs de cuivre y sont insérés et maintenus par des cales. Un grand nombre d'encoches améliore la sinusoïdalité du champ.",
    typical: 'Z = 24, 36, 48 pour moteur triphasé standard',
    formula: 'q = Z / (2p × m)  (encoches / pôle / phase)',
    diagram: <SlotSVG />, contexts: ['stator', 'rotor'],
  },
  {
    term: 'Spire',
    definition: "Un tour complet de conducteur de cuivre autour du noyau magnétique. L'ensemble des spires d'une même phase forme une bobine. Le nombre de spires N détermine directement la tension induite (loi de Faraday).",
    formula: 'N = V_phase / (4,44 × f × kw × Φm)',
    diagram: <CoilSVG />, contexts: ['stator', 'rotor', 'electrofrein'],
  },
  {
    term: 'Section du fil', symbol: 'S', unit: 'mm²',
    definition: "Aire de la section transversale du cuivre conducteur (sans l'émail isolant). Plus la section est grande, plus le fil peut conduire de courant avec moins de pertes. C'est la donnée principale pour choisir le fil de rebobinage.",
    formula: 'S = I / J   →   d = 1,128 × √S',
    typical: 'Moteurs : de 0,1 mm² (petits moteurs) à 10 mm² (gros moteurs)',
    diagram: <WireSVG />, contexts: ['stator', 'rotor', 'electrofrein'],
  },
  {
    term: 'Densité de courant', symbol: 'J', unit: 'A/mm²',
    definition: "Intensité du courant par unité de surface du conducteur. Une densité trop élevée provoque une surchauffe excessive par effet Joule (P = R×I²). On choisit J selon le refroidissement disponible et la durée de service.",
    formula: 'J = I / S',
    typical: 'Moteurs ventilés : 4–6 A/mm² | Bobines immergées : 2–3 A/mm² | Electrofrein : 3–5 A/mm²',
    diagram: <CurrentDensitySVG />, contexts: ['stator', 'rotor', 'electrofrein'],
  },
  {
    term: 'Couplage Étoile / Triangle',
    definition: "Mode de connexion des 3 bobinages d'un moteur triphasé. ÉTOILE (Y) : chaque bobinage reçoit la tension de phase V/√3 ≈ 220 V sur réseau 380 V. TRIANGLE (Δ) : chaque bobinage reçoit la pleine tension 380 V. Le choix change le nombre de spires nécessaires.",
    formula: 'Étoile : Vph = VL / √3 ≈ 220 V\nTriangle : Vph = VL = 380 V',
    diagram: <StarDeltaSVG />, contexts: ['stator', 'rotor'],
  },
  {
    term: 'Paires de pôles', symbol: 'p',
    definition: "Chaque bobinage crée un ensemble Nord-Sud (une paire de pôles). Le nombre de paires de pôles p détermine la vitesse de synchronisme : plus p est grand, plus le moteur tourne lentement. On compte p=1 pour 2 pôles, p=2 pour 4 pôles, etc.",
    formula: 'n_synchro = 60 × f / p  (tr/min)',
    typical: 'p=1 → 3000 tr/min | p=2 → 1500 | p=3 → 1000 | p=4 → 750',
    diagram: <PoleSVG />, contexts: ['stator', 'rotor'],
  },
  {
    term: 'Facteur de bobinage', symbol: 'kw',
    definition: "Coefficient (< 1) qui tient compte de la distribution des bobines dans les encoches et du raccourcissement du pas de bobinage. Il représente l'efficacité de l'enroulement réel par rapport à un bobinage concentré idéal.",
    formula: 'kw = kd × kp  (distribution × raccourcissement)',
    typical: 'Bobinage distribué 2 couches : 0,92 à 0,96 | Standard : 0,955',
    diagram: <FactorBobSVG />, contexts: ['stator', 'rotor'],
  },
  {
    term: "Longueur de paquet", symbol: 'L', unit: 'mm',
    definition: "Dimension axiale (dans l'axe de l'arbre) du noyau magnétique en tôles feuilletées. Cette longueur, avec le diamètre d'alésage, détermine la section active utile pour le flux magnétique et donc la puissance développée.",
    diagram: <PackageSVG />, contexts: ['stator', 'rotor'],
  },
  {
    term: "Diamètre d'alésage", symbol: 'D', unit: 'mm',
    definition: "Diamètre intérieur du stator, mesuré à l'intérieur des encoches. Se mesure avec un pied à coulisse ou un palmer sur le stator démonté. Le diamètre extérieur du rotor est légèrement inférieur (entrefer 0,3–1,5 mm).",
    diagram: <BoreSVG />, contexts: ['stator', 'rotor'],
  },
  {
    term: "Induction magnétique", symbol: 'Bav', unit: 'Tesla (T)',
    definition: "Densité de flux magnétique dans l'entrefer. Trop faible : le moteur est sous-utilisé. Trop élevée : saturation des tôles et pertes fer élevées. On la choisit selon les tôles magnétiques utilisées.",
    typical: 'Moteurs asynchrones : 0,60 à 0,85 T | Moteurs DC : 0,75 à 1,0 T',
    diagram: <PoleSVG />, contexts: ['stator', 'rotor'],
  },
  {
    term: 'Électrofrein — Alimentation DC',
    definition: "Mode d'alimentation le plus courant. La bobine fonctionne en courant continu (DC). Sur un réseau AC monophasé ou biphasé, un pont de diodes externe redresse la tension avant d'alimenter la bobine. Tensions courantes : 24 V, 48 V, 110 V, 180 V DC (obtenues par redressement du secteur 220 V ou via 2 phases du 380 V). La bobine est purement résistive : R = V_dc / I_dc.",
    formula: 'R = V_dc / I_dc\nP = V_dc × I_dc\nS_fil = √(ρ × kf × A_bob × l_moy / R)',
    typical: '24 V DC (rectifié depuis 24 V AC) | 48 V DC | 110 V DC | 180 V DC (depuis 230 V AC) | 380 V DC (pont 2 phases)',
    diagram: <ElectrofreinSVG />, contexts: ['electrofrein'],
  },
  {
    term: 'Électrofrein — Alimentation AC 3 phases',
    definition: "Certains électrofreins sont conçus pour être alimentés directement sur le réseau triphasé 380 V sans pont de diodes. La bobine est dimensionnée pour fonctionner en courant alternatif : elle présente une impédance Z = R + jX. La résistance R dissipe l'énergie (effet Joule) et la réactance X est due à l'inductance de la bobine. Le fil est dimensionné sur la résistance de phase R = Z × cos φ. Il n'y a aucun redressement : la bobine est reliée directement entre deux ou trois phases.",
    formula: 'Z = V_phase / I_phase  (Ω)\nR = Z × cos φ  (résistance active)\nX = Z × sin φ  (réactance inductive)\nL = X / (2π × f)  (Henry)',
    typical: 'V_phase = 380 / √3 ≈ 219 V | cos φ ≈ 0,80 à 0,90 | f = 50 Hz',
    diagram: <ACThreePhaseSVG />, contexts: ['electrofrein'],
  },
  {
    term: 'Pont de diodes (redresseur)',
    definition: "Circuit électronique composé de 4 diodes (pont de Graetz) qui transforme une tension alternative AC en tension continue DC. Indispensable pour alimenter une bobine d'électrofrein DC depuis le réseau AC. Il se monte en externe entre le réseau secteur et les bornes de la bobine. Pour un réseau triphasé, on utilise un pont à 6 diodes (pont de Graetz triphasé). La tension DC obtenue est proportionnelle à la tension AC d'entrée.",
    formula: 'Monophasé : V_dc ≈ 0,9 × V_ac\n2 phases 380V : V_dc ≈ 0,9 × 380 ≈ 342 V\n3 phases : V_dc = V_ligne × 3√2/π ≈ 1,35 × V_ligne',
    typical: 'Courant : selon puissance bobine | Tension inverse : > 2× V_dc | PIV ≥ 800 V pour réseau 380 V',
    diagram: <DiodeBridgeSVG />, contexts: ['electrofrein'],
  },
  {
    term: 'Diamètre intérieur', symbol: 'Di', unit: 'mm',
    definition: "Diamètre intérieur du bobineau de l'électrofrein. Il correspond au diamètre du noyau central (mandrin) autour duquel le fil de cuivre est bobiné. C'est le diamètre minimum de l'espace de bobinage. Il se mesure à l'intérieur de la gorge d'enroulement avec un pied à coulisse.",
    formula: 'A_bobinage = ((De - Di) / 2) × h  (mm²)',
    typical: 'Petits électrofreins : 20–40 mm | Moyens : 40–80 mm | Grands : 80–150 mm',
    diagram: <CoilDimensionsSVG />, contexts: ['electrofrein'],
  },
  {
    term: 'Diamètre extérieur', symbol: 'De', unit: 'mm',
    definition: "Diamètre extérieur du bobineau de l'électrofrein. Il définit la limite radiale maximale de l'enroulement. La différence (De − Di) donne la largeur radiale disponible pour le cuivre. Plus cette différence est grande, plus on peut loger de fil.",
    formula: 'Largeur radiale = (De - Di) / 2\nA_bobinage = ((De - Di) / 2) × h',
    typical: 'Ratio De/Di courant : 1,5 à 2,5 | Bobinage serré : De/Di ≈ 2',
    diagram: <CoilDimensionsSVG />, contexts: ['electrofrein'],
  },
  {
    term: 'Hauteur du bobineau', symbol: 'h', unit: 'mm',
    definition: "Hauteur axiale du bobineau de l'électrofrein, mesurée dans l'axe de la bobine. Avec le diamètre intérieur et extérieur, elle détermine la section disponible pour le bobinage (A_bobinage). C'est la troisième cote indispensable pour calculer le nombre de spires.",
    formula: 'A_bobinage = ((De - Di) / 2) × h  (mm²)\nN = A_bob × kf / (π × d²/4)',
    typical: 'Hauteur courante : 15 à 60 mm | Bobines plates : h < Di/4',
    diagram: <CoilDimensionsSVG />, contexts: ['electrofrein'],
  },
  {
    term: 'Facteur de remplissage', symbol: 'kf',
    definition: "Rapport entre la section totale de cuivre et la section disponible dans l'espace de bobinage. Un fil rond laisse des interstices ; l'émail isolant occupe aussi de l'espace. kf tient compte de ces deux effets.",
    formula: 'kf = (N × π × d²/4) / A_bobinage',
    typical: 'Machine automatique : 0,65–0,75 | Bobinage manuel : 0,55–0,65',
    diagram: <FillFactorSVG />, contexts: ['electrofrein'],
  },
  {
    photoFigure: true,
    term: 'Électrofrein — Carcasse et bobine (vue éclatée)',
    definition: "Vue éclatée d'un électrofrein réel montrant ses 3 composants principaux :\n\n• Carcasse magnétique (fonte) : corps annulaire en fonte grise, usiné avec précision. Elle referme le circuit magnétique et sert de support mécanique. Les encoches radiales forment les pôles magnétiques. On mesure Di (diamètre intérieur de la gorge) et De (diamètre extérieur) directement sur cette pièce au pied à coulisse.\n\n• Bobine cuivre (bobineau) : enroulement de fil de cuivre émaillé bobiné dans la gorge annulaire. Visible en orange dans les encoches de la carcasse du milieu. La hauteur h se mesure axialement, Di et De radialement dans la gorge.\n\n• Spires de rechange (bas) : bobines de fil de cuivre prêtes à l'emploi pour le rebobinage. Le nombre de spires N et le diamètre de fil d se calculent à partir de Di, De, h et du facteur de remplissage kf.",
    formula: 'A_bobinage = ((De - Di) / 2) × h\nN = (A_bob × kf) / (π × d² / 4)',
    typical: 'Di : 30–120 mm | De : 60–200 mm | h : 15–60 mm | kf : 0,55–0,75',
    diagram: <img src="/images/ChatGPT_Image_21_fevr._2026,_23_51_24.png" alt="Électrofrein éclaté — carcasse, bobine, spires" className="w-full h-full object-contain rounded-lg" />,
    contexts: ['electrofrein'],
  },
  {
    photoFigure: true,
    term: 'Électrofrein — Bobinage en place (vue 3D)',
    definition: "Vues 3D d'un électrofrein assemblé montrant les différentes perspectives pour la prise de mesures :\n\n• Vue du dessus (haut) : électrofrein complet avec câbles de sortie. On voit les bobines cuivre logées dans les encoches de la carcasse. Pour mesurer De, placer le pied à coulisse sur le diamètre extérieur de la gorge visible.\n\n• Vue en coupe (milieu) : coupe transversale révélant la profondeur de l'enroulement. Les fils cuivre (orange) sont nettement visibles. La hauteur h se mesure de l'épaulement inférieur au bord supérieur de la gorge. L'isolant vert (ruban kapton) protège la bobine.\n\n• Vue de dessous (bas) : face opposée montrant l'accès à la gorge vide pour mesurer Di. Placer les mâchoires intérieures du pied à coulisse dans l'alésage central pour relever Di avec précision.",
    formula: 'R_bobine = ρ_Cu × l_moy × N / S_fil\nl_moy = π × (Di + De) / 2\nP_bobine = V² / R',
    typical: 'Résistivité Cu : ρ = 0,0175 Ω·mm²/m | T° max bobine : 130–180 °C (classe F/H)',
    diagram: <img src="/images/ChatGPT_Image_22_fevr._2026,_00_00_00.png" alt="Électrofrein bobinage en place — vues 3D" className="w-full h-full object-contain rounded-lg" />,
    contexts: ['electrofrein'],
  },
];

interface Props {
  context: Context;
}

export default function GlossarySection({ context }: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const relevant = ENTRIES.filter(e => e.contexts.includes(context));

  return (
    <div className="mt-6 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-800 hover:bg-slate-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <div className="text-left">
            <p className="text-sm font-bold text-white">Notes et Lexique Technique</p>
            <p className="text-xs text-slate-400">Définitions illustrées — {relevant.length} termes</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
      </button>

      {open && (
        <div className="bg-white p-5 space-y-3">
          <p className="text-xs text-slate-500 mb-4">Cliquez sur un terme pour voir sa définition et son schéma.</p>
          {relevant.map(entry => {
            const isExp = expanded === entry.term;
            return (
              <div key={entry.term} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpanded(isExp ? null : entry.term)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${isExp ? 'bg-cyan-50 border-b border-cyan-200' : 'bg-slate-50 hover:bg-slate-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isExp ? 'bg-cyan-500' : 'bg-slate-300'}`}/>
                    <span className={`font-semibold text-sm ${isExp ? 'text-cyan-700' : 'text-slate-800'}`}>{entry.term}</span>
                    {entry.symbol && (
                      <span className="text-xs px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 font-mono">
                        {entry.symbol}{entry.unit ? ` (${entry.unit})` : ''}
                      </span>
                    )}
                  </div>
                  {isExp ? <ChevronUp className="w-4 h-4 text-cyan-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                </button>

                {isExp && (
                  entry.photoFigure ? (
                    <div className="p-4 space-y-4">
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{entry.definition}</p>
                      {entry.formula && (
                        <div className="bg-slate-900 rounded-lg px-4 py-3">
                          <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Formules</p>
                          <p className="text-sm font-mono text-cyan-300 whitespace-pre-line">{entry.formula}</p>
                        </div>
                      )}
                      {entry.typical && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                          <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-0.5">Valeurs typiques</p>
                          <p className="text-xs text-amber-800">{entry.typical}</p>
                        </div>
                      )}
                      <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 flex justify-center">
                        <div className="w-full max-w-md">
                          {entry.diagram}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 text-center italic">Figure — {entry.term}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="p-4 space-y-3">
                        <p className="text-sm text-slate-700 leading-relaxed">{entry.definition}</p>
                        {entry.formula && (
                          <div className="bg-slate-900 rounded-lg px-4 py-3">
                            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Formule</p>
                            <p className="text-sm font-mono text-cyan-300 whitespace-pre-line">{entry.formula}</p>
                          </div>
                        )}
                        {entry.typical && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                            <p className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-0.5">Valeurs typiques</p>
                            <p className="text-xs text-amber-800">{entry.typical}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-center p-4 bg-slate-50 border-l border-slate-100 min-h-[180px]">
                        <div className="w-full max-w-[220px] aspect-square">
                          {entry.diagram}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
