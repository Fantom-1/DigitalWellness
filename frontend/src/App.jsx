import React, { useState } from 'react';
import SearchArea from './components/SearchArea';
import SubmissionModal from './components/SubmissionModal';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Home() {
  const [activeTab, setActiveTab] = useState('advisor'); // 'advisor' | 'directory' | 'compare' | 'guides'
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#f5f5f7] flex flex-col font-sans text-[#1d1d1f] px-3 sm:px-6 md:px-8 overflow-x-hidden selection:bg-black/10 selection:text-black">
      
      {/* Subtle Apple Ambient Light Aura */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[20%] w-[55vw] h-[45vw] rounded-full bg-indigo-500/[0.03] blur-[150px]" />
        <div className="absolute top-[10%] right-[5%] w-[45vw] h-[40vw] rounded-full bg-sky-500/[0.03] blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[50vw] h-[40vw] rounded-full bg-rose-500/[0.02] blur-[160px]" />
      </div>

      {/* Top Navigation */}
      <header className="w-full max-w-[1000px] mx-auto py-3.5 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 z-20 border-b border-black/[0.06]">
        {/* Brand Wordmark & Mobile Feedback Button */}
        <div className="w-full sm:w-auto flex items-center justify-between">
          <div 
            onClick={() => setActiveTab('advisor')} 
            className="cursor-pointer select-none active:opacity-70 transition-opacity"
          >
            <span className="font-semibold text-sm tracking-tight text-[#1d1d1f]">
              Digital Wellness
            </span>
          </div>

          {/* Mobile Feedback Button (min 44px tap target) */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="sm:hidden text-xs font-medium text-zinc-600 hover:text-black py-1.5 px-3 rounded-full bg-black/[0.04] active:bg-black/[0.08] transition-colors"
          >
            Feedback
          </button>
        </div>

        {/* Minimalist Apple Segmented Navigation */}
        <nav className="flex items-center gap-1 p-1 rounded-full bg-black/[0.04] border border-black/[0.04] backdrop-blur-md max-w-full overflow-x-auto no-scrollbar touch-pan-x">
          {[
            { id: 'advisor', label: 'Advisor' },
            { id: 'directory', label: 'Directory' },
            { id: 'compare', label: 'Compare' },
            { id: 'guides', label: 'Guides' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-medium transition-all shrink-0 min-h-[36px] sm:min-h-0 flex items-center justify-center cursor-pointer select-none ${
                activeTab === tab.id
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-zinc-500 hover:text-black active:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Desktop Feedback Action Link */}
        <div className="hidden sm:flex items-center gap-4 text-xs font-medium">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-zinc-500 hover:text-black transition-colors cursor-pointer"
          >
            Feedback
          </button>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-start z-10 pt-4 sm:pt-6 md:pt-10 pb-16 md:pb-20">
        <SearchArea activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
      
      {/* Restrained Apple Light Footer */}
      <footer className="w-full max-w-[1000px] mx-auto py-6 border-t border-black/[0.06] text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3 z-10 font-light text-center sm:text-left">
        <div>
          © 2026 Digital Wellness Resource Hub. Curated for student focus.
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4 text-[11px] text-zinc-400 font-mono">
          <span>November 2026 Verification</span>
          <span>•</span>
          <span>Zero Telemetry Audited</span>
        </div>
      </footer>

      {/* Student Feedback Modal */}
      <SubmissionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
