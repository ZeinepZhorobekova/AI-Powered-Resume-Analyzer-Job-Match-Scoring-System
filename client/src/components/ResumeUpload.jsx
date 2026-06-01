import { useRef, useState } from 'react';

export default function ResumeUpload({ file, onFileChange }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') onFileChange(dropped);
  };

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (selected) onFileChange(selected);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">Resume (PDF)</label>
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-colors
          ${dragging ? 'border-brand-500 bg-brand-50' : 'border-slate-300 hover:border-brand-400 bg-white'}`}
      >
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl">📄</span>
            <p className="font-medium text-slate-800 text-sm">{file.name}</p>
            <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB — click to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <span className="text-3xl">⬆️</span>
            <p className="text-sm">Drag &amp; drop your PDF here, or <span className="text-brand-600 font-medium">browse</span></p>
            <p className="text-xs">Max 5 MB</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
