'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Send, Check, Settings, MessageSquare, Users, ShieldCheck } from 'lucide-react';

interface DemoMessage {
  id: string;
  sender: 'me' | 'other';
  senderName?: string;
  text: string;
  time: string;
}

/**
 * Creative Bonus Element: Interactive Live Sandbox
 * Allows prospective users to test real-time chat interactions, message composition,
 * auto-scroll, and group admin simulation directly on the landing page.
 */
export const InteractiveDemoSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'direct' | 'group'>('direct');
  const [inputText, setInputText] = useState('');
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [directMessages, setDirectMessages] = useState<DemoMessage[]>([
    {
      id: '1',
      sender: 'other',
      senderName: 'Ada Lovelace',
      text: 'Hey! The new TanStack Query and WebSocket chat architecture is ready to try.',
      time: '10:40 AM',
    },
    {
      id: '2',
      sender: 'me',
      text: 'Awesome! Testing the interactive composer right now.',
      time: '10:41 AM',
    },
  ]);

  const [groupMessages, setGroupMessages] = useState<DemoMessage[]>([
    {
      id: 'g1',
      sender: 'other',
      senderName: 'Ada Lovelace',
      text: 'Team, please test the group admin promotion and rename features.',
      time: '09:15 AM',
    },
    {
      id: 'g2',
      sender: 'other',
      senderName: 'Alex Mercer',
      text: 'Verified! Added 2 new members and promoted Setu to group admin.',
      time: '09:20 AM',
    },
  ]);

  const currentMessages = activeTab === 'direct' ? directMessages : groupMessages;

  // Auto-scroll demo on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: DemoMessage = {
      id: Date.now().toString(),
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (activeTab === 'direct') {
      setDirectMessages((prev) => [...prev, newMsg]);
    } else {
      setGroupMessages((prev) => [...prev, newMsg]);
    }

    setInputText('');

    // Simulate instant natural response in Direct chat
    if (activeTab === 'direct') {
      setTimeout(() => {
        setDirectMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'other',
            senderName: 'Ada Lovelace',
            text: 'Instant delivery confirmed! Real-time WebSockets are connected.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 900);
    }
  };

  return (
    <section id="interactive-demo" className="py-20 md:py-28 border-t border-slate-200/80 dark:border-zinc-900 bg-white/40 dark:bg-zinc-950/40 transition-colors duration-150">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3.5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800 px-3.5 py-1 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300 shadow-xs">
              Live Demonstration
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 leading-[1.28] sm:leading-[1.22]">
            Test the interface live.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 leading-relaxed font-normal pt-0.5">
            Experience the real chat environment right now. Switch between a 1-to-1 conversation and a group discussion, send messages, and explore group admin controls.
          </p>
        </div>

        {/* Interactive Playground Card */}
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden flex flex-col h-[520px]">
          {/* Top Demo Bar & Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 px-4 py-3 bg-slate-50 dark:bg-zinc-950/80 shrink-0">
            {/* Conversation Switcher Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-200/80 dark:bg-zinc-800 p-1 rounded-xl">
              <button
                onClick={() => {
                  setActiveTab('direct');
                  setShowGroupInfo(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'direct'
                    ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <MessageSquare className="h-4 w-4 text-sky-500" />
                <span>1-to-1 Direct</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('group');
                  setShowGroupInfo(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'group'
                    ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <Users className="h-4 w-4 text-indigo-500" />
                <span>Group Channel</span>
              </button>
            </div>

            {/* Header Right Action */}
            {activeTab === 'group' && (
              <button
                onClick={() => setShowGroupInfo(!showGroupInfo)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer border ${
                  showGroupInfo
                    ? 'bg-slate-200 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-100'
                    : 'bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>{showGroupInfo ? 'Close Settings' : 'Manage Group'}</span>
              </button>
            )}
          </div>

          {/* Active Conversation Details Banner */}
          <div className="px-5 py-3 border-b border-slate-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Avatar
                name={activeTab === 'direct' ? 'Ada Lovelace' : 'Engineering Core'}
                isGroup={activeTab === 'group'}
                size="md"
              />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                  {activeTab === 'direct' ? 'Ada Lovelace' : 'Engineering Core'}
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  {activeTab === 'direct' ? '+1 415-555-2671 • Online' : '3 members • 2 admins'}
                </p>
              </div>
            </div>
            <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono">
              Live Sandbox
            </span>
          </div>

          {/* Body Area */}
          {showGroupInfo && activeTab === 'group' ? (
            <div className="flex-1 overflow-y-auto p-5 bg-slate-50 dark:bg-zinc-950/60 space-y-3.5 custom-scrollbar text-xs sm:text-sm">
              <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                <h4 className="font-bold text-slate-900 dark:text-zinc-100 mb-1 text-sm">Group Details</h4>
                <p className="text-slate-500 dark:text-zinc-400 text-xs">Engineering Core • Created for Sprint Planning</p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Group Members (3)
                </h5>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <Avatar name="Setu" size="sm" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-zinc-100 text-xs sm:text-sm">Setu (You)</p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">+8801703235224</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs flex items-center gap-1 border border-sky-500/20">
                    <ShieldCheck className="h-3.5 w-3.5" /> Admin
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <Avatar name="Ada Lovelace" size="sm" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-zinc-100 text-xs sm:text-sm">Ada Lovelace</p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">+1 415-555-2671</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold text-xs flex items-center gap-1 border border-sky-500/20">
                    <ShieldCheck className="h-3.5 w-3.5" /> Admin
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <Avatar name="Alex Mercer" size="sm" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-zinc-100 text-xs sm:text-sm">Alex Mercer</p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">+1 212-555-8930</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Member</span>
                </div>
              </div>
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-slate-50 dark:bg-zinc-950/60 custom-scrollbar"
            >
              {currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'me' ? 'items-end' : 'items-start'
                  } group w-full`}
                >
                  {msg.sender === 'other' && activeTab === 'group' && (
                    <span className="mb-1 ml-1 text-xs font-bold text-slate-600 dark:text-zinc-400">
                      {msg.senderName}
                    </span>
                  )}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-xs leading-relaxed ${
                      msg.sender === 'me'
                        ? 'bg-sky-600 text-white rounded-br-xs'
                        : 'bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 border border-slate-200 dark:border-zinc-700/60 rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                        msg.sender === 'me' ? 'text-sky-100/80' : 'text-slate-400 dark:text-zinc-400'
                      }`}
                    >
                      <span>{msg.time}</span>
                      {msg.sender === 'me' && <Check className="h-3 w-3 stroke-[2.5]" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Interactive Composer Footer */}
          <form
            onSubmit={handleSendMessage}
            className="p-3.5 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2.5 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeTab === 'direct'
                  ? 'Type a message to Ada... (Press Enter)'
                  : 'Type a message to Engineering Core...'
              }
              className="flex-1 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/80 px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:border-sky-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
