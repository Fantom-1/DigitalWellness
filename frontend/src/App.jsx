import React, { useState } from 'react';
import SearchArea from './components/SearchArea';
import SubmissionModal from './components/SubmissionModal';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Home() {
  const [activeTab, setActiveTab] = useState('advisor'); // 'advisor' | 'directory' | 'compare' | 'guides'
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#f5f5f7] flex flex-col font-sans text-[#1d1d1f] px-4 md:px-8 overflow-x-hidden selection:bg-black/10 selection:text-black">
      
      {/* Subtle Apple Ambient Light Aura */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[20%] w-[55vw] h-[45vw] rounded-full bg-indigo-500/[0.03] blur-[150px]" />
        <div className="absolute top-[10%] right-[5%] w-[45vw] h-[40vw] rounded-full bg-sky-500/[0.03] blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[50vw] h-[40vw] rounded-full bg-rose-500/[0.02] blur-[160px]" />
      </div>

      {/* Top Navigation */}
      <header className="w-full max-w-[1000px] mx-auto py-5 flex items-center justify-between z-20 border-b border-black/[0.06]">
        {/* Simple Brand Wordmark (Zero Emojis, Clean San Francisco Styling) */}
        <div 
          onClick={() => setActiveTab('advisor')} 
          className="cursor-pointer"
        >
          <span className="font-semibold text-sm tracking-tight text-[#1d1d1f] hover:opacity-75 transition-opacity">
            Digital Wellness
          </span>
        </div>

        {/* Minimalist Apple Segmented Navigation */}
        <nav className="flex items-center gap-1 p-1 rounded-full bg-black/[0.04] border border-black/[0.04] backdrop-blur-md">
          {[
            { id: 'advisor', label: 'Advisor' },
            { id: 'directory', label: 'Directory' },
            { id: 'compare', label: 'Compare' },
            { id: 'guides', label: 'Guides' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-zinc-500 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Action Link */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-zinc-500 hover:text-black transition-colors"
          >
            Feedback
          </button>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-start z-10 pt-6 md:pt-10 pb-20">
        <SearchArea activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
      
      {/* Restrained Apple Light Footer */}
      <footer className="w-full max-w-[1000px] mx-auto py-6 border-t border-black/[0.06] text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-3 z-10 font-light">
        <div>
          © 2026 Digital Wellness Resource Hub. Curated for student focus.
        </div>
        <div className="flex gap-4 text-[11px] text-zinc-400 font-mono">
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
