import { describeVibe } from '../lib/vibe';

export default function VibeSlider({ value, onChange }) {
  const { label } = describeVibe(value);

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between font-mono text-xs uppercase tracking-[0.2em]">
        <span className="text-mist">Vibe level</span>
        <span className="text-runway">
          {String(value).padStart(3, '0')} / {label}
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        step="1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="vibe-range"
        aria-label={`Vibe level: ${value} out of 100, ${label}`}
      />

      <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-mist/70">
        <span>◦ mellow</span>
        <span>full send ◦</span>
      </div>
    </div>
  );
}
