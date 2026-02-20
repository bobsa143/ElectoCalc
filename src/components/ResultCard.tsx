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
  cyan:  { header: 'bg-cyan-500',  dot: 'bg-cyan-500',  badge: 'bg-cyan-50 text-cyan-700 ring-cyan-200' },
  teal:  { header: 'bg-teal-500',  dot: 'bg-teal-500',  badge: 'bg-teal-50 text-teal-700 ring-teal-200' },
  amber: { header: 'bg-amber-500', dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 ring-amber-200' },
  rose:  { header: 'bg-rose-500',  dot: 'bg-rose-500',  badge: 'bg-rose-50 text-rose-700 ring-rose-200' },
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
            <div className={`flex items-center gap-1.5 ${item.warning ? 'text-amber-600' : ''}`}>
              <span className={`text-sm font-bold ${item.highlight ? 'text-cyan-700 text-base' : item.warning ? 'text-amber-600' : 'text-slate-900'}`}>
                {typeof item.value === 'number' ? item.value.toLocaleString('fr-FR', { maximumFractionDigits: 4 }) : item.value}
              </span>
              {item.unit && (
                <span className={`text-xs font-medium ${item.highlight ? c.badge.split(' ').slice(1).join(' ') : 'text-slate-400'}`}>
                  {item.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
