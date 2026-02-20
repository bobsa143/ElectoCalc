interface Option<T extends string | number> {
  value: T;
  label: string;
}

interface Props<T extends string | number> {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
  hint?: string;
}

export default function SelectField<T extends string | number>({ label, value, options, onChange, hint }: Props<T>) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
        {label}
      </label>
      <select
        value={value}
        onChange={e => {
          const raw = e.target.value;
          const parsed = isNaN(Number(raw)) ? raw : Number(raw);
          onChange(parsed as T);
        }}
        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm font-medium
          focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
          hover:border-slate-300 transition-colors appearance-none cursor-pointer"
      >
        {options.map(o => (
          <option key={String(o.value)} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hint && <p className="text-xs text-slate-400 italic">{hint}</p>}
    </div>
  );
}
