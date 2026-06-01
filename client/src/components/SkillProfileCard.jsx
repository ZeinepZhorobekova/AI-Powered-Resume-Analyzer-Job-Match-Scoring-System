export default function SkillProfileCard({ skillProfile }) {
  if (!skillProfile) return null;
  const { skills = [], experience_years, education, job_titles = [], summary } = skillProfile;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-slate-400 inline-block"></span>
        Extracted Candidate Profile
      </h3>

      {summary && (
        <p className="text-sm text-slate-600 leading-relaxed mb-4">{summary}</p>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
        {experience_years != null && (
          <div className="bg-slate-50 rounded-lg px-3 py-2">
            <p className="text-slate-400 mb-0.5">Experience</p>
            <p className="font-semibold text-slate-700">{experience_years} yr{experience_years !== 1 ? 's' : ''}</p>
          </div>
        )}
        {education && (
          <div className="bg-slate-50 rounded-lg px-3 py-2">
            <p className="text-slate-400 mb-0.5">Education</p>
            <p className="font-semibold text-slate-700 truncate">{education}</p>
          </div>
        )}
      </div>

      {job_titles.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-1.5">Past Roles</p>
          <div className="flex flex-wrap gap-1.5">
            {job_titles.map((t) => (
              <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md">{t}</span>
            ))}
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <p className="text-xs text-slate-400 mb-1.5">All Detected Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span key={s} className="px-2 py-0.5 bg-brand-50 text-brand-700 border border-brand-100 text-xs rounded-md">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
