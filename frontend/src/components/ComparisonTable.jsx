import React, { useState } from 'react';
import { ExternalLink, Check, Shield, AlertTriangle, Scale, Eye } from 'lucide-react';

export default function ComparisonTable({ resources, onSelectResource }) {
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All 12 Resources' },
    { id: 'focus_blocker', label: 'Focus & Distraction Blockers' },
    { id: 'screen_time', label: 'Screen Time & Timers' },
    { id: 'bedtime_routine', label: 'Bedtime & Circadian Routines' },
    { id: 'privacy_safety', label: 'Privacy & Safety' },
    { id: 'browser_extension', label: 'Browser Extensions' }
  ];

  const filtered = filterCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === filterCategory);

  return (
    <div id="comparison-table" className="w-full max-w-[1000px] mt-16 text-left">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300 mb-2">
            <Scale size={13} />
            Consistent Evaluation Criteria
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Resource Comparison Matrix</h2>
          <p className="text-gray-400 text-sm mt-1 max-w-xl">
            Side-by-side comparison across purpose, device compatibility, verified pricing, privacy rating, and bypass limitations.
          </p>
        </div>
        <span className="text-xs text-gray-500 mt-2 md:mt-0 font-mono">
          Updated November 2026
        </span>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterCategory === cat.id
                ? 'bg-white text-black shadow-md'
                : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-[#111111]/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#161616] text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="py-4 px-5 font-semibold text-gray-300">Tool / Category</th>
                <th className="py-4 px-4 font-semibold text-gray-300">Platforms</th>
                <th className="py-4 px-4 font-semibold text-gray-300">Pricing Model</th>
                <th className="py-4 px-4 font-semibold text-gray-300">Privacy Audit</th>
                <th className="py-4 px-4 font-semibold text-gray-300">Bypass Resistance & Limitation</th>
                <th className="py-4 px-4 font-semibold text-right text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300 font-light">
              {filtered.map((item) => {
                const isPaid = item.pricing_type === 'Paid';
                const isFree = item.pricing_type === '100% Free' || item.pricing_type === 'Open Source';
                return (
                  <tr 
                    key={item.id} 
                    onClick={() => onSelectResource && onSelectResource(item)}
                    className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-5">
                      <div className="font-semibold text-white group-hover:text-purple-300 transition-colors text-sm">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5 capitalize">
                        {item.category.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {item.platforms.map((p) => (
                          <span key={p} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-gray-300">
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                        isFree 
                          ? 'bg-green-500/10 text-green-300 border-green-500/20' 
                          : isPaid 
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' 
                          : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                      }`}>
                        {item.pricing_type}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1 line-clamp-1 max-w-[140px]" title={item.price_details}>
                        {item.price_details}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-white">
                        <Shield size={12} className="text-blue-400" />
                        <span className="font-semibold">{item.privacy_rating}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 max-w-[130px]" title={item.privacy_details}>
                        {item.privacy_details}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-1 text-[11px] text-gray-300 line-clamp-2 max-w-[200px]" title={item.limitations}>
                        <AlertTriangle size={12} className="text-yellow-500/80 shrink-0 mt-0.5" />
                        <span>{item.limitations}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {item.official_url ? (
                        <a 
                          href={item.official_url} 
                          target="_blank" 
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors text-[11px]"
                        >
                          Visit <ExternalLink size={11} />
                        </a>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
