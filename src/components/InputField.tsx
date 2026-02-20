interface Props {
  label: string;
  unit?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}

export default function InputField({ label, unit, value, onChange, min, max, step = 'any', hint }: Props & { step?: number | 'any' }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">
        {label}
        {unit && <span className="ml-1 text-slate-400 normal-case font-normal">({unit})</span>}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm font-medium
            focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent
            hover:border-slate-300 transition-colors"
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-slate-400 italic">{hint}</p>}
    </div>
  );
}
