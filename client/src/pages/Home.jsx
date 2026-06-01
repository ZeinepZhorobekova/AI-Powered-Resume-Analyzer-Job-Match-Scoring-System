import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';
import JobDescriptionInput from '../components/JobDescriptionInput';
import LoadingSpinner from '../components/LoadingSpinner';
import { analyzeResume } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const canSubmit = file && jobDescription.trim().length >= 50 && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);

      const { data } = await analyzeResume(formData, (event) => {
        if (event.total) setUploadProgress(Math.round((event.loaded / event.total) * 100));
      });

      navigate(`/results/${data.sessionId}`, { state: data });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <LoadingSpinner message={uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Analyzing with GPT-4o...'} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          AI Resume Analyzer
        </h1>
        <p className="text-slate-500 text-base leading-relaxed">
          Upload your resume and paste a job description to get an AI-powered fit score,
          skill gap analysis, and personalized improvement recommendations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <ResumeUpload file={file} onFileChange={setFile} />
        <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full py-3 px-6 rounded-xl bg-brand-600 text-white font-semibold text-sm
            hover:bg-brand-700 active:scale-[0.98] transition-all
            disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Analyze My Resume
        </button>

        <p className="text-center text-xs text-slate-400">
          Your resume is not stored — analysis results expire after 1 hour.
        </p>
      </form>
    </div>
  );
}
