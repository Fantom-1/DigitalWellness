import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { submitStudentFeedback } from '../api';

export default function SubmissionModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submissionType, setSubmissionType] = useState('feedback');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      await submitStudentFeedback({
        student_name: name.trim() || 'Anonymous Student',
        email: email.trim() || null,
        submission_type: submissionType,
        content: content.trim(),
        media_url: mediaUrl.trim() || null
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setContent('');
        setMediaUrl('');
        onClose();
      }, 1800);
    } catch (err) {
      setError('Could not submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-black/[0.08] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl text-left overflow-y-auto max-h-[90dvh] apple-scrollbar">
        
        <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-[#1d1d1f] tracking-tight">Student Contribution</h3>
            <p className="text-xs text-zinc-500 font-light mt-0.5">Submit feedback, tool corrections, or video walkthroughs.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-zinc-400 hover:text-black rounded-full hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <CheckCircle2 size={40} className="text-[#1d1d1f] mb-3" />
            <h4 className="text-base font-semibold text-[#1d1d1f]">Thank you for your feedback</h4>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs font-light">Your contribution helps improve digital wellness guidance for all students.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 sm:mt-5 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                {error}
              </div>
            )}

            {/* Type selector */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-2">Contribution Type</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'feedback', label: 'Feedback & Review' },
                  { id: 'tool_suggestion', label: 'Suggest New Tool' },
                  { id: 'app_screen', label: 'Setup Screenshot' },
                  { id: 'video_link', label: 'Video Walkthrough' },
                ].map((item) => {
                  const active = submissionType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSubmissionType(item.id)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left min-h-[42px] cursor-pointer ${
                        active 
                          ? 'bg-[#1d1d1f] text-white border-black shadow-sm' 
                          : 'bg-zinc-50 border-black/[0.04] text-zinc-600 hover:bg-zinc-100 hover:text-black'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name & Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Anonymous Student"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-black/10 rounded-xl text-[16px] sm:text-xs text-[#1d1d1f] placeholder-zinc-400 focus:outline-none focus:border-black/30 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="alex@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-zinc-50 border border-black/10 rounded-xl text-[16px] sm:text-xs text-[#1d1d1f] placeholder-zinc-400 focus:outline-none focus:border-black/30 focus:bg-white"
                />
              </div>
            </div>

            {/* Content area */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Notes / Description</label>
              <textarea
                required
                rows={3}
                placeholder="Share your setup tip, tool correction, bypass mitigation, or feedback..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-50 border border-black/10 rounded-xl text-[16px] sm:text-xs text-[#1d1d1f] placeholder-zinc-400 focus:outline-none focus:border-black/30 focus:bg-white resize-none font-light"
              />
            </div>

            {/* Media / Video link */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1">Link to Video, Screenshot, or Animation (Optional)</label>
              <input
                type="url"
                placeholder="https://..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-50 border border-black/10 rounded-xl text-[16px] sm:text-xs text-[#1d1d1f] placeholder-zinc-400 focus:outline-none focus:border-black/30 focus:bg-white"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-500 hover:text-black rounded-xl hover:bg-black/5 transition-colors cursor-pointer min-h-[38px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="px-4 py-2 bg-[#1d1d1f] text-white hover:bg-black disabled:opacity-50 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer min-h-[38px]"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
