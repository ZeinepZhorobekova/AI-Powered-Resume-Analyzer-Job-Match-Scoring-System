import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <p className="text-6xl font-bold text-slate-200 mb-4">404</p>
      <h1 className="text-xl font-semibold text-slate-800 mb-2">Page not found</h1>
      <p className="text-sm text-slate-500 mb-8">The page you're looking for doesn't exist or the session has expired.</p>
      <Link
        to="/"
        className="inline-block px-6 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition"
      >
        Start a New Analysis
      </Link>
    </div>
  );
}
