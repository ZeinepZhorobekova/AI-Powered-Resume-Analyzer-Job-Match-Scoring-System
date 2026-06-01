export default function Recommendations({ recommendations = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-500 inline-block"></span>
        Improvement Recommendations
      </h3>
      {recommendations.length > 0 ? (
        <ol className="space-y-3">
          {recommendations.map((rec, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-sm text-slate-700 leading-relaxed">{rec}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-xs text-slate-400 italic">No recommendations generated</p>
      )}
    </div>
  );
}
