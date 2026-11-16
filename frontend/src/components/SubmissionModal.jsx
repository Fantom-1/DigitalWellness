import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl text-left overflow-y-auto max-h-[90vh] apple-scrollbar">
        
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <h3 className="text-xl font-semibold text-white tracking-tight">Student Contribution</h3>
            <p className="text-xs text-zinc-400 font-light mt-0.5">Submit feedback, tool corrections, or setup walkthroughs.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <CheckCircle2 size={40} className="text-zinc-200 mb-3" />
            <h4 className="text-base font-medium text-white">Thank you for your feedback</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs font-light">Your contribution helps improve digital wellness guidance for all students.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs">
                {error}
              </div>
            )}

            {/* Type selector */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-2">Contribution Type</label>
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
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                        active 
                          ? 'bg-white text-black border-white shadow-sm' 
                          : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name & Email row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Anonymous Student"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="alex@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            {/* Content area */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Notes / Description</label>
              <textarea
                required
                rows={3}
                placeholder="Share your setup tip, tool correction, bypass mitigation, or feedback..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 resize-none font-light"
              />
            </div>

            {/* Media / Video link */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Link to Video, Screenshot, or Animation (Optional)</label>
              <input
                type="url"
                placeholder="https://..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="px-4 py-2 bg-white text-black hover:bg-zinc-200 disabled:opacity-50 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
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
