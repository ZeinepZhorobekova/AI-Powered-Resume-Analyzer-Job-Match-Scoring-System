import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [mockMode, setMockMode] = useState(false);

  useEffect(() => {
    fetch('/api/../health')
      .then(r => r.json())
      .then(d => setMockMode(d.mockMode))
      .catch(() => {});
  }, []);

  return (
    <>
      {mockMode && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center text-xs text-amber-700">
          <strong>Mock Mode</strong> — AI responses are simulated. Add your{' '}
          <code className="font-mono bg-amber-100 px-1 rounded">OPENAI_API_KEY</code>{' '}
          to <code className="font-mono bg-amber-100 px-1 rounded">server/.env</code> to enable real analysis.
        </div>
      )}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">
            RA
          </div>
          <Link to="/" className="text-lg font-semibold text-slate-800 hover:text-brand-600 transition-colors">
            Resume Analyzer
          </Link>
          <span className="ml-auto text-xs text-slate-400">
            {mockMode ? 'Mock Mode' : 'Powered by GPT-4o'}
          </span>
        </div>
      </header>
    </>
  );
}
