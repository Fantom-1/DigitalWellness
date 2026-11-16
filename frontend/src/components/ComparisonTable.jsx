import React, { useState } from 'react';
import { Shield } from 'lucide-react';

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

  const isExtension = (r) => 
    r.category === 'browser_extension' ||
    Boolean(r.extension_url && (r.extension_url.includes('chromewebstore') || r.extension_url.includes('addons.mozilla') || r.extension_url.includes('addons.opera'))) ||
    (r.platforms && r.platforms.some(p => ['Chrome', 'Firefox', 'Edge', 'Safari', 'Brave', 'Opera'].includes(p)));

  const isBedtime = (r) =>
    r.category === 'bedtime_routine' ||
    ['flux', 'alarmy', 'sleep-as-android-apple-sleep', 'dark-reader', 'twilight', 'freedom', 'one-sec'].includes(r.slug);

  const filtered = filterCategory === 'all' 
    ? resources 
    : resources.filter(r => {
        if (filterCategory === 'browser_extension') return isExtension(r);
        if (filterCategory === 'bedtime_routine') return isBedtime(r);
        return r.category === filterCategory;
      });

  return (
    <div className="w-full max-w-[1000px] text-left animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-black/[0.06]">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] tracking-tight">Comparison Matrix</h2>
          <p className="text-zinc-500 text-sm mt-1 max-w-xl font-light">
            Consistent evaluation across purpose, platform compatibility, verified cost, privacy, and bypass resistance.
          </p>
        </div>
        <span className="text-xs text-zinc-400 mt-2 md:mt-0 font-mono">
          {filtered.length} of {resources.length} Verified Resources
        </span>
      </div>

      {/* Category Filter Pills (Smooth Edge-to-Edge Touch Scroll on Mobile) */}
      <div className="flex items-center sm:flex-wrap gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar apple-scrollbar touch-pan-x -mx-3 px-3 sm:mx-0 sm:px-0 pb-1 mb-4 sm:mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all min-h-[34px] sm:min-h-0 flex items-center ${
              filterCategory === cat.id
                ? 'bg-[#1d1d1f] text-white shadow-sm'
                : 'bg-white border border-black/[0.06] text-zinc-600 hover:text-black hover:border-black/15'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Mobile Horizontal Scroll Cue */}
      <div className="sm:hidden flex items-center justify-between text-[11px] text-zinc-400 font-mono mb-2 px-1">
        <span>← Swipe horizontally to compare</span>
        <span>Sticky Resource Column</span>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto apple-scrollbar touch-pan-x">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-zinc-50 text-zinc-500 uppercase text-[10px] tracking-wider border-b border-black/[0.06] font-medium">
              <tr>
                <th className="py-3.5 sm:py-4 px-4 sm:px-5 sticky left-0 bg-zinc-50 z-20 shadow-[2px_0_6px_rgba(0,0,0,0.04)] sm:shadow-none min-w-[130px] sm:min-w-0">
                  Resource
                </th>
                <th className="py-3.5 sm:py-4 px-3 sm:px-4 min-w-[110px]">Platforms</th>
                <th className="py-3.5 sm:py-4 px-3 sm:px-4 min-w-[110px]">Pricing</th>
                <th className="py-3.5 sm:py-4 px-3 sm:px-4 min-w-[100px]">Privacy</th>
                <th className="py-3.5 sm:py-4 px-3 sm:px-4 min-w-[160px]">Bypass Limitation</th>
                <th className="py-3.5 sm:py-4 px-3 sm:px-4 text-right min-w-[80px]">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] text-zinc-700 font-light">
              {filtered.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => onSelectResource && onSelectResource(item)}
                  className="hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 sm:py-4 px-4 sm:px-5 sticky left-0 bg-white group-hover:bg-zinc-50/95 transition-colors z-10 shadow-[2px_0_6px_rgba(0,0,0,0.04)] sm:shadow-none min-w-[130px] sm:min-w-0">
                    <div className="font-semibold text-[#1d1d1f] group-hover:text-blue-600 transition-colors text-sm">
                      {item.name}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5 capitalize truncate max-w-[120px] sm:max-w-none">
                      {item.category.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="py-3.5 sm:py-4 px-3 sm:px-4">
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {item.platforms.map((p) => (
                        <span key={p} className="px-1.5 py-0.5 rounded bg-zinc-100 text-[10px] text-zinc-600">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 sm:py-4 px-3 sm:px-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium bg-black/[0.04] text-zinc-800">
                      {item.pricing_type}
                    </span>
                    <p className="text-[10px] text-zinc-500 mt-1 line-clamp-1 max-w-[140px]" title={item.price_details}>
                      {item.price_details}
                    </p>
                  </td>
                  <td className="py-3.5 sm:py-4 px-3 sm:px-4">
                    <div className="flex items-center gap-1 font-mono text-xs text-zinc-800">
                      <Shield size={11} className="text-zinc-500" />
                      <span>{item.privacy_rating}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1 max-w-[130px]" title={item.privacy_details}>
                      {item.privacy_details}
                    </p>
                  </td>
                  <td className="py-3.5 sm:py-4 px-3 sm:px-4">
                    <p className="text-[11px] text-zinc-600 line-clamp-2 max-w-[200px]" title={item.limitations}>
                      {item.limitations}
                    </p>
                  </td>
                  <td className="py-3.5 sm:py-4 px-3 sm:px-4 text-right">
                    <span className="text-xs text-zinc-400 group-hover:text-black font-medium transition-colors">
                      Inspect →
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
