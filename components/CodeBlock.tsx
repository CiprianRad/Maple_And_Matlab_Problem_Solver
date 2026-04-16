
import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  title: string;
  filename: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, title, filename }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">{title} ({filename})</span>
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button 
            onClick={downloadFile}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Download
          </button>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-slate-200 max-h-[400px]">
        <code>{code}</code>
      </pre>
    </div>
  );
};
