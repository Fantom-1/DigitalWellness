import React, { useState } from 'react';
import { ExternalLink, Shield } from 'lucide-react';

export default function ComparisonTable({ resources, onSelectResource }) {
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'focus_blocker', label: 'Focus Blockers' },
    { id: 'screen_time', label: 'Screen Time' },
    { id: 'bedtime_routine', label: 'Bedtime Routines' },
    { id: 'privacy_safety', label: 'Privacy & Safety' },
    { id: 'browser_extension', label: 'Browser Extensions' }
  ];

  const filtered = filterCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === filterCategory);

  return (
    <div className="w-full max-w-[1000px] text-left animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">Comparison Matrix</h2>
          <p className="text-zinc-400 text-sm mt-1 max-w-xl font-light">
            Consistent evaluation across purpose, platform compatibility, verified cost, privacy, and bypass resistance.
          </p>
        </div>
        <span className="text-xs text-zinc-500 mt-2 md:mt-0 font-mono">
          12 Verified Resources
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
                ? 'bg-white text-black shadow-sm'
                : 'bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-[#0c0c0e] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto apple-scrollbar">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/[0.02] text-zinc-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-medium">
              <tr>
                <th className="py-4 px-5">Resource</th>
                <th className="py-4 px-4">Platforms</th>
                <th className="py-4 px-4">Pricing</th>
                <th className="py-4 px-4">Privacy</th>
                <th className="py-4 px-4">Bypass Limitation</th>
                <th className="py-4 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-zinc-300 font-light">
              {filtered.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => onSelectResource && onSelectResource(item)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-5">
                    <div className="font-medium text-white group-hover:text-zinc-300 transition-colors text-sm">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-0.5 capitalize">
                      {item.category.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {item.platforms.map((p) => (
                        <span key={p} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-zinc-400">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-zinc-300">
                      {item.pricing_type}
                    </span>
                    <p className="text-[10px] text-zinc-500 mt-1 line-clamp-1 max-w-[140px]" title={item.price_details}>
                      {item.price_details}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 font-mono text-xs text-zinc-300">
                      <Shield size={11} className="text-zinc-500" />
                      <span>{item.privacy_rating}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1 max-w-[130px]" title={item.privacy_details}>
                      {item.privacy_details}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-[11px] text-zinc-400 line-clamp-2 max-w-[200px]" title={item.limitations}>
                      {item.limitations}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-xs text-zinc-400 group-hover:text-white transition-colors">
                      View →
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
