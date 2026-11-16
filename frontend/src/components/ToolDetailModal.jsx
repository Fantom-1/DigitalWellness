import React from 'react';
import { X, ExternalLink, Shield, AlertCircle, Play, Film, Monitor } from 'lucide-react';

export default function ToolDetailModal({ tool, onClose }) {
  if (!tool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl text-left overflow-y-auto max-h-[90vh] apple-scrollbar">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-medium capitalize">
                {tool.category.replace('_', ' ')}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                Rating: {tool.student_rating} / 5.0
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">{tool.name}</h3>
            <p className="text-sm text-zinc-400 font-light mt-1 max-w-lg leading-relaxed">{tool.tagline}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Media Preview & Tutorial Section */}
        <div className="py-5 border-b border-white/[0.08]">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 group aspect-video max-h-56 flex items-center justify-center">
            {tool.image_url ? (
              <img 
                src={tool.image_url} 
                alt={`${tool.name} Interface Wireframe`} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-95 transition-opacity duration-300"
              />
            ) : (
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
                <Monitor size={16} />
                <span>Interface Wireframe Preview</span>
              </div>
            )}

            {/* Floating Video Tutorial Action */}
            {tool.video_tutorial_url && (
              <a
                href={tool.video_tutorial_url}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-xl bg-black/80 hover:bg-white hover:text-black text-white text-xs font-medium backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 shadow-lg"
              >
                <Play size={12} fill="currentColor" />
                <span>Watch Video Tutorial</span>
              </a>
            )}
          </div>
        </div>

        {/* Overview & Purpose */}
        <div className="py-5 border-b border-white/[0.08]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Overview</h4>
          <p className="text-sm text-zinc-300 font-light leading-relaxed">{tool.description}</p>

          <div className="mt-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <h5 className="text-xs font-semibold text-white mb-1">Purpose & Use Case</h5>
            <p className="text-xs text-zinc-400 font-light leading-relaxed">{tool.purpose}</p>
          </div>
        </div>

        {/* Evaluation Criteria Grid */}
        <div className="py-5 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Evaluation Criteria</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Platforms */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-zinc-500 font-medium block mb-1.5">Supported Platforms</span>
              <div className="flex flex-wrap gap-1.5">
                {tool.platforms.map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-300 text-[11px]">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-zinc-500 font-medium block mb-1">Verified Cost Model</span>
              <span className="text-white font-medium">{tool.pricing_type}</span>
              <p className="text-zinc-400 mt-1 text-[11px] leading-relaxed">{tool.price_details}</p>
            </div>

            {/* Privacy */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-zinc-500 font-medium block mb-1">Privacy & Telemetry</span>
              <div className="flex items-center gap-1.5 text-zinc-200 font-mono text-[11px] mb-1">
                <Shield size={12} className="text-zinc-400" />
                <span>Grade {tool.privacy_rating}</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">{tool.privacy_details}</p>
            </div>

            {/* Accessibility */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-zinc-500 font-medium block mb-1">Accessibility</span>
              <p className="text-zinc-300 text-[11px] leading-relaxed">{tool.accessibility_features}</p>
            </div>
          </div>

          {/* Limitations */}
          <div className="p-3.5 rounded-2xl bg-amber-500/[0.03] border border-amber-500/15 text-xs">
            <span className="text-amber-300/90 font-medium flex items-center gap-1.5 mb-1">
              <AlertCircle size={13} />
              Limitations & Bypass Resistance
            </span>
            <p className="text-zinc-300 font-light text-[11px] leading-relaxed">{tool.limitations}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/[0.08]">
          <span className="text-[11px] text-zinc-500 font-mono">
            Verified {tool.verified_date}
          </span>

          <div className="flex items-center gap-3">
            {tool.video_tutorial_url && (
              <a
                href={tool.video_tutorial_url}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1.5"
              >
                <Film size={12} />
                YouTube Tutorial
              </a>
            )}
            {tool.official_url && (
              <a
                href={tool.official_url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-white text-black hover:bg-zinc-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              >
                Official Site
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
