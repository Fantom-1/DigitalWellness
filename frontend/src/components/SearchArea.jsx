import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowUp, 
  Plus, 
  Smartphone, 
  Laptop, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Bot, 
  Filter, 
  Clock, 
  Scale, 
  Eye, 
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchStats, fetchResources, sendChatMessage, fetchGuides } from '../api';
import ComparisonTable from './ComparisonTable';
import SetupGuides from './SetupGuides';
import SubmissionModal from './SubmissionModal';

export default function SearchArea() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'browse'
  
  // Data states
  const [stats, setStats] = useState({ total_resources: 12, total_guides: 3, verified_date: 'November 2026' });
  const [resources, setResources] = useState([]);
  const [guides, setGuides] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState('all');

  // Chat states
  const [chatInput, setChatInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const textareaRef = useRef(null);
  const chatEndRef = useRef(null);

  // Initial load
  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(console.error);

    fetchResources()
      .then(data => {
        const list = data.results || [];
        setResources(list);
        if (list.length > 0) setSelectedResource(list[0]);
      })
      .catch(console.error);

    fetchGuides()
      .then(setGuides)
      .catch(console.error);
  }, []);

  // Filter effect
  useEffect(() => {
    if (activeTab === 'browse') {
      fetchResources({
        q: searchQuery,
        category: selectedCategory,
        platform: selectedPlatform,
        pricing_type: selectedPricing
      }).then(data => {
        const list = data.results || [];
        setResources(list);
        if (list.length > 0 && !selectedResource) {
          setSelectedResource(list[0]);
        }
      }).catch(console.error);
    }
  }, [searchQuery, selectedCategory, selectedPlatform, selectedPricing, activeTab]);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.max(90, scrollHeight)}px`;
    }
  }, [chatInput, searchQuery]);

  // Scroll to bottom of chat
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
      const response = await sendChatMessage(text, historyPayload, selectedPlatform !== 'all' ? selectedPlatform : null);
      
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
          content: "Sorry, I ran into an error connecting to the Wellness Advisor. Please ensure your backend is running or try again."
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setActiveTab('chat');
    setChatInput(promptText);
    handleSendChat(promptText);
  };

  const handleSelectToolFromChat = (toolSlug) => {
    const found = resources.find(r => r.slug === toolSlug);
    if (found) {
      setSelectedResource(found);
      setActiveTab('browse');
      const elem = document.getElementById('featured-tool-profile');
      elem?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-[1000px] mx-auto flex flex-col items-center">
      
      {/* Centered Header Section */}
      <div className="text-center mb-6 w-full flex flex-col items-center mt-2 md:mt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 mb-6 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          {stats.total_resources} Curated Student Tools • {stats.total_guides} Practical Guides • Verified {stats.verified_date}
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white tracking-tight">
          Digital Wellness.
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
          The curated student guide to master screen time, eliminate study distractions, and reclaim bedtime device routines.
        </p>

        {/* Apple Segmented Mode Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-full bg-white/5 border border-white/10 mt-6 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium transition-all ${
              activeTab === 'chat'
                ? 'bg-white text-black shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bot size={15} />
            Ask Wellness AI (Use-Case Chatbot)
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium transition-all ${
              activeTab === 'browse'
                ? 'bg-white text-black shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Filter size={15} />
            Find & Compare Tools
          </button>
        </div>
      </div>

      {/* Main Glass Search & Chat Panel */}
      <motion.div 
        className={`w-full relative mt-4 ${isFocused ? 'panel-focused' : ''}`}
        animate={{ scale: isFocused ? 1.003 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Outer panel wrapper for the glass touch screen effect */}
        <div className="absolute inset-0 rounded-[20px] z-0">
          <div className="absolute inset-[1px] bg-[#111111]/70 backdrop-blur-[24px] rounded-[19px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),inset_0_24px_48px_rgba(255,255,255,0.02)] z-10" />
          
          {/* Animated comet glow border */}
          <div 
            className="absolute inset-0 rounded-[20px] p-[1px] overflow-hidden z-20" 
            style={{
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude'
            }}
          >
            <div className="comet-spinner" />
          </div>

          <div className="absolute inset-0 overflow-hidden rounded-[20px] z-0">
            <div className="comet-glow" />
          </div>
        </div>

        {/* Content Box */}
        <div className="p-5 flex flex-col justify-between relative z-30 min-h-[160px]">
          
          {activeTab === 'chat' ? (
            /* Chat Mode Input */
            <>
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2 px-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5 font-medium text-purple-300">
                    <Sparkles size={14} className="text-purple-400" />
                    Describe your digital wellness problem, schedule, or device habit:
                  </span>
                  <span className="text-[11px] text-gray-500 font-mono">Powered by Gemini AI</span>
                </div>
                
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
                  placeholder="e.g. I keep getting sucked into YouTube Shorts and Instagram reels late at night on Mac and Android. What's free that I cannot easily bypass?"
                  className="w-full bg-transparent text-gray-200 text-base md:text-lg outline-none resize-none placeholder-gray-600 px-2 font-sans leading-relaxed"
                  style={{ minHeight: '90px' }}
                />
              </div>

              {/* Chat Bottom Controls */}
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/[0.08] px-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Filter Device:</span>
                  {['all', 'iOS', 'Android', 'macOS', 'Windows'].map((plat) => (
                    <button
                      key={plat}
                      onClick={() => setSelectedPlatform(plat)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                        selectedPlatform === plat
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {plat === 'all' ? 'Any Device' : plat}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => handleSendChat()}
                  disabled={!chatInput.trim() || chatLoading}
                  className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 text-xs font-semibold ${
                    chatInput.trim() && !chatLoading
                      ? 'bg-white text-black hover:bg-gray-200 shadow-md' 
                      : 'text-gray-500 bg-white/5 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {chatLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Ask Wellness AI
                      <ArrowUp size={15} />
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Direct Filter / Search Mode */
            <>
              <div className="flex flex-col">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Search 12 curated tools by name, features, or restrictions..."
                  className="w-full bg-transparent text-gray-200 text-lg outline-none placeholder-gray-600 px-2 font-sans py-2"
                />

                {/* Filter Pills Grid */}
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/[0.08] text-xs">
                  <span className="text-gray-500 text-[11px] font-medium mr-1">Category:</span>
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'focus_blocker', label: 'Focus Blockers' },
                    { id: 'screen_time', label: 'Screen Time' },
                    { id: 'bedtime_routine', label: 'Bedtime' },
                    { id: 'privacy_safety', label: 'Privacy' },
                    { id: 'browser_extension', label: 'Extensions' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-white text-black'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                  <span className="text-gray-500 text-[11px] font-medium mr-1">Pricing:</span>
                  {['all', '100% Free', 'Open Source', 'Freemium', 'Paid'].map(price => (
                    <button
                      key={price}
                      onClick={() => setSelectedPricing(price)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                        selectedPricing === price
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      {price === 'all' ? 'All Pricing' : price}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </motion.div>

      {/* Quick Prompts as Aesthetic Pills (When in Chat mode & no messages yet) */}
      {activeTab === 'chat' && chatMessages.length === 0 && (
        <div className="flex flex-wrap justify-center gap-2.5 text-xs w-full max-w-3xl mt-6 animate-in fade-in duration-300">
          <button 
            onClick={() => handleQuickPrompt("I cannot stop scrolling YouTube shorts late at night on Windows and Android. What can I do that is completely free?")} 
            className="bg-[#151515] hover:bg-[#202020] text-gray-300 border border-white/5 px-4 py-2 rounded-full transition-all hover:scale-[1.01] shadow-sm text-left"
          >
            🚫 Block YouTube Shorts & reels during study (Free)
          </button>
          <button 
            onClick={() => handleQuickPrompt("How do I set up Screen Time on iOS so I cannot bypass the 15 minute ignore limit?")} 
            className="bg-[#151515] hover:bg-[#202020] text-gray-300 border border-white/5 px-4 py-2 rounded-full transition-all hover:scale-[1.01] shadow-sm text-left"
          >
            🔒 Prevent bypassing iPhone Screen Time limits
          </button>
          <button 
            onClick={() => handleQuickPrompt("Best zero-telemetry open source digital wellness tools for Mac and Windows")} 
            className="bg-[#151515] hover:bg-[#202020] text-gray-300 border border-white/5 px-4 py-2 rounded-full transition-all hover:scale-[1.01] shadow-sm text-left"
          >
            🛡️ Zero-telemetry open source focus tools
          </button>
        </div>
      )}

      {/* Interactive Chatbot Conversation Stream */}
      {activeTab === 'chat' && chatMessages.length > 0 && (
        <div className="w-full max-w-[1000px] flex flex-col gap-6 mt-8 text-left animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Wellness Counseling Session
            </span>
            <button
              onClick={() => setChatMessages([])}
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Clear Conversation
            </button>
          </div>

          <div className="space-y-6">
            {chatMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.role === 'user' ? (
                  <div className="max-w-2xl bg-white/10 border border-white/15 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed shadow-md">
                    {msg.content}
                  </div>
                ) : (
                  <div className="w-full max-w-3xl bg-[#111111]/90 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-purple-400">
                      <Bot size={16} />
                      Student Wellness Advisor
                    </div>

                    {/* Markdown Body */}
                    <div className="text-gray-200 text-sm md:text-base leading-relaxed space-y-3 font-light whitespace-pre-line">
                      {msg.content}
                    </div>

                    {/* Recommended Tool Badges */}
                    {msg.recommended_tools && msg.recommended_tools.length > 0 && (
                      <div className="mt-6 pt-5 border-t border-white/[0.08]">
                        <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                          Recommended Verified Tools from Hub:
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {msg.recommended_tools.map((rec) => (
                            <div 
                              key={rec.slug}
                              onClick={() => handleSelectToolFromChat(rec.slug)}
                              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-400/40 hover:bg-white/[0.06] transition-all cursor-pointer group flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center justify-between">
                                  <h6 className="font-semibold text-xs text-white group-hover:text-purple-300 transition-colors">
                                    {rec.name}
                                  </h6>
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                                    {rec.pricing_type}
                                  </span>
                                </div>
                                <p className="text-[11px] text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                                  {rec.reason}
                                </p>
                              </div>
                              <span className="mt-2 text-[10px] text-purple-400 flex items-center gap-1 group-hover:underline">
                                View Specs & Criteria →
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Guide Referral Banner */}
                    {msg.relevant_guide_slug && (
                      <div className="mt-4 p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <BookOpen size={16} className="text-blue-400 shrink-0" />
                          <span className="text-xs text-blue-200">
                            A step-by-step setup guide is available for this setup.
                          </span>
                        </div>
                        <a 
                          href="#guides-section"
                          className="text-xs font-semibold text-blue-300 hover:text-white px-3 py-1 bg-blue-500/20 rounded-lg transition-colors shrink-0"
                        >
                          View Guide ↓
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {chatLoading && (
              <div className="flex items-center gap-3 text-xs text-gray-400 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl w-fit">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                Synthesizing student wellness recommendation from database...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
      )}

      {/* Featured / Selected Tool Card (Evaluating 6 Rubric Criteria) */}
      {selectedResource && (
        <div id="featured-tool-profile" className="flex flex-col gap-6 mt-12 w-full max-w-[1000px] text-left animate-in fade-in duration-500">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Eye size={14} className="text-purple-400" />
              Detailed Resource Evaluation
            </span>
            <span className="text-xs text-gray-500 font-mono">
              Verified Date: {selectedResource.verified_date}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start w-full bg-[#111111]/70 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
            
            {/* Left Column: Name, Tagline, & Description */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium capitalize">
                  {selectedResource.category.replace('_', ' ')}
                </span>
                <span className="text-xs text-yellow-400 font-medium">
                  ★ {selectedResource.student_rating} Student Score
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                {selectedResource.name}
              </h2>
              <p className="text-base text-gray-400 font-light mb-4 leading-relaxed">
                {selectedResource.tagline}
              </p>
              
              <div className="text-gray-300 leading-relaxed text-sm md:text-base font-light space-y-4">
                <p>{selectedResource.description}</p>
                
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-blue-400" /> Purpose & Academic Fit
                  </h4>
                  <p className="text-xs text-gray-300 font-light leading-relaxed">
                    {selectedResource.purpose}
                  </p>
                </div>
              </div>

              {selectedResource.official_url && (
                <div className="mt-6 flex items-center gap-3">
                  <a
                    href={selectedResource.official_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-gray-200 font-semibold text-xs transition-all shadow-md"
                  >
                    Visit Official Site
                    <ExternalLink size={13} />
                  </a>
                  {selectedResource.repository_url && (
                    <a
                      href={selectedResource.repository_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs transition-all border border-white/10"
                    >
                      View Source Code
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Consistent Evaluation Criteria Matrix */}
            <div className="w-full md:w-[380px] shrink-0 bg-white/[0.02] border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4 pb-2 border-b border-white/10">
                Evaluation Criteria
              </h3>

              <div className="flex flex-col divide-y divide-white/[0.08] text-xs">
                {/* 1. Platforms */}
                <div className="py-3 flex justify-between items-start">
                  <span className="text-gray-400 font-medium w-24 shrink-0">Platforms</span>
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {selectedResource.platforms.map(p => (
                      <span key={p} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-200 text-[11px]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. Pricing & Cost Breakdown */}
                <div className="py-3 flex justify-between items-start">
                  <span className="text-gray-400 font-medium w-24 shrink-0">Cost Model</span>
                  <div className="flex flex-col items-end text-right">
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 font-medium text-[11px] mb-1">
                      {selectedResource.pricing_type}
                    </span>
                    <span className="text-[11px] text-gray-400 leading-tight max-w-[200px]">
                      {selectedResource.price_details}
                    </span>
                  </div>
                </div>

                {/* 3. Privacy & Telemetry */}
                <div className="py-3 flex justify-between items-start">
                  <span className="text-gray-400 font-medium w-24 shrink-0">Privacy</span>
                  <div className="flex flex-col items-end text-right">
                    <div className="flex items-center gap-1 text-blue-300 font-mono text-[11px] mb-0.5">
                      <Shield size={12} />
                      <span className="font-bold">{selectedResource.privacy_rating}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 leading-tight max-w-[200px]">
                      {selectedResource.privacy_details}
                    </span>
                  </div>
                </div>

                {/* 4. Accessibility */}
                <div className="py-3 flex justify-between items-start">
                  <span className="text-gray-400 font-medium w-24 shrink-0">Accessibility</span>
                  <span className="text-[11px] text-gray-300 text-right leading-tight max-w-[200px]">
                    {selectedResource.accessibility_features}
                  </span>
                </div>

                {/* 5. Limitations & Bypass */}
                <div className="py-3 flex justify-between items-start">
                  <span className="text-gray-400 font-medium w-24 shrink-0">Limitations</span>
                  <div className="flex items-start gap-1 text-[11px] text-yellow-300/90 text-right leading-tight max-w-[200px]">
                    <AlertTriangle size={12} className="text-yellow-400 shrink-0 mt-0.5" />
                    <span>{selectedResource.limitations}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Comparison Matrix Table */}
      <ComparisonTable 
        resources={resources} 
        onSelectResource={(item) => {
          setSelectedResource(item);
          const elem = document.getElementById('featured-tool-profile');
          elem?.scrollIntoView({ behavior: 'smooth' });
        }} 
      />

      {/* 3 Practical Student Setup Guides */}
      <SetupGuides guides={guides} />

      {/* Student Feedback & Submission Banner */}
      <div className="w-full max-w-[1000px] mt-16 p-8 rounded-3xl bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div>
          <h3 className="text-xl font-bold text-white">Have a Setup Tip or Feedback?</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-lg">
            Submit your feedback, tool corrections, or video walkthroughs to help update the student hub.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-white text-black hover:bg-gray-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-lg shrink-0"
        >
          <MessageSquare size={14} />
          Submit Feedback / Media
        </button>
      </div>

      {/* Modal */}
      <SubmissionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

    </div>
  );
}
