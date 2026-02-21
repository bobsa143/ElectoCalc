interface ResultItem {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
  warning?: boolean;
}

interface Props {
  title: string;
  icon: React.ReactNode;
  items: ResultItem[];
  color?: 'cyan' | 'teal' | 'amber' | 'rose';
}

const colorMap = {
  cyan:  { header: 'bg-cyan-500',  dot: 'bg-cyan-500'  },
  teal:  { header: 'bg-teal-500',  dot: 'bg-teal-500'  },
  amber: { header: 'bg-amber-500', dot: 'bg-amber-500' },
  rose:  { header: 'bg-rose-500',  dot: 'bg-rose-500'  },
};

export default function ResultCard({ title, icon, items, color = 'cyan' }: Props) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className={`${c.header} px-4 py-3 flex items-center gap-2.5`}>
        <div className="text-white">{icon}</div>
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide">{title}</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {items.map((item, i) => (
          <div key={i} className={`flex items-center justify-between px-4 py-3 ${item.highlight ? 'bg-cyan-50' : ''}`}>
            <div className="flex items-center gap-2">
              {item.highlight && <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />}
              <span className={`text-sm ${item.highlight ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>
                {item.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-bold ${item.highlight ? 'text-cyan-700 text-base' : item.warning ? 'text-amber-600' : 'text-slate-900'}`}>
                {typeof item.value === 'number' ? item.value.toLocaleString('fr-FR', { maximumFractionDigits: 4 }) : item.value}
              </span>
              {item.unit && (
                <span className="text-xs font-medium text-slate-400">{item.unit}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
