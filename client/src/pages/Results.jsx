import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import FitScoreGauge from '../components/FitScoreGauge';
import SkillsBreakdown from '../components/SkillsBreakdown';
import Recommendations from '../components/Recommendations';
import SkillProfileCard from '../components/SkillProfileCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getSession } from '../services/api';

function CopyLinkButton({ sessionId }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-slate-500 hover:text-brand-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:border-brand-300 transition flex items-center gap-1.5"
    >
      {copied ? '✓ Copied' : '🔗 Copy Link'}
    </button>
  );
}

export default function Results() {
  const { sessionId } = useParams();
  const { state } = useLocation();
  const [data, setData] = useState(state || null);
  const [loading, setLoading] = useState(!state);
  const [error, setError] = useState('');

  useEffect(() => {
    if (state) return;
    getSession(sessionId)
      .then(({ data: d }) => setData(d))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load results'))
      .finally(() => setLoading(false));
  }, [sessionId, state]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <LoadingSpinner message="Loading results..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-5xl mb-4">⏱️</p>
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Session not found</h2>
        <p className="text-sm text-slate-500 mb-6">{error}</p>
        <Link to="/" className="inline-block px-6 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition">
          Start a New Analysis
        </Link>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Header row */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analysis Results</h1>
          {data.jobTitle && (
            <p className="text-slate-500 text-sm mt-1">
              Role: <span className="font-medium text-slate-700">{data.jobTitle}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <CopyLinkButton sessionId={sessionId} />
          <Link
            to="/"
            className="text-sm text-brand-600 hover:text-brand-700 font-medium border border-brand-200 rounded-lg px-4 py-2 hover:bg-brand-50 transition"
          >
            New Analysis
          </Link>
        </div>
      </div>

      {/* Fit score gauge */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center mb-6">
        <FitScoreGauge score={data.fitScore} />
        <p className="text-xs text-slate-400 mt-3 text-center max-w-xs">
          Semantic fit score computed by GPT-4o — reflects conceptual alignment, not just keyword overlap.
        </p>
      </div>

      {/* Skills breakdown */}
      <div className="mb-6">
        <SkillsBreakdown matchedSkills={data.matchedSkills} missingSkills={data.missingSkills} />
      </div>

      {/* Recommendations */}
      <div className="mb-6">
        <Recommendations recommendations={data.recommendations} />
      </div>

      {/* Candidate profile (only present on fresh analysis, not on session reload) */}
      {data.skillProfile && (
        <div className="mb-6">
          <SkillProfileCard skillProfile={data.skillProfile} />
        </div>
      )}

      {/* Footer note */}
      <p className="text-center text-xs text-slate-400">
        Session <code className="font-mono bg-slate-100 px-1 rounded">{sessionId}</code> — expires 1 hour after creation
      </p>
    </div>
  );
}
