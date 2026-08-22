'use client';

import React from 'react';
import { X, ShieldCheck, FileText, Lock, Users, AlertCircle } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-2xl bg-[#12141c] border border-white/10 rounded-3xl p-6 shadow-2xl text-slate-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FD297B]/15 text-[#FD297B] border border-[#FD297B]/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Terms of Service & Privacy Disclosure</h3>
              <p className="text-xs text-slate-400">Public profile visibility and community standards for Connector</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Terms Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs text-slate-300 custom-scrollbar pr-2 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-[#FD297B]/10 border border-[#FD297B]/30 flex items-start gap-2.5 text-pink-200">
            <AlertCircle className="w-4 h-4 text-[#FD297B] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Public Developer Profile Visibility Notice:</span>
              <p className="mt-0.5 text-[11px] text-slate-300">
                Connector is a networking platform for tech students and builders. By creating a profile, you agree that your profile details (name, photo, university, tech skills, bio, public GitHub repository metrics, and LinkedIn headlines) will be displayed to other active students on the discovery deck.
              </p>
            </div>
          </div>

          <section className="space-y-1.5">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2DB1FF]" />
              1. Profile Data & Public Showcase
            </h4>
            <p>
              When you join Connector, you authorize the platform to aggregate and display public technical signals associated with your provided GitHub handle, LinkedIn URL, and competitive programming handles. This data is used solely to generate your Dev Card and calculate synergy matching scores with other prospective teammates.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#20D5A0]" />
              2. Privacy, Communications & Mutual Matching
            </h4>
            <p>
              - <strong>Direct Messaging:</strong> You can only receive direct messages and project invitations from developers with whom you have mutually connected (swiped right or accepted super-collab).
            </p>
            <p>
              - <strong>No Unsolicited Spam:</strong> Connector enforces a strict zero-tolerance policy against commercial recruiters, automated bot scrapers, and unsolicited mass marketing.
            </p>
            <p>
              - <strong>Account Control:</strong> You may edit, update, or permanently delete your profile and all associated data at any time from your account settings.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#F5B800]" />
              3. Community Standards & Code of Conduct
            </h4>
            <p>
              All members agree to treat fellow student developers with respect and professional courtesy. Harassment, misrepresentation of credentials, plagiarism of code repositories, or abusive language in chat rooms will result in immediate and permanent account termination.
            </p>
          </section>

          <section className="space-y-1.5">
            <h4 className="font-bold text-white text-sm">4. Data Processing & AI Synergy Calculations</h4>
            <p>
              Connector employs deterministic heuristic and LLM-assisted synergy scoring algorithms to suggest relevant hackathon teammates and project peers. Match scores represent estimated technical complementarity and do not constitute an endorsement or warranty of student skills.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full tinder-gradient text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
}
