import React, { useState } from 'react';
import SearchArea from './components/SearchArea';
import SubmissionModal from './components/SubmissionModal';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sparkles, MessageSquare, BookOpen, Scale, ExternalLink } from 'lucide-react';

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#050505] flex flex-col font-sans text-white px-4 overflow-x-hidden selection:bg-purple-500/30 selection:text-white">
      {/* Background Ambient Gradient Balls */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-purple-600/10 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-blue-600/10 blur-[130px]" />
        <div className="absolute top-[35%] left-[55%] w-[35vw] h-[35vw] rounded-full bg-pink-600/5 blur-[120px]" />
      </div>

      {/* Top Navigation */}
      <header className="w-full max-w-[1000px] mx-auto py-6 flex items-center justify-between z-20 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-white">
            Digital Wellness <span className="text-gray-400 font-normal">Hub</span>
          </span>
        </div>

        <nav className="flex items-center gap-5 text-xs font-medium text-gray-400">
          <a href="#comparison-table" className="hover:text-white transition flex items-center gap-1">
            <Scale size={13} />
            Matrix
          </a>
          <a href="#guides-section" className="hover:text-white transition flex items-center gap-1">
            <BookOpen size={13} />
            Guides
          </a>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="hover:text-white transition flex items-center gap-1"
          >
            <MessageSquare size={13} />
            Feedback
          </button>
          <a 
            href="http://127.0.0.1:8000/docs" 
            target="_blank" 
            rel="noreferrer" 
            className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition flex items-center gap-1"
          >
            API <ExternalLink size={10} />
          </a>
        </nav>
      </header>
      
      {/* Main Content */}
      <main className="w-full flex-1 flex flex-col items-center justify-start z-10 pt-4 md:pt-8 pb-16">
        <SearchArea />
      </main>
      
      {/* Footer */}
      <footer className="relative w-full max-w-[1000px] mx-auto py-8 border-t border-white/[0.06] text-xs text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4 z-10">
        <div>
          Digital Wellness Resource Hub for Students © 2026. Designed with Apple UI/UX priorities.
        </div>
        <div className="flex gap-4 text-gray-400 text-[11px]">
          <span>12 Verified Tools</span>
          <span>•</span>
          <span>Zero Deceptive "Free" Tags</span>
          <span>•</span>
          <span>Tested for Students</span>
        </div>
      </footer>

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
