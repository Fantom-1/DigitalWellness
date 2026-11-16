import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Shield, ExternalLink, Bot, Filter, Search, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchStats, fetchResources, sendChatMessage, fetchGuides } from '../api';
import ComparisonTable from './ComparisonTable';
import SetupGuides from './SetupGuides';
import ToolDetailModal from './ToolDetailModal';

export default function SearchArea({ activeTab, setActiveTab }) {
  // Data states
  const [stats, setStats] = useState({ total_resources: 12, total_guides: 3, verified_date: 'November 2026' });
  const [resources, setResources] = useState([]);
  const [guides, setGuides] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);

  // Directory filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  // Chat states
  const [chatInput, setChatInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  const textareaRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchStats().then(setStats).catch(console.error);
    fetchResources().then(data => setResources(data.results || [])).catch(console.error);
    fetchGuides().then(setGuides).catch(console.error);
  }, []);

  // Filter resources for directory
  const filteredResources = resources.filter(r => {
    const matchesSearch = !searchQuery.trim() || 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesPlat = selectedPlatform === 'all' || r.platforms.includes(selectedPlatform);
    return matchesSearch && matchesCat && matchesPlat;
  });

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.max(76, scrollHeight)}px`;
    }
  }, [chatInput]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  const handleSendChat = async (promptToSend) => {
    const text = promptToSend || chatInput;
    if (!text.trim() || chatLoading) return;

    const userMsg = { role: 'user', content: text };
    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setChatInput('');
    setChatLoading(true);

    try {
      const historyPayload = chatMessages.map(m => ({ role: m.role, content: m.content }));
      const response = await sendChatMessage(text, historyPayload);
      
      const assistantMsg = {
        role: 'assistant',
        content: response.reply,
        recommended_tools: response.recommended_tools || [],
        relevant_guide_slug: response.relevant_guide_slug
      };
      setChatMessages([...newHistory, assistantMsg]);
    } catch (err) {
      console.error(err);
      setChatMessages([
        ...newHistory,
        {
          role: 'assistant',
          content: "Unable to connect to the advisor service. Please verify the backend is running."
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setChatInput(promptText);
    handleSendChat(promptText);
  };

  const handleSelectToolFromSlug = (slug) => {
    const found = resources.find(r => r.slug === slug);
    if (found) {
      setSelectedTool(found);
    }
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto flex flex-col items-center">
      
      {/* 1. ADVISOR VIEW */}
      {activeTab === 'advisor' && (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
          
          {/* Header */}
          <div className="text-center mb-6 w-full flex flex-col items-center mt-2 md:mt-4">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-3">
              Curated for Student Focus
            </span>
            
            <h1 className="text-4xl md:text-6xl font-semibold mb-3 text-[#1d1d1f] tracking-tight">
              Digital Wellness.
            </h1>
            <p className="text-zinc-500 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed">
              Practical focus tools, screen time controls, and bedtime device routines.
            </p>
          </div>

          {/* Glass Prompt Panel for Light Theme */}
          <motion.div 
            className={`w-full relative mt-3 ${isFocused ? 'panel-focused' : ''}`}
            animate={{ scale: isFocused ? 1.002 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Ambient Aura behind the panel: softly radiates outside with radial falloff */}
            <div 
              className={`absolute -inset-3.5 rounded-[28px] overflow-hidden pointer-events-none z-0 transition-opacity duration-300 ${
                isFocused ? 'opacity-85' : 'opacity-55'
              }`}
              style={{
                WebkitMask: 'radial-gradient(ellipse at center, black 65%, transparent 98%)',
                mask: 'radial-gradient(ellipse at center, black 65%, transparent 98%)'
              }}
            >
              <div className="comet-glow" />
            </div>

            {/* Main Card Shell */}
            <div className="absolute inset-0 rounded-[22px] z-10 pointer-events-none">
              {/* Card surface: inset by border track width */}
              <div className="absolute inset-[2.5px] bg-white/92 backdrop-blur-[24px] rounded-[19.5px] shadow-[0_12px_36px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] z-10" />
              
              {/* 2.5px Prominent Border Track with Moving Comet Beam */}
              <div 
                className="absolute inset-0 rounded-[22px] p-[2.5px] overflow-hidden z-20" 
                style={{
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude'
                }}
              >
                {/* Resting subtle border line so structure is always crisp */}
                <div className="absolute inset-0 bg-black/[0.08]" />
                {/* Dynamic vibrant illuminated border beam */}
                <div className="comet-spinner" />
              </div>
            </div>

            <div className="p-4 md:p-5 flex flex-col justify-between relative z-30 min-h-[140px]">
              <textarea
                ref={textareaRef}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChat();
                  }
                }}
                placeholder="Describe your habit, device, or study challenge..."
                className="w-full bg-transparent text-[#1d1d1f] text-base md:text-lg outline-none resize-none placeholder-zinc-400 px-2 font-light leading-relaxed"
                style={{ minHeight: '76px' }}
              />

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-black/[0.04] px-1">
                <span className="text-[11px] font-mono text-zinc-400">
                  Powered by Gemini
                </span>

                <button 
                  onClick={() => handleSendChat()}
                  disabled={!chatInput.trim() || chatLoading}
                  className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 text-xs font-semibold ${
                    chatInput.trim() && !chatLoading
                      ? 'bg-[#1d1d1f] text-white hover:bg-black shadow-sm' 
                      : 'text-zinc-400 bg-black/[0.04] opacity-50 cursor-not-allowed'
                  }`}
                >
                  {chatLoading ? (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>
                      <span>Ask Advisor</span>
                      <ArrowUp size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Quick Prompts (Only if no messages) */}
          {chatMessages.length === 0 && (
            <div className="flex flex-wrap justify-center gap-2 text-xs w-full max-w-2xl mt-6 animate-in fade-in duration-300">
              <button 
                onClick={() => handleQuickPrompt("Block YouTube recommendations and shorts while studying on desktop")} 
                className="bg-white/80 hover:bg-white text-zinc-600 hover:text-black border border-black/[0.05] px-4 py-2 rounded-full transition-all text-left font-light shadow-xs"
              >
                Block YouTube recommendations and shorts while studying
              </button>
              <button 
                onClick={() => handleQuickPrompt("Set up strict iOS Downtime without bypass loopholes")} 
                className="bg-white/80 hover:bg-white text-zinc-600 hover:text-black border border-black/[0.05] px-4 py-2 rounded-full transition-all text-left font-light shadow-xs"
              >
                Set up strict iOS Downtime without bypass loopholes
              </button>
              <button 
                onClick={() => handleQuickPrompt("Open-source focus tools with zero data collection")} 
                className="bg-white/80 hover:bg-white text-zinc-600 hover:text-black border border-black/[0.05] px-4 py-2 rounded-full transition-all text-left font-light shadow-xs"
              >
                Open-source focus tools with zero data collection
              </button>
            </div>
          )}

          {/* Conversation Stream */}
          {chatMessages.length > 0 && (
            <div className="w-full max-w-[850px] flex flex-col gap-6 mt-8 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Advisor Response
                </span>
                <button
                  onClick={() => setChatMessages([])}
                  className="text-xs text-zinc-400 hover:text-black transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-6">
                {chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {msg.role === 'user' ? (
                      <div className="max-w-xl bg-[#1d1d1f] text-white px-5 py-3 rounded-2xl text-sm leading-relaxed font-light shadow-sm">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="w-full bg-white border border-black/[0.06] rounded-3xl p-6 md:p-8 shadow-sm">
                        <div className="text-zinc-700 text-sm md:text-base leading-relaxed space-y-3 font-light whitespace-pre-line">
                          {msg.content}
                        </div>

                        {/* Recommended Tool Badges */}
                        {msg.recommended_tools && msg.recommended_tools.length > 0 && (
                          <div className="mt-6 pt-5 border-t border-black/[0.06]">
                            <h5 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-3">
                              Recommended Resources
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {msg.recommended_tools.map((rec) => (
                                <button
                                  key={rec.slug}
                                  onClick={() => handleSelectToolFromSlug(rec.slug)}
                                  className="p-3.5 rounded-2xl bg-zinc-50 border border-black/[0.04] hover:border-black/15 hover:bg-white transition-all text-left flex flex-col justify-between group shadow-2xs"
                                >
                                  <div>
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-semibold text-xs text-[#1d1d1f] group-hover:text-blue-600 transition-colors">
                                        {rec.name}
                                      </span>
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-black/[0.06] text-zinc-600">
                                        {rec.pricing_type}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-500 line-clamp-2 font-light">
                                      {rec.reason}
                                    </p>
                                  </div>
                                  <span className="mt-2 text-[10px] text-zinc-600 group-hover:text-black font-medium transition-colors">
                                    Watch Video & Inspect →
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Guide Referral */}
                        {msg.relevant_guide_slug && (
                          <div className="mt-4 p-3 bg-zinc-50 border border-black/[0.04] rounded-2xl flex items-center justify-between">
                            <span className="text-xs text-zinc-600 font-light">
                              Related setup protocol available.
                            </span>
                            <button
                              onClick={() => setActiveTab('guides')}
                              className="text-xs font-semibold text-[#1d1d1f] hover:underline transition-colors"
                            >
                              Open Guide →
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex items-center gap-2.5 text-xs text-zinc-500 py-2">
                    <span className="w-3 h-3 rounded-full border-2 border-zinc-500 border-t-transparent animate-spin" />
                    <span>Analyzing wellness catalog...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
          )}

        </div>
      )}

      {/* 2. DIRECTORY VIEW */}
      {activeTab === 'directory' && (
        <div className="w-full text-left animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-black/[0.06]">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] tracking-tight">Curated Directory</h2>
              <p className="text-zinc-500 text-sm mt-1 max-w-xl font-light">
                Twelve vetted student digital wellness resources. Click any tool to inspect full evaluation criteria and play video tutorials.
              </p>
            </div>
            <span className="text-xs text-zinc-400 mt-2 md:mt-0 font-mono">
              {filteredResources.length} of 12 Resources
            </span>
          </div>

          {/* Search & Filter Header */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search tools, platforms, or capabilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-black/10 rounded-2xl text-xs text-[#1d1d1f] placeholder-zinc-400 focus:outline-none focus:border-black/30 font-light shadow-xs"
              />
            </div>

            {/* Platform Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 apple-scrollbar">
              {['all', 'macOS', 'iOS', 'Windows', 'Android', 'Chrome'].map((plat) => (
                <button
                  key={plat}
                  onClick={() => setSelectedPlatform(plat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                    selectedPlatform === plat
                      ? 'bg-[#1d1d1f] text-white shadow-sm'
                      : 'bg-white border border-black/[0.06] text-zinc-600 hover:text-black hover:border-black/15'
                  }`}
                >
                  {plat === 'all' ? 'All Platforms' : plat}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'focus_blocker', label: 'Focus Blockers' },
              { id: 'screen_time', label: 'Screen Time' },
              { id: 'bedtime_routine', label: 'Bedtime Routines' },
              { id: 'privacy_safety', label: 'Privacy & Safety' },
              { id: 'browser_extension', label: 'Browser Extensions' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-800 text-white'
                    : 'bg-white border border-black/[0.05] text-zinc-600 hover:text-black'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 3-Column Clean Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedTool(item)}
                className="bg-white border border-black/[0.06] hover:border-black/15 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer group shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
              >
                {/* Visual Thumbnail Wireframe Preview with Play Video badge */}
                {item.image_url && (
                  <div className="w-full h-36 relative overflow-hidden bg-zinc-100 border-b border-black/[0.04]">
                    <img 
                      src={item.image_url} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                    
                    {item.video_tutorial_url && (
                      <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-black/75 hover:bg-black text-[10px] text-white backdrop-blur-md border border-white/20 font-medium flex items-center gap-1.5 transition-all shadow-sm">
                        <Play size={9} fill="currentColor" />
                        Play Video
                      </span>
                    )}
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                        {item.category.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/[0.04] text-zinc-700 font-medium">
                        {item.pricing_type}
                      </span>
                    </div>

                    <h3 className="font-semibold text-[#1d1d1f] text-base group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h3>
                    
                    <p className="text-xs text-zinc-500 mt-2 line-clamp-2 font-light leading-relaxed">
                      {item.tagline || item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-black/[0.04] flex items-center justify-between text-[11px] text-zinc-500">
                    <div className="flex items-center gap-1">
                      {item.platforms.slice(0, 3).map((p) => (
                        <span key={p} className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 text-[10px]">
                          {p}
                        </span>
                      ))}
                      {item.platforms.length > 3 && (
                        <span className="text-[10px] text-zinc-400">+{item.platforms.length - 3}</span>
                      )}
                      {item.extension_url && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                          Ext
                        </span>
                      )}
                    </div>

                    <span className="group-hover:text-black font-medium transition-colors">
                      Inspect →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. COMPARISON VIEW */}
      {activeTab === 'compare' && (
        <ComparisonTable 
          resources={resources} 
          onSelectResource={(tool) => setSelectedTool(tool)}
        />
      )}

      {/* 4. SETUP GUIDES VIEW */}
      {activeTab === 'guides' && (
        <SetupGuides guides={guides} />
      )}

      {/* Detail Modal with Onsite Playable Video */}
      <ToolDetailModal 
        tool={selectedTool} 
        onClose={() => setSelectedTool(null)} 
      />

    </div>
  );
}
