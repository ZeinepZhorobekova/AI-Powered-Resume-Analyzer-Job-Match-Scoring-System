export default function JobDescriptionInput({ value, onChange }) {
  const charCount = value.length;
  const minChars = 50;

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        Job Description
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job description here — the more detail, the more accurate the analysis..."
        rows={10}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none transition"
      />
      <p className={`text-xs mt-1 text-right ${charCount < minChars ? 'text-amber-500' : 'text-slate-400'}`}>
        {charCount < minChars ? `${minChars - charCount} more characters needed` : `${charCount} characters`}
      </p>
    </div>
  );
}
