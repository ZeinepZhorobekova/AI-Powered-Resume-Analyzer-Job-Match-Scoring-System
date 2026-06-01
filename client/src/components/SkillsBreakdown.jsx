function SkillBadge({ label, variant }) {
  const styles = {
    matched: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    missing: 'bg-red-50 text-red-700 border border-red-200',
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${styles[variant]}`}>
      {label}
    </span>
  );
}

export default function SkillsBreakdown({ matchedSkills = [], missingSkills = [] }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          Matched Skills ({matchedSkills.length})
        </h3>
        {matchedSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((s) => <SkillBadge key={s} label={s} variant="matched" />)}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No matched skills detected</p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
          Missing Skills ({missingSkills.length})
        </h3>
        {missingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((s) => <SkillBadge key={s} label={s} variant="missing" />)}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No skill gaps detected — great match!</p>
        )}
      </div>
    </div>
  );
}
