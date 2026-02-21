import { Settings, RotateCw, Magnet, Table, Gauge } from 'lucide-react';

export type TabId = 'stator' | 'rotor' | 'electrofrein' | 'mesure' | 'table';

interface Tab {
  id: TabId;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: Tab[] = [
  { id: 'stator',       label: 'Bobine Stator',     sublabel: 'Stator',   icon: Settings  },
  { id: 'rotor',        label: 'Bobine Rotor',      sublabel: 'Rotor',    icon: RotateCw  },
  { id: 'electrofrein', label: 'Électrofrein',      sublabel: 'Frein',    icon: Magnet    },
  { id: 'mesure',       label: 'Mesure Résistance', sublabel: 'Mesure',   icon: Gauge     },
  { id: 'table',        label: 'Table des Fils',    sublabel: 'Table',    icon: Table     },
];

interface Props {
  active: TabId;
  onChange: (id: TabId) => void;
}

export default function TabNav({ active, onChange }: Props) {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex overflow-x-auto gap-1 py-2">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="hidden sm:block">{tab.label}</span>
                <span className="sm:hidden">{tab.sublabel}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
