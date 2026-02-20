import { Calculator } from 'lucide-react';

interface Props {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export default function CalculateButton({ onClick, disabled, label = 'Calculer' }: Props) {
  return (
    <div className="flex justify-center pt-2">
      <button
        onClick={onClick}
        disabled={disabled}
        className="inline-flex items-center gap-3 px-10 py-4 bg-cyan-500 hover:bg-cyan-600
          active:bg-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed
          text-white font-bold text-base rounded-2xl
          shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50
          transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
      >
        <Calculator className="w-5 h-5" />
        {label}
      </button>
    </div>
  );
}
