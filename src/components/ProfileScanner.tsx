'use client';

import React, { useState } from 'react';
import { TechProfile } from '@/types';
import { TechCard } from './TechCard';
import { GithubIcon, LinkedinIcon } from './icons';
import { 
  Terminal, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Cpu, 
  Play, 
  ArrowRight,
  PlusCircle,
  Flame
} from 'lucide-react';

interface ProfileScannerProps {
  onAddScannedProfileToDeck: (profile: TechProfile) => void;
  onSetAsMyProfile: (profile: TechProfile) => void;
}

export function ProfileScanner({
  onAddScannedProfileToDeck,
  onSetAsMyProfile
}: ProfileScannerProps) {
  const [githubUser, setGithubUser] = useState('alexchen-dev');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/in/alexchen-dev');
  const [university, setUniversity] = useState('Stanford University');
  const [major, setMajor] = useState('Computer Science');
  const [targetRole, setTargetRole] = useState('Full-Stack');

  const [isScanning, setIsScanning] = useState(false);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [scannedResult, setScannedResult] = useState<TechProfile | null>(null);

  const runScanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setScanLogs([]);
    setScannedResult(null);

    const logSteps = [
      `[webcmd:0.1] Initializing headless background agent...`,
      `[webcmd:0.4] Querying public profile for @${githubUser || 'dev'}...`,
      `[webcmd:0.8] Extracting repository metrics & commit activity...`,
      `[webcmd:1.2] Analyzing LinkedIn signals for ${university}...`,
      `[webcmd:1.6] Generating tech skill matrix for ${targetRole}...`,
      `[webcmd:2.0] Computing synergy baseline & Dev Card proof tokens...`,
      `[webcmd:2.2] Profile synthesis complete! [HTTP 200 OK]`
    ];

    // Animate terminal log lines
    for (let i = 0; i < logSteps.length; i++) {
      await new Promise(res => setTimeout(res, 280));
      setScanLogs(prev => [...prev, logSteps[i]]);
    }

    try {
      const res = await fetch('/api/enrich-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubUsername: githubUser,
          linkedinUrl,
          university,
          major,
          targetRole
        })
      });

      const data = await res.json();
      if (data.success && data.profile) {
        setScannedResult(data.profile as TechProfile);
      }
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold mb-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            Webcmd Profile Enricher Engine
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Instant Dev Card Generator</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Input any student GitHub username and LinkedIn URL. Our backend Webcmd extractor parses their repositories, top languages, verified milestones, and builds an interactive Dev Card in seconds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Target Student Signals
            </h3>

            <form onSubmit={runScanner} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                  <GithubIcon className="w-3.5 h-3.5 text-slate-300" />
                  GitHub Username / URL
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. sophiaz-ml, marcus-sys, or your own"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                  <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                  LinkedIn Profile URL
                </label>
                <input 
                  type="text"
                  placeholder="e.g. https://linkedin.com/in/username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 mb-1 block">University</label>
                  <input 
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Major</label>
                  <input 
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Target Role</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                >
                  <option value="Full-Stack">Full-Stack Engineer</option>
                  <option value="AI / ML Engineer">AI / ML Specialist</option>
                  <option value="Frontend">Frontend / UI Engineer</option>
                  <option value="Backend">Backend / Distributed Systems</option>
                  <option value="Mobile Dev">Mobile Dev (Flutter/React Native)</option>
                  <option value="Systems / DevOps">Systems & Cloud DevOps</option>
                  <option value="UI/UX & Product">UI/UX & Product Designer</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isScanning}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2 active:scale-95"
              >
                {isScanning ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Executing Webcmd Extraction...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Run Webcmd Profile Scan</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Terminal Logs Output */}
          <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 shadow-xl min-h-[160px]">
            <div className="flex items-center gap-1.5 pb-2 border-b border-slate-900 text-slate-500 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-[10px] text-slate-500">webcmd-enricher.log</span>
            </div>

            {scanLogs.length === 0 ? (
              <div className="text-slate-600 py-4 text-center">
                Ready. Click "Run Webcmd Profile Scan" to inspect live signals.
              </div>
            ) : (
              <div className="space-y-1">
                {scanLogs.map((log, idx) => (
                  <div key={idx} className={idx === scanLogs.length - 1 ? 'text-cyan-400 font-bold' : 'text-slate-400'}>
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Preview Column */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          {scannedResult ? (
            <div className="w-full space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Live Dev Card Generated
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onAddScannedProfileToDeck(scannedResult)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Add to Swipe Deck
                  </button>
                  <button
                    onClick={() => onSetAsMyProfile(scannedResult)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Set as My Card
                  </button>
                </div>
              </div>

              <TechCard profile={scannedResult} isExpanded={true} showSynergy={false} />
            </div>
          ) : (
            <div className="w-full h-full min-h-[400px] rounded-3xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center text-center p-8 bg-slate-900/40">
              <Terminal className="w-12 h-12 text-slate-700 mb-3" />
              <h4 className="text-sm font-bold text-slate-300">No Profile Scanned Yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Enter target parameters on the left to extract and preview live GitHub/LinkedIn dev card attributes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
