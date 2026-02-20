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
}

const MotorCrossSectionSVG = () => (
  <svg viewBox="0 0 220 220" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <circle cx="110" cy="110" r="100" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2"/>
    <circle cx="110" cy="110" r="80" fill="#ffffff" stroke="#64748b" strokeWidth="1.5"/>
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 15 - 90) * Math.PI / 180;
      const cx = 110 + 80 * Math.cos(angle);
      const cy = 110 + 80 * Math.sin(angle);
      const rx = 110 + 95 * Math.cos(angle);
      const ry = 110 + 95 * Math.sin(angle);
      const fill = i % 3 === 0 ? '#0ea5e9' : i % 3 === 1 ? '#f97316' : '#22c55e';
      return (
        <g key={i}>
          <rect
            x={cx - 4} y={cy - 8} width="8" height="16"
            fill={fill} opacity="0.85" rx="1"
            transform={`rotate(${i * 15} ${cx} ${cy})`}
          />
        </g>
      );
    })}
    <circle cx="110" cy="110" r="58" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 22.5 - 90) * Math.PI / 180;
      const cx = 110 + 58 * Math.cos(angle);
      const cy = 110 + 58 * Math.sin(angle);
      return (
        <rect key={i} x={cx - 3} y={cy - 6} width="6" height="12"
          fill="#93c5fd" rx="1"
          transform={`rotate(${i * 22.5} ${cx} ${cy})`}
        />
      );
    })}
    <circle cx="110" cy="110" r="18" fill="#94a3b8" stroke="#475569" strokeWidth="2"/>
    <circle cx="110" cy="110" r="8" fill="#64748b"/>
    <text x="110" y="18" textAnchor="middle" fontSize="9" fill="#0f172a" fontWeight="bold">STATOR</text>
    <text x="110" y="122" textAnchor="middle" fontSize="8" fill="#1d4ed8" fontWeight="bold">ROTOR</text>
    <text x="110" y="115" textAnchor="middle" fontSize="7" fill="#64748b">Arbre</text>
    <line x1="110" y1="22" x2="110" y2="32" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#arr)"/>
    <line x1="165" y1="110" x2="175" y2="110" stroke="#0f172a" strokeWidth="1"/>
    <text x="177" y="114" fontSize="8" fill="#0f172a">Carcasse</text>
    <line x1="155" y1="80" x2="175" y2="65" stroke="#0ea5e9" strokeWidth="1"/>
    <text x="177" y="64" fontSize="8" fill="#0ea5e9">Encoches</text>
    <line x1="110" y1="50" x2="130" y2="40" stroke="#3b82f6" strokeWidth="1"/>
    <text x="132" y="44" fontSize="8" fill="#3b82f6">Entrefer</text>
  </svg>
);

const SlotWiresSVG = () => (
  <svg viewBox="0 0 180 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="10" width="120" height="180" fill="#e2e8f0" rx="4" stroke="#94a3b8" strokeWidth="2"/>
    <rect x="50" y="25" width="80" height="150" fill="#fff" rx="3" stroke="#64748b" strokeWidth="1.5"/>
    {Array.from({ length: 6 }).map((_, row) =>
      Array.from({ length: 4 }).map((_, col) => (
        <circle key={`${row}-${col}`}
          cx={65 + col * 18} cy={42 + row * 22}
          r="7" fill={row < 3 ? '#0ea5e9' : '#f97316'}
          stroke={row < 3 ? '#0369a1' : '#c2410c'} strokeWidth="1.5"
        />
      ))
    )}
    <line x1="50" y1="113" x2="130" y2="113" stroke="#64748b" strokeWidth="1" strokeDasharray="4,2"/>
    <text x="135" y="116" fontSize="9" fill="#64748b">Séparation</text>
    <text x="135" y="105" fontSize="9" fill="#0369a1">Couche 1</text>
    <text x="135" y="127" fontSize="9" fill="#c2410c">Couche 2</text>
    <text x="90" y="196" textAnchor="middle" fontSize="10" fill="#0f172a" fontWeight="bold">Encoche (vue section)</text>
    <text x="90" y="8" textAnchor="middle" fontSize="8" fill="#475569">Spires de cuivre dans l'encoche</text>
  </svg>
);

const WireSectionSVG = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="20" width="180" height="120" fill="#f8fafc" rx="8" stroke="#e2e8f0" strokeWidth="1"/>
    {[0,1,2,3,4].map(row =>
      [0,1,2,3,4].map(col => (
        <g key={`${row}-${col}`}>
          <circle cx={28 + col * 30} cy={38 + row * 20} r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
          <circle cx={28 + col * 30} cy={38 + row * 20} r="5" fill="#f59e0b"/>
          <circle cx={28 + col * 30} cy={38 + row * 20} r="2" fill="#fef3c7"/>
        </g>
      ))
    )}
    <line x1="110" y1="100" x2="140" y2="80" stroke="#dc2626" strokeWidth="1.5"/>
    <line x1="138" y1="48" x2="158" y2="48" stroke="#000" strokeWidth="1.5" markerEnd="url(#arr)"/>
    <line x1="138" y1="48" x2="138" y2="38" stroke="#64748b" strokeWidth="1"/>
    <line x1="138" y1="58" x2="138" y2="48" stroke="#64748b" strokeWidth="1"/>
    <text x="163" y="52" fontSize="9" fill="#0f172a">d</text>
    <text x="143" y="80" fontSize="8" fill="#dc2626">S = π×d²/4</text>
    <text x="100" y="150" textAnchor="middle" fontSize="9" fill="#475569" fontWeight="bold">Fils de cuivre émaillés (vue transversale)</text>
  </svg>
);

const StarDeltaSVG = () => (
  <svg viewBox="0 0 280 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <text x="65" y="18" textAnchor="middle" fontSize="11" fill="#0f172a" fontWeight="bold">Étoile (Y)</text>
    <line x1="65" y1="55" x2="65" y2="95" stroke="#0ea5e9" strokeWidth="2.5"/>
    <line x1="65" y1="95" x2="30" y2="145" stroke="#f97316" strokeWidth="2.5"/>
    <line x1="65" y1="95" x2="100" y2="145" stroke="#22c55e" strokeWidth="2.5"/>
    <line x1="65" y1="95" x2="65" y2="160" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,3"/>
    <circle cx="65" cy="95" r="5" fill="#0f172a"/>
    <circle cx="65" cy="55" r="5" fill="#0ea5e9"/>
    <circle cx="30" cy="145" r="5" fill="#f97316"/>
    <circle cx="100" cy="145" r="5" fill="#22c55e"/>
    <text x="73" y="50" fontSize="9" fill="#0ea5e9">L1</text>
    <text x="12" y="150" fontSize="9" fill="#f97316">L2</text>
    <text x="104" y="150" fontSize="9" fill="#22c55e">L3</text>
    <text x="73" y="165" fontSize="9" fill="#64748b">N</text>

    <text x="215" y="18" textAnchor="middle" fontSize="11" fill="#0f172a" fontWeight="bold">Triangle (Δ)</text>
    <line x1="215" y1="45" x2="170" y2="145" stroke="#0ea5e9" strokeWidth="2.5"/>
    <line x1="215" y1="45" x2="260" y2="145" stroke="#22c55e" strokeWidth="2.5"/>
    <line x1="170" y1="145" x2="260" y2="145" stroke="#f97316" strokeWidth="2.5"/>
    <circle cx="215" cy="45" r="5" fill="#0ea5e9"/>
    <circle cx="170" cy="145" r="5" fill="#f97316"/>
    <circle cx="260" cy="145" r="5" fill="#22c55e"/>
    <text x="220" y="42" fontSize="9" fill="#0ea5e9">L1</text>
    <text x="153" y="157" fontSize="9" fill="#f97316">L2</text>
    <text x="263" y="157" fontSize="9" fill="#22c55e">L3</text>
    <text x="198" y="100" fontSize="8" fill="#0369a1">V_bobine</text>
    <text x="198" y="110" fontSize="8" fill="#0369a1">= V_réseau</text>

    <line x1="140" y1="10" x2="140" y2="190" stroke="#e2e8f0" strokeWidth="1.5"/>
  </svg>
);

const PolePairSVG = () => (
  <svg viewBox="0 0 220 180" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <circle cx="110" cy="95" r="75" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2"/>
    <circle cx="110" cy="95" r="45" fill="#ffffff" stroke="#64748b" strokeWidth="1.5"/>
    <path d="M 110 20 A 75 75 0 0 1 185 95 A 75 75 0 0 1 110 20" fill="#fecaca" stroke="#ef4444" strokeWidth="1"/>
    <path d="M 110 170 A 75 75 0 0 1 35 95 A 75 75 0 0 1 110 170" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1"/>
    <text x="145" y="60" fontSize="14" fill="#dc2626" fontWeight="bold">N</text>
    <text x="65" y="140" fontSize="14" fill="#2563eb" fontWeight="bold">S</text>
    <text x="110" y="12" textAnchor="middle" fontSize="9" fill="#dc2626">Pôle Nord</text>
    <text x="110" y="178" textAnchor="middle" fontSize="9" fill="#2563eb">Pôle Sud</text>
    <text x="110" y="99" textAnchor="middle" fontSize="8" fill="#475569">p = 1</text>
    <text x="110" y="109" textAnchor="middle" fontSize="8" fill="#475569">2 pôles</text>
    <line x1="35" y1="95" x2="185" y2="95" stroke="#64748b" strokeWidth="1" strokeDasharray="4,3"/>
  </svg>
);

const CoilDiagramSVG = () => (
  <svg viewBox="0 0 240 180" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    {[0,1,2,3,4,5].map(i => (
      <g key={i}>
        <rect x={30 + i * 28} y="30" width="16" height="120" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" rx="3"/>
        <ellipse cx={38 + i * 28} cy="30" rx="8" ry="4" fill="#fcd34d" stroke="#d97706" strokeWidth="1"/>
        <ellipse cx={38 + i * 28} cy="150" rx="8" ry="4" fill="#fcd34d" stroke="#d97706" strokeWidth="1"/>
      </g>
    ))}
    <path d="M 38 150 Q 38 170 66 170 Q 94 170 94 150" fill="none" stroke="#d97706" strokeWidth="2.5"/>
    <path d="M 122 150 Q 122 170 150 170 Q 178 170 178 150" fill="none" stroke="#d97706" strokeWidth="2.5"/>
    <path d="M 38 30 Q 38 10 66 10 Q 94 10 94 30" fill="none" stroke="#d97706" strokeWidth="2.5"/>
    <path d="M 122 30 Q 122 10 150 10 Q 178 10 178 30" fill="none" stroke="#d97706" strokeWidth="2.5"/>
    <text x="120" y="100" textAnchor="middle" fontSize="10" fill="#0f172a">6 spires</text>
    <line x1="30" y1="95" x2="25" y2="95" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#arr)"/>
    <text x="5" y="99" fontSize="8" fill="#0f172a" fontWeight="bold">I</text>
    <line x1="202" y1="95" x2="210" y2="95" stroke="#0f172a" strokeWidth="1.5"/>
    <text x="213" y="99" fontSize="8" fill="#0f172a">I</text>
  </svg>
);

const CurrentDensitySVG = () => (
  <svg viewBox="0 0 200 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="80" r="60" fill="#fef9c3" stroke="#ca8a04" strokeWidth="2.5"/>
    <circle cx="100" cy="80" r="55" fill="#fef08a" stroke="none"/>
    <circle cx="100" cy="80" r="35" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
    <circle cx="100" cy="80" r="18" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5"/>
    {[[-25,-25],[0,-30],[25,-25],[30,0],[25,25],[0,30],[-25,25],[-30,0]].map(([dx, dy], i) => (
      <line key={i} x1={100 + dx * 0.5} y1={80 + dy * 0.5} x2={100 + dx} y2={80 + dy}
        stroke="#0f172a" strokeWidth="1.5"
        markerEnd="url(#dot)"
      />
    ))}
    {[[0,0],[12,10],[-10,12],[8,-14],[-15,5],[5,15],[-8,-10],[14,-5]].map(([dx, dy], i) => (
      <circle key={i} cx={100 + dx} cy={80 + dy} r="2" fill="#1e3a5f"/>
    ))}
    <text x="100" y="157" textAnchor="middle" fontSize="9" fill="#0f172a" fontWeight="bold">J = I / S (A/mm²)</text>
    <text x="100" y="145" textAnchor="middle" fontSize="8" fill="#475569">Répartition du courant</text>
    <line x1="100" y1="20" x2="100" y2="140" stroke="#dc2626" strokeWidth="1" strokeDasharray="3,2" opacity="0.4"/>
    <line x1="40" y1="80" x2="160" y2="80" stroke="#dc2626" strokeWidth="1" strokeDasharray="3,2" opacity="0.4"/>
    <text x="168" y="84" fontSize="8" fill="#dc2626">d</text>
    <line x1="100" y1="80" x2="155" y2="80" stroke="#dc2626" strokeWidth="1.5"/>
  </svg>
);

const WindingFactorSVG = () => (
  <svg viewBox="0 0 240 180" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="80" width="220" height="30" fill="#e2e8f0" rx="4" stroke="#94a3b8" strokeWidth="1.5"/>
    {Array.from({length: 12}).map((_, i) => (
      <g key={i}>
        <rect x={15 + i * 18} y="30" width="10" height="80" fill={i < 4 ? '#0ea5e9' : i < 8 ? '#f97316' : '#22c55e'} rx="2" opacity="0.8"/>
        <text x={20 + i * 18} y="27" textAnchor="middle" fontSize="7" fill="#475569">{i + 1}</text>
      </g>
    ))}
    <path d="M 20 120 Q 65 155 115 120" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeDasharray="5,3"/>
    <text x="65" y="172" textAnchor="middle" fontSize="8" fill="#0ea5e9">Pas de bobine</text>
    <path d="M 20 120 Q 90 165 165 120" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,3"/>
    <text x="95" y="160" textAnchor="middle" fontSize="7" fill="#dc2626">Pas polaire</text>
    <text x="120" y="18" textAnchor="middle" fontSize="10" fill="#0f172a" fontWeight="bold">kw = 0.955 (distribué)</text>
  </svg>
);

const PackageLengthSVG = () => (
  <svg viewBox="0 0 220 180" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect x="60" y="30" width="100" height="120" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2" rx="4"/>
    {Array.from({length: 8}).map((_, i) => (
      <line key={i} x1="60" y1={30 + i * 17} x2="160" y2={30 + i * 17} stroke="#93c5fd" strokeWidth="1"/>
    ))}
    <ellipse cx="110" cy="30" rx="50" ry="15" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2"/>
    <ellipse cx="110" cy="150" rx="50" ry="15" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2"/>
    <circle cx="110" cy="30" r="20" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5"/>
    <circle cx="110" cy="150" r="20" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5"/>
    <circle cx="110" cy="30" r="8" fill="#64748b"/>
    <circle cx="110" cy="150" r="8" fill="#64748b"/>
    <line x1="170" y1="30" x2="200" y2="30" stroke="#0f172a" strokeWidth="1"/>
    <line x1="170" y1="150" x2="200" y2="150" stroke="#0f172a" strokeWidth="1"/>
    <line x1="188" y1="30" x2="188" y2="150" stroke="#0f172a" strokeWidth="1.5"/>
    <text x="205" y="93" fontSize="9" fill="#0f172a" fontWeight="bold">L</text>
    <text x="110" y="175" textAnchor="middle" fontSize="8" fill="#3b82f6">Longueur de paquet</text>
    <text x="110" y="0" textAnchor="middle" fontSize="8" fill="#475569">Tôles feuilletées empilées</text>
  </svg>
);

const BoreDiameterSVG = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="90" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2"/>
    <circle cx="100" cy="100" r="65" fill="#ffffff" stroke="#64748b" strokeWidth="1.5"/>
    <circle cx="100" cy="100" r="55" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="5,3"/>
    <circle cx="100" cy="100" r="18" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5"/>
    <line x1="100" y1="100" x2="155" y2="100" stroke="#dc2626" strokeWidth="2"/>
    <line x1="145" y1="94" x2="155" y2="100" stroke="#dc2626" strokeWidth="2"/>
    <line x1="145" y1="106" x2="155" y2="100" stroke="#dc2626" strokeWidth="2"/>
    <text x="118" y="96" fontSize="9" fill="#dc2626" fontWeight="bold">D/2</text>
    <text x="100" y="192" textAnchor="middle" fontSize="8" fill="#3b82f6">Alésage D = diamètre intérieur stator</text>
    <text x="100" y="12" textAnchor="middle" fontSize="9" fill="#0f172a" fontWeight="bold">Vue de face du stator</text>
  </svg>
);

const ElectrofreinSVG = () => (
  <svg viewBox="0 0 240 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="60" width="200" height="80" fill="#fef3c7" stroke="#d97706" strokeWidth="2" rx="8"/>
    <rect x="50" y="75" width="60" height="50" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" rx="4"/>
    {Array.from({length: 5}).map((_, i) => (
      <line key={i} x1="50" y1={80 + i * 10} x2="110" y2={80 + i * 10} stroke="#b45309" strokeWidth="0.8"/>
    ))}
    <text x="80" y="104" textAnchor="middle" fontSize="8" fill="#7c2d12" fontWeight="bold">Bobine</text>
    <rect x="130" y="75" width="70" height="50" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" rx="2"/>
    <text x="165" y="104" textAnchor="middle" fontSize="8" fill="#475569">Noyau Fe</text>
    <rect x="20" y="55" width="200" height="10" fill="#94a3b8" stroke="#64748b" strokeWidth="1" rx="2"/>
    <rect x="20" y="135" width="200" height="10" fill="#94a3b8" stroke="#64748b" strokeWidth="1" rx="2"/>
    <line x1="50" y1="45" x2="50" y2="55" stroke="#ef4444" strokeWidth="2"/>
    <line x1="80" y1="45" x2="80" y2="55" stroke="#1d4ed8" strokeWidth="2"/>
    <text x="50" y="42" textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="bold">+</text>
    <text x="80" y="42" textAnchor="middle" fontSize="9" fill="#1d4ed8" fontWeight="bold">−</text>
    <path d="M 165 40 Q 165 20 185 20 Q 200 20 200 35 L 200 145 Q 200 160 185 160 Q 165 160 165 145" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,2"/>
    <text x="208" y="97" fontSize="8" fill="#475569">Force</text>
    <text x="208" y="107" fontSize="8" fill="#475569">↑</text>
    <text x="120" y="185" textAnchor="middle" fontSize="8" fill="#0f172a" fontWeight="bold">Électrofrein — principe</text>
  </svg>
);

const FillFactorSVG = () => (
  <svg viewBox="0 0 200 180" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
    <rect x="40" y="20" width="120" height="140" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" rx="6"/>
    <rect x="52" y="32" width="96" height="116" fill="#fff" stroke="#cbd5e1" strokeWidth="1" rx="3"/>
    {Array.from({length: 5}).map((_, row) =>
      Array.from({length: 5}).map((_, col) => (
        <circle key={`${row}-${col}`}
          cx={63 + col * 17} cy={43 + row * 19}
          r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2"
        />
      ))
    )}
    {[[75,130],[95,125],[110,133]].map(([cx,cy], i) => (
      <circle key={i} cx={cx} cy={cy} r="5" fill="#fbbf24" stroke="#d97706" strokeWidth="1" opacity="0.5"/>
    ))}
    <rect x="40" y="20" width="120" height="140" fill="none" stroke="#d97706" strokeWidth="2.5" rx="6" strokeDasharray="6,3"/>
    <text x="100" y="172" textAnchor="middle" fontSize="8" fill="#0f172a" fontWeight="bold">kf = Surface fils / Surface totale</text>
    <text x="100" y="14" textAnchor="middle" fontSize="8" fill="#475569">Typique : kf = 0,60 à 0,70</text>
  </svg>
);

const ENTRIES: GlossaryEntry[] = [
  {
    term: 'Stator',
    definition: "Partie fixe du moteur électrique. Contient les bobinages de cuivre logés dans des encoches découpées dans les tôles. Lorsqu'un courant alternatif le traverse, il crée un champ magnétique tournant qui entraîne le rotor.",
    typical: '24 à 72 encoches pour un moteur standard',
    diagram: <MotorCrossSectionSVG />,
    contexts: ['stator', 'rotor'],
  },
  {
    term: 'Rotor',
    definition: "Partie tournante du moteur, placée à l'intérieur du stator. Le rotor bobiné possède des enroulements de cuivre reliés à des bagues frottantes. La cage d'écureuil utilise des barres en aluminium ou cuivre.",
    typical: 'Entrefer : 0,3 à 1,5 mm',
    diagram: <MotorCrossSectionSVG />,
    contexts: ['rotor'],
  },
  {
    term: 'Encoche (slot)',
    symbol: 'Z',
    definition: "Rainure découpée dans les tôles du stator ou du rotor. Les conducteurs de cuivre y sont enfoncés soigneusement. Plus il y a d'encoches, meilleure est la distribution du champ magnétique (moins d'harmoniques).",
    typical: 'Z = 24, 36, 48, 72 pour stator triphasé',
    diagram: <SlotWiresSVG />,
    contexts: ['stator', 'rotor'],
  },
  {
    term: 'Spire',
    definition: 'Un tour complet de fil de cuivre autour du noyau magnétique. Un bobinage est constitué de plusieurs spires. Le nombre de spires détermine la tension induite (loi de Faraday : e = N × dΦ/dt).',
    formula: 'N = V_phase / (4.44 × f × kw × Φm)',
    diagram: <CoilDiagramSVG />,
    contexts: ['stator', 'rotor', 'electrofrein'],
  },
  {
    term: 'Section du fil',
    symbol: 'S',
    unit: 'mm²',
    definition: "Aire de la section transversale du fil de cuivre conducteur (sans l'émail). Elle détermine la résistance du fil et sa capacité à conduire le courant. Plus la section est grande, moins la résistance est élevée et plus le fil peut porter de courant.",
    formula: 'S = I / J   puis   d = 1,128 × √S',
    diagram: <WireSectionSVG />,
    contexts: ['stator', 'rotor', 'electrofrein'],
  },
  {
    term: 'Densité de courant',
    symbol: 'J',
    unit: 'A/mm²',
    definition: "Courant électrique par unité de surface du conducteur. Une densité trop élevée provoque une surchauffe excessive (effet Joule). Pour les moteurs, on choisit J selon le refroidissement disponible.",
    formula: 'J = I / S',
    typical: 'Moteurs : 4–6 A/mm² (avec ventilation), 2–3 A/mm² (bobines immergées)',
    diagram: <CurrentDensitySVG />,
    contexts: ['stator', 'rotor', 'electrofrein'],
  },
  {
    term: 'Couplage Étoile / Triangle',
    definition: "Façon de connecter les trois bobinages d'un moteur triphasé. En ÉTOILE (Y) : les bobinages reçoivent V/√3 ≈ 220 V (sur réseau 380 V). En TRIANGLE (Δ) : les bobinages reçoivent la tension complète 380 V. Le couplage détermine le nombre de spires.",
    formula: 'Étoile : Vph = VL / √3 = 220 V\nTriangle : Vph = VL = 380 V',
    diagram: <StarDeltaSVG />,
    contexts: ['stator', 'rotor'],
  },
  {
    term: 'Paires de pôles',
    symbol: 'p',
    definition: "Chaque enroulement de phase crée 2 pôles (un Nord, un Sud). Le nombre de paires de pôles p détermine la vitesse de synchronisme. Chaque paire de pôles est formée par des bobines opposées.",
    formula: 'n_synchro = 60 × f / p  (tr/min)',
    typical: 'p=1 → 3000 tr/min | p=2 → 1500 | p=3 → 1000 | p=4 → 750',
    diagram: <PolePairSVG />,
    contexts: ['stator', 'rotor'],
  },
  {
    term: 'Facteur de bobinage',
    symbol: 'kw',
    definition: "Coefficient qui tient compte de la distribution des bobines dans les encoches et du raccourcissement du pas. Il représente le rapport entre la FEM réelle et la FEM théorique d'un bobinage concentré. Un facteur proche de 1 est idéal.",
    formula: 'kw = kd × kp  (distribution × pas)',
    typical: 'Bobinage distribué : 0,92 à 0,96 — Standard : 0,955',
    diagram: <WindingFactorSVG />,
    contexts: ['stator', 'rotor'],
  },
  {
    term: 'Longueur de paquet',
    symbol: 'L',
    unit: 'mm',
    definition: "Longueur axiale (dans l'axe de rotation) du paquet de tôles magnétiques. Cette dimension, combinée au diamètre d'alésage, détermine la surface utile pour le flux magnétique et donc la puissance du moteur.",
    diagram: <PackageLengthSVG />,
    contexts: ['stator', 'rotor'],
  },
  {
    term: "Diamètre d'alésage",
    symbol: 'D',
    unit: 'mm',
    definition: "Diamètre intérieur du stator, mesuré sur l'alésage qui accueille le rotor. C'est la mesure à prendre avec un pied à coulisse sur le stator démonté. L'entrefer (air entre stator et rotor) fait généralement 0,3 à 1,5 mm.",
    diagram: <BoreDiameterSVG />,
    contexts: ['stator', 'rotor'],
  },
  {
    term: 'Induction magnétique moyenne',
    symbol: 'Bav',
    unit: 'Tesla (T)',
    definition: "Valeur moyenne de l'induction dans l'entrefer. Elle caractérise la densité du flux magnétique utile. Une induction trop faible sous-utilise le fer ; trop élevée, elle sature le circuit magnétique et augmente les pertes.",
    typical: 'Moteurs asynchrones : 0,60 à 0,85 T',
    diagram: <PolePairSVG />,
    contexts: ['stator', 'rotor'],
  },
  {
    term: 'Électrofrein',
    definition: "Dispositif de freinage électromagnétique. Une bobine de cuivre alimentée en courant continu crée un champ magnétique qui attire un disque ou une plaque métallique, bloquant ainsi la rotation du moteur. Utilisé pour l'arrêt précis de machines.",
    typical: 'Alimentations : 24 V DC, 48 V DC, 110 V DC',
    diagram: <ElectrofreinSVG />,
    contexts: ['electrofrein'],
  },
  {
    term: 'Facteur de remplissage',
    symbol: 'kf',
    definition: "Rapport entre la section totale des conducteurs de cuivre et la section disponible dans le bobineau (espace de bobinage). Un fil rond laisse toujours des espaces vides ; kf tient compte de ces interstices et de l'épaisseur d'émail.",
    formula: 'kf = (N × π × d²/4) / A_bobinage',
    typical: 'Fil rond machine : 0,60 à 0,70 — Manuel : 0,55 à 0,65',
    diagram: <FillFactorSVG />,
    contexts: ['electrofrein'],
  },
];

interface Props {
  context: Context;
}

export default function GlossarySection({ context }: Props) {
  const [open, setOpen] = useState(false);
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

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
            <p className="text-sm font-bold text-white">Notes & Lexique Technique</p>
            <p className="text-xs text-slate-400">Explication des termes utilisés dans ce calculateur ({relevant.length} définitions)</p>
          </div>
        </div>
        {open
          ? <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
          : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
        }
      </button>

      {open && (
        <div className="bg-white p-5 space-y-3">
          <p className="text-xs text-slate-500 mb-4">
            Cliquez sur un terme pour afficher son explication détaillée et son schéma.
          </p>

          <div className="grid grid-cols-1 gap-3">
            {relevant.map(entry => {
              const isExpanded = expandedTerm === entry.term;
              return (
                <div key={entry.term} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedTerm(isExpanded ? null : entry.term)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                      isExpanded ? 'bg-cyan-50 border-b border-cyan-200' : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isExpanded ? 'bg-cyan-500' : 'bg-slate-300'}`}/>
                      <span className={`font-semibold text-sm ${isExpanded ? 'text-cyan-700' : 'text-slate-800'}`}>
                        {entry.term}
                      </span>
                      {entry.symbol && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 font-mono">
                          {entry.symbol}{entry.unit ? ` (${entry.unit})` : ''}
                        </span>
                      )}
                    </div>
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    }
                  </button>

                  {isExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
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
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
