'use client';

import React, { useState } from 'react';
import { MatchResult, ChatMessage, TechProfile } from '@/types';
import { CURRENT_USER } from '@/lib/mockData';
import { GithubIcon } from './icons';
import { 
  Send, 
  Code2, 
  Sparkles, 
  UserPlus, 
  Flame, 
  Copy, 
  Check, 
  Search, 
  Terminal, 
  Layers,
  PhoneCall,
  Video
} from 'lucide-react';

interface ChatViewProps {
  matches: MatchResult[];
  activeMatchId: string | null;
  onSelectMatch: (matchId: string) => void;
  messages: Record<string, ChatMessage[]>;
  onSendMessage: (receiverId: string, text: string, codeSnippet?: { language: string; code: string }) => void;
  onInviteToSquad?: (profile: TechProfile) => void;
}

export function ChatView({
  matches,
  activeMatchId,
  onSelectMatch,
  messages,
  onSendMessage,
  onInviteToSquad
}: ChatViewProps) {
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('typescript');
  const [codeInput, setCodeInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeMatch = matches.find(m => m.userProfile.id === activeMatchId) || matches[0];
  const activeChatMessages = activeMatch ? messages[activeMatch.userProfile.id] || [] : [];

  const filteredMatches = matches.filter(m => 
    m.userProfile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.userProfile.primaryRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.userProfile.university.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeMatch) return;
    onSendMessage(activeMatch.userProfile.id, inputText.trim());
    setInputText('');
  };

  const handleSendCode = () => {
    if (!codeInput.trim() || !activeMatch) return;
    onSendMessage(
      activeMatch.userProfile.id, 
      `Sharing code snippet (${codeLanguage}):`,
      { language: codeLanguage, code: codeInput.trim() }
    );
    setCodeInput('');
    setIsCodeModalOpen(false);
  };

  const copyCodeToClipboard = (id: string, codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto h-[680px] bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col md:flex-row">
      {/* Matches Left Sidebar */}
      <div className="w-full md:w-80 border-r border-slate-800 flex flex-col bg-slate-950/40">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span>Your Matches</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-600/30 text-indigo-300 text-xs font-mono">
                {matches.length}
              </span>
            </h3>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by name, role, school..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Matches List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
          {filteredMatches.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No matches found. Swipe more tech students on the Discover deck!
            </div>
          ) : (
            filteredMatches.map((match) => {
              const isActive = activeMatch?.userProfile.id === match.userProfile.id;
              return (
                <button
                  key={match.id}
                  onClick={() => onSelectMatch(match.userProfile.id)}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 ${
                    isActive 
                      ? 'bg-indigo-600/20 border border-indigo-500/50 shadow-md' 
                      : 'hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img 
                      src={match.userProfile.avatar} 
                      alt={match.userProfile.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-bold text-xs text-white truncate">{match.userProfile.name}</h4>
                      {match.synergyScore && (
                        <span className="text-[10px] font-bold font-mono text-amber-400 flex items-center gap-0.5">
                          <Flame className="w-3 h-3 fill-amber-400" />
                          {match.synergyScore}%
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 truncate">
                      {match.userProfile.primaryRole} • {match.userProfile.university.split(' ')[0]}
                    </p>

                    <p className="text-[11px] text-slate-300 truncate mt-1">
                      {match.lastMessage || 'Connected! Say hello and discuss tech ideas.'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Conversation Thread */}
      {activeMatch ? (
        <div className="flex-1 flex flex-col bg-slate-900/60">
          {/* Conversation Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/30">
            <div className="flex items-center gap-3">
              <img 
                src={activeMatch.userProfile.avatar} 
                alt={activeMatch.userProfile.name} 
                className="w-11 h-11 rounded-xl object-cover border border-slate-700"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">{activeMatch.userProfile.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {activeMatch.userProfile.primaryRole}
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>{activeMatch.userProfile.university}</span>
                  <span>•</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Online
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Actions in Header */}
            <div className="flex items-center gap-2">
              {onInviteToSquad && (
                <button
                  onClick={() => onInviteToSquad(activeMatch.userProfile)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Invite to your Hackathon Squad"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Invite to Squad
                </button>
              )}

              {activeMatch.userProfile.socials.github && (
                <a 
                  href={activeMatch.userProfile.socials.github} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="GitHub Profile"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Synergy Banner */}
          <div className="px-4 py-2 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-200/90 truncate">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
              <span className="truncate">{activeMatch.userProfile.synergyReason || 'High tech complementarity'}</span>
            </div>
            <span className="font-mono font-bold text-amber-400 flex-shrink-0 pl-2">
              {activeMatch.synergyScore}% Synergy
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
            {activeChatMessages.map((msg) => {
              const isMe = msg.senderId === CURRENT_USER.id || msg.senderId === 'user-me';

              return (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs shadow-md ${
                    isMe 
                      ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-none' 
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    {/* Code Snippet Block */}
                    {msg.codeSnippet && (
                      <div className="mt-2.5 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden text-left">
                        <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="flex items-center gap-1 text-cyan-400">
                            <Terminal className="w-3 h-3" />
                            {msg.codeSnippet.language}
                          </span>
                          <button
                            onClick={() => copyCodeToClipboard(msg.id, msg.codeSnippet?.code || '')}
                            className="hover:text-white flex items-center gap-1 text-[10px]"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 font-mono text-[11px] text-indigo-200 overflow-x-auto">
                          <code>{msg.codeSnippet.code}</code>
                        </pre>
                      </div>
                    )}

                    {/* Project Invite Card */}
                    {msg.isProjectInvite && (
                      <div className="mt-2.5 p-3 rounded-xl bg-indigo-950/70 border border-indigo-500/40 text-left">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                          <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
                          Squad Invitation: {msg.isProjectInvite.projectName}
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1">{msg.isProjectInvite.projectDescription}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 font-mono text-[10px]">
                          Role: {msg.isProjectInvite.roleNeeded}
                        </span>
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-500 mt-1 font-mono px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCodeModalOpen(true)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-colors"
              title="Share Code Snippet"
            >
              <Code2 className="w-4 h-4" />
            </button>

            <input 
              type="text"
              placeholder={`Message ${activeMatch.userProfile.name.split(' ')[0]}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all shadow-md shadow-indigo-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500">
          Select a match to start discussing hackathons, projects, and tech stacks.
        </div>
      )}

      {/* Code Snippet Modal */}
      {isCodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              Share Code Snippet
            </h3>

            <div className="mb-3">
              <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Language</label>
              <select
                value={codeLanguage}
                onChange={(e) => setCodeLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono"
              >
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="rust">Rust</option>
                <option value="go">Go</option>
                <option value="javascript">JavaScript</option>
                <option value="cpp">C++</option>
                <option value="sql">SQL</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="text-[11px] font-semibold text-slate-400 mb-1 block">Code</label>
              <textarea 
                rows={6}
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Paste code or API spec here..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-200 font-mono focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCodeModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={!codeInput.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold"
              >
                Send Code Snippet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
