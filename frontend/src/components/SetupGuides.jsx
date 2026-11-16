import React, { useState } from 'react';
import { Clock, ShieldCheck, Check, Play, ExternalLink, Terminal } from 'lucide-react';

export default function SetupGuides({ guides }) {
  const [selectedGuideIndex, setSelectedGuideIndex] = useState(0);

  if (!guides || guides.length === 0) return null;
  const currentGuide = guides[selectedGuideIndex] || guides[0];

  return (
    <div className="w-full max-w-[1000px] text-left animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Setup Guides</h2>
          <p className="text-zinc-400 text-sm mt-1 max-w-xl font-light">
            Verified step-by-step device configurations with zero personal information, designed to eliminate bypass loopholes.
          </p>
        </div>
        <span className="text-xs text-zinc-500 mt-2 md:mt-0 font-mono">
          3 Guided Protocols
        </span>
      </div>

      {/* Guide Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        {guides.map((guide, idx) => {
          const isSelected = selectedGuideIndex === idx;
          return (
            <button
              key={guide.slug}
              onClick={() => setSelectedGuideIndex(idx)}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-white/[0.06] border-white/20 shadow-md ring-1 ring-white/10'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center justify-between mb-3 w-full">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                  Protocol 0{idx + 1}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
                  {guide.estimated_minutes} min
                </span>
              </div>
              <div>
                <h3 className={`font-medium text-sm leading-snug ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                  {guide.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-1.5 line-clamp-2 font-light">
                  {guide.summary}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Guide Card */}
      <div className="bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
              {currentGuide.category}
            </span>
            <h3 className="text-2xl font-semibold text-white mt-1">{currentGuide.title}</h3>
            <p className="text-sm text-zinc-400 mt-1 font-light leading-relaxed max-w-2xl">{currentGuide.summary}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-zinc-400">
              <Clock size={12} />
              {currentGuide.estimated_minutes} Minutes
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-zinc-400">
              <ShieldCheck size={12} />
              {currentGuide.difficulty}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-zinc-300 font-mono text-[11px]">
              {currentGuide.target_platforms.join(', ')}
            </span>
            {currentGuide.video_url && (
              <a
                href={currentGuide.video_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-medium transition-colors"
              >
                <Play size={11} fill="currentColor" />
                <span>Video Tutorial</span>
              </a>
            )}
          </div>
        </div>

        {/* Sequential Steps with Visual Wireframes */}
        <div className="mt-8 space-y-4">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
            Sequential Instructions & Device Wireframes
          </h4>
          <div className="space-y-4">
            {currentGuide.steps.map((step) => (
              <div
                key={step.step_number}
                className="bg-white/[0.015] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-semibold text-white shrink-0 mt-0.5">
                    {step.step_number}
                  </span>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-white">{step.title}</h5>
                    <p className="text-xs text-zinc-300 font-light mt-1.5 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Device Wireframe Flow */}
                    {step.wireframe && (
                      <div className="mt-3 p-2.5 bg-black/40 border border-white/[0.06] rounded-xl flex items-center gap-2 text-[11px] font-mono text-zinc-400 overflow-x-auto apple-scrollbar">
                        <Terminal size={12} className="text-zinc-500 shrink-0" />
                        <span className="whitespace-nowrap">{step.wireframe}</span>
                      </div>
                    )}

                    {step.tip && (
                      <div className="mt-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-zinc-400 flex items-start gap-2">
                        <span className="font-semibold text-zinc-200">Note:</span>
                        <span className="font-light">{step.tip}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Takeaways */}
        {currentGuide.key_takeaways && currentGuide.key_takeaways.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/[0.08]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
              Key Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentGuide.key_takeaways.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.015] border border-white/5 text-xs text-zinc-300 font-light">
                  <Check size={14} className="text-zinc-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
