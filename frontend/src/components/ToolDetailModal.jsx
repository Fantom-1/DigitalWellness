import React, { useState } from 'react';
import { X, ExternalLink, Shield, AlertCircle, Play, Image, Film, BookOpen, Puzzle } from 'lucide-react';
import { getYouTubeEmbedUrl } from '../utils';

export default function ToolDetailModal({ tool, onClose }) {
  const [mediaMode, setMediaMode] = useState('video'); // 'video' | 'preview'

  if (!tool) return null;

  const embedUrl = getYouTubeEmbedUrl(tool.video_tutorial_url, `${tool.name} setup tutorial`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-black/[0.08] rounded-3xl p-6 md:p-8 shadow-2xl text-left overflow-y-auto max-h-[90vh] apple-scrollbar">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-black/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-black/[0.04] border border-black/[0.06] text-zinc-700 text-xs font-medium capitalize">
                {tool.category.replace('_', ' ')}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                Student Score: {tool.student_rating} / 5.0
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] tracking-tight">{tool.name}</h3>
            <p className="text-sm text-zinc-500 font-light mt-1 max-w-lg leading-relaxed">{tool.tagline}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-black rounded-full hover:bg-black/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Media & Interactive Onsite Video Section */}
        <div className="py-5 border-b border-black/[0.06]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Interactive Media
            </span>
            <div className="flex items-center p-1 rounded-full bg-black/[0.04] border border-black/[0.04] text-xs">
              <button
                onClick={() => setMediaMode('video')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                  mediaMode === 'video'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-500 hover:text-black'
                }`}
              >
                <Play size={10} fill={mediaMode === 'video' ? 'currentColor' : 'none'} />
                Playable Video
              </button>
              <button
                onClick={() => setMediaMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                  mediaMode === 'preview'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-500 hover:text-black'
                }`}
              >
                <Image size={11} />
                Interface Preview
              </button>
            </div>
          </div>

          {/* Video or Image View */}
          {mediaMode === 'video' && embedUrl ? (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-inner border border-black/10 bg-black">
              <iframe
                src={embedUrl}
                title={`${tool.name} Video Tutorial`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-black/[0.06] bg-zinc-100 aspect-video max-h-64 flex items-center justify-center group">
              {tool.image_url ? (
                <img 
                  src={tool.image_url} 
                  alt={`${tool.name} Preview`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-zinc-400 font-mono">No Preview Image</span>
              )}
              {embedUrl && (
                <button
                  onClick={() => setMediaMode('video')}
                  className="absolute bottom-3 right-3 px-3.5 py-1.5 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-medium backdrop-blur-md shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Play size={11} fill="currentColor" />
                  Play Video Walkthrough
                </button>
              )}
            </div>
          )}
        </div>

        {/* Overview & Purpose */}
        <div className="py-5 border-b border-black/[0.06]">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Overview</h4>
          <p className="text-sm text-zinc-600 font-light leading-relaxed">{tool.description}</p>

          <div className="mt-4 p-4 rounded-2xl bg-zinc-50 border border-black/[0.04]">
            <h5 className="text-xs font-semibold text-[#1d1d1f] mb-1">Purpose & Academic Fit</h5>
            <p className="text-xs text-zinc-500 font-light leading-relaxed">{tool.purpose}</p>
          </div>
        </div>

        {/* Evaluation Criteria Grid */}
        <div className="py-5 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Evaluation Criteria</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Platforms */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-black/[0.04]">
              <span className="text-zinc-500 font-medium block mb-1.5">Supported Platforms</span>
              <div className="flex flex-wrap gap-1.5">
                {tool.platforms.map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded-md bg-white border border-black/[0.06] text-zinc-700 text-[11px]">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-black/[0.04]">
              <span className="text-zinc-500 font-medium block mb-1">Verified Cost Model</span>
              <span className="text-[#1d1d1f] font-semibold">{tool.pricing_type}</span>
              <p className="text-zinc-500 mt-1 text-[11px] leading-relaxed">{tool.price_details}</p>
            </div>

            {/* Privacy */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-black/[0.04]">
              <span className="text-zinc-500 font-medium block mb-1">Privacy & Telemetry</span>
              <div className="flex items-center gap-1.5 text-zinc-700 font-mono text-[11px] mb-1">
                <Shield size={12} className="text-zinc-500" />
                <span className="font-bold">Grade {tool.privacy_rating}</span>
              </div>
              <p className="text-zinc-500 text-[11px] leading-relaxed">{tool.privacy_details}</p>
            </div>

            {/* Accessibility */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-black/[0.04]">
              <span className="text-zinc-500 font-medium block mb-1">Accessibility</span>
              <p className="text-zinc-600 text-[11px] leading-relaxed">{tool.accessibility_features}</p>
            </div>
          </div>

          {/* Limitations */}
          <div className="p-3.5 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 text-xs">
            <span className="text-amber-900 font-medium flex items-center gap-1.5 mb-1">
              <AlertCircle size={13} className="text-amber-700" />
              Limitations & Bypass Resistance
            </span>
            <p className="text-amber-800 font-light text-[11px] leading-relaxed">{tool.limitations}</p>
          </div>
        </div>

        {/* Footer Actions & Reference Links */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-black/[0.06]">
          <span className="text-[11px] text-zinc-400 font-mono">
            Verified {tool.verified_date}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {tool.documentation_url && (
              <a
                href={tool.documentation_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-black rounded-xl bg-zinc-100 hover:bg-zinc-200 transition-colors flex items-center gap-1.5"
              >
                <BookOpen size={12} />
                Docs & Setup
              </a>
            )}
            {tool.extension_url && (
              <a
                href={tool.extension_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Puzzle size={12} />
                {tool.category === 'browser_extension' ? 'Add Extension' : 'Get App / Download'}
              </a>
            )}
            {tool.repository_url && (
              <a
                href={tool.repository_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-black rounded-xl bg-zinc-100 hover:bg-zinc-200 transition-colors"
              >
                Source Code
              </a>
            )}
            {tool.official_url && (
              <a
                href={tool.official_url}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-[#1d1d1f] text-white hover:bg-black text-xs font-medium rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
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
