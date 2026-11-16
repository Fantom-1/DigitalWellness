import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowUp, Shield, ExternalLink, Bot, Filter, Search, Play, 
  ChevronLeft, ChevronRight, BookOpen, AlertCircle, Sparkles, 
  Puzzle, Download, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchStats, fetchResources, sendChatMessage, fetchGuides } from '../api';
import ComparisonTable from './ComparisonTable';
import SetupGuides from './SetupGuides';
import ToolDetailModal from './ToolDetailModal';

const DISTRACTION_SOLUTIONS = [
  {
    slug: 'unhook',
    distraction: 'YouTube Algorithm & Shorts',
    solution: 'Hides YouTube recommendations, sidebar feeds, and Shorts so it acts purely as an educational search engine.',
    type: 'Browser Extension',
    prompt: 'How do I use Unhook to block YouTube recommendations and shorts while studying?'
  },
  {
    slug: 'cold-turkey-blocker',
    distraction: 'Desktop App & Game Bypasses',
    solution: 'Operates at the system kernel level to enforce un-bypassable blocks on apps, games, and domains during study blocks.',
    type: 'Desktop App (Mac & PC)',
    prompt: 'How does Cold Turkey Blocker prevent me from bypassing website limits during exam prep?'
  },
  {
    slug: 'one-sec',
    distraction: 'Compulsive Social Media Opens',
    solution: 'Forces a mandatory 3-second guided breath before opening Instagram or TikTok, cutting compulsive opens by 57%.',
    type: 'Mobile App (iOS & Android)',
    prompt: 'How does One Sec use mindful breathing friction to reduce impulsive phone pickups?'
  },
  {
    slug: 'sleep-as-android-apple-sleep',
    distraction: 'Bedtime Doomscrolling & Snoozing',
    solution: 'Automates sunset blue-light filtration and requires scanning a bathroom QR code to stop morning alarms.',
    type: 'Bedtime Routine (Mobile)',
    prompt: 'What is the best way to set up captive QR-code alarms and sleep routines before exams?'
  },
  {
    slug: 'freedom',
    distraction: 'Multi-Device Procrastination',
    solution: 'Blocks distracting apps and sites across Mac, iPhone, Windows, and Android in unified lockstep.',
    type: 'Multi-Device Sync',
    prompt: 'How does Freedom sync block sessions across laptop and phone simultaneously?'
  },
  {
    slug: 'ublock-origin',
    distraction: 'Intrusive Ads & Web Clutter',
    solution: 'Zero-telemetry content blocker with an element picker to permanently zap distracting banners on study sites.',
    type: 'Browser Extension (Open Source)',
    prompt: 'How do I use uBlock Origin element picker to zap distracting banners on study websites?'
  },
  {
    slug: 'olauncher',
    distraction: 'Home Screen Icon Dopamine',
    solution: 'Replaces flashy, notification-badged Android home screens with a serene, monochrome text-only launcher.',
    type: 'Android Launcher (FOSS)',
    prompt: 'How does switching to Olauncher minimal launcher reduce phone pickups?'
  },
  {
    slug: 'stayfree',
    distraction: 'Uncontrolled Screen Time Hours',
    solution: 'Detailed screen time analytics with PIN-protected app limits that an accountability partner can lock for you.',
    type: 'Screen Time App',
    prompt: 'How can I set PIN-locked daily app limits with StayFree?'
  },
  {
    slug: 'forest',
    distraction: 'Study Motivation Slumps',
    solution: 'Visual Pomodoro timer that grows virtual trees as you study, withering them if you leave the study app.',
    type: 'Gamified Focus App',
    prompt: 'How do I use Forest Pomodoro to stay focused during 90-minute study blocks?'
  },
  {
    slug: 'opal',
    distraction: 'Study Session App Overrides',
    solution: 'Uses Apple Screen Time API to automate scheduled Deep Focus lockouts where overrides and uninstalls are blocked.',
    type: 'iOS & macOS Focus',
    prompt: 'How does Opal Deep Focus lockout mode prevent canceling focus sessions?'
  },
  {
    slug: 'leechblock-ng',
    distraction: 'Excessive Web Time Allowances',
    solution: 'Enforces daily time banks (e.g. max 15 minutes of social sites per day) directly inside desktop web browsers.',
    type: 'Browser Extension',
    prompt: 'How do I set up 15-minute daily website time limits with LeechBlock NG?'
  },
  {
    slug: 'signal',
    distraction: 'Noisy Group Chats & Feeds',
    solution: 'Zero-distraction group study messaging with end-to-end encryption and no algorithms, ads, or feeds.',
    type: 'Private Messaging App',
    prompt: 'Why is Signal better for focused study group communication than social messaging apps?'
  },
  {
    slug: 'flux',
    distraction: 'Circadian Blue Light & Late Screentime',
    solution: 'Automatically warms display color temperature after sunset to prevent melatonin suppression and late-night insomnia.',
    type: 'Bedtime Routine (Desktop & iOS)',
    prompt: 'How do I configure f.lux circadian lighting to improve sleep quality while studying late?'
  },
  {
    slug: 'news-feed-eradicator',
    distraction: 'Infinite Social Feeds on Desktop',
    solution: 'Replaces endless algorithmic feeds on Facebook, Twitter, Reddit, LinkedIn, and YouTube with inspiring quotes.',
    type: 'Browser Extension',
    prompt: 'How does News Feed Eradicator replace social media doomscroll feeds with study quotes?'
  },
  {
    slug: 'alarmy',
    distraction: 'Morning Oversleeping & Snoozing',
    solution: 'Forces cognitive missions (math problems, barcode/QR scanning, memory puzzles) before silencing morning alarms.',
    type: 'Bedtime Routine (Mobile App)',
    prompt: 'How can I configure Alarmy barcode scanning to force myself out of bed for 8 AM classes?'
  }
];

const CAROUSEL_PAGES = [
  DISTRACTION_SOLUTIONS.slice(0, 3),
  DISTRACTION_SOLUTIONS.slice(3, 6),
  DISTRACTION_SOLUTIONS.slice(6, 9),
  DISTRACTION_SOLUTIONS.slice(9, 12),
  DISTRACTION_SOLUTIONS.slice(12, 15),
];

function renderInlineMarkdown(text) {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-[#1d1d1f]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function FormattedAdvisorContent({ content }) {
  if (!content) return null;
  const paragraphs = content.split('\n\n');

  return (
    <div className="space-y-3 font-light text-zinc-700 text-sm md:text-base leading-relaxed">
      {paragraphs.map((para, pIdx) => {
        const lines = para.split('\n').filter(Boolean);
        const isList = lines.length > 0 && lines.every(l => l.trim().startsWith('* ') || l.trim().startsWith('- ') || /^\d+\.\s/.test(l.trim()));

        if (isList) {
          return (
            <ul key={pIdx} className="space-y-1.5 pl-1 my-2">
              {lines.map((l, lIdx) => {
                const cleaned = l.replace(/^[\*\-]\s+/, '').replace(/^\d+\.\s+/, '');
                return (
                  <li key={lIdx} className="flex items-start gap-2 text-xs md:text-sm text-zinc-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                    <span>{renderInlineMarkdown(cleaned)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        if (para.startsWith('### ')) {
          return (
            <h4 key={pIdx} className="text-sm md:text-base font-semibold text-[#1d1d1f] mt-3 pt-1">
              {renderInlineMarkdown(para.replace('### ', ''))}
            </h4>
          );
        }

        return (
          <p key={pIdx}>
            {lines.map((line, lineIdx) => (
              <React.Fragment key={lineIdx}>
                {renderInlineMarkdown(line)}
                {lineIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default function SearchArea({ activeTab, setActiveTab }) {
  // Data states
  const [stats, setStats] = useState({ total_resources: 15, total_guides: 3, verified_date: 'November 2026' });
  const [resources, setResources] = useState([]);
  const [guides, setGuides] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [activeGuideSlug, setActiveGuideSlug] = useState(null);

  const handleOpenGuide = (slug) => {
    setActiveGuideSlug(slug);
    setActiveTab('guides');
  };

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
  const [carouselPage, setCarouselPage] = useState(0);

  const handlePrevCarousel = () => {
    setCarouselPage((prev) => (prev > 0 ? prev - 1 : CAROUSEL_PAGES.length - 1));
  };

  const handleNextCarousel = () => {
    setCarouselPage((prev) => (prev < CAROUSEL_PAGES.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    fetchStats().then(setStats).catch(console.error);
    fetchResources().then(data => setResources(data.results || [])).catch(console.error);
    fetchGuides().then(setGuides).catch(console.error);
  }, []);

  const isBrowserExtension = (item) => {
    if (item.category === 'browser_extension') return true;
    if (item.extension_url && (item.extension_url.includes('chromewebstore') || item.extension_url.includes('addons.mozilla') || item.extension_url.includes('addons.opera'))) return true;
    if (item.platforms && item.platforms.some(p => ['Chrome', 'Firefox', 'Edge', 'Brave', 'Safari', 'Opera'].includes(p))) return true;
    return false;
  };

  // Filter resources for directory
  const filteredResources = resources.filter(r => {
    const matchesSearch = !searchQuery.trim() || 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = selectedCategory === 'all' 
      ? true 
      : (selectedCategory === 'browser_extension' ? isBrowserExtension(r) : r.category === selectedCategory);
    
    const matchesPlat = selectedPlatform === 'all' || 
      (r.platforms && r.platforms.includes(selectedPlatform)) ||
      ((selectedPlatform === 'macOS' || selectedPlatform === 'Windows' || selectedPlatform === 'Chrome') && isBrowserExtension(r));

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
          <motion.div 
            animate={{ 
              marginBottom: chatMessages.length > 0 ? '12px' : '24px'
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-center w-full flex flex-col items-center mt-2 md:mt-4"
          >
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest mb-2">
              Curated for Student Focus
            </span>
            
            <h1 className={`${chatMessages.length > 0 ? 'text-3xl md:text-4xl' : 'text-4xl md:text-6xl'} font-semibold mb-2 text-[#1d1d1f] tracking-tight transition-all duration-300`}>
              Digital Wellness.
            </h1>
            
            <AnimatePresence>
              {chatMessages.length === 0 && (
                <motion.p 
                  key="hero-subtitle"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.25 }}
                  className="text-zinc-500 text-base md:text-lg max-w-xl mx-auto font-light leading-relaxed"
                >
                  Practical focus tools, screen time controls, and bedtime device routines.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Expanding Glass Chat Box Panel for Light Theme */}
          <motion.div 
            layout
            className={`w-full max-w-[850px] relative mt-2 ${isFocused ? 'panel-focused' : ''}`}
            animate={{ scale: isFocused ? 1.002 : 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
              <div className="absolute inset-[2.5px] bg-white/94 backdrop-blur-[24px] rounded-[19.5px] shadow-[0_12px_36px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9)] z-10" />
              
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

            {/* Inner Content of the Chat Box */}
            <div className="p-4 md:p-6 flex flex-col justify-between relative z-30 min-h-[140px]">
              
              {/* 1. INITIAL EMPTY STATE INPUT */}
              {chatMessages.length === 0 ? (
                <div>
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
                          ? 'bg-[#1d1d1f] text-white hover:bg-black shadow-sm cursor-pointer' 
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
              ) : (
                /* 2. EXPANDED ACTIVE CONSULTATION VIEW */
                <div className="flex flex-col">
                  {/* Top Session Bar */}
                  <div className="flex items-center justify-between pb-3 mb-5 border-b border-black/[0.06]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-semibold text-[#1d1d1f] tracking-tight">Active Consultation</span>
                      <span className="text-[10px] font-mono text-zinc-400">• Student Focused</span>
                    </div>

                    <button
                      onClick={() => {
                        setChatMessages([]);
                        setChatInput('');
                      }}
                      className="text-xs text-zinc-500 hover:text-black font-medium px-2.5 py-1 rounded-full hover:bg-black/[0.04] transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>New Consultation</span>
                      <span className="text-zinc-400 text-sm">×</span>
                    </button>
                  </div>

                  {/* Conversation History */}
                  <div className="space-y-6 text-left">
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
                          <div className="w-full bg-[#fbfbfd] border border-black/[0.06] rounded-2xl p-5 md:p-7 shadow-2xs">
                            {/* Advisor Header Bar */}
                            <div className="flex items-center justify-between pb-4 mb-5 border-b border-black/[0.05]">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-[#1d1d1f] flex items-center justify-center text-white">
                                  <Bot size={14} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-[#1d1d1f] tracking-tight">Digital Wellness Advisor</span>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-medium">Curated Strategy</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Student Audited</span>
                              </div>
                            </div>

                            {/* Advisor Written Counsel */}
                            <FormattedAdvisorContent content={msg.content} />

                            {/* Structured Tool Dossiers: Mini Version of the Full Evaluation Matrix */}
                            {msg.recommended_tools && msg.recommended_tools.length > 0 && (
                              <div className="mt-8 pt-6 border-t border-black/[0.06]">
                                <div className="flex items-center justify-between mb-4">
                                  <div>
                                    <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                      <Sparkles size={13} className="text-blue-600" />
                                      Structured Tool Dossiers & Solutions
                                    </h4>
                                    <p className="text-xs text-zinc-500 font-light mt-0.5">
                                      Evaluated for academic focus, zero telemetry, and bypass resistance.
                                    </p>
                                  </div>
                                  <span className="text-[11px] font-mono text-zinc-400">
                                    {msg.recommended_tools.length} Curated Solution{msg.recommended_tools.length > 1 ? 's' : ''}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {msg.recommended_tools.map((rec) => {
                                    const tool = resources.find(r => r.slug === rec.slug) || {
                                      name: rec.name,
                                      slug: rec.slug,
                                      category: rec.category || 'focus_blocker',
                                      pricing_type: rec.pricing_type || 'Free',
                                      platforms: ['macOS', 'Windows', 'Chrome'],
                                      privacy_rating: 'A+',
                                      tagline: rec.reason,
                                      purpose: rec.reason,
                                      limitations: 'Standard platform permissions required.'
                                    };

                                    return (
                                      <div
                                        key={rec.slug || tool.slug}
                                        className="bg-white border border-black/[0.06] hover:border-black/15 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 group shadow-2xs hover:shadow-xs"
                                      >
                                        <div>
                                          {/* Top Row: Meta badges */}
                                          <div className="flex items-start justify-between gap-2 mb-2">
                                            <div>
                                              <div className="flex items-center gap-1.5 mb-1.5">
                                                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/[0.04] text-zinc-600">
                                                  {tool.category.replace('_', ' ')}
                                                </span>
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-black/[0.06] text-zinc-700 font-medium">
                                                  {tool.pricing_type}
                                                </span>
                                              </div>
                                              <h5 
                                                onClick={() => setSelectedTool(tool)}
                                                className="font-semibold text-sm text-[#1d1d1f] group-hover:text-blue-600 transition-colors cursor-pointer"
                                              >
                                                {tool.name}
                                              </h5>
                                            </div>

                                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60 text-[10px] font-mono font-medium flex items-center gap-1 shrink-0">
                                              <Shield size={10} />
                                              {tool.privacy_rating ? `Grade ${tool.privacy_rating}` : 'Grade A'}
                                            </span>
                                          </div>

                                          {/* Platforms */}
                                          {tool.platforms && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                              {tool.platforms.slice(0, 4).map((p) => (
                                                <span key={p} className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 text-[10px]">
                                                  {p}
                                                </span>
                                              ))}
                                              {tool.platforms.length > 4 && (
                                                <span className="text-[10px] text-zinc-400 font-mono">+{tool.platforms.length - 4}</span>
                                              )}
                                            </div>
                                          )}

                                          {/* Advisor Match Callout */}
                                          <div className="text-xs text-blue-950 bg-blue-50/80 border border-blue-100/80 rounded-xl p-3 mb-3 leading-relaxed font-light">
                                            <span className="font-semibold text-blue-900 block text-[11px] mb-0.5">Advisor Assessment:</span>
                                            {rec.reason}
                                          </div>

                                          {/* Tool Purpose & Capabilities ("What we have") */}
                                          <p className="text-xs text-zinc-600 font-light leading-relaxed mb-3">
                                            <strong className="text-zinc-800 font-medium">What It Does: </strong>
                                            {tool.tagline || tool.purpose || tool.description}
                                          </p>

                                          {/* Limitations / Bypass Reality Check */}
                                          {tool.limitations && (
                                            <div className="text-[11px] text-amber-900 bg-amber-500/[0.06] border border-amber-500/15 rounded-xl p-2.5 mb-4 flex items-start gap-1.5 font-light leading-relaxed">
                                              <AlertCircle size={12} className="text-amber-700 shrink-0 mt-0.5" />
                                              <span>
                                                <strong className="font-medium text-amber-950">Limitation: </strong>
                                                {tool.limitations}
                                              </span>
                                            </div>
                                          )}
                                        </div>

                                        {/* Integrated Actions Toolbar */}
                                        <div className="pt-3 border-t border-black/[0.04] flex flex-wrap items-center justify-between gap-2">
                                          <div className="flex items-center gap-1.5">
                                            {tool.video_tutorial_url && (
                                              <button
                                                onClick={() => setSelectedTool(tool)}
                                                className="px-2.5 py-1.5 rounded-xl bg-black/[0.04] hover:bg-black/[0.08] text-zinc-700 hover:text-black text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                                                title="Watch Video Walkthrough"
                                              >
                                                <Play size={10} fill="currentColor" />
                                                Video
                                              </button>
                                            )}
                                            {tool.extension_url && (
                                              <a
                                                href={tool.extension_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60 text-xs font-medium flex items-center gap-1 transition-all"
                                              >
                                                <Puzzle size={11} />
                                                {tool.category === 'browser_extension' ? 'Add Extension' : 'Get App'}
                                              </a>
                                            )}
                                            {tool.documentation_url && (
                                              <a
                                                href={tool.documentation_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="px-2.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium flex items-center gap-1 transition-all"
                                              >
                                                <BookOpen size={11} />
                                                Docs
                                              </a>
                                            )}
                                          </div>

                                          <button
                                            onClick={() => setSelectedTool(tool)}
                                            className="px-3 py-1.5 rounded-xl bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium flex items-center gap-1 transition-all ml-auto cursor-pointer"
                                          >
                                            Inspect Full Dossier →
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Guide Referral Banner */}
                            {msg.relevant_guide_slug && (() => {
                              const guide = guides.find(g => g.slug === msg.relevant_guide_slug);
                              return (
                                <div className="mt-5 p-4 rounded-2xl bg-white border border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                                  <div className="flex items-start gap-3">
                                    <div className="p-2.5 rounded-xl bg-zinc-100 border border-black/[0.04] text-[#1d1d1f] shrink-0 mt-0.5">
                                      <BookOpen size={15} />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                                          Related Setup Protocol
                                        </span>
                                        {guide && (
                                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/[0.04] text-zinc-600 font-mono">
                                            {guide.estimated_minutes} min • {guide.difficulty_level}
                                          </span>
                                        )}
                                      </div>
                                      <h5 className="text-xs font-semibold text-[#1d1d1f] mt-0.5">
                                        {guide ? guide.title : msg.relevant_guide_slug}
                                      </h5>
                                      <p className="text-[11px] text-zinc-500 font-light mt-0.5 line-clamp-1">
                                        {guide ? guide.summary : 'Step-by-step hardened device configuration with zero bypass loopholes.'}
                                      </p>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => handleOpenGuide(msg.relevant_guide_slug)}
                                    className="px-3.5 py-2 rounded-xl bg-[#1d1d1f] hover:bg-black text-white text-xs font-medium shrink-0 flex items-center gap-1.5 transition-all self-end sm:self-center cursor-pointer"
                                  >
                                    Open Protocol Guide →
                                  </button>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    ))}

                    {chatLoading && (
                      <div className="flex items-center gap-2.5 text-xs text-zinc-500 py-3">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-zinc-500 border-t-transparent animate-spin" />
                        <span>Analyzing wellness catalog & academic constraints...</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Follow-up Prompt Input Bar at Bottom of Expanded Chat Box */}
                  <div className="pt-4 border-t border-black/[0.06] mt-4">
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
                      placeholder="Ask a follow-up question or explore another challenge..."
                      className="w-full bg-transparent text-[#1d1d1f] text-sm md:text-base outline-none resize-none placeholder-zinc-400 px-1 font-light leading-relaxed"
                      style={{ minHeight: '52px' }}
                    />

                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-black/[0.04]">
                      <span className="text-[11px] font-mono text-zinc-400">
                        Powered by Gemini
                      </span>

                      <button 
                        onClick={() => handleSendChat()}
                        disabled={!chatInput.trim() || chatLoading}
                        className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-2 text-xs font-semibold ${
                          chatInput.trim() && !chatLoading
                            ? 'bg-[#1d1d1f] text-white hover:bg-black shadow-sm cursor-pointer' 
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
                </div>
              )}

            </div>
          </motion.div>

          {/* Targeted Distraction Remedies: 3-Card Carousel Deck (Removed when chat starts) */}
          <AnimatePresence>
            {chatMessages.length === 0 && (
              <motion.div 
                key="targeted-remedies-deck"
                initial={{ opacity: 0, height: 0, scale: 0.98 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.98, overflow: 'hidden' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-[850px] mt-8 text-left"
              >
                {/* Carousel Header & Apple Paginator */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                      Targeted Remedies
                    </span>
                    <span className="text-zinc-300 font-mono text-[10px]">•</span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Set {carouselPage + 1} of {CAROUSEL_PAGES.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Interactive Dot Indicators */}
                    <div className="flex items-center gap-1.5" role="tablist" aria-label="Remedy slides">
                      {CAROUSEL_PAGES.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCarouselPage(idx)}
                          className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                            carouselPage === idx
                              ? 'w-5 bg-[#1d1d1f]'
                              : 'w-1.5 bg-black/15 hover:bg-black/35'
                          }`}
                          title={`Go to set ${idx + 1}`}
                          aria-label={`Go to set ${idx + 1}`}
                        />
                      ))}
                    </div>

                    {/* Arrow Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handlePrevCarousel}
                        className="p-1.5 rounded-full bg-white border border-black/[0.06] text-zinc-500 hover:text-black hover:border-black/20 shadow-xs transition-all cursor-pointer"
                        title="Previous 3 Tools"
                        aria-label="Previous 3 Tools"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        onClick={handleNextCarousel}
                        className="p-1.5 rounded-full bg-white border border-black/[0.06] text-zinc-500 hover:text-black hover:border-black/20 shadow-xs transition-all cursor-pointer"
                        title="Next 3 Tools"
                        aria-label="Next 3 Tools"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sliding Container: Exactly 3 full cards per view with zero cut-off edges */}
                <div className="w-full overflow-hidden rounded-2xl">
                  <div 
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${carouselPage * 100}%)` }}
                  >
                    {CAROUSEL_PAGES.map((pageCards, pageIdx) => (
                      <div 
                        key={pageIdx} 
                        className="w-full shrink-0 grid grid-cols-1 md:grid-cols-3 gap-3"
                      >
                        {pageCards.map((item) => {
                          const matchedTool = resources.find(r => r.slug === item.slug);
                          return (
                            <div
                              key={item.slug}
                              className="bg-white border border-black/[0.06] hover:border-black/20 rounded-2xl p-4 flex flex-col justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-200 group text-left"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-2">
                                  <span className="text-[10px] font-medium text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-md truncate max-w-[170px]" title={item.distraction}>
                                    {item.distraction}
                                  </span>
                                  <span className="text-[9px] font-mono text-zinc-400 shrink-0">
                                    {item.type.split(' ')[0]}
                                  </span>
                                </div>

                                <h5 className="font-semibold text-sm text-[#1d1d1f] group-hover:text-blue-600 transition-colors">
                                  {matchedTool ? matchedTool.name : item.slug}
                                </h5>
                                <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                                  {item.type}
                                </p>

                                <p className="text-xs text-zinc-500 font-light mt-2 line-clamp-3 leading-relaxed">
                                  {item.solution}
                                </p>
                              </div>

                              <div className="mt-4 pt-3 border-t border-black/[0.04] flex items-center justify-between text-xs">
                                <button
                                  onClick={() => handleSelectToolFromSlug(item.slug)}
                                  className="text-zinc-500 hover:text-black font-medium transition-colors cursor-pointer"
                                >
                                  Inspect Tool →
                                </button>
                                <button
                                  onClick={() => handleQuickPrompt(item.prompt)}
                                  className="px-2.5 py-1 rounded-lg bg-black/[0.04] hover:bg-[#1d1d1f] hover:text-white text-zinc-700 text-[11px] font-medium transition-all cursor-pointer"
                                >
                                  Ask Advisor
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Prompts (Only if no messages, removed when chat starts) */}
          <AnimatePresence>
            {chatMessages.length === 0 && (
              <motion.div 
                key="quick-prompts-row"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex flex-wrap justify-center gap-2 text-xs w-full max-w-2xl mt-5"
              >
                <button 
                  onClick={() => handleQuickPrompt("Block YouTube recommendations and shorts while studying on desktop")} 
                  className="bg-white/80 hover:bg-white text-zinc-600 hover:text-black border border-black/[0.05] px-4 py-2 rounded-full transition-all text-left font-light shadow-xs cursor-pointer"
                >
                  Block YouTube recommendations and shorts while studying
                </button>
                <button 
                  onClick={() => handleQuickPrompt("Set up strict iOS Downtime without bypass loopholes")} 
                  className="bg-white/80 hover:bg-white text-zinc-600 hover:text-black border border-black/[0.05] px-4 py-2 rounded-full transition-all text-left font-light shadow-xs cursor-pointer"
                >
                  Set up strict iOS Downtime without bypass loopholes
                </button>
                <button 
                  onClick={() => handleQuickPrompt("Open-source focus tools with zero data collection")} 
                  className="bg-white/80 hover:bg-white text-zinc-600 hover:text-black border border-black/[0.05] px-4 py-2 rounded-full transition-all text-left font-light shadow-xs cursor-pointer"
                >
                  Open-source focus tools with zero data collection
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

      {/* 2. DIRECTORY VIEW */}
      {activeTab === 'directory' && (
        <div className="w-full text-left animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-black/[0.06]">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] tracking-tight">Curated Directory</h2>
              <p className="text-zinc-500 text-sm mt-1 max-w-xl font-light">
                Fifteen vetted student digital wellness resources. Click any tool to inspect full evaluation criteria and play video tutorials.
              </p>
            </div>
            <span className="text-xs text-zinc-400 mt-2 md:mt-0 font-mono">
              {filteredResources.length} of {resources.length} Resources
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
        <SetupGuides guides={guides} selectedGuideSlug={activeGuideSlug} />
      )}

      {/* Detail Modal with Onsite Playable Video */}
      <ToolDetailModal 
        tool={selectedTool} 
        onClose={() => setSelectedTool(null)} 
      />

    </div>
  );
}
