import React, { useState } from 'react';
import SearchArea from './components/SearchArea';
import SubmissionModal from './components/SubmissionModal';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function Home() {
  const [activeTab, setActiveTab] = useState('advisor'); // 'advisor' | 'directory' | 'compare' | 'guides'
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#050505] flex flex-col font-sans text-white px-4 md:px-8 overflow-x-hidden selection:bg-white/20 selection:text-white">
      
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[20%] w-[50vw] h-[40vw] rounded-full bg-white/[0.02] blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-white/[0.015] blur-[140px]" />
      </div>

      {/* Top Navigation */}
      <header className="w-full max-w-[1000px] mx-auto py-5 flex items-center justify-between z-20 border-b border-white/[0.06]">
        {/* Simple Brand Wordmark (No Emojis, No Icons) */}
        <div 
          onClick={() => setActiveTab('advisor')} 
          className="cursor-pointer"
        >
          <span className="font-semibold text-sm tracking-tight text-white hover:text-zinc-300 transition-colors">
            Digital Wellness
          </span>
        </div>

        {/* Minimalist Segmented Navigation */}
        <nav className="flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md">
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
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
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
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Feedback
          </button>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-start z-10 pt-6 md:pt-10 pb-20">
        <SearchArea activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
      
      {/* Restrained Apple Footer */}
      <footer className="w-full max-w-[1000px] mx-auto py-6 border-t border-white/[0.06] text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3 z-10 font-light">
        <div>
          © 2026 Digital Wellness Resource Hub. Curated for student focus.
        </div>
        <div className="flex gap-4 text-[11px] text-zinc-500 font-mono">
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
