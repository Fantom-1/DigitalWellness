import React, { useState, useEffect } from 'react';
import { Clock, ShieldCheck, Check, Play, X, Terminal } from 'lucide-react';
import { getYouTubeEmbedUrl } from '../utils';

export default function SetupGuides({ guides, selectedGuideSlug }) {
  const [selectedGuideIndex, setSelectedGuideIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (selectedGuideSlug && guides && guides.length > 0) {
      const idx = guides.findIndex(g => g.slug === selectedGuideSlug);
      if (idx !== -1) {
        setSelectedGuideIndex(idx);
        setShowVideo(false);
      }
    }
  }, [selectedGuideSlug, guides]);

  if (!guides || guides.length === 0) return null;
  const currentGuide = guides[selectedGuideIndex] || guides[0];
  const embedUrl = getYouTubeEmbedUrl(currentGuide.video_url, `${currentGuide.title} tutorial`);

  return (
    <div className="w-full max-w-[1000px] text-left animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-black/[0.06]">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] tracking-tight">Setup Guides</h2>
          <p className="text-zinc-500 text-sm mt-1 max-w-xl font-light">
            Verified step-by-step device configurations with zero personal information, designed to eliminate bypass loopholes.
          </p>
        </div>
        <span className="text-xs text-zinc-400 mt-2 md:mt-0 font-mono">
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
              onClick={() => {
                setSelectedGuideIndex(idx);
                setShowVideo(false);
              }}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-black/15 shadow-md ring-1 ring-black/5'
                  : 'bg-white/60 border-black/[0.04] hover:border-black/10 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-3 w-full">
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                  Protocol 0{idx + 1}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-black/[0.04] text-zinc-600">
                  {guide.estimated_minutes} min
                </span>
              </div>
              <div>
                <h3 className={`font-semibold text-sm leading-snug ${isSelected ? 'text-[#1d1d1f]' : 'text-zinc-700'}`}>
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
      <div className="bg-white border border-black/[0.06] rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-black/[0.06]">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              {currentGuide.category}
            </span>
            <h3 className="text-2xl font-semibold text-[#1d1d1f] mt-1">{currentGuide.title}</h3>
            <p className="text-sm text-zinc-500 mt-1 font-light leading-relaxed max-w-2xl">{currentGuide.summary}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/[0.03] border border-black/[0.04] text-zinc-600">
              <Clock size={12} />
              {currentGuide.estimated_minutes} Minutes
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/[0.03] border border-black/[0.04] text-zinc-600">
              <ShieldCheck size={12} />
              {currentGuide.difficulty}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-black/[0.03] border border-black/[0.04] text-zinc-700 font-mono text-[11px]">
              {currentGuide.target_platforms.join(', ')}
            </span>
            
            {embedUrl && (
              <button
                onClick={() => setShowVideo(!showVideo)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                  showVideo 
                    ? 'bg-zinc-200 text-[#1d1d1f]' 
                    : 'bg-[#1d1d1f] text-white hover:bg-black shadow-sm'
                }`}
              >
                {showVideo ? (
                  <>
                    <X size={12} />
                    <span>Hide Video</span>
                  </>
                ) : (
                  <>
                    <Play size={11} fill="currentColor" />
                    <span>Watch Video Walkthrough</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Expandable Onsite Video Player */}
        {showVideo && embedUrl && (
          <div className="mt-6 p-4 rounded-2xl bg-zinc-50 border border-black/[0.06] animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold text-[#1d1d1f]">
                Video Tutorial: {currentGuide.title}
              </span>
              <button
                onClick={() => setShowVideo(false)}
                className="text-xs text-zinc-500 hover:text-black transition-colors"
              >
                Close Player
              </button>
            </div>
            <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-md border border-black/10 bg-black">
              <iframe
                src={embedUrl}
                title={`${currentGuide.title} Walkthrough`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Sequential Steps with Visual Wireframes */}
        <div className="mt-8 space-y-4">
          <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Sequential Instructions & Device Wireframes
          </h4>
          <div className="space-y-4">
            {currentGuide.steps.map((step) => (
              <div
                key={step.step_number}
                className="bg-zinc-50/70 border border-black/[0.04] rounded-2xl p-5 hover:border-black/10 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1d1d1f] text-xs font-semibold text-white shrink-0 mt-0.5">
                    {step.step_number}
                  </span>
                  <div className="flex-1">
                    <h5 className="text-sm font-semibold text-[#1d1d1f]">{step.title}</h5>
                    <p className="text-xs text-zinc-600 font-light mt-1.5 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Device Wireframe Flow */}
                    {step.wireframe && (
                      <div className="mt-3 p-2.5 bg-white border border-black/[0.06] rounded-xl flex items-center gap-2 text-[11px] font-mono text-zinc-600 overflow-x-auto apple-scrollbar shadow-xs">
                        <Terminal size={12} className="text-zinc-400 shrink-0" />
                        <span className="whitespace-nowrap">{step.wireframe}</span>
                      </div>
                    )}

                    {step.tip && (
                      <div className="mt-3 p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                        <span className="font-semibold text-blue-950">Tip:</span>
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
          <div className="mt-8 pt-6 border-t border-black/[0.06]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
              Key Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentGuide.key_takeaways.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-50 border border-black/[0.04] text-xs text-zinc-700 font-light">
                  <Check size={14} className="text-zinc-500 shrink-0 mt-0.5" />
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
