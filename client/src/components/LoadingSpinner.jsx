export default function LoadingSpinner({ message = 'Analyzing...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      <p className="text-sm text-slate-500 font-medium">{message}</p>
      <p className="text-xs text-slate-400 max-w-xs text-center">
        GPT-4o is extracting skills and computing semantic fit — this usually takes 10–20 seconds.
      </p>
    </div>
  );
}
