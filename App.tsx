
import React, { useState } from 'react';
import { Button } from './components/Button';
import { CodeBlock } from './components/CodeBlock';
import { generateMathSolutions } from './services/geminiService';
import { GeneratedContent, AppStatus } from './types';

const App: React.FC = () => {
  const [maplePrompt, setMaplePrompt] = useState('');
  const [matlabPrompt, setMatlabPrompt] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maplePrompt.trim() || !matlabPrompt.trim()) return;

    setStatus(AppStatus.LOADING);
    setError(null);

    try {
      const data = await generateMathSolutions({ maplePrompt, matlabPrompt });
      setResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while generating content.');
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setMaplePrompt('');
    setMatlabPrompt('');
    setResult(null);
    setStatus(AppStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-indigo-700 text-white py-12 px-4 shadow-lg mb-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">MathScript Architect</h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Generate simple Maple, MATLAB, and LaTeX solutions for your mathematical problems in seconds.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4">
        {status !== AppStatus.SUCCESS ? (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Maple Section */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Maple Problem Description
                </label>
                <textarea
                  className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
                  placeholder="e.g. Calculate the integral of x^2*sin(x) from 0 to pi..."
                  value={maplePrompt}
                  onChange={(e) => setMaplePrompt(e.target.value)}
                  disabled={status === AppStatus.LOADING}
                />
              </div>

              {/* MATLAB Section */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  MATLAB Problem Description
                </label>
                <textarea
                  className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
                  placeholder="e.g. Solve a system of linear equations Ax=B where A is 3x3..."
                  value={matlabPrompt}
                  onChange={(e) => setMatlabPrompt(e.target.value)}
                  disabled={status === AppStatus.LOADING}
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className="flex justify-center pt-4">
              <Button 
                type="submit" 
                isLoading={status === AppStatus.LOADING}
                disabled={!maplePrompt.trim() || !matlabPrompt.trim()}
                className="w-full md:w-64 text-lg"
              >
                Generate Solutions
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Generated Results</h2>
              <Button variant="secondary" onClick={handleReset}>
                Start New Project
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <CodeBlock 
                title="LaTeX Documentation" 
                filename="documentation.tex" 
                code={result?.latexContent || ''} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CodeBlock 
                  title="Maple Script" 
                  filename="solution.mw" 
                  code={result?.mapleCode || ''} 
                />
                <CodeBlock 
                  title="MATLAB Script" 
                  filename="solution.m" 
                  code={result?.matlabCode || ''} 
                />
              </div>
            </div>

            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
              <h3 className="text-indigo-900 font-semibold mb-2">Next Steps</h3>
              <ul className="list-disc list-inside text-indigo-800 space-y-1 text-sm">
                <li>Download the <b>.tex</b> file and compile it using your favorite LaTeX editor (e.g., Overleaf).</li>
                <li>Download the <b>.mw</b> file to open in Maple.</li>
                <li>Download the <b>.m</b> file and run it directly in MATLAB.</li>
                <li>The LaTeX file contains specific running instructions for these scripts.</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} MathScript Architect. Powered by Gemini Pro.
        </div>
      </footer>
    </div>
  );
};

export default App;
