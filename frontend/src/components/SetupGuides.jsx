import React, { useState } from 'react';
import { BookOpen, Clock, ShieldCheck, CheckCircle2, ChevronRight, Sparkles, Smartphone, Laptop, Moon } from 'lucide-react';

export default function SetupGuides({ guides }) {
  const [selectedGuideIndex, setSelectedGuideIndex] = useState(0);

  if (!guides || guides.length === 0) return null;
  const currentGuide = guides[selectedGuideIndex] || guides[0];

  const guideIcons = [
    Smartphone,
    Laptop,
    Moon
  ];

  return (
    <div id="guides-section" className="w-full max-w-[1000px] mt-16 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-300 mb-2">
            <BookOpen size={13} />
            Step-by-Step Student Guides
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Practical Setup Guides</h2>
          <p className="text-gray-400 text-sm mt-1 max-w-xl">
            Tested device setups with zero personal info. Created to eliminate bypass loopholes and automate friction.
          </p>
        </div>
        <span className="text-xs text-gray-500 mt-2 md:mt-0 font-mono">
          3 Guides Available • Zero Personal Data
        </span>
      </div>

      {/* Guide Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        {guides.map((guide, idx) => {
          const Icon = guideIcons[idx % guideIcons.length] || BookOpen;
          const isSelected = selectedGuideIndex === idx;
          return (
            <button
              key={guide.slug}
              onClick={() => setSelectedGuideIndex(idx)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-white/[0.08] border-white/30 shadow-lg shadow-black/20 ring-1 ring-white/20'
                  : 'bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-gray-400'}`}>
                  <Icon size={18} />
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                  {guide.estimated_minutes} min setup
                </span>
              </div>
              <div>
                <h3 className={`font-semibold text-sm line-clamp-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                  {guide.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {guide.summary}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Guide Card */}
      <div className="bg-[#111111]/80 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              {currentGuide.category}
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">{currentGuide.title}</h3>
            <p className="text-sm text-gray-300 mt-1 leading-relaxed max-w-2xl">{currentGuide.summary}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300">
              <Clock size={13} className="text-gray-400" />
              {currentGuide.estimated_minutes} Minutes
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300">
              <ShieldCheck size={13} className="text-blue-400" />
              {currentGuide.difficulty}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
              {currentGuide.target_platforms.join(', ')}
            </span>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-8 space-y-6">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Step-by-Step Instructions
          </h4>
          <div className="space-y-4">
            {currentGuide.steps.map((step) => (
              <div
                key={step.step_number}
                className="bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all"
              >
                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white shrink-0 mt-0.5">
                    {step.step_number}
                  </span>
                  <div className="flex-1">
                    <h5 className="text-base font-semibold text-white">{step.title}</h5>
                    <p className="text-sm text-gray-300 font-light mt-1.5 leading-relaxed">
                      {step.description}
                    </p>
                    {step.tip && (
                      <div className="mt-3 p-3 bg-purple-500/5 border border-purple-500/15 rounded-xl text-xs text-purple-200/90 flex items-start gap-2">
                        <Sparkles size={14} className="text-purple-400 shrink-0 mt-0.5" />
                        <span><strong>Student Tip:</strong> {step.tip}</span>
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
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Essential Takeaways
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentGuide.key_takeaways.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-300">
                  <CheckCircle2 size={15} className="text-green-400 shrink-0 mt-0.5" />
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
