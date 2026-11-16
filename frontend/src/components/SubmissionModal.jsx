import React, { useState } from 'react';
import { X, Send, CheckCircle2, Video, MessageSquare, PlusCircle, Image as ImageIcon } from 'lucide-react';
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
      }, 2000);
    } catch (err) {
      setError('Could not submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#111111]/95 border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl text-left overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-semibold text-white">Student Contribution</h3>
            <p className="text-xs text-gray-400 mt-0.5">Submit feedback, tool tips, app setup screenshots, or video walkthroughs.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <CheckCircle2 size={48} className="text-green-400 mb-3 animate-bounce" />
            <h4 className="text-lg font-medium text-white">Thank you for your submission!</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">Your feedback and practical tip have been recorded to help fellow students.</p>
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
              <label className="block text-xs font-medium text-gray-300 mb-2">Contribution Type</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'feedback', label: 'Feedback / Review', icon: MessageSquare },
                  { id: 'tool_suggestion', label: 'Suggest New Tool', icon: PlusCircle },
                  { id: 'app_screen', label: 'Setup Screenshot', icon: ImageIcon },
                  { id: 'video_link', label: 'Video Walkthrough', icon: Video },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = submissionType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSubmissionType(item.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all ${
                        active 
                          ? 'bg-white/15 border-white/40 text-white shadow-sm' 
                          : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
                      }`}
                    >
                      <Icon size={14} className={active ? 'text-purple-400' : 'text-gray-400'} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name & Email row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Your Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Alex M."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="For follow-up"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50"
                />
              </div>
            </div>

            {/* Content area */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Your Details / Description *</label>
              <textarea
                required
                rows={3}
                placeholder="Share your setup tip, tool correction, bypass mitigation, or feedback..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50 resize-none"
              />
            </div>

            {/* Media / Video link */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Link to Video, Screenshot, or Animation (Optional)</label>
              <input
                type="url"
                placeholder="https://youtu.be/... or image cloud URL"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400/50"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="px-4 py-2 bg-white text-black hover:bg-gray-200 disabled:opacity-50 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all shadow-md"
              >
                {submitting ? 'Submitting...' : (
                  <>
                    <Send size={13} />
                    Submit Contribution
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
